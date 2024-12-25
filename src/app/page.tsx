// src/app/page.tsx
'use client';

import { useState, useEffect } from "react";
import type { Todo, TodoCreate } from "@/types/todo";
import { TodoItem } from "@/components/TodoItem";
import { TodoForm } from "@/components/TodoForm";
import { fetchTodos, saveTodos, getUserIP } from "@/lib/api";

export default function Home() {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [userIdentifier, setUserIdentifier] = useState<string>('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const initializeApp = async () => {
            try {
                setIsLoading(true);
                const ip = await getUserIP();
                setUserIdentifier(ip);

                const response = await fetchTodos(ip);
                // Проверяем, что получили массив
                const todosData = Array.isArray(response) ? response : [];
                setTodos(todosData);
            } catch (error) {
                setError('Не удалось загрузить задачи');
                console.error('Error initializing app:', error);
                // В случае ошибки устанавливаем пустой массив
                setTodos([]);
            } finally {
                setIsLoading(false);
            }
        };

        initializeApp();
    }, []);

    useEffect(() => {
        if (userIdentifier && !isLoading) {
            const saveData = async () => {
                try {
                    await saveTodos(userIdentifier, todos);
                } catch (error) {
                    console.error('Error saving todos:', error);
                    setError('Не удалось сохранить изменения');
                }
            };

            saveData();
        }
    }, [todos, userIdentifier, isLoading]);

    const addTodo = (todoCreate: TodoCreate) => {
        const newTodo: Todo = {
            ...todoCreate,
            id: Date.now().toString(36) + Math.random().toString(36).substring(2),
            createdAt: new Date().toISOString()
        };
        setTodos(prev => Array.isArray(prev) ? [newTodo, ...prev] : [newTodo]);
    };

    const deleteTodo = (id: string) => {
        setTodos(prev => Array.isArray(prev) ? prev.filter(todo => todo.id !== id) : []);
    };

    const toggleTodo = (id: string) => {
        setTodos(prev => 
            Array.isArray(prev) 
                ? prev.map(todo => todo.id === id ? { ...todo, completed: !todo.completed } : todo)
                : []
        );
    };

    const editTodo = (id: string, newText: string) => {
        setTodos(prev => 
            Array.isArray(prev) 
                ? prev.map(todo => todo.id === id ? { ...todo, text: newText } : todo)
                : []
        );
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-gray-600">Загрузка...</div>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-2xl mx-auto px-4">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Список задач</h1>

                {error && (
                    <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
                        {error}
                    </div>
                )}

                <TodoForm onAdd={addTodo} />

                <div className="space-y-4">
                    {todos.length === 0 ? (
                        <p className="text-center text-gray-500 py-8">
                            Нет задач. Добавьте новую задачу выше.
                        </p>
                    ) : (
                        todos.map(todo => (
                            <TodoItem
                                key={todo.id}
                                todo={todo}
                                onDelete={deleteTodo}
                                onToggle={toggleTodo}
                                onEdit={editTodo}
                            />
                        ))
                    )}
                </div>

                {todos.length > 0 && (
                    <div className="mt-4 text-sm text-gray-500">
                        Всего задач: {todos.length} | 
                        Выполнено: {todos.filter(todo => todo.completed).length}
                    </div>
                )}
            </div>
        </main>
    );
}

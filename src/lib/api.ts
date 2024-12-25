// src/lib/api.ts
import { Todo } from '@/types/todo';

export async function getUserIP(): Promise<string> {
    try {
        const response = await fetch('/api/ip');
        const data = await response.json();
        return data.ip || 'unknown';
    } catch (error) {
        console.error('Failed to get IP:', error);
        return 'unknown';
    }
}

export async function fetchTodos(userIdentifier: string): Promise<Todo[]> {
    try {
        const response = await fetch(`/api/todos?identifier=${userIdentifier}`);
        if (!response.ok) {
            throw new Error('Failed to fetch todos');
        }
        const data = await response.json();
        return Array.isArray(data) ? data : [];
    } catch (error) {
        console.error('Error fetching todos:', error);
        return [];
    }
}

export async function saveTodos(userIdentifier: string, todos: Todo[]): Promise<void> {
    const response = await fetch('/api/todos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
            identifier: userIdentifier, 
            todos: Array.isArray(todos) ? todos : [] 
        }),
    });

    if (!response.ok) {
        throw new Error('Failed to save todos');
    }
}

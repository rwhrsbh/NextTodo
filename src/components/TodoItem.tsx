import { type Todo } from '@/types/todo';
import { useState } from "react";
import { formatDate } from "@/lib/utils";

interface TodoItemProps {
    todo: Todo;
    onDelete: (id: string) => void;
    onToggle: (id: string) => void;
    onEdit: (id: string, newText: string) => void;
}

export function TodoItem({ todo, onDelete, onToggle, onEdit }: TodoItemProps) {
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [editText, setEditText] = useState<string>(todo.text);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmedText = editText.trim();
        if (trimmedText !== '') {
            onEdit(todo.id, trimmedText);
            setIsEditing(false);
        }
    };

    return (
        <div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm">
            <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => onToggle(todo.id)}
                className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
            />

            {isEditing ? (
                <form onSubmit={handleSubmit} className="flex-1 flex items-center gap-2">
                    <input
                        type="text"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        autoFocus
                    />
                    <button
                        type="submit"
                        className="px-3 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded"
                    >
                        Сохранить
                    </button>
                </form>
            ) : (
                <div className="flex-1">
                    <span className={`block ${todo.completed ? 'line-through text-gray-500' : ''}`}>
                        {todo.text}
                    </span>
                    <span className="text-xs text-gray-500">
                        {formatDate(new Date(todo.createdAt))}
                    </span>
                </div>
            )}

            <div className="flex gap-2">
                <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded"
                >
                    {isEditing ? 'Отмена' : 'Изменить'}
                </button>
                <button
                    onClick={() => onDelete(todo.id)}
                    className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded"
                >
                    Удалить
                </button>
            </div>
        </div>
    );
}
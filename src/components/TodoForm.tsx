// src/components/TodoForm.tsx


import { useState } from "react";
import type { TodoCreate } from "@/types/todo";

interface TodoFormProps {
    onAdd: (todo: TodoCreate) => void;
}

export function TodoForm({ onAdd }: TodoFormProps) {
    const [text, setText] = useState<string>('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmedText = text.trim();
        if (trimmedText !== '') {
            onAdd({
                text: trimmedText,
                completed: false,
            });
            setText('');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mb-6">
            <div className="flex gap-4">
                <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Добавить новую задачу..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                    type="submit"
                    className="px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                    Добавить
                </button>
            </div>
        </form>
    );
}
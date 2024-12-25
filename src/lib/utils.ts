// src/lib/utils.ts
import { Todo } from '@/types/todo';

// Функция для создания хеша строки
export function hashString(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return hash.toString(36);
}

// Форматирование даты
export function formatDate(date: Date): string {
    return new Intl.DateTimeFormat('ru-RU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(date);
}

// Функции для работы с localStorage
export function getTodosFromStorage(fingerprint: string): Todo[] {
    try {
        const storageKey = `todos_${fingerprint}`;
        const storedTodos = localStorage.getItem(storageKey);
        if (storedTodos) {
            return JSON.parse(storedTodos);
        }
    } catch (error) {
        console.error('Error reading from localStorage:', error);
    }
    return [];
}

export function saveTodosToStorage(todos: Todo[], fingerprint: string): void {
    try {
        const storageKey = `todos_${fingerprint}`;
        localStorage.setItem(storageKey, JSON.stringify(todos));
    } catch (error) {
        console.error('Error saving to localStorage:', error);
    }
}
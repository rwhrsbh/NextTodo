// src/types/todo.ts
export interface Todo {
    id: string;           // Изменили тип с number на string
    text: string;
    completed: boolean;
    createdAt: string;    // Изменили тип с Date на string
}

export type TodoCreate = Omit<Todo, 'id' | 'createdAt'>;
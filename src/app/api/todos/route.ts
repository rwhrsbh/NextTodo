// src/app/api/todos/route.ts
import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { Todo } from '@/types/todo';

export async function GET(request: NextRequest) {
    try {
        const identifier = request.nextUrl.searchParams.get('identifier');
        if (!identifier) {
            return NextResponse.json({ data: [] });
        }

        const client = await clientPromise;
        const db = client.db('todosdb');
        const result = await db.collection('todos').findOne({ identifier });

        // Убедимся что возвращаем массив
        const todos = result?.items || [];
        return NextResponse.json(todos);
    } catch (error) {
        console.error('Error reading todos:', error);
        // В случае ошибки возвращаем пустой массив
        return NextResponse.json([]);
    }
}

export async function POST(request: NextRequest) {
    try {
        const { identifier, todos } = await request.json();
        if (!identifier || !Array.isArray(todos)) {
            return NextResponse.json({ error: 'Invalid data format' }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db('todosdb');
        
        await db.collection('todos').updateOne(
            { identifier },
            { 
                $set: { 
                    identifier,
                    items: todos
                }
            },
            { upsert: true }
        );

        return NextResponse.json(todos);
    } catch (error) {
        console.error('Error saving todos:', error);
        return NextResponse.json({ error: 'Failed to save' }, { status: 500 });
    }
}

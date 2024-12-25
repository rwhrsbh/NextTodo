// src/app/api/todos/route.ts
import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET(request: NextRequest) {
    try {
        const identifier = request.nextUrl.searchParams.get('identifier');
        if (!identifier) {
            return NextResponse.json({ error: 'Identifier is required' }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db('todosdb');
        const todos = await db.collection('todos').findOne({ identifier });

        return NextResponse.json(todos?.items || []);
    } catch (error) {
        console.error('Error reading todos:', error);
        return NextResponse.json({ error: 'Failed to read todos' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const { identifier, todos } = await request.json();
        if (!identifier) {
            return NextResponse.json({ error: 'Identifier is required' }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db('todosdb');

        await db.collection('todos').updateOne(
            { identifier },
            {
                $set: {
                    identifier,
                    items: todos,
                    updatedAt: new Date()
                }
            },
            { upsert: true }
        );

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error saving todos:', error);
        return NextResponse.json({ error: 'Failed to save todos' }, { status: 500 });
    }
}
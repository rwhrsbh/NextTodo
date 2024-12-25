// src/app/api/todos/route.ts
import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { Todo } from '@/types/todo';

// Интерфейс для ответа API
interface ApiResponse<T> {
  data?: T;
  error?: string;
}

// Обработчик GET-запросов
export async function GET(
  request: NextRequest
): Promise<NextResponse<ApiResponse<Todo[]>>> {
  try {
    const identifier = request.nextUrl.searchParams.get('identifier');
    if (!identifier) {
      return NextResponse.json(
        { error: 'Identifier is required' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('todosdb');
    const result = await db.collection('todos').findOne({ identifier });

    return NextResponse.json({ data: result?.items || [] });
  } catch (error) {
    console.error('Error reading todos:', error);
    return NextResponse.json(
      { error: 'Failed to read todos' },
      { status: 500 }
    );
  }
}

// Интерфейс для тела POST-запроса
interface TodosPostRequest {
  identifier: string;
  todos: Todo[];
}

// Обработчик POST-запросов
export async function POST(
  request: NextRequest
): Promise<NextResponse<ApiResponse<{ success: boolean }>>> {
  try {
    const body = await request.json() as TodosPostRequest;
    const { identifier, todos } = body;

    if (!identifier) {
      return NextResponse.json(
        { error: 'Identifier is required' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('todosdb');
    
    await db.collection('todos').updateOne(
      { identifier },
      { 
        $set: { 
          identifier,
          items: todos,
          updatedAt: new Date().toISOString()
        }
      },
      { upsert: true }
    );

    return NextResponse.json({ data: { success: true } });
  } catch (error) {
    console.error('Error saving todos:', error);
    return NextResponse.json(
      { error: 'Failed to save todos' },
      { status: 500 }
    );
  }
}

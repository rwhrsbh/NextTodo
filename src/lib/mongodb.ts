// src/lib/mongodb.ts
import { MongoClient, MongoClientOptions } from 'mongodb';

// Проверка наличия URI в переменных окружения
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error(
        'Please define the MONGODB_URI environment variable inside .env.local or in Vercel project settings'
    );
}

// Настройки подключения к MongoDB
const options: MongoClientOptions = {
    maxPoolSize: 10,
    minPoolSize: 5,
    maxIdleTimeMS: 60000,
    connectTimeoutMS: 10000,
    socketTimeoutMS: 45000,
};

// Объявление типов для глобального кэша
declare global {
    var _mongoClientPromise: Promise<MongoClient> | undefined;
}

// Инициализация клиента
let client: MongoClient;
let clientPromise: Promise<MongoClient>;

// Настройка для разработки - переиспользуем соединение
if (process.env.NODE_ENV === 'development') {
    if (!global._mongoClientPromise) {
        client = new MongoClient(MONGODB_URI, options);
        global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise;
} 
// Для продакшена создаем новое соединение
else {
    client = new MongoClient(MONGODB_URI, options);
    clientPromise = client.connect();
}

// Экспортируем промис с подключением
export default clientPromise;

// Вспомогательная функция для проверки соединения
export async function testConnection() {
    try {
        const client = await clientPromise;
        await client.db().command({ ping: 1 });
        console.log("Successfully connected to MongoDB.");
        return true;
    } catch (error) {
        console.error("Failed to connect to MongoDB:", error);
        return false;
    }
}

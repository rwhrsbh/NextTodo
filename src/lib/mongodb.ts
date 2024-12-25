// src/lib/mongodb.ts
import { MongoClient, MongoClientOptions } from 'mongodb';

// Получаем URI из переменных окружения с правильным именем
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error(
        'Please define the MONGODB_URI environment variable in Vercel project settings'
    );
}

// Настройки подключения к MongoDB с оптимальными параметрами
const options: MongoClientOptions = {
    maxPoolSize: 10,
    minPoolSize: 5,
    maxIdleTimeMS: 60000,
    connectTimeoutMS: 10000,
    socketTimeoutMS: 45000,
};

// Объявляем тип для глобального кэша клиента MongoDB
declare global {
    let _mongoClientPromise: Promise<MongoClient> | undefined;
}

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
    // В режиме разработки переиспользуем соединение
    if (!global._mongoClientPromise) {
        client = new MongoClient(MONGODB_URI, options);
        global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise;
} else {
    // В продакшене создаем новое соединение
    client = new MongoClient(MONGODB_URI, options);
    clientPromise = client.connect();
}

export default clientPromise;

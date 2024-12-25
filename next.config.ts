import type { NextConfig } from "next";

const nextConfig = {
    // Проверяем наличие переменных окружения при сборке
    webpack: (config, { isServer }) => {
        if (isServer) {
            if (!process.env.MONGODB_URI) {
                throw new Error('MONGODB_URI environment variable is required');
            }
        }
        return config;
    },
    // Передаем переменные окружения в приложение
    env: {
        MONGODB_URI: process.env.MONGODB_URI
    },
    // Включаем экспериментальные функции
    experimental: {
        turbo: true
    }
};

module.exports = nextConfig;

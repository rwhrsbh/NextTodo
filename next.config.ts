import type { NextConfig } from "next";

const nextConfig = {
    env: {
        MONGODB_URI: process.env.MONGODB_URI
    },
    experimental: {
        turbo: true
    },
    // Улучшенная обработка ошибок
    onError: async (err) => {
        console.error('Next.js config error:', err);
    },
    // Проверка обязательных переменных окружения
    webpack: (config, { isServer }) => {
        if (isServer) {
            const requiredEnvVars = ['MONGODB_URI'];
            requiredEnvVars.forEach((envVar) => {
                if (!process.env[envVar]) {
                    throw new Error(`Environment variable ${envVar} is required`);
                }
            });
        }
        return config;
    }
};

module.exports = nextConfig;

// src/lib/fingerprint.ts
import { hashString } from './utils';

interface BrowserInfo {
    userAgent: string;
    language: string;
    timeZone: string;
    screenResolution: string;
    colorDepth: number;
    cores: number;
    connection: string;
}

export async function generateFingerprint(): Promise<string> {
    // Собираем базовую информацию о браузере
    const browserInfo: BrowserInfo = {
        userAgent: navigator.userAgent,
        language: navigator.language,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        screenResolution: `${window.screen.width}x${window.screen.height}`,
        colorDepth: window.screen.colorDepth,
        cores: navigator.hardwareConcurrency || 1,
        connection: getConnectionInfo()
    };

    // Добавляем дополнительные характеристики
    const additionalFeatures = [
        'ontouchstart' in window,
        'orientation' in window,
        'IntersectionObserver' in window,
        'WebGL2RenderingContext' in window
    ];

    // Комбинируем все характеристики
    const fingerprintComponents = [
        JSON.stringify(browserInfo),
        JSON.stringify(additionalFeatures),
        getCanvasFingerprint()
    ];

    // Создаем и возвращаем хеш
    return hashString(fingerprintComponents.join('|||'));
}

// Получение информации о подключении
function getConnectionInfo(): string {
    if ('connection' in navigator) {
        const conn = (navigator as any).connection;
        return [
            conn?.effectiveType || '',
            conn?.type || '',
            conn?.downlink || ''
        ].join('_');
    }
    return '';
}

// Создание уникального отпечатка на основе рендеринга canvas
function getCanvasFingerprint(): string {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';

    // Задаем размер canvas
    canvas.width = 200;
    canvas.height = 50;

    // Рисуем текст с различными характеристиками
    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = '#f60';
    ctx.fillRect(125, 1, 62, 20);
    ctx.fillStyle = '#069';
    ctx.fillText('Fingerprint', 2, 15);
    ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
    ctx.fillText('Canvas', 4, 17);

    try {
        return canvas.toDataURL();
    } catch {
        return '';
    }
}

// Проверка поддержки функций браузера
function checkBrowserFeatures(): string[] {
    const features = [
        'fetch' in window,
        'CSS' in window,
        'WebSocket' in window,
        'localStorage' in window,
        'sessionStorage' in window,
        'indexedDB' in window,
        'Worker' in window,
        'Proxy' in window,
        'MutationObserver' in window,
        'requestAnimationFrame' in window
    ];

    return features.map((supported, index) =>
        `feature_${index}:${supported ? '1' : '0'}`
    );
}
import Redis from 'ioredis'
const redis = new Redis(process.env.REDIS_URL!)
export const kv = {
    async get<T = unknown>(key: string): Promise<T | null> {
        const value = await redis.get(key)
        if (value === null) return null
        try {
            return JSON.parse(value) as T
        } catch {
            return value as T
        }
    },
    async set(key: string, value: unknown): Promise<void> {
        await redis.set(key, JSON.stringify(value))
    },
    async ping(): Promise<string> {
        return redis.ping()
    },
}
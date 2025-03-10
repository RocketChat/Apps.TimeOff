import { ITimeOff } from "./interfaces/ITimeOff";

export class TimeOffCache {
    private static instance: TimeOffCache;
    private cache: Map<string, { data: ITimeOff; expiresAt: number }>;
    private TTL = 30 * 60 * 1000; // 30 minutes cache

    private constructor() {
        this.cache = new Map();
    }

    public static getInstance(): TimeOffCache {
        if (!TimeOffCache.instance) {
            TimeOffCache.instance = new TimeOffCache();
        }
        return TimeOffCache.instance;
    }

    public set(userId: string, timeOffData: ITimeOff): void {
        const expiresAt = Date.now() + this.TTL;
        this.cache.set(userId, { data: timeOffData, expiresAt });
    }

    public get(userId: string): ITimeOff | undefined {
        const cached = this.cache.get(userId);
        if (!cached) return undefined;

        if (Date.now() > cached.expiresAt) {
            this.cache.delete(userId);
            return undefined;
        }

        return cached.data;
    }

    public invalidateUser(userId: string): void {
        this.cache.delete(userId);
    }

    public invalidateCache(): void {
        this.cache.clear();
    }
}

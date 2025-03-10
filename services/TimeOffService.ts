import { IPersistence } from "@rocket.chat/apps-engine/definition/accessors";
import { ITimeOff } from "../interfaces/ITimeOff";
import { ITimeOffRepository } from "../repositories/ITimeOffRepository";
import { TimeOffCache } from "../TimeOffCache";
import { TimeOffApp } from "../TimeOffApp";

export class TimeOffService {
    constructor(private readonly timeOffRepository: ITimeOffRepository) {}

    public async saveTimeOff(persistence: IPersistence, timeOff: ITimeOff): Promise<boolean> {
        const success = await this.timeOffRepository.save(persistence, timeOff);

        if (success) {
            const cache = TimeOffCache.getInstance();
            cache.invalidateUser(timeOff.coreUserId);
            cache.set(timeOff.coreUserId, timeOff);
        }

        return success;
    }

    public async getTimeOffByUserId(coreUserId: string): Promise<ITimeOff | undefined> {
        const cache: TimeOffCache = TimeOffCache.getInstance();
        let timeOffData: ITimeOff | undefined = cache.get(coreUserId);

        if (!timeOffData) {
            timeOffData = await this.timeOffRepository.findByUserId(coreUserId);

            if (timeOffData) {
                cache.set(coreUserId, timeOffData);
            }
        }

        return timeOffData;
    }
}

import { ITimeOff } from "../interfaces/ITimeOff";
import { ITimeOffRepository } from "../repositories/ITimeOffRepository";
import { TimeOffCache } from "../TimeOffCache";
import { ITimeOffService } from "./ITimeOffService";

export class TimeOffService implements ITimeOffService {
    constructor(private readonly repository: ITimeOffRepository) {}

    public async saveTimeOff(timeOff: ITimeOff): Promise<boolean> {
        const success = await this.repository.save(timeOff);

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
            timeOffData = await this.repository.findByUserId(coreUserId);

            if (timeOffData) {
                cache.set(coreUserId, timeOffData);
            }
        }

        return timeOffData;
    }
}

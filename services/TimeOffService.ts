import { IPersistence } from "@rocket.chat/apps-engine/definition/accessors";
import { ITimeOff } from "../interfaces/ITimeOff";
import { ITimeOffRepository } from "../repositories/ITimeOffRepository";

export class TimeOffService {
    constructor(private readonly timeOffRepository: ITimeOffRepository) {}

    public async saveTimeOff(persistence: IPersistence, timeOff: ITimeOff): Promise<boolean> {
        return this.timeOffRepository.save(persistence, timeOff);
    }

    public async getTimeOffByUserId(coreUserId: string): Promise<ITimeOff | undefined> {
        return this.timeOffRepository.findByUserId(coreUserId);
    }
}

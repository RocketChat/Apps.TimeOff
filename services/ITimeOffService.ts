import { IPersistence } from "@rocket.chat/apps-engine/definition/accessors";
import { ITimeOff } from "../interfaces/ITimeOff";

export interface ITimeOffService {
    saveTimeOff(persistence: IPersistence, timeOff: ITimeOff): Promise<boolean>;
    getTimeOffByUserId(coreUserId: string): Promise<ITimeOff | undefined>;
}

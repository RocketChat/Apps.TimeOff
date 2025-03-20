import { IPersistence } from "@rocket.chat/apps-engine/definition/accessors";
import { ITimeOff } from "../interfaces/ITimeOff";

export interface ITimeOffRepository {
    save(persistence: IPersistence, timeOff: ITimeOff): Promise<boolean>;
    findByUserId(coreUserId: string): Promise<ITimeOff | undefined>;
}

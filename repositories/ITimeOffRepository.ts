import { ITimeOff } from "../interfaces/ITimeOff";

export interface ITimeOffRepository {
    save(timeOff: ITimeOff): Promise<boolean>;
    findByUserId(coreUserId: string): Promise<ITimeOff | undefined>;
}

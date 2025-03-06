import { Status } from "../enums/Status";

export interface ITimeOff {
    coreUserId: string;
    username: string;
    message: string;
    status: Status;
    startAt?: Date;
    endAt?: Date;
}

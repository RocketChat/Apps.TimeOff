import { TimeOffStatus } from '../enums/Status';

export interface ITimeOff {
	coreUserId: string;
	username: string;
	message: string;
	status: TimeOffStatus;
}

import { ITimeOff } from '../interfaces/ITimeOff';

export interface ITimeOffService {
	saveTimeOff(timeOff: ITimeOff): Promise<boolean>;
	getTimeOffByUserId(coreUserId: string): Promise<ITimeOff | undefined>;
}

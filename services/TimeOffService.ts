import { ITimeOff } from '../interfaces/ITimeOff';
import { ITimeOffRepository } from '../repositories/ITimeOffRepository';
import { ITimeOffService } from './ITimeOffService';

export class TimeOffService implements ITimeOffService {
	constructor(private readonly repository: ITimeOffRepository) {}

	public async saveTimeOff(timeOff: ITimeOff): Promise<boolean> {
		return this.repository.save(timeOff);
	}

	public async getTimeOffByUserId(coreUserId: string): Promise<ITimeOff | undefined> {
		return this.repository.findByUserId(coreUserId);
	}
}

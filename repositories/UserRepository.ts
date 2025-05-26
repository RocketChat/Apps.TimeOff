import { IRead } from '@rocket.chat/apps-engine/definition/accessors';
import { IUser } from '@rocket.chat/apps-engine/definition/users';
import { IUserRepository } from './IUserRepository';

export class UserRepository implements IUserRepository {
	constructor(private readonly read: IRead) {}

	public async getById(userId: string): Promise<IUser | undefined> {
		try {
			return await this.read.getUserReader().getById(userId);
		} catch (err) {
			console.warn(`[UserRepository] Error fetching user by ID: ${userId}`, err);
			return undefined;
		}
	}
}

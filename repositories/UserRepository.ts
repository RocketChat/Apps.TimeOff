import { IRead } from "@rocket.chat/apps-engine/definition/accessors";
import { IUser } from "@rocket.chat/apps-engine/definition/users";
import { IUserRepository } from "./IUserRepository";

export class UserRepository implements IUserRepository {
    constructor(private readonly read: IRead) {}

    public async getById(userId: string): Promise<IUser> {
        return this.read.getUserReader().getById(userId);
    }
}

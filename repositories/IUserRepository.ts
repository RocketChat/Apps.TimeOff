import { IUser } from "@rocket.chat/apps-engine/definition/users";

export interface IUserRepository {
    getById(userId: string): Promise<IUser>;
}

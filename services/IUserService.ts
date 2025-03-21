import { IUser } from "@rocket.chat/apps-engine/definition/users";

export interface IUserService {
    getUserById(userId: string): Promise<IUser | undefined>;
}

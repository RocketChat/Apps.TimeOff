import { IUser } from "@rocket.chat/apps-engine/definition/users";
import { IUserRepository } from "../repositories/IUserRepository";
import { IUserService } from "./IUserService";

export class UserService implements IUserService {
    constructor(private readonly userRepository: IUserRepository) {}

    public async getUserById(userId: string): Promise<IUser | undefined> {
        return this.userRepository.getById(userId);
    }
}

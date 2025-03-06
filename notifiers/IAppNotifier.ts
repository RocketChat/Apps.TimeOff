import { IRoom } from "@rocket.chat/apps-engine/definition/rooms";
import { IUser } from "@rocket.chat/apps-engine/definition/users";

export interface IAppNotifier {
    notifyUser(room: IRoom, sender: IUser, message: string): void;
}

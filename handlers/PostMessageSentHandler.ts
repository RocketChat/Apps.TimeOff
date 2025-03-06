import { IMessage } from "@rocket.chat/apps-engine/definition/messages";
import { IUser } from "@rocket.chat/apps-engine/definition/users";
import { Status } from "../enums/Status";
import { IUserRepository } from "../repositories/IUserRepository";
import { ITimeOffService } from "../services/ITimeOffService";
import { IAppNotifier } from "../notifiers/IAppNotifier";

export class PostMessageSentHandler {
    constructor(
        private readonly userRepository: IUserRepository,
        private readonly timeOffService: ITimeOffService,
        private readonly notifier: IAppNotifier
    ) {}

    public async handle(message: IMessage): Promise<void> {
        const sender = await this.userRepository.getById(message.sender.id);
        const receiver = await this.getReceiver(message, sender);

        if (!receiver) return;

        const timeOffEntry = await this.timeOffService.getTimeOffByUserId(receiver.id);

        if (timeOffEntry?.status === Status.IN_TIME_OFF) {
            this.notifier.notifyUser(message.room, sender, timeOffEntry.message);
        }
    }

    private async getReceiver(message: IMessage, sender: IUser): Promise<IUser | null> {
        const members = message.room.userIds || [];
        const receiverId = members.find((id) => id !== sender.id);

        return receiverId ? this.userRepository.getById(receiverId) : null;
    }
}

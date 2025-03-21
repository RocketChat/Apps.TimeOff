import { IMessage } from "@rocket.chat/apps-engine/definition/messages";
import { IUser } from "@rocket.chat/apps-engine/definition/users";
import { TimeOffStatus } from "../enums/Status";
import { IUserRepository } from "../repositories/IUserRepository";
import { ITimeOffService } from "../services/ITimeOffService";
import { IAppNotifier } from "../notifiers/IAppNotifier";
import { LayoutBlock } from "@rocket.chat/ui-kit";
import { TimeOffApp } from "../TimeOffApp";

export class PostMessageSentHandler {
    constructor(
        private readonly app: TimeOffApp,
        private readonly userRepository: IUserRepository,
        private readonly timeOffService: ITimeOffService,
        private readonly notifier: IAppNotifier
    ) {}

    public async handle(message: IMessage): Promise<void> {
        const sender = await this.userRepository.getById(message.sender.id);
        if (!sender) {
            this.app.getLogger().error("[PostMessageSentHandler] Sender not found for message:", message);
            return;
        }

        const receiver = await this.getReceiver(message, sender);
        if (!receiver) {
            this.app.getLogger().error("[PostMessageSentHandler] Receiver not found for message:", message);
            return;
        }

        const timeOffEntry = await this.timeOffService.getTimeOffByUserId(receiver.id);

        if (timeOffEntry?.status === TimeOffStatus.ON_TIME_OFF) {
            this.notifier.notifyUser(message.room, sender, timeOffEntry.message, this.timeOffMessage(receiver.username, timeOffEntry.message));
        }
    }

    private async getReceiver(message: IMessage, sender: IUser): Promise<IUser | undefined> {
        const members = message.room.userIds || [];
        const receiverId = members.find((id) => id !== sender.id);

        return receiverId ? await this.userRepository.getById(receiverId) : undefined;
    }

    private timeOffMessage(username: string, message: string): LayoutBlock[] {
        return [
            {
                type: "section",
                text: {
                    type: "mrkdwn",
                    text: `${username} is currently *unavailable* to answer your message, however they left the following message:\n\n`
                }
            },
            {
                type: "preview",
                title: [],
                description: [{
                    type: "mrkdwn",
                    text: message
                }]
            }
        ];
    }
}

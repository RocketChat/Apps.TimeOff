import { IModify, IRead } from "@rocket.chat/apps-engine/definition/accessors";
import { IRoom } from "@rocket.chat/apps-engine/definition/rooms";
import { IUser } from "@rocket.chat/apps-engine/definition/users";
import { IAppNotifier } from "./IAppNotifier";
import { LayoutBlock } from "@rocket.chat/ui-kit";
import { TimeOffApp } from "../TimeOffApp";

export class AppNotifier implements IAppNotifier {
    private readonly TimeOffName: string = 'TimeOff Bot';
    private readonly TimeOffEmojiAvatar: string = ':sunrise:';

    constructor(
        private readonly app: TimeOffApp,
        private readonly read: IRead
    ) {}

    public async notifyUser(room: IRoom, user: IUser, message?: string, messageBlocks?: LayoutBlock[]): Promise<void> {
        const notifier = this.read.getNotifier();
        const messageBuilder = notifier.getMessageBuilder();
        messageBuilder
                .setRoom(room)
                .setUsernameAlias(this.TimeOffName)
                .setEmojiAvatar(this.TimeOffEmojiAvatar);

        if (message) messageBuilder.setText(message);
        if (messageBlocks) messageBuilder.setBlocks(messageBlocks);

        try {
            await notifier.notifyUser(user, messageBuilder.getMessage());
        } catch (error) {
            this.app.getLogger().error(error);
        }
    }
}

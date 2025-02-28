import { IRead, IMessageBuilder } from "@rocket.chat/apps-engine/definition/accessors";
import { IRoom } from "@rocket.chat/apps-engine/definition/rooms";
import { IUser } from "@rocket.chat/apps-engine/definition/users";
import { LayoutBlock } from "@rocket.chat/ui-kit";
import { TimeOffApp } from "../TimeOffApp";

export async function notifyUser(app: TimeOffApp, read: IRead, room: IRoom, user: IUser, message?: string, messageBlocks?: LayoutBlock[]): Promise<void> {
    const notifier = read.getNotifier();
    const messageBuilder: IMessageBuilder = notifier.getMessageBuilder();
    messageBuilder.setRoom(room);

    if (message) messageBuilder.setText(message);

    if (messageBlocks) messageBuilder.setBlocks(messageBlocks);

    try {
        await notifier.notifyUser(user, messageBuilder.getMessage());
    } catch (error) {
        app.getLogger().log(error);
    }
}

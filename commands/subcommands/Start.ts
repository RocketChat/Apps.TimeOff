import { IPersistence, IRead } from "@rocket.chat/apps-engine/definition/accessors";
import { SlashCommandContext } from "@rocket.chat/apps-engine/definition/slashcommands";
import { TimeOffApp } from "../../TimeOffApp";
import { NOTIFICATION_MESSAGES } from "../../helpers/NotificationMessage";
import { ITimeOff } from "../../interfaces/ITimeOff";
import { Status } from "../../enums/Status";
import { AppNotifier } from "../../notifiers/AppNotifier";
import { TimeOffRepository } from "../../repositories/TimeOffRepository";

export async function startCommand(app: TimeOffApp, context: SlashCommandContext, read: IRead, persistence: IPersistence): Promise<void> {
    const currentUser = context.getSender();
    let [_, message] = context.getArguments();

    if (!message) {
        message = NOTIFICATION_MESSAGES.default_reply_message;
    }

    const timeOffEntry: ITimeOff = {
        coreUserId: currentUser.id,
        username: currentUser.username,
        status: Status.IN_TIME_OFF,
        message: message,
    };

    const timeOffRepository = new TimeOffRepository(read);
    timeOffRepository.save(persistence,timeOffEntry);


    const room = context.getRoom();
    const notificationMessage = NOTIFICATION_MESSAGES.started;

    const notifier = new AppNotifier(this, read);
    await notifier.notifyUser(room, currentUser, notificationMessage);
}

import { IPersistence, IRead } from "@rocket.chat/apps-engine/definition/accessors";
import { SlashCommandContext } from "@rocket.chat/apps-engine/definition/slashcommands";
import { TimeOffApp } from "../../TimeOffApp";
import { NOTIFICATION_MESSAGES } from "../../helpers/NotificationMessage";
import { ITimeOff } from "../../interfaces/ITimeOff";
import { Status } from "../../enums/Status";
import { AppNotifier } from "../../notifiers/AppNotifier";
import { TimeOffRepository } from "../../repositories/TimeOffRepository";
import { TimeOffService } from "../../services/TimeOffService";
import { CommandEnum } from "../../enums/CommandEnum";

export async function startCommand(app: TimeOffApp, context: SlashCommandContext, read: IRead, persistence: IPersistence): Promise<void> {
    const currentUser = context.getSender();
    // remove the command from the message and then join other arguments
    let message = context.getArguments().join(' ').replace(CommandEnum.START, '');
    const notifier = new AppNotifier(this, read);

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
    const timeOffService = new TimeOffService(timeOffRepository);
    const savedTimeOff = await timeOffService.saveTimeOff(persistence, timeOffEntry);

    const room = context.getRoom();
    const notificationMessage = !savedTimeOff ? NOTIFICATION_MESSAGES.error : NOTIFICATION_MESSAGES.started;
    await notifier.notifyUser(room, currentUser, notificationMessage);
}

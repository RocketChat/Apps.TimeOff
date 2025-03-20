import { IRead, IPersistence } from "@rocket.chat/apps-engine/definition/accessors";
import { SlashCommandContext } from "@rocket.chat/apps-engine/definition/slashcommands";
import { NOTIFICATION_MESSAGES } from "../../helpers/NotificationMessage";
import { AppNotifier } from "../../notifiers/AppNotifier";
import { TimeOffRepository } from "../../repositories/TimeOffRepository";
import { TimeOffApp } from "../../TimeOffApp";
import { TimeOffStatus } from "../../enums/Status";
import { TimeOffService } from "../../services/TimeOffService";


export async function statusCommand(app: TimeOffApp, context: SlashCommandContext, read: IRead, persistence: IPersistence): Promise<void> {
    const currentUser = context.getSender();
    const room = context.getRoom();
    const notifier = new AppNotifier(this, read);

    const timeOffRepository = new TimeOffRepository(read, persistence);
    const timeOffService = new TimeOffService(timeOffRepository);
    const timeOffEntry = await timeOffService.getTimeOffByUserId(currentUser.id);

    let notificationMessage = '';

    if (!timeOffEntry) {
        notificationMessage = NOTIFICATION_MESSAGES.not_started;
        await notifier.notifyUser(room, currentUser, notificationMessage);
        return;
    }

    if (timeOffEntry.status === TimeOffStatus.ON_TIME_OFF) {
        notificationMessage = `${NOTIFICATION_MESSAGES.status_in}${timeOffEntry.message}`;
    } else {
        notificationMessage = `${NOTIFICATION_MESSAGES.status_out}`;
    }

    await notifier.notifyUser(room, currentUser, notificationMessage);
}

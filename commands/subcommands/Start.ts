import { IPersistence, IRead } from "@rocket.chat/apps-engine/definition/accessors";
import { SlashCommandContext } from "@rocket.chat/apps-engine/definition/slashcommands";
import { TimeOffApp } from "../../TimeOffApp";
import { NOTIFICATION_MESSAGES } from "../../helpers/NotificationMessage";
import { ITimeOff } from "../../interfaces/ITimeOff";
import { TimeOffStatus } from "../../enums/Status";
import { AppNotifier } from "../../notifiers/AppNotifier";
import { TimeOffRepository } from "../../repositories/TimeOffRepository";
import { TimeOffService } from "../../services/TimeOffService";
import { CommandEnum } from "../../enums/CommandEnum";
import { RocketChatAssociationRecord, RocketChatAssociationModel } from "@rocket.chat/apps-engine/definition/metadata";

export async function startCommand(app: TimeOffApp, context: SlashCommandContext, read: IRead, persistence: IPersistence): Promise<void> {
    const currentUser = context.getSender();
    const room = context.getRoom();
    const notifier = new AppNotifier(this, read);

    let message = context.getArguments().join(' ').replace(CommandEnum.START, '');
    if (!message) {
        message = NOTIFICATION_MESSAGES.default_reply_message;
    }

    const timeOffEntry: ITimeOff = {
        coreUserId: currentUser.id,
        username: currentUser.username,
        status: TimeOffStatus.ON_TIME_OFF,
        message: message,
    };

    const timeOffRepository = new TimeOffRepository(app, read, persistence);
    const timeOffService = new TimeOffService(timeOffRepository);
    const savedTimeOff = await timeOffService.saveTimeOff(timeOffEntry);

    const notificationMessage = !savedTimeOff ? NOTIFICATION_MESSAGES.error : NOTIFICATION_MESSAGES.started;
    await notifier.notifyUser(room, currentUser, notificationMessage);
}

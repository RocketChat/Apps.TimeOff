import { IPersistence, IRead } from "@rocket.chat/apps-engine/definition/accessors";
import { SlashCommandContext } from "@rocket.chat/apps-engine/definition/slashcommands";
import { TimeOffApp } from "../../TimeOffApp";
import { notifyUser } from "../../helpers/Util";
import { NOTIFICATION_MESSAGES } from "../../helpers/NotificationMessage";
import { TimeOffPersistence } from "../../persistence/TimeOffPersistence";
import { ITimeOff } from "../../definitions/TimeOff";
import { Status } from "../../enums/Status";

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

    TimeOffPersistence.persist(persistence,timeOffEntry);


    const room = context.getRoom();
    const notificationMessage = NOTIFICATION_MESSAGES.started;

    await notifyUser(app, read, room, currentUser, notificationMessage);
}

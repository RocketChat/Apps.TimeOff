import { IRead, IPersistence } from '@rocket.chat/apps-engine/definition/accessors';
import { SlashCommandContext } from '@rocket.chat/apps-engine/definition/slashcommands';
import { NOTIFICATION_MESSAGES } from '../../helpers/NotificationMessage';
import { AppNotifier } from '../../notifiers/AppNotifier';
import { TimeOffRepository } from '../../repositories/TimeOffRepository';
import { TimeOffApp } from '../../TimeOffApp';
import { TimeOffStatus } from '../../enums/Status';
import { TimeOffService } from '../../services/TimeOffService';

export async function endCommand(
	app: TimeOffApp,
	context: SlashCommandContext,
	read: IRead,
	persistence: IPersistence,
): Promise<void> {
	const currentUser = context.getSender();
	const room = context.getRoom();
	const notifier = new AppNotifier(this, read);

	const timeOffRepository = new TimeOffRepository(app, read, persistence);
	const timeOffService = new TimeOffService(timeOffRepository);
	const timeOffEntry = await timeOffService.getTimeOffByUserId(currentUser.id);

	let notificationMessage = NOTIFICATION_MESSAGES.ended;

	if (!timeOffEntry || timeOffEntry.status === TimeOffStatus.OFF_TIME_OFF) {
		notificationMessage = NOTIFICATION_MESSAGES.not_started;
		await notifier.notifyUser(room, currentUser, notificationMessage);
		return;
	}

	timeOffEntry.status = TimeOffStatus.OFF_TIME_OFF;
	const savedTimeOff = await timeOffService.saveTimeOff(timeOffEntry);

	if (!savedTimeOff) {
		notificationMessage = NOTIFICATION_MESSAGES.error;
	} else {
		await notifier.notifyUser(room, currentUser, notificationMessage);
	}
}

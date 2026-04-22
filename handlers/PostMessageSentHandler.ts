import { IMessage } from '@rocket.chat/apps-engine/definition/messages';
import { IUser } from '@rocket.chat/apps-engine/definition/users';
import { TimeOffStatus } from '../enums/Status';
import { ITimeOffService } from '../services/ITimeOffService';
import { IAppNotifier } from '../notifiers/IAppNotifier';
import { TimeOffMessageFormatter } from '../helpers/TimeOffMessageFormatter';
import { TimeOffApp } from '../TimeOffApp';
import { IUserService } from '../services/IUserService';
import { ITimeOff } from '../interfaces/ITimeOff';
import { MILLISECONDS_PER_HOUR } from '../helpers/AppSettings';

export class PostMessageSentHandler {
	constructor(
		private readonly app: TimeOffApp,
		private readonly userService: IUserService,
		private readonly timeOffService: ITimeOffService,
		private readonly notifier: IAppNotifier,
		private readonly notificationCooldownHours: number,
	) {}

	public async handle(message: IMessage): Promise<void> {
		const sender = await this.getSender(message);
		if (!sender) return;

		const receiver = await this.getReceiver(message, sender);
		if (!receiver) return;

		const timeOffEntry = await this.timeOffService.getTimeOffByUserId(receiver.id);
		if (!this.shouldSendNotification(timeOffEntry, sender.id)) {
			return;
		}

		await this.notifySender(message, sender, receiver, timeOffEntry.message);
		await this.persistLastNotifiedAtBySender(timeOffEntry, sender.id);
	}

	private async getSender(message: IMessage): Promise<IUser | undefined> {
		const sender = await this.userService.getUserById(message.sender.id);
		if (!sender) {
			this.app.getLogger().error('[PostMessageSentHandler] Sender not found for message:', message);
		}
		return sender;
	}

	private async getReceiver(message: IMessage, sender: IUser): Promise<IUser | undefined> {
		const members = message.room.userIds || [];
		const receiverId = members.find((id) => id !== sender.id);

		if (!receiverId) {
			this.app.getLogger().error('[PostMessageSentHandler] Receiver not found for message:', message);
			return undefined;
		}

		return await this.userService.getUserById(receiverId);
	}

	private async notifySender(
		message: IMessage,
		sender: IUser,
		receiver: IUser,
		timeOffMessage: string,
	): Promise<void> {
		const formattedMessage = TimeOffMessageFormatter.format(receiver.username, timeOffMessage);
		await this.notifier.notifyUser(message.room, sender, timeOffMessage, formattedMessage);
	}

	private shouldSendNotification(timeOffEntry: ITimeOff | undefined, senderId: string): timeOffEntry is ITimeOff {
		if (!timeOffEntry || timeOffEntry.status !== TimeOffStatus.ON_TIME_OFF) {
			return false;
		}

		return this.shouldNotifySender(timeOffEntry, senderId);
	}

	private shouldNotifySender(timeOffEntry: ITimeOff, senderId: string): boolean {
		const lastNotifiedAt = timeOffEntry.lastNotifiedAtBySenderId?.[senderId];
		if (!lastNotifiedAt) {
			return true;
		}

		const cooldownMs = this.notificationCooldownHours * MILLISECONDS_PER_HOUR;
		return Date.now() - lastNotifiedAt >= cooldownMs;
	}

	private async persistLastNotifiedAtBySender(timeOffEntry: ITimeOff, senderId: string): Promise<void> {
		const now = Date.now();
		const cleanedNotifications = this.cleanupExpiredNotifications(timeOffEntry.lastNotifiedAtBySenderId || {}, now);

		const saveSucceeded = await this.timeOffService.saveTimeOff({
			...timeOffEntry,
			lastNotifiedAtBySenderId: {
				...cleanedNotifications,
				[senderId]: now,
			},
		});

		if (!saveSucceeded) {
			this.app.getLogger().error('[PostMessageSentHandler] Could not persist last-notified timestamp.');
		}
	}

	private cleanupExpiredNotifications(notifications: Record<string, number>, now: number): Record<string, number> {
		const cooldownMs = this.notificationCooldownHours * MILLISECONDS_PER_HOUR;

		return Object.keys(notifications).reduce<Record<string, number>>((acc, senderId) => {
			const timestamp = notifications[senderId];
			if (now - timestamp < cooldownMs) {
				acc[senderId] = timestamp;
			}
			return acc;
		}, {});
	}
}

import { IMessage } from '@rocket.chat/apps-engine/definition/messages';
import { IUser } from '@rocket.chat/apps-engine/definition/users';
import { TimeOffStatus } from '../enums/Status';
import { ITimeOffService } from '../services/ITimeOffService';
import { IAppNotifier } from '../notifiers/IAppNotifier';
import { TimeOffMessageFormatter } from '../helpers/TimeOffMessageFormatter';
import { TimeOffApp } from '../TimeOffApp';
import { IUserService } from '../services/IUserService';

export class PostMessageSentHandler {
	constructor(
		private readonly app: TimeOffApp,
		private readonly userService: IUserService,
		private readonly timeOffService: ITimeOffService,
		private readonly notifier: IAppNotifier,
	) {}

	public async handle(message: IMessage): Promise<void> {
		const sender = await this.getSender(message);
		if (!sender) return;

		const receiver = await this.getReceiver(message, sender);
		if (!receiver) return;

		const timeOffEntry = await this.timeOffService.getTimeOffByUserId(receiver.id);
		if (timeOffEntry?.status === TimeOffStatus.ON_TIME_OFF) {
			this.notifySender(message, sender, receiver, timeOffEntry.message);
		}
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

	private notifySender(message: IMessage, sender: IUser, receiver: IUser, timeOffMessage: string): void {
		const formattedMessage = TimeOffMessageFormatter.format(receiver.username, timeOffMessage);
		this.notifier.notifyUser(message.room, sender, timeOffMessage, formattedMessage);
	}
}

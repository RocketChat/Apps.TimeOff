import {
	IAppAccessors,
	IConfigurationExtend,
	IConfigurationModify,
	IEnvironmentRead,
	IHttp,
	ILogger,
	IModify,
	IPersistence,
	IRead,
} from '@rocket.chat/apps-engine/definition/accessors';
import { App } from '@rocket.chat/apps-engine/definition/App';
import { IAppInfo } from '@rocket.chat/apps-engine/definition/metadata';
import { TimeOffCommand } from './commands/TimeOffCommand';
import { IMessage, IPostMessageSent } from '@rocket.chat/apps-engine/definition/messages';
import { RoomType } from '@rocket.chat/apps-engine/definition/rooms';
import { UserRepository } from './repositories/UserRepository';
import { TimeOffService } from './services/TimeOffService';
import { AppNotifier } from './notifiers/AppNotifier';
import { PostMessageSentHandler } from './handlers/PostMessageSentHandler';
import { TimeOffRepository } from './repositories/TimeOffRepository';
import { TimeOffCache } from './TimeOffCache';
import { UserService } from './services/UserService';

export class TimeOffApp extends App implements IPostMessageSent {
	constructor(info: IAppInfo, logger: ILogger, accessors: IAppAccessors) {
		super(info, logger, accessors);
	}

	public async extendConfiguration(
		configuration: IConfigurationExtend,
		_environmentRead: IEnvironmentRead,
	): Promise<void> {
		configuration.slashCommands.provideSlashCommand(new TimeOffCommand(this));
	}

	public async onEnable(
		_environmentRead: IEnvironmentRead,
		_configurationModify: IConfigurationModify,
	): Promise<boolean> {
		TimeOffCache.getInstance().invalidateCache();
		return Promise.resolve(true);
	}

	public async checkPostMessageSent?(message: IMessage, _read: IRead, _http: IHttp): Promise<boolean> {
		// We only want to notify the user if the message was sent in a direct message
		return Promise.resolve(message.room.type === RoomType.DIRECT_MESSAGE);
	}

	public async executePostMessageSent(
		message: IMessage,
		read: IRead,
		_http: IHttp,
		persistence: IPersistence,
		_modify: IModify,
	): Promise<void> {
		const userRepository = new UserRepository(read);
		const userService = new UserService(userRepository);

		const timeOffRepository = new TimeOffRepository(this, read, persistence);
		const timeOffService = new TimeOffService(timeOffRepository);

		const notifier = new AppNotifier(this, read);

		const handler = new PostMessageSentHandler(this, userService, timeOffService, notifier);
		await handler.handle(message);
	}
}

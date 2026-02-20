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
import { SettingType } from '@rocket.chat/apps-engine/definition/settings';
import { UserRepository } from './repositories/UserRepository';
import { TimeOffService } from './services/TimeOffService';
import { AppNotifier } from './notifiers/AppNotifier';
import { PostMessageSentHandler } from './handlers/PostMessageSentHandler';
import { TimeOffRepository } from './repositories/TimeOffRepository';
import { TimeOffCache } from './TimeOffCache';
import { UserService } from './services/UserService';
import {
	APP_SETTINGS,
	DEFAULT_TIME_OFF_REPLY_COOLDOWN_HOURS,
	MIN_TIME_OFF_REPLY_COOLDOWN_HOURS,
} from './helpers/AppSettings';

export class TimeOffApp extends App implements IPostMessageSent {
	constructor(info: IAppInfo, logger: ILogger, accessors: IAppAccessors) {
		super(info, logger, accessors);
	}

	public async extendConfiguration(
		configuration: IConfigurationExtend,
		_environmentRead: IEnvironmentRead,
	): Promise<void> {
		configuration.slashCommands.provideSlashCommand(new TimeOffCommand(this));
		await configuration.settings.provideSetting({
			id: APP_SETTINGS.TIME_OFF_REPLY_COOLDOWN_HOURS,
			type: SettingType.NUMBER,
			packageValue: DEFAULT_TIME_OFF_REPLY_COOLDOWN_HOURS,
			required: false,
			public: true,
			i18nLabel: 'TimeOff Reply Cooldown (hours)',
			i18nDescription: `Hours to wait before sending another TimeOff message to the same sender. Minimum: ${MIN_TIME_OFF_REPLY_COOLDOWN_HOURS}.`,
		});
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
		const cooldownHours = await this.getTimeOffReplyCooldownHours(read);

		const handler = new PostMessageSentHandler(this, userService, timeOffService, notifier, cooldownHours);
		await handler.handle(message);
	}

	private async getTimeOffReplyCooldownHours(read: IRead): Promise<number> {
		try {
			const settingValue = await read
				.getEnvironmentReader()
				.getSettings()
				.getValueById(APP_SETTINGS.TIME_OFF_REPLY_COOLDOWN_HOURS);
			const parsedSettingValue = Number(settingValue);

			if (Number.isFinite(parsedSettingValue)) {
				return Math.max(parsedSettingValue, MIN_TIME_OFF_REPLY_COOLDOWN_HOURS);
			}
		} catch (error) {
			this.getLogger().error('[TimeOffApp] Error while reading time-off reply cooldown setting:', error);
		}

		return DEFAULT_TIME_OFF_REPLY_COOLDOWN_HOURS;
	}
}

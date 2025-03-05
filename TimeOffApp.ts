import {
    IAppAccessors,
    IConfigurationExtend,
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
import { TimeOffPersistence } from './persistence/TimeOffPersistence';
import { ITimeOff } from './definitions/TimeOff';
import { notifyUser } from './helpers/Util';
import { IUser } from '@rocket.chat/apps-engine/definition/users';
import { Status } from './enums/Status';

export class TimeOffApp extends App implements IPostMessageSent {
    constructor(info: IAppInfo, logger: ILogger, accessors: IAppAccessors) {
        super(info, logger, accessors);
    }

    public async extendConfiguration(configuration: IConfigurationExtend, environmentRead: IEnvironmentRead): Promise<void> {
        configuration.slashCommands.provideSlashCommand(new TimeOffCommand(this));
    }

    public async checkPostMessageSent?(message: IMessage, read: IRead, http: IHttp): Promise<boolean> {
        // We only want to notify the user if the message was sent in a direct message
        return Promise.resolve(message.room.type === RoomType.DIRECT_MESSAGE);
    }

    public async executePostMessageSent(message: IMessage, read: IRead, http: IHttp, persistence: IPersistence, modify: IModify): Promise<void> {
        const sender: IUser = await read.getUserReader().getById(message.sender.id);

        const members = message.room.userIds || [];

        const receiverId = members.find((id) => id !== sender.id);
        if (!receiverId) {
            return;
        }

        const receiver: IUser = await read.getUserReader().getById(receiverId);

        const timeOffEntry: ITimeOff | undefined = await TimeOffPersistence.findByUserId(read.getPersistenceReader(), receiver.id);

        if (timeOffEntry && timeOffEntry.status === Status.IN_TIME_OFF) {
            notifyUser(this, read, message.room, sender, timeOffEntry.message);
        }

        // SOLID Version
        // const userRepository = new UserRepository(read);
        // const timeOffService = new TimeOffService(read.getPersistenceReader());
        // const notifier = new Notifier(modify);

        // const handler = new PostMessageSentHandler(userRepository, timeOffService, notifier);
        // await handler.handle(message);
    }

}

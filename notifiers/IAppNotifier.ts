import { IRoom } from '@rocket.chat/apps-engine/definition/rooms';
import { IUser } from '@rocket.chat/apps-engine/definition/users';
import { LayoutBlock } from '@rocket.chat/ui-kit';

export interface IAppNotifier {
	notifyUser(room: IRoom, sender: IUser, message?: string, messageBlocks?: LayoutBlock[]): void;
}

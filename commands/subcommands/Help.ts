import { IRead } from '@rocket.chat/apps-engine/definition/accessors';
import { SlashCommandContext } from '@rocket.chat/apps-engine/definition/slashcommands';
import { TimeOffApp } from '../../TimeOffApp';
import { AppNotifier } from '../../notifiers/AppNotifier';

export async function helpCommand(app: TimeOffApp, context: SlashCommandContext, read: IRead): Promise<void> {
	const sender = context.getSender();
	const room = context.getRoom();

	const message =
		`*Time Off App Help*\n\n` +
		`*Commands*\n` +
		`• \`/time-off start\` starts new time off period\n` +
		`• \`/time-off start [message]\` start a new time off period with a custom message\n` +
		`• \`/time-off end\` ends current time off period\n` +
		`• \`/time-off status\` shows current time off status\n` +
		`• \`/time-off help\` shows this list\n`;

	const notifier = new AppNotifier(app, read);
	await notifier.notifyUser(room, sender, message);
}

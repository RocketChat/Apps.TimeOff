import { IRead, IModify } from "@rocket.chat/apps-engine/definition/accessors";
import { SlashCommandContext } from "@rocket.chat/apps-engine/definition/slashcommands";
import { TimeOffApp } from "../../TimeOffApp";
import { AppNotifier } from "../../notifiers/AppNotifier";


export async function helpCommand(app: TimeOffApp, context: SlashCommandContext, read: IRead): Promise<void> {
    const sender = context.getSender();
    const room = context.getRoom();

    const message = `*Time Off App Help*\n\n` +
        `*Commands*\n` +
        `• \`/time-off start\` - Start a new time off\n` +
        `• \`/time-off end\` - End an existing time off\n` +
        `• \`/time-off status\` - Check the current time off status\n` +
        `• \`/time-off help\` - Display this help message\n`;

    const notifier = new AppNotifier(app, read);
    await notifier.notifyUser(room, sender, message);
}

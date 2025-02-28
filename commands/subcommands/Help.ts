import { IRead, IModify } from "@rocket.chat/apps-engine/definition/accessors";
import { SlashCommandContext } from "@rocket.chat/apps-engine/definition/slashcommands";
import { TimeOffApp } from "../../TimeOffApp";
import { notifyUser } from "../../helpers/Util";


export async function helpCommand(app: TimeOffApp, context: SlashCommandContext, read: IRead): Promise<void> {
    const sender = context.getSender();
    const room = context.getRoom();

    const message = `*Time Off App Help*\n\n` +
        `*Commands*\n` +
        `• \`/time-off start\` - Start a new time off\n` +
        `• \`/time-off end\` - End an existing time off\n` +
        `• \`/time-off help\` - Display this help message\n`;

    await notifyUser(app, read, room, sender, message);
}

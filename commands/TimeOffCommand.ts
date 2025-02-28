import { IRead, IModify, IPersistence } from "@rocket.chat/apps-engine/definition/accessors";
import { ISlashCommand, SlashCommandContext } from "@rocket.chat/apps-engine/definition/slashcommands";
import { CommandEnum } from "../enums/CommandEnum";
import { TimeOffApp } from "../TimeOffApp";
import { helpCommand } from "./subcommands/Help";

export class TimeOffCommand implements ISlashCommand {
    public command = 'time-off';
    public i18nParamsExample = '';
    public i18nDescription = '';
    public providesPreview = false;

    constructor(private readonly app: TimeOffApp) {}

    public async executor(context: SlashCommandContext, read: IRead): Promise<void> {

        const [command, ...params] = context.getArguments();

        if (!command) {
            helpCommand(this.app, context, read);
            return;
        }

        switch (command) {
            case CommandEnum.START:

                break;
            case CommandEnum.END:

                break;
            case CommandEnum.HELP:
            default:
                helpCommand(this.app, context, read);
                break;
        }
    }
}

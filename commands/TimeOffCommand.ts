import { IHttp, IModify, IPersistence, IRead } from "@rocket.chat/apps-engine/definition/accessors";
import { ISlashCommand, SlashCommandContext } from "@rocket.chat/apps-engine/definition/slashcommands";
import { CommandEnum } from "../enums/CommandEnum";
import { TimeOffApp } from "../TimeOffApp";
import { helpCommand } from "./subcommands/Help";
import { startCommand } from "./subcommands/Start";
import { endCommand } from "./subcommands/End";
import { statusCommand } from "./subcommands/Status";

export class TimeOffCommand implements ISlashCommand {
    public command = 'time-off';
    public i18nParamsExample = '';
    public i18nDescription = '';
    public providesPreview = false;

    constructor(private readonly app: TimeOffApp) {}

    public async executor(context: SlashCommandContext, read: IRead, modify: IModify, http: IHttp, persistence: IPersistence): Promise<void> {

        const [command, ...params] = context.getArguments();

        if (!command) {
            await helpCommand(this.app, context, read);
            return;
        }

        switch (command) {
            case CommandEnum.START:
                await startCommand(this.app, context, read, persistence);
                break;
            case CommandEnum.END:
                await endCommand(this.app, context, read, persistence);
                break;
            case CommandEnum.STATUS:
                await statusCommand(this.app, context, read, persistence);
                break;
            case CommandEnum.HELP:
            default:
                await helpCommand(this.app, context, read);
                break;
        }
    }
}

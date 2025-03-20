import { IRead, IPersistence } from "@rocket.chat/apps-engine/definition/accessors";
import { RocketChatAssociationRecord, RocketChatAssociationModel } from "@rocket.chat/apps-engine/definition/metadata";
import { ITimeOff } from "../interfaces/ITimeOff";
import { ITimeOffRepository } from "./ITimeOffRepository";

export class TimeOffRepository implements ITimeOffRepository {
    constructor(
        private readonly read: IRead,
        private readonly persistence: IPersistence // Injected via constructor
    ) {}

    private createAssociations(coreUserId: string): RocketChatAssociationRecord[] {
        return [
            new RocketChatAssociationRecord(RocketChatAssociationModel.MISC, "timeoff"),
            new RocketChatAssociationRecord(RocketChatAssociationModel.USER, coreUserId),
        ];
    }

    public async save(timeOff: ITimeOff): Promise<boolean> {
        try {
            await this.persistence.updateByAssociations(
                this.createAssociations(timeOff.coreUserId),
                { ...timeOff },
                true
            );
            return true;
        } catch (err) {
            console.warn("[TimeOffRepository] Error saving time off:", err);
            return false;
        }
    }

    public async findByUserId(coreUserId: string): Promise<ITimeOff | undefined> {
        try {
            const data = (await this.read.getPersistenceReader().readByAssociations(
                this.createAssociations(coreUserId)
            )) as ITimeOff[];
            return data.length > 0 ? data[0] : undefined;
        } catch (err) {
            console.warn("[TimeOffRepository] Error fetching time off:", err);
            return undefined;
        }
    }
}

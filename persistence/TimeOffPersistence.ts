import { IPersistence, IPersistenceRead } from "@rocket.chat/apps-engine/definition/accessors";
import { RocketChatAssociationRecord, RocketChatAssociationModel } from "@rocket.chat/apps-engine/definition/metadata";
import { ITimeOff } from "../definitions/TimeOff";


export class TimeOffPersistence {

    public static async persist(persis: IPersistence, timeoff: ITimeOff): Promise<boolean> {
        const associations: Array<RocketChatAssociationRecord> = [
            new RocketChatAssociationRecord(RocketChatAssociationModel.MISC, 'timeoff'),
            new RocketChatAssociationRecord(RocketChatAssociationModel.USER, timeoff.coreUserId)
        ];

        try {
            await persis.updateByAssociations(associations, { ...timeoff }, true);
        } catch (err) {
            console.warn(err);
            return false;
        }

        return true;
    }

    public static async findByUserId(persis: IPersistenceRead, coreUserId: string): Promise<ITimeOff | undefined> {
        const associations: Array<RocketChatAssociationRecord> = [
            new RocketChatAssociationRecord(RocketChatAssociationModel.MISC, 'timeoff'),
            new RocketChatAssociationRecord(RocketChatAssociationModel.USER, coreUserId)
        ];

        let data: ITimeOff[] = [];
        try {
            data = (await persis.readByAssociations(associations)) as ITimeOff[];
        } catch (err) {
            console.warn(err);
            return;
        }

        return data[0];
    }

}

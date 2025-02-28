import { IPersistence } from "@rocket.chat/apps-engine/definition/accessors";
import { RocketChatAssociationRecord, RocketChatAssociationModel } from "@rocket.chat/apps-engine/definition/metadata";
import { ITimeOff } from "../definitions/TimeOff";


export class TimeOffPersistence {

    public static async persist(persis: IPersistence, timeoff: ITimeOff): Promise<boolean> {
        const associations: Array<RocketChatAssociationRecord> = [
            new RocketChatAssociationRecord(RocketChatAssociationModel.MISC, 'serprobot'),
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

}

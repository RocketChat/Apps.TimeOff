import { stat } from "fs";

export const NOTIFICATION_MESSAGES = {
    started: `You are marked as Time Off, we will see you when you get back. Use \`/time-off end\` to end your time off.`,
    default_reply_message: `I am out of office, I will get back to you soon.`,
    ended: `Welcome back! You are no longer marked as Time Off.`,
    not_started: `You are not marked as Time Off. Use \`/time-off start\` to start your time off.`,
    status_in: `You are currently marked as Time Off. Your message is: `,
    status_out: `You are \`not\` marked as Time Off.`,
    error: `An error occurred while updating your Time Off status. Please try again later.`,
}

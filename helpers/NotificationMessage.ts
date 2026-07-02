export const NOTIFICATION_MESSAGES = {
	started: (customMessage?: string): string => {
		const intro = `*Time off on*\nI will automatically reply to any direct messages you receive to let the sender know you're on time off.`;
		const reminder = `Remember to use the \`/time-off end\` command when you get back.`;

		if (customMessage) {
			const quoted = customMessage
				.split('\n')
				.map((line) => `> ${line}`)
				.join('\n');
			return `${intro}\n\nI will also include the following custom message:\n${quoted}\n\n${reminder}`;
		}

		return `${intro}\n\n${reminder}`;
	},
	default_reply_message: `I am out of office, I will get back to you soon.`,
	ended: `Welcome back! You are no longer marked as Time Off.`,
	not_started: `*Time-off off*\nI will not automatically reply to any direct messages you receive.`,
	status_in: `You are currently marked as Time Off. Your message is: `,
	status_out: `*Time-off off*\nI will not automatically reply to any direct messages you receive.`,
	error: `An error occurred while updating your Time Off status. Please try again later.`,
};

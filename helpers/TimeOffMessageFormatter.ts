import { LayoutBlock } from '@rocket.chat/ui-kit';

export class TimeOffMessageFormatter {
	public static format(username: string, message: string): LayoutBlock[] {
		return [
			{
				type: 'section',
				text: {
					type: 'mrkdwn',
					text: `${username} is currently *unavailable* to answer your message, however they left the following message:\n\n`,
				},
			},
			{
				type: 'preview',
				title: [],
				description: [
					{
						type: 'mrkdwn',
						text: message,
					},
				],
			},
		];
	}
}

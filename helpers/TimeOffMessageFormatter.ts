import { LayoutBlock } from '@rocket.chat/ui-kit';

export class TimeOffMessageFormatter {
	public static format(username: string, message?: string): LayoutBlock[] {
		const headerText = message
			? `${username} is currently on time off. They left the following message:`
			: `${username} is currently on time off.`;

		const blocks: LayoutBlock[] = [
			{
				type: 'section',
				text: {
					type: 'mrkdwn',
					text: headerText,
				},
			},
		];

		if (message) {
			const quoted = message
				.split('\n')
				.map((line) => `> ${line}`)
				.join('\n');

			blocks.push({
				type: 'section',
				text: {
					type: 'mrkdwn',
					text: quoted,
				},
			});
		}

		return blocks;
	}
}

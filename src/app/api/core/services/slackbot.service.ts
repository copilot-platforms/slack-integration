import { SlackChannel } from '@api/core/types/slackbot'

export class SlackbotService {
  // TODO: Implement in dedicated PR, this is a dummy one
  async bulkCreateChannels(channels: SlackChannel[]) {
    for (const channel of channels) {
      console.log(`Creating channel ${channel.channelName}`)
      console.log(`Sending invite emails from slack to:`, channel.emails)
    }
  }
}

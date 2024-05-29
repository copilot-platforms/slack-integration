import { SlackChannel } from '@api/core/types/slackbot'
import { BaseService } from './base.service'

export class SlackbotService extends BaseService {
  // TODO: Implement in dedicated PR, this is a dummy one
  async createChannel(channel: SlackChannel) {
    console.log(`Creating channel ${channel.channelName}`)
    console.log(`Sending invite emails from slack to:`, channel.emails)
  }

  async postMessage(channelId: string, message: string) {
    console.log(`Posted message "${message}" to slack channel id ${channelId}`)
  }
}

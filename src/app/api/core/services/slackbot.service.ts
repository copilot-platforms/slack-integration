import { SlackChannel } from '@api/core/types/slackbot'
import { BaseService } from './base.service'
import { getRandomChars } from '@/utils/string'

export class SlackbotService extends BaseService {
  // TODO: Implement in dedicated PR, this is a dummy one
  async createChannel(channel: SlackChannel): Promise<string> {
    console.log(`Creating channel ${channel.channelName}`)
    console.log(`Sending invite emails from slack to:`, channel.emails)

    // Return random slack channel id for now
    return getRandomChars()
  }

  async postMessage(channelId: string, message: string) {
    console.log(`Posted message "${message}" to slack channel id ${channelId}`)
  }
}

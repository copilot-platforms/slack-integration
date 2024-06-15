import { ConversationsCreateResponse, WebClient } from '@slack/web-api'
import { Member } from '@slack/web-api/dist/types/response/UsersListResponse'
import httpStatus from 'http-status'
import { z } from 'zod'
import { slackConfig } from '@/config'
import { SlackChannel } from '@api/core/types/slackbot'
import { BaseService } from '@api/core/services/base.service'
import APIError from '@api/core/exceptions/APIError'
import { SyncedMessagesService } from '@api/synced-messages/synced-messages.service'

export class SlackbotService extends BaseService {
  slackClient = new WebClient(slackConfig.botOAuthToken)

  async createChannel(channel: SlackChannel): Promise<string> {
    console.info(`Creating channel ${channel.channelName}`)

    let createResponse: ConversationsCreateResponse
    try {
      createResponse = await this.slackClient.conversations.create({
        name: channel.channelName,
        // Make channels public as per current requirements
        is_private: false,
      })
    } catch (e: unknown) {
      console.error(e)
      throw new APIError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to create corresponding slack channel')
    }
    const slackChannelId = z.string().parse(createResponse.channel?.id)
    const syncableMembers = await this.fetchSlackMembers(channel.emails)
    // Invite syncableMembers to slackChannelId here
    await this.inviteSlackMembersToConversation(slackChannelId, syncableMembers)
    return slackChannelId
  }

  async deleteChannel(channel: string) {
    console.info(`Deleting channel with id ${channel}`)
    await this.slackClient.conversations.archive({ channel })
  }

  async postMessage(channel: string, text: string, senderName?: string | null) {
    if (senderName) {
      text = `${senderName} sent a message in Copilot: \n\n${text}`
    }
    const syncedMessage = await this.db.syncedMessage.findFirstOrThrow({ where: { slackChannelId: channel } })
    const syncedMessagesService = new SyncedMessagesService(this.user)
    try {
      await this.slackClient.chat.postMessage({ channel, text })
      await syncedMessagesService.markSyncComplete(syncedMessage.id)
    } catch (err: unknown) {
      await syncedMessagesService.markSyncFailed(syncedMessage.id)
      throw new APIError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to sync message', err)
    }
  }

  private async fetchSlackMembers(emails: string[]): Promise<Member[]> {
    const slackUsers = await this.slackClient.users.list({})
    if (!slackUsers.members || !slackUsers.members.length) {
      return []
    }

    const slackUsersToSync = slackUsers.members
      .filter((user) => !!user.profile && !!user.profile?.email) // Filters users who have not yet setup their acc / confirmed their emails
      .filter((user) => emails.includes(user.profile?.email as string))
    return slackUsersToSync
  }

  private async inviteSlackMembersToConversation(channel: string, members: Member[]) {
    const users = members
      .map((member) => member.id)
      .filter((id): id is string => !!id) // Filter to ensure all ids are defined and not null
      .join(',')
    await this.slackClient.conversations.invite({ channel, users, force: true })
  }
}

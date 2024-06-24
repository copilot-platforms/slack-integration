import { ConversationsCreateResponse, WebClient } from '@slack/web-api'
import { Member } from '@slack/web-api/dist/types/response/UsersListResponse'
import httpStatus from 'http-status'
import { z } from 'zod'
import { slackConfig } from '@/config'
import { SlackChannel } from '@api/core/types/slackbot'
import { BaseService } from '@api/core/services/base.service'
import APIError from '@api/core/exceptions/APIError'
import { SyncedMessagesService } from '@api/synced-messages/synced-messages.service'
import { CopilotUser } from '@/types/common'

export class SlackbotService extends BaseService {
  slackClient = new WebClient(slackConfig.botOAuthToken)

  /**
   * Creates a new Slack Channel with Slackbot as the creator
   * @param channel Synced Channel details with channelName and invitee emails
   * @returns Slack channel ID of newly created channel
   */
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

  /**
   * Archives a given channel in Slack
   * @param channel Slack Channel ID which to archive
   */
  async deleteChannel(channel: string) {
    console.info(`Deleting channel with id ${channel}`)
    await this.slackClient.conversations.archive({ channel })
  }

  /**
   * Post a text message from a sender to a slack channel
   * @param channel Slack channel ID
   * @param text Message body
   * @param senderName Name of the sender on behalf of which the Slackbot will post
   */
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

  /**
   * Match an array of emails to the list of members present in a slack workspace to find which ones are common
   * @param emails Array of emails to find in slack members list
   * @returns Slack Members with email addresses in `emails`
   */
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

  async fetchCorrespondingCopilotMember(userId: string): Promise<CopilotUser | null> {
    const userResponse = await this.slackClient.users.info({ user: userId })
    const email = z.string().safeParse(userResponse.user?.profile?.email)
    if (!email.success) {
      throw new APIError(httpStatus.BAD_REQUEST, 'Slack user does not have a verified account')
    }

    return await this.copilot.getUserByEmail(email.data)
  }

  /**
   * Sends invites to a channel for an array of slack Members
   * @param channel Slack channel ID
   * @param members Array of slack Member to send invites
   */
  private async inviteSlackMembersToConversation(channel: string, members: Member[]) {
    const users = members
      .filter((member) => member.profile?.email?.includes('roj')) // REMOVE: this will only invite roj
      .map((member) => member.id)
      .filter((id): id is string => !!id) // Filter to ensure all ids are defined and not null
      .join(',')
    await this.slackClient.conversations.invite({ channel, users, force: true })
  }
}

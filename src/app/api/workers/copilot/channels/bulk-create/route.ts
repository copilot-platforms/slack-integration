import { NextRequest, NextResponse } from 'next/server'
import httpStatus from 'http-status'
import User from '@api/core/models/User.model'
import { SlackbotService } from '@api/core/services/slackbot.service'
import { SlackChannelsSchema } from '@api/core/types/slackbot'
import { WorkerRequestSchema } from '@api/core/types/worker'
import APIError from '@api/core/exceptions/APIError'
import { SyncedChannelsService } from '@api/synced-channels/synced-channels.service'

export const POST = async (req: NextRequest) => {
  const body = WorkerRequestSchema.parse(await req.json())
  const user = await User.authenticateToken(body.token)

  const channels = SlackChannelsSchema.parse(body.data)
  const slackbot = new SlackbotService(user)

  const syncedChannelsService = new SyncedChannelsService(user)
  // Create new slack channels using slackbot service
  for (const channel of channels) {
    try {
      // Check if channel is already synced with a 'success' status. If so, skip it
      // This will be helpful for retries
      const isAlreadySynced = await syncedChannelsService.checkIfSynced(channel.syncedChannelId)
      if (isAlreadySynced) continue

      // Create new channel and update status to 'success' if successful.
      const newSlackChannelId = await slackbot.createChannel(channel)
      await syncedChannelsService.markSyncComplete(channel.syncedChannelId, newSlackChannelId)
    } catch (err: unknown) {
      // Mark sync status as failed and throw error. This will cause Zeplo to retry
      await syncedChannelsService.markSyncFailed(channel.syncedChannelId)
      throw new APIError(
        httpStatus.INTERNAL_SERVER_ERROR,
        `Failed to sync channel: ${JSON.stringify(channel)} - ${JSON.stringify(err)}`,
      )
    }

    return NextResponse.json(true)
  }
}

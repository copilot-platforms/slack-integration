import { NextRequest, NextResponse } from 'next/server'
import { slackConfig } from '@/config'
import httpStatus from 'http-status'
import User from '@api/core/models/User.model'
import { SlackbotService } from '@api/core/services/slackbot.service'
import { SlackChannelSchema, SlackChannelsSchema } from '@api/core/types/slackbot'
import { WorkerRequestSchema } from '@api/core/types/worker'
import APIError from '@api/core/exceptions/APIError'
import { SyncedChannelsService } from '@api/synced-channels/synced-channels.service'
import { z } from 'zod'
import { DeleteSyncedChannelSchema } from '@api/core/types/message'

export const batchCreate = async (req: NextRequest) => {
  const body = WorkerRequestSchema.parse(await req.json())
  const user = await User.authenticateToken(body.token)

  const syncedChannelsService = new SyncedChannelsService(user)
  await syncedChannelsService.batchSyncChannels(slackConfig.batchSize)

  return NextResponse.json({ message: `A batch of ${slackConfig.batchSize} is scheduled to be synced` })
}

export const createSyncedSlackChannel = async (req: NextRequest) => {
  const body = WorkerRequestSchema.parse(await req.json())
  const user = await User.authenticateToken(body.token)

  const channel = SlackChannelSchema.parse(body.data)
  const slackbot = new SlackbotService(user)

  const syncedChannelsService = new SyncedChannelsService(user)
  // Create new slack channels using slackbot service
  try {
    // Check if channel is already synced with a 'success' status. If so, skip it
    // This will be helpful for retries
    const isAlreadySynced = await syncedChannelsService.checkIfSynced(channel.syncedChannelId)
    if (isAlreadySynced) return NextResponse.json({ message: 'Channel has already been synced' })

    // Create new channel and update status to 'success' if successful.
    const newSlackChannelId = await slackbot.createChannel(channel)
    await syncedChannelsService.markSyncComplete(channel.syncedChannelId, newSlackChannelId)
    console.log(channel.channelName, 'is synced')
  } catch (err: unknown) {
    // Mark sync status as failed and throw error. This will cause Zeplo to retry
    await syncedChannelsService.markSyncFailed(channel.syncedChannelId)
    throw new APIError(
      httpStatus.INTERNAL_SERVER_ERROR,
      `Failed to sync channel: ${JSON.stringify(channel)} - ${JSON.stringify(err)}`,
      err,
    )
  }
  console.log('Done sync of', channel.channelName)
  return NextResponse.json({ message: 'Successfully synced channel' })
}

export const runHistoricalSync = async (req: NextRequest) => {
  const reqBody = await req.json()
  const token = z.string().parse(reqBody.token)
  const user = await User.authenticateToken(token)

  const syncedChannelsService = new SyncedChannelsService(user)
  await syncedChannelsService.runHistoricalSync()

  return NextResponse.json({ message: 'Successfully ran historical sync for workspace' })
}

export const archiveSyncedSlackChannel = async (req: NextRequest) => {
  const body = WorkerRequestSchema.parse(await req.json())
  const user = await User.authenticateToken(body.token)

  const sync = DeleteSyncedChannelSchema.parse(body.data)
  const slackbot = new SlackbotService(user)
  await slackbot.deleteChannel(sync.slackChannelId)

  return NextResponse.json(true)
}

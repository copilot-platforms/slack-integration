import { NextRequest, NextResponse } from 'next/server'
import { WorkerRequestSchema } from '@api/core/types/worker'
import User from '@api/core/models/User.model'
import { SyncedMessageSchema } from '@api/core/types/message'
import { SlackbotService } from '@api/core/services/slackbot.service'
import { SyncedMessagesService } from '@api/synced-messages/synced-messages.service'

export const POST = async (req: NextRequest) => {
  const body = WorkerRequestSchema.parse(await req.json())
  const user = await User.authenticateToken(body.token)
  // Parse message from request body
  const message = SyncedMessageSchema.parse(body.data)
  // Send message to slack channel using Slackbot
  const slackbot = new SlackbotService(user)
  await slackbot.postMessage(message.slackChannelId, message.text)
  // Update status of message in SyncedMessages as success
  const syncedMessagesService = new SyncedMessagesService(user)
  await syncedMessagesService.markSyncComplete(message.syncId)
  return NextResponse.json(true)
}

import { NextRequest, NextResponse } from 'next/server'
import { SlackbotService } from '@api/core/services/slackbot.service'
import { WorkerRequestSchema } from '@api/core/types/worker'
import User from '@api/core/models/User.model'
import { DeleteSyncedChannelSchema } from '@api/core/types/message'

export const POST = async (req: NextRequest) => {
  const body = WorkerRequestSchema.parse(await req.json())
  const user = await User.authenticateToken(body.token)

  const sync = DeleteSyncedChannelSchema.parse(body.data)
  const slackbot = new SlackbotService(user)
  await slackbot.postMessage(sync.slackChannelId, 'Posted Copilot Messages channel deleted to slack channel')

  return NextResponse.json(true)
}

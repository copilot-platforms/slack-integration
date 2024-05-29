import { NextRequest, NextResponse } from 'next/server'
import { SlackbotService } from '@api/core/services/slackbot.service'
import { SyncSchema, WorkerRequestSchema } from '@/app/api/core/types/worker'
import User from '@/app/api/core/models/User.model'

export const POST = async (req: NextRequest) => {
  const body = WorkerRequestSchema.parse(await req.json())
  const user = await User.authenticate(req)

  const sync = SyncSchema.parse(body.data)
  const slackbot = new SlackbotService(user)
  await slackbot.postMessage(sync.slackChannelId, 'Posted Copilot Messages channel deleted to slack channel')

  return NextResponse.json(true)
}

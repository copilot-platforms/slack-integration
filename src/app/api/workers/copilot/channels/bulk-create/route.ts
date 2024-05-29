import { NextRequest, NextResponse } from 'next/server'
import User from '@api/core/models/User.model'
import { SlackbotService } from '@api/core/services/slackbot.service'
import { SlackChannelsSchema } from '@api/core/types/slackbot'
import { WorkerRequestSchema } from '@api/core/types/worker'

export const POST = async (req: NextRequest) => {
  const body = WorkerRequestSchema.parse(await req.json())
  const user = await User.authenticate(req)

  const channels = SlackChannelsSchema.parse(body.data)
  const slackbot = new SlackbotService(user)
  for (const channel of channels) {
    await slackbot.createChannel(channel)
    // const sync =
  }

  return NextResponse.json(true)
}

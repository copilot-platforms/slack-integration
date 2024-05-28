import { NextRequest, NextResponse } from 'next/server'
import { SlackbotService } from '@api/core/services/slackbot.service'
import { SlackChannelsSchema } from '../../core/types/slackbot'

export const POST = async (req: NextRequest) => {
  const body = SlackChannelsSchema.parse(await req.json())
  const slackbot = new SlackbotService()
  await slackbot.bulkCreateChannels(body)

  return NextResponse.json(true)
}

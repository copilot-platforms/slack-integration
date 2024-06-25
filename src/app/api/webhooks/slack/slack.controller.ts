import { NextRequest, NextResponse } from 'next/server'
import { SlackEventSubscriptionSchema } from '@api/core/types/slackbot'
import { SlackWebhooksService } from './slack.service'
import User from '@api/core/models/User.model'
import { slackConfig } from '@/config'

export const handleSlackWebhookRequest = async (req: NextRequest) => {
  return NextResponse.json((await req.json()).challenge)
  // const body = SlackEventSubscriptionSchema.safeParse(await req.json())
  // if (!body.success) {
  //   // This is not a relavant message for us to handle
  //   return NextResponse.json(true)
  // }

  // const { data } = body
  // const user = await User.authenticateToken(slackConfig.validToken)
  // const slackService = new SlackWebhooksService(user)
  // await slackService.pushMessageToCopilot(data)
  // return NextResponse.json(true)
}

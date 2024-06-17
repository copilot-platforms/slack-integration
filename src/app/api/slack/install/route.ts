import { NextRequest, NextResponse } from 'next/server'
import { slackConfig } from '@/config'

export const GET = (_: NextRequest) => {
  const { clientId, redirectUri } = slackConfig
  return NextResponse.redirect(
    `https://slack.com/oauth/v2/authorize?client_id=${clientId}&scope=chat:write,groups:write,channels:manage,groups:write.invites&redirect_uri=${redirectUri}`,
  )
}

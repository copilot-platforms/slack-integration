import { NextRequest, NextResponse } from 'next/server'
import { slackConfig } from '@/config'
import User from '@api/core/models/User.model'

export const GET = async (req: NextRequest) => {
  const user = await User.authenticate(req)

  const { clientId, redirectUri } = slackConfig
  return NextResponse.redirect(
    `https://slack.com/oauth/v2/authorize?client_id=${clientId}&scope=chat:write,groups:write,channels:manage,groups:write.invites&redirect_uri=${redirectUri}?workspaceId=${user.workspaceId}`,
  )
}

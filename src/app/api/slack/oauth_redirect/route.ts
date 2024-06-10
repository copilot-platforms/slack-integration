import { WebClient } from '@slack/web-api'
import { NextRequest, NextResponse } from 'next/server'
import { slackConfig } from '@/config'
import APIError from '@api/core/exceptions/APIError'
import httpStatus from 'http-status'

export const GET = async (req: NextRequest) => {
  const slackClient = new WebClient()
  const code = req.nextUrl.searchParams.get('code')

  if (!code) {
    throw new APIError(httpStatus.BAD_REQUEST, 'Missing oauth code')
  }

  try {
    const response = await slackClient.oauth.v2.access({
      client_id: slackConfig.clientId,
      client_secret: slackConfig.clientSecret,
      code,
      redirect_uri: slackConfig.redirectUri,
    })

    const { access_token, team } = response

    // Store the access token and team ID in your database
    console.info('Authenticated team', team, 'with access token:', access_token)

    return NextResponse.json('Bot successfully added to workspace')
  } catch (error) {
    throw new APIError(httpStatus.BAD_REQUEST, 'Error during OAuth verification')
  }
}

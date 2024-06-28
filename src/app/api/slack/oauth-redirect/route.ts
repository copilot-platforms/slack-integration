import { WebClient } from '@slack/web-api'
import { NextRequest, NextResponse } from 'next/server'
import { apiUrl, slackConfig } from '@/config'
import APIError from '@api/core/exceptions/APIError'
import httpStatus from 'http-status'

export const GET = async (req: NextRequest) => {
  const slackClient = new WebClient()
  const code = req.nextUrl.searchParams.get('code')
  const workspaceId = req.nextUrl.searchParams.get('workspaceId')
  console.log('wsid2', workspaceId)

  if (!code) {
    throw new APIError(httpStatus.BAD_REQUEST, 'Missing oauth code')
  }

  try {
    console.log(slackConfig.clientId)
    console.log(slackConfig.clientId)
    console.log(code)
    console.log(slackConfig.redirectUri)
    const response = await slackClient.oauth.v2.access({
      client_id: slackConfig.clientId,
      client_secret: slackConfig.clientSecret,
      code,
      redirect_uri: slackConfig.redirectUri + `?workspaceId=${workspaceId}`,
    })
    console.log('resp', response)

    const { access_token, team } = response

    // Store the access token and team ID in your database
    console.info('Authenticated team', team, 'with access token:', access_token)

    return NextResponse.redirect(`${apiUrl}/oauth-success`)
  } catch (error) {
    throw new APIError(httpStatus.BAD_REQUEST, 'Error during OAuth verification', error)
  }
}

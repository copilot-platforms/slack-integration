import { WebClient } from '@slack/web-api'
import { NextRequest, NextResponse } from 'next/server'
import { apiUrl, slackConfig } from '@/config'
import APIError from '@api/core/exceptions/APIError'
import httpStatus from 'http-status'
import { SyncedWorkspacesService } from '../../synced-workspaces/synced-workspaces.service'
import User from '@api/core/models/User.model'
import { z } from 'zod'

export const GET = async (req: NextRequest) => {
  const workspaceId = z.string().parse(req.nextUrl.searchParams.get('workspaceId'))
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
    const syncedWorkspacesService = new SyncedWorkspacesService(new User(slackConfig.validToken, null as any))
    await syncedWorkspacesService.addAsSynced(workspaceId)
    return NextResponse.redirect(`${apiUrl}/oauth-success`)
  } catch (error) {
    throw new APIError(httpStatus.BAD_REQUEST, 'Error during OAuth verification')
  }
}

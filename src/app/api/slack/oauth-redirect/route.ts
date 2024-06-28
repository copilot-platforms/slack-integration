import { WebClient } from '@slack/web-api'
import { NextRequest, NextResponse } from 'next/server'
import { apiUrl, slackConfig } from '@/config'
import APIError from '@api/core/exceptions/APIError'
import httpStatus from 'http-status'
import User from '../../core/models/User.model'
import { SyncedWorkspacesService } from '../../synced-workspaces/synced-workspaces.service'
import { z } from 'zod'

export const GET = async (req: NextRequest) => {
  const slackClient = new WebClient()
  const code = req.nextUrl.searchParams.get('code')
  const token = req.nextUrl.searchParams.get('token')
  const user = await User.authenticateToken(token)

  if (!code) {
    throw new APIError(httpStatus.BAD_REQUEST, 'Missing oauth code')
  }

  try {
    const response = await slackClient.oauth.v2.access({
      client_id: slackConfig.clientId,
      client_secret: slackConfig.clientSecret,
      code,
      // We're passing an additional URL param and apparantly we need to pass it to the `redirect_uri` as well
      redirect_uri: slackConfig.redirectUri + `?token=${token}`,
    })

    const { access_token, team } = response

    // Store the access token and team ID in your database
    console.info('Authenticated team', team, 'with access token:', access_token)

    const syncedWorkspacesService = new SyncedWorkspacesService(user)
    if (!team?.id) {
      throw new APIError(httpStatus.BAD_REQUEST, "Couldn't save team id to synced workspaces")
    }
    await syncedWorkspacesService.addTeamIdToSyncedWorkspace(z.string().parse(team.id))

    return NextResponse.redirect(`${apiUrl}/oauth-success`)
  } catch (error) {
    throw new APIError(httpStatus.BAD_REQUEST, 'Error during OAuth verification', error)
  }
}

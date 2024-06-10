import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import User from '@api/core/models/User.model'
import { SyncedChannelsService } from '@/app/api/synced-channels/synced-channels.service'

export const POST = async (req: NextRequest) => {
  const reqBody = await req.json()
  const token = z.string().parse(reqBody.token)
  const user = await User.authenticateToken(token)

  const syncedChannelsService = new SyncedChannelsService(user)
  await syncedChannelsService.runHistoricalSync()

  return NextResponse.json(true)
}

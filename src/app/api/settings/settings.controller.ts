import { NextRequest, NextResponse } from 'next/server'
import User from '@api/core/models/User.model'
import { SettingsService } from '@api/settings/settings.service'
import { CreateUpdateSettingsSchema, PatchUpdateSettingsSchema } from '@/types/dtos/settings.dto'
import httpStatus from 'http-status'

export const getSettings = async (req: NextRequest) => {
  const user = await User.authenticate(req)

  const settingsService = new SettingsService(user)
  const data = await settingsService.getSettings()

  return NextResponse.json({ data }, { status: httpStatus.NOT_FOUND })
}

/**
 * Endpoint triggered when Run Sync is clicked - needs to create or update entire Settings data
 */
export const createOrUpdateSettings = async (req: NextRequest) => {
  const user = await User.authenticate(req)

  const body = CreateUpdateSettingsSchema.parse(await req.json())
  const settingsService = new SettingsService(user)
  const data = await settingsService.createOrUpdateSettings(body)

  if (data.isSyncRunning) {
    await settingsService.runHistoricalChannelSync()
  }

  return NextResponse.json({ data })
}

/**
 * Endpoint to turn only bidirectional sync on / off - also updates sync status accordingly
 */
export const patchSettings = async (req: NextRequest) => {
  const user = await User.authenticate(req)

  const body = PatchUpdateSettingsSchema.parse(await req.json())
  const settingsService = new SettingsService(user)
  const data = await settingsService.partialUpdateSettings(body)

  if (data?.isSyncRunning) {
    await settingsService.runHistoricalChannelSync()
  }

  return NextResponse.json({ data })
}

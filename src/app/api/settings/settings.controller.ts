import { NextRequest, NextResponse } from 'next/server'
import User from '@api/core/models/User.model'
import { SettingsService } from '@api/settings/settings.service'
import { CreateUpdateSettingsSchema } from '@/types/dtos/settings.dto'
import httpStatus from 'http-status'

export const getSettings = async (req: NextRequest) => {
  const user = await User.authenticate(req)

  const settingsService = new SettingsService(user)
  const data = await settingsService.getSettings()

  return NextResponse.json({ data }, { status: httpStatus.NOT_FOUND })
}

export const createOrUpdateSettings = async (req: NextRequest) => {
  const user = await User.authenticate(req)

  const body = CreateUpdateSettingsSchema.parse(await req.json())
  const settingsService = new SettingsService(user)
  const data = await settingsService.createOrUpdateSettings(body)

  return NextResponse.json({ data })
}

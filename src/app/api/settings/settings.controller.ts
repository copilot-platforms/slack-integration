import { NextRequest, NextResponse } from 'next/server'
import User from '@api/core/models/User.model'
import { SettingsService } from './settings.service'
import { CreateSettingsSchema, UpdateSettingsSchema } from '@/types/dtos/settings.dto'
import { IdParams } from '../core/types/api'
import httpStatus from 'http-status'

export const getSettings = async (req: NextRequest) => {
  const user = await User.authenticate(req)

  const settingsService = new SettingsService(user)
  const data = await settingsService.getSettings()

  return NextResponse.json({ data })
}

export const createSettings = async (req: NextRequest) => {
  const user = await User.authenticate(req)

  const body = CreateSettingsSchema.parse(await req.json())
  const settingsService = new SettingsService(user)
  const data = await settingsService.createSettings(body)

  return NextResponse.json({ data }, { status: httpStatus.CREATED })
}

export const updateSettings = async (req: NextRequest, { params: { id } }: IdParams) => {
  const user = await User.authenticate(req)

  const body = UpdateSettingsSchema.parse(await req.json())
  const settingsService = new SettingsService(user)
  const data = await settingsService.updateSettings(id, body)

  return NextResponse.json({ data })
}

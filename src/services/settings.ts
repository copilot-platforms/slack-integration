import { CreateUpdateSettingsDTO, CreateUpdateSettingsSchema } from '@/types/dtos/settings.dto'
import { SyncOption } from '@ui/helpers'

export const runSync = async (newData: CreateUpdateSettingsDTO, token: string): Promise<CreateUpdateSettingsDTO> => {
  const reqBody = CreateUpdateSettingsSchema.parse({
    ...newData,
    isSyncRunning: true, // because we have clicked on Run Sync
  })
  const response = await fetch(`/api/settings?token=${token}`, {
    method: 'POST',
    body: JSON.stringify(reqBody),
  })
  const responseJson = await response.json()
  return CreateUpdateSettingsSchema.parse(responseJson?.data)
}

export const updateBidirectionalSync = async (data: SyncOption, token: string): Promise<CreateUpdateSettingsDTO> => {
  const response = await fetch(`/api/settings?token=${token}`, {
    method: 'PATCH',
    body: JSON.stringify({ bidirectionalSlackSync: data === SyncOption.On }),
  })
  const responseJson = await response.json()
  return CreateUpdateSettingsSchema.parse(responseJson?.data)
}

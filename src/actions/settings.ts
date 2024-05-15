'use server'

import { SyncOption } from '@/app/helpers'
import { apiUrl } from '@/config'
import { InternalUserToken } from '@/types/common'
import { CreateUpdateSettingsSchema } from '@/types/dtos/settings.dto'
import { SelecterOption } from '@/types/settings'
import { CopilotAPI } from '@/utils/CopilotAPI'
import { formDataToObject } from '@/utils/formData'
import { Setting } from '@prisma/client'

export const fetchSettings = async (token: string): Promise<Setting | null> => {
  const response = await fetch(`${apiUrl}/api/settings?token=${token}`)
  const settings = await response.json()
  return settings.data
}

export const getInternalUsersOptions = async (copilot: CopilotAPI): Promise<SelecterOption[]> => {
  const internalUsers = await copilot.getInternalUsers()
  return internalUsers.data.map((internalUser) => ({
    label: `${internalUser.givenName} ${internalUser.familyName}`,
    value: internalUser.id,
  }))
}

export const getUserPayload = async (copilot: CopilotAPI): Promise<InternalUserToken | null> => {
  return await copilot.getInternalUserTokenPayload()
}

export const runSync = async (formData: FormData, token: string) => {
  let data = formDataToObject(formData)
  data = {
    ...data,
    bidirectionalSlackSync: data.bidirectionalSlackSync === SyncOption.On,
    isSyncing: true, // because we have clicked on Run Sync
  }

  const reqBody = CreateUpdateSettingsSchema.safeParse(data)
  if (!reqBody.success) {
    return { errors: reqBody.error.format() }
  }

  const response = await fetch(`${apiUrl}/api/settings?token=${token}`, {
    method: 'POST',
    body: JSON.stringify(reqBody.data),
  })
  return await response.json()
}

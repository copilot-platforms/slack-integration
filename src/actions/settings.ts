'use server'

import { SyncOption } from '@/app/helpers'
import { apiUrl } from '@/config'
import { InternalUserToken } from '@/types/common'
import { CreateUpdateSettingsDTO, CreateUpdateSettingsSchema, SettingsFormFields } from '@/types/dtos/settings.dto'
import { SelecterOption } from '@/types/settings'
import { CopilotAPI } from '@/utils/CopilotAPI'
import { formDataToObject } from '@/utils/formData'
import { getFirstErrorMessage } from '@/utils/zod'
import { Setting } from '@prisma/client'
import { revalidateTag } from 'next/cache'

export const fetchSettings = async (token: string): Promise<Setting | null> => {
  const response = await fetch(`${apiUrl}/api/settings?token=${token}`, {
    next: { tags: ['fetchSettings'] },
  })
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

export const runSync = async (
  formData: FormData,
  token: string,
): Promise<{
  errors?: Record<string, string>
  data?: Setting
}> => {
  let data = formDataToObject(formData)
  data = {
    ...data,
    bidirectionalSlackSync: data.bidirectionalSlackSync === SyncOption.On,
    isSyncRunning: true, // because we have clicked on Run Sync
  }

  const reqBody = CreateUpdateSettingsSchema.safeParse(data)
  const formattedErrorObj = reqBody.error?.format()
  if (!reqBody.success && !!formattedErrorObj) {
    // ZodError type is formatted very dirtily by default with nested objects.
    // Format it to an easily readable format like { errors: { field1: 'Error 1', field2: 'Error 2' } }
    const fields = Object.keys(CreateUpdateSettingsSchema.shape) as SettingsFormFields[]
    const errors: Partial<Record<SettingsFormFields, string>> = {}
    fields.forEach((key) => {
      errors[key] = getFirstErrorMessage(formattedErrorObj, key)
    })
    return { errors }
  }
  if (!reqBody.data?.bidirectionalSlackSync) {
    return { errors: { bidirectionalSlackSync: 'Bidirectional sync should be turned on before running sync' } }
  }

  const response = await fetch(`${apiUrl}/api/settings?token=${token}`, {
    method: 'POST',
    body: JSON.stringify(reqBody.data),
  })
  revalidateTag('fetchSettings')
  return await response.json()
}

export const updateBidirectionalSync = async (data: SyncOption, token: string) => {
  const response = await fetch(`${apiUrl}/api/settings?token=${token}`, {
    method: 'PATCH',
    body: JSON.stringify({ bidirectionalSlackSync: data === SyncOption.On }),
  })
  revalidateTag('fetchSettings')
  return await response.json()
}

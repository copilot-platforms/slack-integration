'use server'

import { Setting } from '@prisma/client'
import { apiUrl } from '@/config'
import { InternalUserToken } from '@/types/common'
import { SelecterOption } from '@/types/settings'
import { CopilotAPI } from '@/utils/CopilotAPI'

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

import { DefaultSetting, SelecterOption } from '@/types/settings'
import { ChannelSyncOptions } from '@prisma/client'

export enum SyncOption {
  On = 'on',
  Off = 'off',
}

export const syncOptions: SelecterOption[] = [
  { label: 'Off', value: SyncOption.Off },
  { label: 'On', value: SyncOption.On },
]

export const syncConfigurationOptions: SelecterOption[] = [
  { label: 'Client channels and company channels', value: ChannelSyncOptions.clientAndCompany },
]

export const getDefaultSettings = (fallbackMessageSenderId: string): DefaultSetting => {
  return {
    bidirectionalSlackSync: false,
    channelsToSync: ChannelSyncOptions.clientAndCompany,
    fallbackMessageSenderId,
    isSyncing: false,
    slackChannelPrefix: '',
  }
}

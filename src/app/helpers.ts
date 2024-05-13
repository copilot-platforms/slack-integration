export enum SyncOption {
  On = 'on',
  Off = 'off',
}

export enum ConfigurationOption {
  ClientAndCompany = 'clientAndCompany', // TODO: Replace with one from `schema.prisma` after it is merged
}

export const syncOptions = [
  { label: 'Off', value: SyncOption.Off },
  { label: 'On', value: SyncOption.On },
]

export const syncConfigurationOptions = [
  { label: 'Client channels and company channels', value: ConfigurationOption.ClientAndCompany },
]

export const dummyFallbackSenders = [
  { label: 'Hari Bahadur', value: 'hari' },
  { label: 'Ram Bahadur', value: 'ram' },
]

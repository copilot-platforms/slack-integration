'use client'

import { PrimaryBtn } from '@/components/Buttons'
import { Heading, SubHeading } from '@/components/Typography'
import { FormBox, Label, TextInput, Selecter } from '@/components/FormElements'
import { Box } from '@mui/material'
import { SyncOption, syncConfigurationOptions, syncOptions } from '@/app/helpers'
import { DefaultSetting, SelecterOption } from '@/types/settings'
import { Setting } from '@prisma/client'
import { useFormState } from 'react-dom'
import { getFirstErrorMessage } from '@/utils/zod'

interface SyncFormProps {
  settings: Setting | DefaultSetting
  internalUsers: SelecterOption[]
  runSync: (_: unknown, formData: FormData) => Promise<any>
}

export const SyncForm = ({ runSync, settings, internalUsers }: SyncFormProps) => {
  const [formState, action] = useFormState(runSync, {})
  return (
    <form action={action}>
      <Box id="slack-sync" mb={'38px'}>
        <Heading>Slack sync</Heading>
        <SubHeading>When enabled, Messages App channels and Slack channels will be synced</SubHeading>
        <FormBox>
          <div>
            <Label>Bidirectional Slack sync</Label>
            <Selecter
              name="bidirectionalSlackSync"
              defaultValue={settings.bidirectionalSlackSync ? SyncOption.On : SyncOption.Off}
              options={syncOptions}
            />
          </div>
        </FormBox>
      </Box>
      <Box id="slack-sync" mb={'64px'}>
        <Heading>Slack sync configuration</Heading>
        <SubHeading>Configure the integration</SubHeading>
        <FormBox>
          <div>
            <Label>Channels to sync</Label>
            <Selecter name="channelsToSync" defaultValue={settings.channelsToSync} options={syncConfigurationOptions} />
          </div>
          <div>
            <Label>Fallback message sender</Label>
            <Selecter
              name="fallbackMessageSenderId"
              defaultValue={settings.fallbackMessageSenderId}
              options={internalUsers}
            />
          </div>
          <div>
            <Label>Slack channel prefix</Label>
            <TextInput
              name="slackChannelPrefix"
              placeholder="copilot"
              // Show first prioritized error
              errorText={getFirstErrorMessage(formState?.errors, 'slackChannelPrefix')}
            />
          </div>
        </FormBox>
      </Box>
      <Box id="create-initial-channels" mb={'32px'}>
        <Heading>Create initial Slack channels</Heading>
        <SubHeading pb="24px">
          If you already have channels in your Messages App, run this sync to create them all in Slack. Note that this will
          create a Slack channel for every single channels in the Messages App and may take several minutes.
        </SubHeading>
        <PrimaryBtn type="submit">Run Sync</PrimaryBtn>
      </Box>
    </form>
  )
}

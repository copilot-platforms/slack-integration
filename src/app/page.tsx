import { PrimaryBtn } from '@/components/Buttons'
import { PageContainer } from '@/components/Containers'
import { Heading, SubHeading } from '@/components/Typography'
import { FormBox, Label, TextInput, Selecter } from '@/components/FormElements'
import { Box } from '@mui/material'
import { SyncOption, getDefaultSettings, syncConfigurationOptions, syncOptions } from '@/app/helpers'
import { z } from 'zod'
import { Setting } from '@prisma/client'
import { CopilotAPI } from '@/utils/CopilotAPI'
import { DefaultSetting } from '@/types/settings'
import { runSync as runSyncAction, fetchSettings, getInternalUsersOptions, getUserPayload } from '@/actions/settings'

export default async function Home({ searchParams }: { searchParams: { token: string } }) {
  const tokenParsed = z.string().safeParse(searchParams.token)
  if (!tokenParsed.success) {
    // TODO: fix in dedicated PR
    return <div>Please provide a valid token</div>
  }

  const token = tokenParsed.data
  const copilot = new CopilotAPI(token)
  const [currentUser, internalUsers, settingsData] = await Promise.all([
    getUserPayload(copilot),
    getInternalUsersOptions(copilot),
    fetchSettings(token),
  ])
  if (!currentUser) {
    // TODO: fix in dedicated PR
    return <div>Failed to validate internal user</div>
  }

  const settings: Setting | DefaultSetting = settingsData || getDefaultSettings(currentUser.internalUserId)

  const runSync = async (formData: FormData) => {
    'use server'
    return await runSyncAction(formData, token)
  }

  return (
    <PageContainer>
      <form action={runSync}>
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
              <TextInput name="slackChannelPrefix" placeholder="copilot" />
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
    </PageContainer>
  )
}

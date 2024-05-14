import { PrimaryBtn } from '@/components/Buttons'
import { PageContainer } from '@/components/Containers'
import { Heading, SubHeading } from '@/components/Typography'
import { FormBox, Label, TextInput, Selecter } from '@/components/FormElements'
import { Box } from '@mui/material'
import { SyncOption, getDefaultSettings, syncConfigurationOptions, syncOptions } from '@/app/helpers'
import { z } from 'zod'
import { fetchSettings, getInternalUsersOptions, getUserPayload } from '@/actions/settings'
import { Setting } from '@prisma/client'
import { CopilotAPI } from '@/utils/CopilotAPI'
import { DefaultSetting } from '@/types/settings'

export default async function Home({ searchParams }: { searchParams: { token: string } }) {
  const { success: tokenParseSuccess, data: token } = z.string().safeParse(searchParams.token)
  if (!tokenParseSuccess) {
    // TODO: fix in another PR
    return <div>Please provide a valid token</div>
  }

  const copilot = new CopilotAPI(token)
  const currentUser = await getUserPayload(copilot)
  if (!currentUser) {
    // TODO: fix in another PR
    return <div>Failed to parse token payload</div>
  }

  const internalUsers = await getInternalUsersOptions(copilot)

  const settings: Setting | DefaultSetting = (await fetchSettings(token)) || getDefaultSettings(currentUser.internalUserId)

  return (
    <PageContainer>
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
        <PrimaryBtn>Run Sync</PrimaryBtn>
      </Box>
    </PageContainer>
  )
}

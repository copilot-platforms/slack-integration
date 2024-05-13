import { PrimaryBtn } from '@/components/Buttons'
import { PageContainer } from '@/components/Containers'
import { Heading, SubHeading } from '@/components/Typography'
import { FormBox, Label, TextInput, Selecter } from '@/components/FormElements'
import { Box } from '@mui/material'
import { ConfigurationOption, SyncOption, dummyFallbackSenders, syncConfigurationOptions, syncOptions } from '@/app/helpers'

export default function Home() {
  return (
    <PageContainer>
      <Box id="slack-sync" mb={'38px'}>
        <Heading>Slack sync</Heading>
        <SubHeading>When enabled, Messages App channels and Slack channels will be synced</SubHeading>
        <FormBox>
          <div>
            <Label>Bidirectional Slack sync</Label>
            <Selecter defaultValue={SyncOption.Off} options={syncOptions} />
          </div>
        </FormBox>
      </Box>
      <Box id="slack-sync" mb={'64px'}>
        <Heading>Slack sync configuration</Heading>
        <SubHeading>Configure the integration</SubHeading>
        <FormBox>
          <div>
            <Label>Channels to sync</Label>
            <Selecter defaultValue={ConfigurationOption.ClientAndCompany} options={syncConfigurationOptions} />
          </div>
          <div>
            <Label>Fallback message sender</Label>
            <Selecter defaultValue="hari" options={dummyFallbackSenders} />
          </div>
          <div>
            <Label>Slack channel prefix</Label>
            <TextInput placeholder="copilot" />
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

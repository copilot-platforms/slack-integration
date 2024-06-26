'use client'

import { useFormik } from 'formik'
import { useState } from 'react'
import { ZodError } from 'zod'
import { Box, SelectChangeEvent } from '@mui/material'
import { Setting } from '@prisma/client'
import { PrimaryBtn } from '@/components/Buttons'
import { Heading, SubHeading } from '@/components/Typography'
import { FormBox, Label, TextInput, Selecter } from '@/components/FormElements'
import { SyncOption, syncConfigurationOptions, syncOptions } from '@ui/helpers'
import { DefaultSetting, SelecterOption } from '@/types/settings'
import { useRouter } from 'next/navigation'
import { CreateUpdateSettingsDTO, CreateUpdateSettingsSchema } from '@/types/dtos/settings.dto'
import { runSync, updateBidirectionalSync } from '@/services/settings'
import { getFirstFieldError } from '@/utils/zod'

interface SyncFormProps {
  isSlackbotInstalled: boolean
  token: string
  initialSettings: Setting | DefaultSetting
  internalUsers: SelecterOption[]
}

export const SyncForm = ({ token, isSlackbotInstalled, initialSettings, internalUsers }: SyncFormProps) => {
  const [slackbotInstalled, setSlackbotInstalled] = useState(isSlackbotInstalled)
  const [isBidirectionalSyncUpdating, setIsBidirectionalSyncUpdating] = useState(false)

  const validate = (values: unknown) => {
    try {
      CreateUpdateSettingsSchema.parse(values)
    } catch (error) {
      if (error instanceof ZodError) {
        return getFirstFieldError(error)
      }
    }
  }
  const { values, errors, handleChange, handleSubmit, resetForm, isSubmitting, setSubmitting } =
    useFormik<CreateUpdateSettingsDTO>({
      initialValues: initialSettings,
      validate,
      onSubmit: (values: CreateUpdateSettingsDTO) => {
        const submit = async () => {
          const data = await runSync(values, token)
          resetForm({ values: data })
        }
        submit()
      },
    })

  const handleSyncChange = async (e: SelectChangeEvent<unknown>) => {
    setIsBidirectionalSyncUpdating(true)
    const values = await updateBidirectionalSync(e.target.value as SyncOption, token)
    setIsBidirectionalSyncUpdating(false)
    resetForm({ values })
  }

  const routeToSlackAppInstall = async () => {
    window.open(`/api/slack/install?token=${token}`)
    setTimeout(() => {
      setSlackbotInstalled(true)
    }, 5000)
  }
  return (
    <form onSubmit={handleSubmit}>
      <Box id="slack-sync" mb={'38px'}>
        <Heading>Slack sync</Heading>
        <SubHeading>When enabled, Messages App channels and Slack channels will be synced</SubHeading>
        <FormBox gap="4px">
          <div>
            <Label htmlFor="bidirectionalSlackSync">Bidirectional Slack sync</Label>
            <Selecter
              name="bidirectionalSlackSync"
              value={values.bidirectionalSlackSync ? SyncOption.On : SyncOption.Off}
              options={syncOptions}
              handleChange={handleSyncChange}
              disabled={isSubmitting || isBidirectionalSyncUpdating}
              errorText={
                !values.isSyncRunning && !values.bidirectionalSlackSync
                  ? 'Bidirectional slack sync must be turned on before running sync'
                  : undefined
              }
            />
          </div>
        </FormBox>
      </Box>
      <Box id="slack-sync" mb={'64px'}>
        <Heading>Slack sync configuration</Heading>
        <SubHeading>Configure the integration</SubHeading>
        <FormBox>
          <div>
            <Label htmlFor="channelsToSync">Channels to sync</Label>
            <Selecter
              name="channelsToSync"
              handleChange={handleChange}
              value={values.channelsToSync}
              options={syncConfigurationOptions}
              errorText={errors.channelsToSync}
              disabled={values.isSyncRunning || isSubmitting}
            />
          </div>
          <div>
            <Label htmlFor="fallbackMessageSenderId">Fallback message sender</Label>
            <Selecter
              name="fallbackMessageSenderId"
              handleChange={handleChange}
              value={values.fallbackMessageSenderId}
              options={internalUsers}
              errorText={errors.fallbackMessageSenderId}
              disabled={values.isSyncRunning || isSubmitting}
            />
          </div>
          <div>
            <Label htmlFor="slackChannelPrefix">Slack channel prefix</Label>
            <TextInput
              name="slackChannelPrefix"
              placeholder="copilot"
              handleChange={handleChange}
              defaultValue={values.slackChannelPrefix}
              // Show first prioritized error
              errorText={errors.slackChannelPrefix}
              disabled={values.isSyncRunning || isSubmitting}
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

        <Box sx={{ display: 'flex', gap: '0.75em' }}>
          <div>
            <PrimaryBtn
              type="submit"
              isLoading={isSubmitting}
              disabled={values.isSyncRunning || !values.bidirectionalSlackSync || isSubmitting || !slackbotInstalled}
            >
              {values.isSyncRunning ? 'Running sync...' : 'Run sync'}
            </PrimaryBtn>
          </div>
          <div>
            {values.bidirectionalSlackSync && (
              <PrimaryBtn type="button" handleClick={routeToSlackAppInstall}>
                Add to Slack
              </PrimaryBtn>
            )}
          </div>
        </Box>
      </Box>
    </form>
  )
}

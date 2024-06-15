import { NextRequest, NextResponse } from 'next/server'
import User from '@api/core/models/User.model'
import { CopilotWebhookService } from '@api/webhooks/copilot/copilot.service'
import { SettingsService } from '@api/settings/settings.service'
import { WebhookSchema } from '@api/core/types/webhook'

export const handleCopilotWebhookEvent = async (req: NextRequest) => {
  // Authenticates if the webhook comes from a valid source - no signature matching is necessary
  const user = await User.authenticate(req)

  // If sync is not running for a workspace, we can safely ignore this webhook call
  const settingsService = new SettingsService(user)
  const settings = await settingsService.getSettings()
  console.log('settings', settings)
  if (!settings?.isSyncRunning) {
    console.info('Sync not running, ignoring webhook call')
    return NextResponse.json({ message: 'Sync not running, ignoring webhook call' })
  }

  // Handle webhook based on event that triggered it
  const data = WebhookSchema.parse(await req.json())
  const copilotWebhookService = new CopilotWebhookService(user, settings)
  await copilotWebhookService.handleWebhookEvent(data)

  return NextResponse.json({
    message: 'Webhook event handled',
  })
}

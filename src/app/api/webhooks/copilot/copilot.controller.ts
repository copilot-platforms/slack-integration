import { NextRequest, NextResponse } from 'next/server'
import User from '@/app/api/core/models/User.model'
import { CopilotWebhookService } from '@api/webhooks/copilot/copilot.service'
import { SettingsService } from '@api/settings/settings.service'

export const handleCopilotWebhookEvent = async (req: NextRequest) => {
  const user = await User.authenticate(req)

  // If sync is not running for a workspace, we can safely ignore this webhook call
  const settingsService = new SettingsService(user)
  const settings = await settingsService.getSettings()
  if (!settings?.isSyncRunning) {
    return NextResponse.json({ message: 'Sync not running, ignoring webhook call' })
  }

  const body = await req.json()
  const copilotWebhookService = new CopilotWebhookService(user, settings)
  // Verify that webhook was called by copilot app using the `x-copilot-signature` header
  const data = await copilotWebhookService.verifySignature(body, req.headers.get('x-copilot-signature'))
  // Handle webhook based on event that triggered it
  await copilotWebhookService.handleWebhookEvent(data)

  return NextResponse.json({
    message: 'Webhook event handled',
  })
}

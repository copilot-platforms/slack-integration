import { withErrorHandler } from '@api/core/utils/withErrorHandler'
import { handleCopilotWebhookEvent } from '@api/webhooks/copilot/copilot.controller'

export const POST = withErrorHandler(handleCopilotWebhookEvent)

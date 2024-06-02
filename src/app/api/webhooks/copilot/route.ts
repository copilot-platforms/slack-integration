import { withErrorHandler } from '@api/core/utils/withErrorHandler'
import { handleCopilotWebhookEvent } from './copilot.controller'

export const POST = withErrorHandler(handleCopilotWebhookEvent)

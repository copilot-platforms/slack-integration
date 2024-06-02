import { withErrorHandler } from '@/app/api/core/utils/withErrorHandler'
import { handleCopilotWebhookEvent } from './copilot.controller'

export const POST = withErrorHandler(handleCopilotWebhookEvent)

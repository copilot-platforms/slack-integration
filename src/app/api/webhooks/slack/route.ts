import { withErrorHandler } from '@api/core/utils/withErrorHandler'
import { handleSlackWebhookRequest } from '@api/webhooks/slack/slack.controller'

export const POST = withErrorHandler(handleSlackWebhookRequest)

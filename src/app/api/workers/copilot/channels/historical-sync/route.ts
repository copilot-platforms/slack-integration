import { withErrorHandler } from '@api/core/utils/withErrorHandler'
import { runHistoricalSync } from '@api/workers/copilot/channels/copilot-channels-worker.controller'

// Raise maximum duration of serverless runtime to 5 mins
export const maxDuration = 300

export const POST = withErrorHandler(runHistoricalSync)

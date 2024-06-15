import { withErrorHandler } from '@api/core/utils/withErrorHandler'
import { runHistoricalSync } from '@api/workers/copilot/channels/copilot-channels-worker.controller'

// Raise maximum duration of serverless runtime to 120 secs
export const maxDuration = 120

export const POST = withErrorHandler(runHistoricalSync)

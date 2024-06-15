import { withErrorHandler } from '@api/core/utils/withErrorHandler'
import { batchCreate } from '@api/workers/copilot/channels/copilot-channels-worker.controller'

// Set timeout of serverless function to 5 mins - the max that Vercel Pro can support
export const maxDuration = 300

export const POST = withErrorHandler(batchCreate)

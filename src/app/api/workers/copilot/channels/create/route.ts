import { withErrorHandler } from '@/app/api/core/utils/withErrorHandler'
import { createSyncedSlackChannel } from '@api/workers/copilot/channels/copilot-channels-worker.controller'

export const maxDuration = 300

export const POST = withErrorHandler(createSyncedSlackChannel)

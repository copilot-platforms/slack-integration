import { withErrorHandler } from '@api/core/utils/withErrorHandler'
import { archiveSyncedSlackChannel } from '@api/workers/copilot/channels/copilot-channels-worker.controller'

export const maxDuration = 300

export const POST = withErrorHandler(archiveSyncedSlackChannel)

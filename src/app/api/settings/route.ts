import { withErrorHandler } from '@api/core/utils/withErrorHandler'
import { getSettings, createOrUpdateSettings } from '@api/settings/settings.controller'

export const GET = withErrorHandler(getSettings)
export const POST = withErrorHandler(createOrUpdateSettings)

import { withErrorHandler } from '@api/core/utils/withErrorHandler'
import { createSettings, getSettings, updateSettings } from '@api/settings/settings.controller'

export const GET = withErrorHandler(getSettings)
export const POST = withErrorHandler(createSettings)
export const PATCH = withErrorHandler(updateSettings)

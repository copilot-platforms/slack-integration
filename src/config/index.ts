export const copilotAPIKey = process.env.COPILOT_API_KEY || ''
export const apiUrl = `${process.env.VERCEL_ENV === 'development' ? 'http://' : 'https://'}${process.env.VERCEL_URL}`
export const SentryConfig = {
  DSN: process.env.NEXT_PUBLIC_SENTRY_DSN || '',
}
export const vercelConfig = {
  env: process.env.VERCEL_ENV || 'development',
}
export const zeploConfig = {
  apiKey: process.env.ZEPLO_API_KEY || '',
  url: vercelConfig.env === 'development' ? process.env.ZEPLO_DEV_URL : apiUrl,
}

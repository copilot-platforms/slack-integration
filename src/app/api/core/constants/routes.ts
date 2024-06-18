const BASE_WORKER_ROUTE = '/api/workers'

export const WORKERS = {
  copilot: {
    channels: {
      create: `${BASE_WORKER_ROUTE}/copilot/channels/create`,
      delete: `${BASE_WORKER_ROUTE}/copilot/channels/delete`,
      historicalSync: `${BASE_WORKER_ROUTE}/copilot/channels/historical-sync`,
    },
    messages: {
      create: `${BASE_WORKER_ROUTE}/copilot/messages/create`,
    },
  },
}

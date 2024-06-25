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

export const noSyncTriggerKeywords = [
  '> has joined the channel', // Prevents recursive channel joined messages being sent
  ' sent a message in Copilot: ', // Prevents an infinite loop sending messages constantly back and forth between slack and copilot
]

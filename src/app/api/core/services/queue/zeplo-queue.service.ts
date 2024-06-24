import { vercelConfig, zeploConfig } from '@/config'
import { Queueable } from '@api/core/services/queue/request-queue.service'

export class ZeploQueueService implements Queueable {
  /**
   * Push a new request task to the Zeplo queue
   */
  async push(url: string, opts?: { params?: object; traceId?: string }): Promise<Response> {
    return await fetch(`https://zeplo.to/${zeploConfig.url}${url}`, {
      method: 'POST',
      headers: {
        'X-Zeplo-Token': zeploConfig.apiKey,
        'X-Zeplo-Retry': '0', // Move retry logic away from Zeplo layer for better control
        'X-Zeplo-Trace': opts?.traceId || '',
        'X-Zeplo-Env': vercelConfig.env,
      },
      body: JSON.stringify(opts?.params),
    })
    // NOTE: X-Zeplo-Id, X-Zeplo-Start store job id and time request started respectively
  }
}

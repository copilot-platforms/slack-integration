import { vercelConfig, zeploConfig } from '@/config'

/**
 * Wrapper around Zeplo which provides a queue service for requests
 *
 * https://zeplo.io/docs/getting-started/
 */
export class RequestQueueService {
  /**
   * Push a new request into the request queue
   * @param url URL where request is to be made
   * @param opts Provide optional request body or a trace id to identify this particular request
   */
  async push(url: string, opts?: { params?: object; traceId?: string }): Promise<Response> {
    return await fetch(`https://zeplo.to/${zeploConfig.url}${url}`, {
      method: 'POST',
      headers: {
        'X-Zeplo-Token': zeploConfig.apiKey,
        'X-Zeplo-Retry': '3|exponential|1',
        'X-Zeplo-Trace': opts?.traceId || '',
        'X-Zeplo-Env': vercelConfig.env,
      },
      body: JSON.stringify(opts?.params),
    })
    // NOTE: X-Zeplo-Id, X-Zeplo-Start store job id and time request started respectively
  }
}

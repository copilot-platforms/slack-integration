import { vercelConfig, zeploConfig } from '@/config'
import { ZeploQueueService } from './zeplo-queue.service'

export interface Queueable {
  push(url: string, opts?: { params?: object; traceId?: string }): Promise<Response>
}

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
    const zeploQueueService = new ZeploQueueService()
    return await zeploQueueService.push(url, opts)
  }
}

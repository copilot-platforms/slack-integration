import * as request from 'superagent'

export class SuperTestService {
  private static baseUrl: string = process.env.VERCEL_URL || 'http://localhost:3000'

  public async get(url: string) {
    return request.get(`${SuperTestService.baseUrl}${url}`)
  }

  public async post(url: string) {
    return request.post(`${SuperTestService.baseUrl}${url}`)
  }

  public async put(url: string) {
    return request.put(`${SuperTestService.baseUrl}${url}`)
  }

  public async patch(url: string) {
    return request.patch(`${SuperTestService.baseUrl}${url}`)
  }

  public async delete(url: string) {
    return request.delete(`${SuperTestService.baseUrl}${url}`)
  }
}

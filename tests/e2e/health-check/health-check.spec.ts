import { SuperTestService } from '@test/services/super-test.service'

describe('Health Check', () => {
  let superTest: SuperTestService

  beforeAll(() => {
    superTest = new SuperTestService()
  })

  it('should return 200', async () => {
    const response = await superTest.get('/api/health-check')

    expect(response.status).toBe(200)
  })
})

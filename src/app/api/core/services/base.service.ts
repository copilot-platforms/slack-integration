import DBClient from '@/lib/db'
import { PrismaClient } from '@prisma/client'
import User from '@api/core/models/User.model'
import { CopilotAPI } from '@/utils/CopilotAPI'

/**
 * Base Service with access to db and current user
 */
export abstract class BaseService {
  protected db: PrismaClient = DBClient.getInstance()
  protected copilot: CopilotAPI

  constructor(protected user: User) {
    this.copilot = new CopilotAPI(user.token)
  }
}

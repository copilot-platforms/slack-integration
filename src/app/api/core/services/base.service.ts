import DBClient from '@/lib/db'
import { PrismaClient } from '@prisma/client'
import User from '@api/core/models/User.model'

/**
 * Base Service with access to db and current user
 */
export abstract class BaseService {
  protected db: PrismaClient = DBClient.getInstance()

  constructor(public user: User) {}
}

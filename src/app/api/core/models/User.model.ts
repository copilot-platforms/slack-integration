import { InternalUserToken, InternalUserTokenSchema } from '@/types/common'
import APIError from '@api/core/exceptions/APIError'
import httpStatus from 'http-status'
import { CopilotAPI } from '@/utils/CopilotAPI'
import { NextRequest } from 'next/server'
import { z } from 'zod'

/**
 * Faux model for Copilot Users (IU + Client)
 * This model is used to repressent the current user based on the token payload decrypted by Copilot SDK
 * @param token The request token provided by copilot for custom apps
 * @param tokenPayload The decrypted token payload
 */
class User {
  internalUserId: string
  workspaceId: string

  // Instantiate a User from a request token & decrypted payload
  constructor(
    public token: string,
    tokenPayload: InternalUserToken,
  ) {
    this.internalUserId = tokenPayload.internalUserId
    this.workspaceId = tokenPayload.workspaceId
  }

  static async authenticate(req: NextRequest) {
    /**
     * Token parser and authentication util
     *
     * `authenticate` takes in the current request, parses the "token" searchParam from it,
     * uses `CopilotAPI` to check if the user token is valid
     * and finally returns an instance of `User` that is associated with this request
     *
     * @throws {APIError} Handles authentication errors gracefully
     */
    const token = req.nextUrl.searchParams.get('token')
    // Fetch token from search param and validate it
    const tokenParsed = z.string().safeParse(token)
    if (!tokenParsed.success || !tokenParsed.data) {
      throw new APIError(httpStatus.UNAUTHORIZED, 'Please provide a valid token')
    }

    // Parse token payload from valid token
    const copilot = new CopilotAPI(tokenParsed.data)
    const payload = await copilot.getIUTokenPayload()

    if (!payload) {
      throw new APIError(httpStatus.UNAUTHORIZED, 'Failed to authenticate token')
    }

    if (!payload.internalUserId) {
      throw new APIError(httpStatus.UNAUTHORIZED, 'You are not permitted to access this resource')
    }

    return new User(tokenParsed.data, payload)
  }
}

export default User

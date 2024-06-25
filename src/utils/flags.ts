import APIError from '@/app/api/core/exceptions/APIError'
import httpStatus from 'http-status'

export const checkIfFeatureFlagged = (flag: boolean) => {
  if (flag) return

  throw new APIError(httpStatus.NOT_FOUND, 'The request resource does not exist')
}

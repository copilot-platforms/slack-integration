/**
 * Custom error class representing an error that occurred in Tasks API.
 * Extends the built-in Error class.
 * @param {string} status - Response status code for this request
 * @param {string} message - Response error message
 */
class APIError extends Error {
  status: number
  message: string
  error?: unknown

  constructor(status: number = 500, message: string = 'Something went wrong', error?: unknown) {
    super(message)
    this.status = status
    this.message = message
    this.error = error
  }
}

export default APIError

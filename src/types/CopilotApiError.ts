export class CopilotApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly body: { message: string },
  ) {
    super(body.message)
  }
}

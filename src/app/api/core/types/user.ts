/**
 * UserAction holds every permitted action that a user is allowed to perform on a given `Resource`
 */
export enum UserAction {
  All,
  Read,
  Create,
  Update,
  Delete,
}

/**
 * User roles as defined by Copilot
 */
export enum UserRole {
  Client,
  IU,
}

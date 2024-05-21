interface EmailableUser {
  id: string
  email: string
}

/**
 * Returns an object with user id as key and email as value for optimal lookups
 */
export const parseUserIdAndEmail = (users: EmailableUser[] | null) => {
  const emailMap: { [k: string]: string } = {}
  users?.forEach(({ id, email }) => (emailMap[id] = email))
  return emailMap
}

import { getAuth } from 'firebase/auth'

export async function currentUser() {
  const auth = getAuth()
  if (!auth) {
    return null
  }

  return auth.currentUser
}

type TUserRole = 'admin' | 'traveler'
type TUser = {
  id: string
  email: string
  password: string
  needsPasswordChange: boolean
  role: TUserRole
  status: 'basic' | 'premium'
  isBlocked: boolean
}

export { TUser, TUserRole }

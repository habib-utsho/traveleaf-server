import { Router } from 'express'
import { authRouter } from '../module/auth/auth.route'
import { adminRouter } from '../module/admin/admin.route'
import { travelerRouter } from '../module/traveler/traveler.route'
import { userRouter } from '../module/user/user.route'

const router = Router()
const routes = [
  {
    path: '/auth',
    route: authRouter,
  },
  {
    path: '/user',
    route: userRouter,
  },
  {
    path: '/traveler',
    route: travelerRouter,
  },
  {
    path: '/admin',
    route: adminRouter,
  },
]

routes.forEach((route) => router.use(route.path, route.route))

export default router

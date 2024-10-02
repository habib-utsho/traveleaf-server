import { Router } from 'express'
import { authRouter } from '../module/auth/auth.route'
import { adminRouter } from '../module/admin/admin.route'
import { travelerRouter } from '../module/traveler/traveler.route'
import { userRouter } from '../module/user/user.route'
import { categoryRouter } from '../module/category/category.route'
import { commentRouter } from '../module/comment/comment.route'
import { packageRouter } from '../module/package/package.route'
import { subscriptionRouter } from '../module/subscription/subscription.route'

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
  {
    path: '/category',
    route: categoryRouter,
  },
  {
    path: '/comment',
    route: commentRouter,
  },
  {
    path: '/package',
    route: packageRouter,
  },
  {
    path: '/subscription',
    route: subscriptionRouter,
  },
]

routes.forEach((route) => router.use(route.path, route.route))

export default router

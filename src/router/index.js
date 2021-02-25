import Vue from 'vue'
import Router from 'vue-router'
import store from '../store'
import bootstrap from './bootstrap'

// Routes
import PagesRoutes from './pages.routes'
import UsersRoutes from './users.routes'

Vue.use(Router)

export const routes = [{
  path: '/',
  redirect: '/users'
},
...PagesRoutes,
...UsersRoutes,
{
  path: '/blank',
  name: 'blank',
  component: () => import(/* webpackChunkName: "blank" */ '@/pages/BlankPage.vue')
},
{
  path: '*',
  name: 'error',
  component: () => import(/* webpackChunkName: "error" */ '@/pages/error/NotFoundPage.vue'),
  meta: {
    layout: 'error'
  }
}]

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL || '/',
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition

    return { x: 0, y: 0 }
  },
  routes
})

let firstRoute = true

/**
 * Before each route update
 */
router.beforeEach(async (to, from, next) => {
  if (firstRoute) {
    firstRoute = false

    await bootstrap()
  }

  const { roleId } = store.state.auth.user

  const requiresAuth =
    (to.matched.some((record) => record.meta.superAdmin)) ||
    (to.matched.some((record) => record.meta.userAuth)) ||
    (to.matched.some((record) => record.meta.koreAdmin)) ||
    (to.matched.some((record) => record.meta.customerAdmin))

  if (requiresAuth) {
    if (roleId) {
      if (to.matched.some((record) => record.meta.userAuth)) {
        return next()
      } else if (roleId !== 'kore_admin' && to.matched.some((record) => record.meta.userAuth)) {
        return next({
          name: 'auth-signin'
        })
      } else if (roleId !== 'customer_admin' && to.matched.some((record) => record.meta.userAuth)) {
        return next({
          name: 'auth-signin'
        })
      }

      return next()
    } else {
      return next({
        name: 'auth-signin'
      })
    }
  } else {
    if (roleId && (to.matched.some((record) => record.meta.userNotAuth))) {
      if (roleId === 'kore_admin') {
        return next({
          name: 'acs-machines'
        })
      } else if (roleId === 'customer_admin' && roleId === 'customer_manager' || roleId === 'customer_operator') {
        return next({
          name: 'dashboard-analytics'
        })
      }
    }
  }

  return next()
})
export default router

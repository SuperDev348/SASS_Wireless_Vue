export default [{
  path: '/auth/signin',
  name: 'auth-signin',
  component: () => import(/* webpackChunkName: "auth-signin" */ '@/pages/auth/SigninPage.vue'),
  meta: {
    layout: 'auth',
    userNotAuth: true
  }
},
{
  path: '/profile',
  name: 'profile',
  component: () => import(/* webpackChunkName: "profile" */ '@/pages/profile/Index.vue'),
  meta: {
    userAuth: true
  }
}, {
  path: '/auth/verify-email',
  name: 'auth-verify-email',
  component: () => import(/* webpackChunkName: "auth-verify-email" */ '@/pages/auth/VerifyEmailPage.vue'),
  meta: {
    layout: 'auth'
  }
}, {
  path: '/auth/forgot-password',
  name: 'auth-forgot',
  component: () => import(/* webpackChunkName: "auth-forgot" */ '@/pages/auth/ForgotPage.vue'),
  meta: {
    layout: 'auth',
    userNotAuth: true
  }
}, {
  path: '/auth/reset-password',
  name: 'auth-reset',
  component: () => import(/* webpackChunkName: "auth-reset" */ '@/pages/auth/ResetPage.vue'),
  meta: {
    layout: 'auth'
  }
}, {
  path: '/error/not-found',
  name: 'error-not-found',
  component: () => import(/* webpackChunkName: "error-not-found" */ '@/pages/error/NotFoundPage.vue'),
  meta: {
    layout: 'error'
  }
}, {
  path: '/error/unexpected',
  name: 'error-unexpected',
  component: () => import(/* webpackChunkName: "error-unexpected" */ '@/pages/error/UnexpectedPage.vue'),
  meta: {
    layout: 'error'
  }
}, {
  path: '/utility/maintenance',
  name: 'utility-maintenance',
  component: () => import(/* webpackChunkName: "utility-maintenance" */ '@/pages/utility/MaintenancePage.vue'),
  meta: {
    layout: 'auth'
  }
}, {
  path: '/utility/coming-soon',
  name: 'utility-soon',
  component: () => import(/* webpackChunkName: "utility-soon" */ '@/pages/utility/SoonPage.vue'),
  meta: {
    layout: 'auth'
  }
}, {
  path: '/utility/help',
  name: 'utility-help',
  component: () => import(/* webpackChunkName: "utility-help" */ '@/pages/utility/HelpPage.vue')
}, {
  path: '/customer-assign',
  name: 'customer-assign',
  component: () => import(/* webpackChunkName: "customer-assign" */ '@/pages/customer-assign/CustomerAssign.vue'),
  meta: {
    koreAdmin: true
  }
}, {
  path: '/router-dashboard/:id',
  name: 'router-dashboard',
  component: () => import(/* webpackChunkName: "router-dashboard" */ '@/pages/dashboard/RouterDashboard.vue'),
  meta: {
    customerAdmin: true
  }
}, {
  path: '/settings/company-info',
  name: 'company-settings',
  component: () => import(/* webpackChunkName: "company-info" */ '@/pages/settings/CompanySettings.vue'),
  meta: {
    customerAdmin: true
  }
}, {
  path: '/settings/device-names',
  name: 'device-names',
  component: () => import(/* webpackChunkName: "device-names" */ '@/pages/settings/DeviceNames.vue'),
  meta: {
    customerAdmin: true
  }
}]

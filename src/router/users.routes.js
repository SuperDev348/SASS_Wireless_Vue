export default [{
  path: '/users',
  name: 'users-list',
  component: () => import(/* webpackChunkName: "users-list" */ '@/pages/users/UsersPage.vue'),
  meta: {
    customerAdmin: true
  }
}, {
  path: '/users/edit/:id',
  name: 'users-edit',
  component: () => import(/* webpackChunkName: "users-edit" */ '@/pages/users/EditUserPage.vue'),
  meta: {
    customerAdmin: true
  }
}, {
  path: '/users/add',
  name: 'users-add',
  component: () => import(/* webpackChunkName: "users-add" */ '@/pages/users/CreateUserPage.vue'),
  meta: {
    customerAdmin: true
  }
}, {
  path: '/kore-admin/users',
  name: 'kore-users-list',
  component: () => import(/* webpackChunkName: "kore-users-list" */ '@/pages/users/UsersPage.vue'),
  meta: {
    // koreAdmin: true
  }
}, {
  path: '/kore-admin/users/edit/:id',
  name: 'kore-users-edit',
  component: () => import(/* webpackChunkName: "kore-users-edit" */ '@/pages/users/EditUserPage.vue'),
  meta: {
    // koreAdmin: true
  }
}, {
  path: '/kore-admin/users/add',
  name: 'kore-users-add',
  component: () => import(/* webpackChunkName: "kore-users-add" */ '@/pages/users/CreateUserPage.vue'),
  meta: {
    // koreAdmin: true
  }
}, {
  path: '/customers',
  name: 'customers-list',
  component: () => import(/* webpackChunkName: "customers-list" */ '@/pages/customers/Index.vue'),
  meta: {
    customerAdmin: true
  }
}, {
  path: '/customers/add',
  name: 'customers-add',
  component: () => import(/* webpackChunkName: "customers-add" */ '@/pages/customers/AddCustomer.vue'),
  meta: {
    customerAdmin: true
  }
}, {
  path: '/customers/edit/:id',
  name: 'customers-edit',
  component: () => import(/* webpackChunkName: "customers-edit" */ '@/pages/customers/EditCustomer.vue'),
  meta: {
    customerAdmin: true
  }
}]

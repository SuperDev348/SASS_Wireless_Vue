export default {
  // main navigation - side menu
  menu: [{
    text: '',
    key: '',
    items: [
      { icon: 'mdi-account-multiple', text: 'Users', link: '/kore-admin/users' },
      { icon: 'mdi-swap-horizontal', text: 'Customer Assign', link: '/customer-assign' },
      { icon: 'mdi-file-outline', key: 'menu.utilityHelp', text: 'FAQs / Help', link: '/utility/help' }
    ]
  }],

  superAdminMenu: [{
    text: '',
    key: '',
    items: [
      { icon: 'mdi-view-dashboard-outline', text: 'App Settings', link: '/app-settings/customize-application' },
      { icon: 'mdi-devices', text: 'Configurations', link: '/app-settings/configurations' },
      { icon: 'mdi-file-outline', key: 'menu.utilityHelp', text: 'FAQs / Help', link: '/utility/help' }
    ]
  }],

  koreViewerMenu: [{
    text: '',
    key: '',
    items: [
      { icon: 'mdi-city', text: 'Companies', link: '/customers/list' },
      { icon: 'mdi-account-multiple', text: 'Users', link: '/kore-admin/users' },
      { icon: 'mdi-file-outline', key: 'menu.utilityHelp', text: 'FAQs / Help', link: '/utility/help' }
    ]
  }],

  customerMenu: [{
    text: '',
    key: '',
    items: [
      { icon: 'mdi-account-multiple', text: 'User Access', link: '/users' },
      { icon: 'mdi-swap-horizontal', text: 'Customer Assign', link: '/customer-assign' },
      { icon: 'mdi-cog', text: 'Settings', regex: /^\/settings/,
        items: [
          { text: 'Company Info', link: '/settings/company-info' },
          { text: 'Device Names', link: '/settings/device-names' }
        ]
      },
      { icon: 'mdi-file-outline', key: 'menu.utilityHelp', text: 'FAQs / Help', link: '/utility/help' }
    ]
  }],

  customerManagerMenu: [{
    text: '',
    key: '',
    items: [
      { icon: 'mdi-account-multiple', text: 'User Access', link: '/users' },
      { icon: 'mdi-cog', text: 'Settings', regex: /^\/settings/,
        items: [
          { text: 'Company Info', link: '/settings/company-info' },
          { text: 'Device Names', link: '/settings/device-names' }
        ]
      },
      { icon: 'mdi-file-outline', key: 'menu.utilityHelp', text: 'FAQs / Help', link: '/utility/help' }
    ]
  }],

  customerOperatorMenu: [{
    text: '',
    key: '',
    items: [
      { icon: 'mdi-account-multiple', text: 'User Access', link: '/users/list' },
      { icon: 'mdi-file-outline', key: 'menu.utilityHelp', text: 'FAQs / Help', link: '/utility/help' }
    ]
  }],

  // footer links
  footer: [{
    text: 'Copyright',
    key: 'menu.parent',
    href: 'https://aecinternet.com',
    target: '_blank'
  }]
}

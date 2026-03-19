const { terms } = require('./terms.json')
const configs = require('../configs')

const menus = [
  {
    label: 'แกลเลอรี่ภาพ',
    path: '/media',
    icon: 'cloud-upload',
  },
  {
    label: 'User Logs',
    path: '/user-logs',
    icon: 'history',
  },
  {
    label: 'ATK Logs',
    path: '/atk-logs',
    icon: 'notes-medical',
  },
  {
    label: 'Wallet Management',
    icon: 'wallet',
    keyword: 'wallets',
    submenu: [
      {
        label: 'Wallet Overview',
        path: '/wallets',
        icon: 'wallet'
      },
      {
        label: 'Reports & Analytics',
        path: '/wallets/reports',
        icon: 'chart-bar'
      },
      {
        label: 'Voucher Management',
        path: '/wallets/vouchers',
        icon: 'ticket-alt'
      }
    ],
  },
  {
    label: 'Event/Concert',
    icon: 'music',
    submenu: [
      {
        label: 'Tickets summary',
        path: '/tickets-summary',
        icon: 'chart-line'
      },
      {
        label: 'Tickets',
        path: '/tickets',
        icon: 'ticket-alt'
      },
      {
        label: 'Event Page',
        path: '/event-page',
        icon: 'music'
      },
      {
        label: 'Event list',
        path: '/events',
        icon: 'list',
      }
    ],
  },
  {
    label: 'Contents',
    // path: '/menus',
    submenu: [
      {
        label: 'News & Promotions',
        path: '/articles',
        icon: 'book',
      },
      {
        label: 'Bookings',
        path: '/bookings',
        icon: 'list',
      },
      {
        label: 'Vaccinated Submissions',
        path: '/vaccinateds',
        icon: 'syringe',
      },
      {
        label: 'Branches',
        path: '/branches',
        icon: 'store',
      },
    ],
  },
  {
    label: 'Menu',
    // path: '/menus',
    submenu: [
      {
        label: 'Menu',
        path: '/menus',
        icon: 'list',
      },
      {
        label: 'Menu Categories',
        path: '/menu-categories',
        icon: 'list',
      },
      {
        label: 'Menu Sub Categories',
        path: '/menu-sub-categories',
        icon: 'list',
      },
    ],
  },
  {
    label: 'Pages',
    // path: '/menus',
    submenu: [
      {
        label: 'Application Page',
        path: '/landing-page',
        icon: 'cog',
      },
      {
        label: 'About Page',
        path: '/about-page',
        icon: 'cog',
      },
      {
        label: 'Contact Page',
        path: '/contact-page',
        icon: 'cog',
      },
      {
        label: 'News Page',
        path: '/news-page',
        icon: 'cog',
      },
      {
        label: 'Home Page',
        path: '/home-page',
        icon: 'cog',
      },
      {
        label: 'Terms & Conditions',
        path: '/terms-and-conditions',
        icon: 'cog',
      },
      {
        label: 'Vaccination Campaign',
        path: '/vaccinated-page',
        icon: 'cog',
      },
    ],
  },
  {
    label: 'Settings',
    submenu: [
      {
        label: 'ATK Management',
        path: '/atk-management',
        icon: 'cog',
      },
      {
        label: 'Fully Booked',
        path: '/fully-bookeds',
        icon: 'cog',
      },
      {
        label: 'Lucky Number',
        path: '/lucky-numbers',
        icon: 'cog'
      },
      {
        label: 'Notification',
        path: '/notifications',
        icon: 'cog'
      },
      {
        label: 'Application Settings',
        path: '/app-settings',
        icon: 'cog',
      },
      {
        label: 'Website Settings',
        path: '/website-settings',
        icon: 'cog',
      },
      {
        label: 'Users',
        path: '/users',
        icon: 'user',
      },
      {
        label: 'Staffs',
        path: '/staffs',
        icon: 'user',
      },

    ]
  }
];

const staffATKMenus = [
  {
    label: 'ATK Approvement',
    path: '/atk-approvement',
    icon: 'notes-medical',
  },
];

export const state = () => ({
  page: 1,
  sort: null,
  perPage: 10,
  filters: null,
  configs: {},
  toastData: null,
  brandname: 'Chongjaroen',
  brandURL: 'https://chongjaroen.com',
  navLinks: menus,
  staffATKMenus,
  // internationalize 🌏
  // locales: [
  //   { value: 'th', label: 'Thai', flag: 'TH' },
  //   { value: 'en', label: 'English', flag: 'GB-UKM' },
  //   { value: 'zh', label: 'Chinese', flag: 'CN' },
  // ],
  // currentLocale: 'th',
  terms,
  configs,
});

export const mutations = {
  SET_BY_KEY(state, { key, value }) {
    state[key] = value
  },
  CHANGE_LOCALE(state, newLocale) {
    state.currentLocale = newLocale
  },
}

export const actions = {
  async nuxtServerInit({ commit }, { $axios, query }) {
    let { locale } = query
    if (locale) commit('CHANGE_LOCALE', locale)
  },
}

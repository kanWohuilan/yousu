const multiMenu: AuthRoute.Route = {
  name: 'system-manage',
  path: '/system-manage',
  component: 'basic',
  children: [
    {
      name: 'system-manage_countryandcity-manage',
      path: '/system-manage/countryandcity-manage',
      component: 'self',
      meta: {
        title: '国家与城市管理',
        requiresAuth: true
        // code: '03_01'
      }
    },
    {
      name: 'system-manage_indexImg-manage',
      path: '/system-manage/indexImg-manage',
      component: 'self',
      meta: {
        title: '首页轮播图管理',
        requiresAuth: true,
        code: '03_01'
      }
    },
    {
      name: 'system-manage_studentQrCode-manage',
      path: '/system-manage/studentQrCode-manage',
      component: 'self',
      meta: {
        title: '二维码管理',
        requiresAuth: true,
        code: '03_05'
      }
    },
    {
      name: 'system-manage_user-manage',
      path: '/system-manage/user-manage',
      component: 'self',
      meta: {
        title: '用户管理',
        requiresAuth: true,
        code: '03_02'
      }
    },
    {
      name: 'system-manage_role-manage',
      path: '/system-manage/role-manage',
      component: 'self',
      meta: {
        title: '角色管理',
        requiresAuth: true,
        code: '03_03'
      }
    },
    {
      name: 'system-manage_menu-manage',
      path: '/system-manage/menu-manage',
      component: 'self',
      meta: {
        title: '菜单管理',
        requiresAuth: true,
        code: '03_04'
      }
    },

    {
      name: 'system-manage_user-center',
      path: '/system-manage/user-center',
      component: 'self',
      meta: {
        title: '用户中心',
        requiresAuth: true,
        hide: true
      }
    }
  ],
  meta: {
    title: '系统管理',
    icon: 'icon-park-solid:setting-web',
    requiresAuth: true,
    order: 11
  }
};

export default multiMenu;

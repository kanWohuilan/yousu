export const routeModel: Record<Auth.RoleType, AuthRoute.Route[]> = {
  super: [
    {
      name: 'system-manage',
      path: '/system-manage',
      component: 'basic',
      children: [
        {
          name: 'system-manage_first',
          path: '/system-manage/first',
          component: 'multi',
          children: [
            {
              name: 'system-manage_first_second',
              path: '/system-manage/first/second',
              component: 'self',
              meta: {
                title: '二级菜单',
                requiresAuth: true,
                icon: 'ic:outline-menu'
              }
            },
            {
              name: 'system-manage_first_second-new',
              path: '/system-manage/first/second-new',
              component: 'multi',
              children: [
                {
                  name: 'system-manage_first_second-new_third',
                  path: '/system-manage/first/second-new/third',
                  component: 'self',
                  meta: {
                    title: '三级菜单',
                    requiresAuth: true,
                    icon: 'ic:outline-menu'
                  }
                }
              ],
              meta: {
                title: '二级菜单(有子菜单)',
                icon: 'ic:outline-menu'
              }
            }
          ],
          meta: {
            title: '二级菜单',
            icon: 'ic:outline-menu'
          }
        },
        {
          name: 'system-manage_user-manage',
          path: '/system-manage/user-manage',
          component: 'self',
          meta: {
            title: '用户'
          }
        }
      ],
      meta: {
        title: '系统管理',
        icon: 'carbon:menu',
        order: 8
      }
    }
  ],
  admin: [
    {
      name: 'system-manage',
      path: '/system-manage',
      component: 'basic',
      children: [
        {
          name: 'system-manage_first',
          path: '/system-manage/first',
          component: 'multi',
          children: [
            {
              name: 'system-manage_first_second',
              path: '/system-manage/first/second',
              component: 'self',
              meta: {
                title: '二级菜单',
                requiresAuth: true,
                icon: 'ic:outline-menu'
              }
            },
            {
              name: 'system-manage_first_second-new',
              path: '/system-manage/first/second-new',
              component: 'multi',
              children: [
                {
                  name: 'system-manage_first_second-new_third',
                  path: '/system-manage/first/second-new/third',
                  component: 'self',
                  meta: {
                    title: '三级菜单',
                    requiresAuth: true,
                    icon: 'ic:outline-menu'
                  }
                }
              ],
              meta: {
                title: '二级菜单(有子菜单)',
                icon: 'ic:outline-menu'
              }
            }
          ],
          meta: {
            title: '一级菜单',
            icon: 'ic:outline-menu'
          }
        }
      ],
      meta: {
        title: '多级菜单',
        icon: 'carbon:menu',
        order: 8
      }
    }
  ],
  user: [
    {
      name: 'system-manage',
      path: '/system-manage',
      component: 'basic',
      children: [
        {
          name: 'system-manage_first',
          path: '/system-manage/first',
          component: 'multi',
          children: [
            {
              name: 'system-manage_first_second',
              path: '/system-manage/first/second',
              component: 'self',
              meta: {
                title: '二级菜单',
                requiresAuth: true,
                icon: 'ic:outline-menu'
              }
            },
            {
              name: 'system-manage_first_second-new',
              path: '/system-manage/first/second-new',
              component: 'multi',
              children: [
                {
                  name: 'system-manage_first_second-new_third',
                  path: '/system-manage/first/second-new/third',
                  component: 'self',
                  meta: {
                    title: '三级菜单',
                    requiresAuth: true,
                    icon: 'ic:outline-menu'
                  }
                }
              ],
              meta: {
                title: '二级菜单(有子菜单)',
                icon: 'ic:outline-menu'
              }
            }
          ],
          meta: {
            title: '一级菜单',
            icon: 'ic:outline-menu'
          }
        }
      ],
      meta: {
        title: '多级菜单',
        icon: 'carbon:menu',
        order: 7
      }
    }
  ]
};

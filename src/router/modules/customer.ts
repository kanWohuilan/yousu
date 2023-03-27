const customer: AuthRoute.Route = {
  name: 'customer',
  path: '/customer',
  component: 'basic',
  children: [
    // {
    //   name: 'customer_customer-manage',
    //   path: '/customer/customer-manage',
    //   component: 'self',
    //   meta: {
    //     title: '客户管理',
    //     requiresAuth: true,
    //     code: '02_01'
    //   }
    // },
    {
      name: 'customer_houseApply-manage',
      path: '/customer/houseApply-manage',
      component: 'self',
      meta: {
        title: '租房申请',
        requiresAuth: true,
        code: '02_02'
      }
    },
    {
      name: 'customer_sublet-manage',
      path: '/customer/sublet-manage',
      component: 'self',
      meta: {
        title: '转租申请',
        requiresAuth: true,
        code: '02_03'
      }
    },
    {
      name: 'customer_signing-manage',
      path: '/customer/signing-manage',
      component: 'self',
      meta: {
        title: '签约管理',
        requiresAuth: true,
        code: '02_04'
      }
    }
  ],
  meta: {
    title: '客户管理',
    icon: 'raphael:customer',
    requiresAuth: true,
    order: 11
  }
};

export default customer;

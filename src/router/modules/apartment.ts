const apartment: AuthRoute.Route = {
  name: 'apartment',
  path: '/apartment',
  component: 'basic',
  children: [
    {
      name: 'apartment_apartment-manage',
      path: '/apartment/apartment-manage',
      component: 'self',
      meta: {
        title: '公寓管理',
        requiresAuth: true,
        code: '01_01'
      }
    },
    {
      name: 'apartment_houseType-manage',
      path: '/apartment/houseType-manage',
      component: 'self',
      meta: {
        title: '房型管理',
        requiresAuth: true,
        code: '01_02'
      }
    },
    {
      name: 'apartment_tag-manage',
      path: '/apartment/tag-manage',
      component: 'self',
      meta: {
        title: '标签管理',
        requiresAuth: true,
        code: '01_03'
      }
    },
    {
      name: 'apartment_aroundFacility-manage',
      path: '/apartment/aroundFacility-manage',
      component: 'self',
      meta: {
        title: '周边设施管理',
        requiresAuth: true,
        code: '01_04'
      }
    },
    {
      name: 'apartment_indoorFacility-manage',
      path: '/apartment/indoorFacility-manage',
      component: 'self',
      meta: {
        title: '室内设施管理',
        requiresAuth: true,
        code: '01_05'
      }
    },
    {
      name: 'apartment_campus-manage',
      path: '/apartment/campus-manage',
      component: 'self',
      meta: {
        title: '校区管理',
        requiresAuth: true,
        code: '01_06'
      }
    },
    {
      name: 'apartment_subletHouse-manage',
      path: '/apartment/subletHouse-manage',
      component: 'self',
      meta: {
        title: '转租房管理',
        requiresAuth: true,
        code: '01_07'
      }
    }
  ],
  meta: {
    title: '公寓管理',
    icon: 'bxs:building-house',
    requiresAuth: true,
    order: 11
  }
};

export default apartment;

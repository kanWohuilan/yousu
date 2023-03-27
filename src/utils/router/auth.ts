/**
 * 根据用户权限过滤路由
 * @param routes - 权限路由
 * @param permission - 权限
 */
export function filterAuthRoutesByUserPermission(routes: AuthRoute.Route[], permission: Auth.RoleType) {
  return routes.map(route => filterAuthRouteByUserPermission(route, permission)).flat(1);
}

/**
 * 根据用户权限过滤单个路由
 * @param route - 单个权限路由
 * @param permission - 权限
 */
function filterAuthRouteByUserPermission(route: AuthRoute.Route, permission: Auth.RoleType): AuthRoute.Route[] {
  const filterRoute = { ...route };
  const hasPermission = true;
  // !route.meta.permissions || permission === 'super' || route.meta.permissions.includes(permission);

  if (filterRoute.children) {
    const filterChildren = filterRoute.children.map(item => filterAuthRouteByUserPermission(item, permission)).flat(1);
    Object.assign(filterRoute, { children: filterChildren });
  }
  return hasPermission ? [filterRoute] : [];
}

export function filterRoutesByPermissions(routes: AuthRoute.Route[], permissions: string[]) {
  const tempRoutes = routes.map(route => filterRouteByPermissions(route, permissions)).flat(1);
  return tempRoutes.filter(item => {
    return item.children?.length && item.children?.length !== 0;
  });
}

function filterRouteByPermissions(route: AuthRoute.Route, permissions: string[]): AuthRoute.Route[] {
  const filterRoute = { ...route };
  const hasPermission = !route.meta.code || permissions.includes(route.meta.code);
  if (filterRoute.children) {
    const filterChildren = filterRoute.children.map(item => filterRouteByPermissions(item, permissions)).flat(1);
    Object.assign(filterRoute, { children: filterChildren });
  }
  return hasPermission ? [filterRoute] : [];
}

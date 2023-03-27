import type { App } from 'vue';
// createWebHistory
import { createRouter, createWebHashHistory } from 'vue-router';
import { transformAuthRoutesToVueRoutes, transformRouteNameToRoutePath } from '@/utils';
import { constantRoutes } from './routes';
import { scrollBehavior } from './helpers';
import { createRouterGuard } from './guard';
// VITE_HASH_ROUTE = 'Y'
const { VITE_BASE_URL } = import.meta.env;
// VITE_HASH_ROUTE === 'Y' ?
// : createWebHistory(VITE_BASE_URL),
export const router = createRouter({
  history: createWebHashHistory(VITE_BASE_URL),
  routes: transformAuthRoutesToVueRoutes(constantRoutes),
  scrollBehavior
});

/** setup vue router. - [安装vue路由] */
export async function setupRouter(app: App) {
  app.use(router);
  createRouterGuard(router);
  await router.isReady();
}

/** 路由名称 */
export const routeName = (key: AuthRoute.RouteKey) => key;
/** 路由路径 */
export const routePath = (key: Exclude<AuthRoute.RouteKey, 'not-found-page'>) => transformRouteNameToRoutePath(key);

export * from './routes';
export * from './modules';

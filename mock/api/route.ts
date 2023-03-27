import type { MockMethod } from 'vite-plugin-mock';
// import { routeModel, userModel } from '../model';

const apis: MockMethod[] = [
  {
    url: '/mock/getUserRoutes',
    method: 'post',
    response: (): Service.MockServiceResult => {
      // const { userId = undefined } = options.body;

      // const routeHomeName: AuthRoute.RouteKey = 'system-manage_first_second';

      // const role = userModel.find(item => item.userId === userId)?.userRole || 'user';

      // const filterRoutes = routeModel[role];

      return {
        code: 200,
        message: 'ok',
        data: {
          routes: [],
          home: ''
        }
      };
    }
  }
];

export default apis;

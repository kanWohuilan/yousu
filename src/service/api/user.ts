import { request } from '@/service/request';

export function fetchUserList(page?: PageParams, searchParams: any = {}) {
  return request.get<BasePage.Page<Auth.UserInfo>>('/api/user/page-list', {
    params: {
      'page.pageNumber': page?.pageNumber,
      'page.pageSize': page?.pageSize,
      ...searchParams
    }
  });
}

export function modifyUsersRole(userId: string, roleId: string) {
  return request.put('/api/user/role', { userId, roleId });
}

export function modifyUser(userInfo: Auth.UserInfo) {
  return request.put('/api/user', userInfo);
}

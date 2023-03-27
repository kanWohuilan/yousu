import { request } from '@/service/request';

export function fetchPermissionList(page?: PageParams) {
  return request.get<BasePage.Page<Auth.Permission>>('/api/permission/page-list', {
    params: {
      'page.pageNumber': page?.pageNumber,
      'page.pageSize': page?.pageSize
    }
  });
}

export function addPermission(permission: Auth.Permission) {
  return request.post<any>('/api/permission', permission);
}

export function removePermission(id: string) {
  return request.delete<any>('/api/permission', { params: { id } });
}

export function modifyPermission(permission: Auth.Permission) {
  return request.put<any>('/api/permission', permission);
}

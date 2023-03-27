import { request } from '@/service/request';

export function fetchroleList(page?: PageParams) {
  return request.get<BasePage.Page<Auth.Role>>('/api/role/page-list', {
    params: {
      'page.pageNumber': page?.pageNumber,
      'page.pageSize': page?.pageSize
    }
  });
}

export function addrole(data: Auth.Role) {
  return request.post<void>('/api/role', data);
}

export function editrole(data: Auth.Role) {
  return request.put<void>('/api/role', data);
}
export function deleterole(id: string) {
  return request.delete<void>('/api/role', { params: { id } });
}

export function getPermissions(id: string) {
  return request.get<any>('/api/role/permissions', { params: { roleId: id } });
}

export function modifyRolePermissions(roleId: string, permissionIds: string[]) {
  return request.put<void>('/api/role/permissions', { roleId, permissionIds });
}

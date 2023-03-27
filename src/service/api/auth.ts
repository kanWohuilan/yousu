import { request, mockRequest } from '../request';

/**
 * 获取验证码
 * @param phone - 手机号
 * @returns - 返回boolean值表示是否发送成功
 */
export function fetchSmsCode(phone: string) {
  return request.post<boolean>('/getSmsCode', { phone });
}

/**
 * 登录
 * @param userName - 用户名
 * @param password - 密码
 */
export function fetchLogin(userName: string, password: string) {
  const formData = new FormData();
  formData.append('username', userName);
  formData.append('password', password);

  return request.post<ApiAuth.Token>('/login', formData);
}

// eslint-disable-next-line max-params
export function fetchRegister(username: string, password: string, phoneNumber: string, nickname: string) {
  return request.post<any>('/api/user/register', { username, password, phoneNumber, nickname });
}
/** 获取用户信息 */
export function fetchUserInfo() {
  return request.get<any>('/api/user/current');
}

/**
 * 获取用户路由数据
 * @param userId - 用户id
 * @description 后端根据用户id查询到对应的角色类型，并将路由筛选出对应角色的路由数据返回前端
 */
export function fetchUserRoutes(userId: string) {
  return mockRequest.post<ApiRoute.Route>('/getUserRoutes', { userId });
}

/**
 * 刷新token
 * @param refreshToken
 */
export function fetchUpdateToken(refreshToken: string) {
  return request.post<ApiAuth.Token>('/updateToken', { refreshToken });
}

export function resetPassword(id: string, oldPassword: string, newPassword: string) {
  return request.post<any>('/api/user/password/reset', {
    id,
    newPassword,
    oldPassword
  });
}
export function fetchUserNameExist(username: string) {
  return request.get<{ data: boolean }>('/api/user/username/exist', {
    params: {
      checkedUsername: username
    }
  });
}

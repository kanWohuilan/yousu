import { request } from '@/service/request';

export function fetchSubletHouseApplyList(page?: PageParams) {
  return request.get<BasePage.Page<Customer.SubletHouseApply>>('/api/customer/sublet-house-apply/page-list', {
    params: {
      'page.pageNumber': page?.pageNumber,
      'page.pageSize': page?.pageSize
    }
  });
}

export function fetchSubletHouseApplyDetails(id: string) {
  return request.get<Customer.SubletHouseApply>('/api/customer/sublet-house-apply/detail', {
    params: {
      id
    }
  });
}

export function modifyPicture(params: any) {
  return request.put<any>('/api/customer/sublet-house-apply/pictures', params);
}

export function rejectApply(params: any) {
  return request.put<any>('/api/customer/sublet-house-apply/reject', params);
}

export function aggreeApply(id: string) {
  return request.put<any>('/api/customer/sublet-house-apply/agree', { id });
}

export function fetchsubletHouseList(page?: PageParams) {
  return request.get<BasePage.Page<Customer.SubletHouseApply>>('/api/customer/sublet-house/page-list', {
    params: {
      'page.pageNumber': page?.pageNumber,
      'page.pageSize': page?.pageSize
    }
  });
}

export function disLaunchSublet(id: string) {
  return request.put<any>('/api/customer/sublet-house/dis-launch', { id });
}

export function fetchSubletHouseDetails(id: string) {
  return request.get<Apartment.SubletHouse>('/api/customer/sublet-house/detail', {
    params: {
      id
    }
  });
}

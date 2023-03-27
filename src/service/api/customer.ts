import dayjs from 'dayjs';
import { request } from '@/service/request';

export function fetchCustomerList(page?: PageParams) {
  return request.get<BasePage.Page<Customer.Customer>>('/api/customer/page-list', {
    params: {
      'page.pageNumber': page?.pageNumber,
      'page.pageSize': page?.pageSize
    }
  });
}
export function fetchHouseApplyList(page?: PageParams, searchParams: any = {}) {
  return request.get<BasePage.Page<Customer.HouseApply>>('/api/customer/rent-house-apply/page-list', {
    params: {
      'page.pageNumber': page?.pageNumber,
      'page.pageSize': page?.pageSize,
      ...searchParams
    }
  });
}

export function fetchRentHouseApplyDetails(id: string) {
  return request.get<Customer.HouseApply>('/api/customer/rent-house-apply/detail', {
    params: {
      id
    }
  });
}

export function dispatchHanldePerson(id: string, handlePersonId: string) {
  return request.put('/api/customer/rent-house-apply/appoint/handle-person', {
    id,
    handlePersonId
  });
}

export function unSignHandle(id: string, handleResultRemark: string) {
  return request.put('/api/customer/rent-house-apply/un-sign-up', {
    id,
    handleResultRemark
  });
}

export function signHandle(params: any) {
  return request.put('/api/customer/rent-house-apply/sign-up', {
    id: params.id,
    customerPhoneNumber: params.customerPhoneNumber,
    beginTime: dayjs(params.beginTime).format('YYYY-MM-DD'),
    endTime: dayjs(params.endTime).format('YYYY-MM-DD'),
    weeklyPrice: params.weeklyPrice,
    signDate: params.signDate,
    remark: params.remark
  });
}

export function fetchSignOrderList(page?: PageParams, searchParams: any = {}) {
  return request.get<BasePage.Page<Customer.SignOrder>>('/api/customer/signing-order/page-list', {
    params: {
      'page.pageNumber': page?.pageNumber,
      'page.pageSize': page?.pageSize,
      ...searchParams
    }
  });
}

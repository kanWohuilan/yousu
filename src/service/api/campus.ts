import { request } from '@/service/request';

export function fetchCampusList(page?: PageParams, searchParams: any = {}) {
  return request.get<BasePage.Page<Apartment.Campus>>('/api/campus/page-list', {
    params: {
      'page.pageNumber': page?.pageNumber,
      'page.pageSize': page?.pageSize,
			...searchParams
    }
  });
}

export function addCampus(campus: Apartment.Campus) {
  return request.post<any>('/api/campus', campus);
}

export function removeCampus(id: string) {
  return request.delete<any>('/api/campus', { params: { id } });
}

export function modifyCampus(campus: Apartment.Campus) {
  return request.put<any>('/api/campus', campus);
}

export function fetchCampusDetails(id: string) {
  return request.get<Apartment.Campus>('/api/campus/detail', {
    params: {
      id
    }
  });
}

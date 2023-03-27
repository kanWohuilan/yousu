import { request } from '../request';

export function fetchIndexImage(page?: PageParams) {
  return request.get<BasePage.Page<IndexImg>>('/api/system/index-img', {
    params: {
      'page.pageNumber': page?.pageNumber,
      'page.pageSize': page?.pageSize
    }
  });
}
export function addIndexImage(indexImage: IndexImg) {
  return request.post<any>('/api/system/index-img', indexImage);
}

export function removeIndexImage(id: string) {
  return request.delete<any>('/api/system/index-img', { params: { id } });
}

export function modifyIndexImage(indexImage: IndexImg) {
  return request.put<any>('/api/system/index-img', indexImage);
}

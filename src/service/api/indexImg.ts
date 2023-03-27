import {request} from '@/service/request';

export function fetchIndexImgList(page?: PageParams) {
	return request.get<BasePage.Page<IndexImg>>('/api/system/index-img', {
		params: {
			'page.pageNumber': page?.pageNumber,
			'page.pageSize': page?.pageSize
		}
	});
}

export function addIndexImg(data: IndexImg) {
	return request.post<void>('/api/system/index-img', data);
}

export function editIndexImg(data: IndexImg) {
	return request.put<void>('/api/system/index-img', data);
}

export function deleteIndexImg(id: string) {
	return request.delete<void>('/api/system/index-img', {params: {id}});
}

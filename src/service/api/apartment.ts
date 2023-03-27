import type { AxiosRequestConfig } from 'axios';
import { request } from '@/service/request';

export function getApartmentList(page?: PageParams, searchParams: any = {}) {
  return request.get<BasePage.Page<Apartment.ApartmentVo>>('/api/apartment/page-list', {
    params: {
      'page.pageNumber': page?.pageNumber,
      'page.pageSize': page?.pageSize,
      ...searchParams
    }
  });
}

export function getApartmentDetails(id: string) {
  return request.get<Apartment.Apartment>('/api/apartment/details', {
    params: {
      id
    }
  });
}

export function addApartment(data: Apartment.ApartmentAdd) {
  return request.post<void>('/api/apartment', data);
}

export function editApartment(data: Apartment.ApartmentEdit) {
  return request.put<void>('/api/apartment', data);
}

export function deleteApartment(params: Apartment.ApartmentDelete) {
  const config = {
    params
  } as AxiosRequestConfig;
  return request.delete<void>('/api/apartment', config);
}

export function getTagList(page?: PageParams) {
  return request.get<BasePage.Page<Apartment.Tag>>('/api/apartment/tag/page-list', {
    params: {
      'page.pageNumber': page?.pageNumber,
      'page.pageSize': page?.pageSize
    }
  });
}

export function addTag(data: Apartment.Tag) {
  return request.post<void>('/api/apartment/tag', data);
}

export function editTag(data: Apartment.Tag) {
  return request.put<void>('/api/apartment/tag', data);
}

export function deleteTag(params: Apartment.Tag) {
  const config = {
    params
  } as AxiosRequestConfig;
  return request.delete<void>('/api/apartment/tag', config);
}

export function getAroundFacilityList(page?: PageParams) {
  return request.get<BasePage.Page<Apartment.AroundFacility>>('/api/apartment/around-facilities/page-list', {
    params: {
      'page.pageNumber': page?.pageNumber,
      'page.pageSize': page?.pageSize
    }
  });
}

export function addAroundFacility(data: Apartment.AroundFacility) {
  return request.post<void>('/api/apartment/around-facilities', data);
}

export function editAroundFacility(data: Apartment.AroundFacility) {
  return request.put<void>('/api/apartment/around-facilities', data);
}

export function deleteAroundFacility(params: Apartment.AroundFacility) {
  const config = {
    params
  } as AxiosRequestConfig;
  return request.delete<void>('/api/apartment/around-facilities', config);
}

export function getHouseTypeList(page?: PageParams) {
  return request.get<BasePage.Page<Apartment.HouseType>>('/api/apartment/house-type/page-list', {
    params: {
      'page.pageNumber': page?.pageNumber,
      'page.pageSize': page?.pageSize
    }
  });
}

export function addHouseType(data: Apartment.HouseType) {
  return request.post<void>('/api/apartment/house-type', data);
}

export function editHouseType(data: Apartment.HouseType) {
  return request.put<void>('/api/apartment/house-type', data);
}

export function deleteHouseType(params: Apartment.HouseType) {
  const config = {
    params
  } as AxiosRequestConfig;
  return request.delete<void>('/api/apartment/house-type', config);
}

export function getIndoorFacilityList(page?: PageParams) {
  return request.get<BasePage.Page<Apartment.IndoorFacility>>('/api/apartment/indoor-facilities/page-list', {
    params: {
      'page.pageNumber': page?.pageNumber,
      'page.pageSize': page?.pageSize
    }
  });
}

export function addIndoorFacility(data: Apartment.IndoorFacility) {
  return request.post<void>('/api/apartment/indoor-facilities', data);
}

export function editIndoorFacility(data: Apartment.IndoorFacility) {
  return request.put<void>('/api/apartment/indoor-facilities', data);
}

export function deleteIndoorFacility(params: Apartment.IndoorFacility) {
  const config = {
    params: {
      id: params.id
    }
  } as AxiosRequestConfig;
  return request.delete<void>('/api/apartment/indoor-facilities', config);
}

export function getCurrency() {
  return request.get<Apartment.Currency[]>('/api/apartment/enums/currency');
}

export function fetchApartmentHouseList(apartmentId: string, page?: PageParams) {
  return request.get<BasePage.Page<Apartment.ApartmentHouse>>('/api/apartment/apartment-house/page-list', {
    params: {
      'page.pageNumber': page?.pageNumber,
      'page.pageSize': page?.pageSize,
      apartmentId
    }
  });
}

export function addApartmentHouse(apartmentHouse: Apartment.ApartmentHouse) {
  apartmentHouse.currency = (apartmentHouse.currency as Apartment.Currency)?.code;
  return request.post<any>('/api/apartment/apartment-house', apartmentHouse);
}

export function removeApartmentHouse(id: string) {
  return request.delete<any>('/api/apartment/apartment-house', { params: { id } });
}

export function modifyApartmentHouse(apartmentHouse: Apartment.ApartmentHouse) {
  apartmentHouse.currency = (apartmentHouse.currency as Apartment.Currency)?.code;

  return request.put<any>('/api/apartment/apartment-house', apartmentHouse);
}

export function fetchApartmentHouseDetails(id: string) {
  return request.get<Apartment.ApartmentHouse>('/api/apartment/apartment-house/detail', {
    params: {
      id
    }
  });
}

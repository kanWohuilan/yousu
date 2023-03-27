import { request } from '@/service/request';

export function fetchCountry(page?: PageParams, searchParams: any = {}) {
  return request.get<BasePage.Page<CountryAndCity>>('/api/apartment/country/page-list', {
    params: {
      'page.pageNumber': page?.pageNumber,
      'page.pageSize': page?.pageSize,
      ...searchParams
    }
  });
}

export function addCountry(country: CountryAndCity) {
  return request.post<any>('/api/apartment/country', country);
}

export function removeCountry(id: string) {
  return request.delete<any>('/api/apartment/country', { params: { id } });
}

export function modifyCountry(country: CountryAndCity) {
  return request.put<any>('/api/apartment/country', country);
}

export function fetchCity(countryId?: string, page?: PageParams, searchParams: any = {}) {
  return request.get<BasePage.Page<CountryAndCity>>('/api/apartment/city/page-list', {
    params: {
      countryId,
      'page.pageNumber': page?.pageNumber,
      'page.pageSize': page?.pageSize,
      ...searchParams
    }
  });
}

export function addCity(countryId: string, city: CountryAndCity) {
  return request.post<any>('/api/apartment/city', { ...city, countryId });
}

export function removeCity(id: string) {
  return request.delete<any>('/api/apartment/city', { params: { id } });
}

export function modifyCity(countryId: string, city: CountryAndCity) {
  return request.put<any>('/api/apartment/city', { ...city, countryId });
}

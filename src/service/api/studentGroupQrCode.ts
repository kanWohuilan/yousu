import { request } from '../request';

export function fetchStudentGroupQrCode(page?: PageParams) {
  return request.get<BasePage.Page<StudentGroupQrCode>>('/api/system/student-qc-code', {
    params: {
      'page.pageNumber': page?.pageNumber,
      'page.pageSize': page?.pageSize
    }
  });
}
export function addStudentGroupQrCode(studentGroupQrCode: StudentGroupQrCode) {
  return request.post<any>('/api/system/student-qc-code', studentGroupQrCode);
}

export function removeStudentGroupQrCode(id: string) {
  return request.delete<any>('/api/system/student-qc-code', { params: { id } });
}

export function modifyStudentGroupQrCode(studentGroupQrCode: StudentGroupQrCode) {
  return request.put<any>('/api/system/student-qc-code', studentGroupQrCode);
}

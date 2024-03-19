import axios from 'axios'

export function fetchList() {
  return axios({
    url: '/patient/findAll',
    method: 'get'
  })
}

export function fetchByName(Pname) {
  return axios({
    url: '/patient/findByName',
    method: 'get',
    params: { Pname }
  })
}
export function createPatient(patients) {
  return axios({
    url: '/patient/insert',
    method: 'post',
    data: patients
  })
}

export function updatePatient(patients) {
  return axios({
    url: '/patient/update',
    method: 'post',
    data: patients
  })
}

export function deleteByPno(Pno) {
  return axios({
    url: '/patient/delete',
    method: 'post',
    params: { Pno }
  })
}

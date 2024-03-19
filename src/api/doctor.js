import axios from 'axios'

export function fetchByDno(Dno) {
  return axios({
    url: '/doctor',
    method: 'get',
    params: { Dno: Dno }
  })
}

export function fetchByName(Dname) {
  return axios({
    url: '/doctor/selectByname',
    method: 'get',
    params: { Dname }
  })
}
export function createDoctor(doctors) {
  return axios({
    url: '/doctor/insert',
    method: 'post',
    data: doctors
  })
}

export function updateDoctor(doctor) {
  return axios({
    url: '/doctor/UpDateDoctor',
    method: 'post',
    data: doctor
  })
}

export function deleteDoctor(Dno) {
  return axios({
    url: '/doctor/deleteDoctor',
    method: 'post',
    params: { Dno }
  })
}

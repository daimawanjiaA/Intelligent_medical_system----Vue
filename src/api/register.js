import axios from 'axios'

export function fetchByName(Pname) {
  return axios({
    url: '/register/selectAllByPnname',
    method: 'get',
    params: { Pname }
  })
}
export function deleteReg(id) {
  return axios({
    url: '/register/deleteByid',
    method: 'post',
    params: { id }
  })
}

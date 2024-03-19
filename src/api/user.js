import request from '@/utils/request'
import Axios from 'axios'

export function valid_Dno(Dno) {
  return Axios({
    url: '/doctor/valid',
    method: 'get',
    params: { Dno: Dno }
  })
}

export function login(data) {
  return request({
    url: '/vue-admin-template/user/login',
    method: 'post',
    data
  })
}

// 发送网络请求，获取用户信息，token传给后端
export function getInfo(token) {
  return request({
    url: '/vue-admin-template/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/vue-admin-template/user/logout',
    method: 'post'
  })
}

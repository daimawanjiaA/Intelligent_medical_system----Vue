import axios from 'axios'
export function deleteByMRno(MRno) {
  return axios({
    url: '/mr/delete',
    method: 'post',
    params: { MRno }
  })
}

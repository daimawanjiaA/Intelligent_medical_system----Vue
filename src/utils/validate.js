/**
 * Created by PanJiaChen on 16/11/18.
 */
import { fetchByDno } from '@/api/doctor'
/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}
/**
 * @param {string} str
 * @returns {Boolean}
 */
var valid = false
export function validUsername(str) {
  if (str === 'admin') { valid = true } else { validate(str) }
  return valid
}
async function validate(str) {
  await fetchByDno(str).then((Response) => {
    if (Response.data !== null) {
      valid = true
      window.localStorage.setItem('Dname', Response.data.dname)
    }
  })
}

export function validUsername_(str) {
  var valid = true
  return valid
}

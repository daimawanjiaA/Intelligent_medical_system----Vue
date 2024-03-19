import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    // 头像
    avatar: ''
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  }
}
const actions = {
  // 用户登录
  login({ commit }, userInfo) {
    window.localStorage.setItem('DDno', userInfo.username)
    console.log(userInfo.username)
    if (userInfo.username === 'admin') {
      window.localStorage.setItem('roles', 'admin')
    } else { window.localStorage.setItem('roles', 'doctor') }
    const { username, password } = { username: 'admin', password: 'userInfo.password' }
    return new Promise((resolve, reject) => {
      // 请求成功会得到对应的响应信息，把data取出来
      login({ username: username.trim(), password: password }).then(response => {
        console.log('response' + response.data)
        const { data } = response
        // token用来做登陆验证的。  commit会触发mutation
        commit('SET_TOKEN', data.token)
        // 本地化，
        setToken(data.token)
        resolve()
        // resetRouter()
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 得到用户信息
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response

        if (!data) {
          return reject('Verification failed, please Login again.')
        }

        const { name, avatar } = data

        commit('SET_NAME', name)
        commit('SET_AVATAR', avatar)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 用户登出
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}


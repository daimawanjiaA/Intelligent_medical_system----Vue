// 导航守卫，路由导航涉及的，所有路由的跳转都要经过这个配置文件
import router from './router'
import store from './store'
import {
  Message
} from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import {
  getToken
} from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({
  showSpinner: false
}) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist

// 一旦加入下面的算法，所有路由都会经过他，next是否要放行
router.beforeEach(async(to, from, next) => {
  // start progress bar 进度条
  NProgress.start()

  // set page title 设置标题
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in 对应auth.js中的setToken，这是去取
  const hasToken = getToken()

  if (hasToken) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page 如果有token，且想去登录，直接跳转
      next({
        path: '/'
      })
      // 关闭进度条
      NProgress.done()
    } else {
      // 如果不想登录，取出名称
      const hasGetUserInfo = store.getters.name
      if (hasGetUserInfo) {
        // 如果有，放行
        next()
      } else {
        // 否则，请求用户信息
        try {
          // get user info
          await store.dispatch('user/getInfo')

          next()
        } catch (error) {
          // remove token and go to login page to re-login
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    /* 如果没有，看一下白名单，在白名单（只有登录页面）里面，放行。token has no token */

    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // redirect记录了用户原本想去的界面 other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})

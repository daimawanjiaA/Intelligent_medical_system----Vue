import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

var hidden = true
/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
// location.reload()
var role = window.localStorage.getItem('roles')
if (role === 'admin') { hidden = false }

export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    // @指的src目录下
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'dashboard' }
    }]
  },
  {
    path: '/admin_doctor',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'doctorTable',
      name: 'DoctorTable',
      hidden: hidden,
      component: () => import('@/views/table/admin/doctor'),
      meta: { title: '医生信息管理', icon: 'table' }
    }]
  },
  {
    path: '/admin_patient',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'patientTable',
      name: 'PatientTable',
      hidden: hidden,
      component: () => import('@/views/table/patient'),
      meta: { title: '患者信息管理', icon: 'table' }
    }]
  },
  {
    path: '/admin_emr',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'emrTable',
      name: 'EMRTable-3',
      hidden: hidden,
      component: () => import('@/views/table/admin/EMR'),
      meta: { title: '患者病历管理 ', icon: 'table', visiable: true, roles: 'doctor' }
    }]
  },
  {
    path: '/example1',
    component: Layout,
    redirect: '/example1/table',
    hidden: !hidden,
    name: 'Example',
    meta: { title: '患者模块', icon: 'el-icon-s-help' },
    // hidden: true,
    children: [
      {
        path: 'table1-2',
        name: 'Table1-2',
        component: () => import('@/views/table/patient'),
        meta: { title: '患者信息一览', icon: 'table' }
      },
      {
        path: 'table1-3',
        name: 'Table1-3',
        component: () => import('@/views/table/complex'),
        meta: { title: '患者病历信息 ', icon: 'table', visiable: true, roles: 'doctor' }
      },
      {
        path: 'tree',
        name: 'Tree',
        component: () => import('@/views/tree/index'),
        meta: { title: '图', icon: 'tree' }
      }
    ]
  },
  {
    path: '/register',
    component: Layout,
    redirect: '/register/table',
    name: 'Example',
    hidden: !hidden,
    meta: { title: '预约模块', icon: 'el-icon-s-help' },
    children: [
      {
        path: 'table2-1',
        name: 'table2-1',
        component: () => import('@/views/table/register/register0'),
        meta: { title: '未确认预约', icon: 'table' }
      },
      {
        path: 'table2-2',
        name: 'Table2-2',
        component: () => import('@/views/table/register/register1'),
        meta: { title: '已确认预约', icon: 'table' }
      },
      {
        path: 'table2-3',
        name: 'Table2-3',
        component: () => import('@/views/table/register/register2'),
        meta: { title: '已完成预约', icon: 'table' }
      },
      {
        path: 'table2-4',
        name: 'Table2-4',
        component: () => import('@/views/table/register/register3'),
        meta: { title: '已拒绝预约', icon: 'table' }
      }
    ]
  },
  {
    path: '/admin_register',
    component: Layout,
    redirect: '/admin_register',
    children: [{
      path: 'registerTable',
      name: 'RegisterTable',
      hidden: hidden,
      component: () => import('@/views/table/admin/register'),
      meta: { title: '预约信息一览', icon: 'table' }
    }]
  },
  {
    path: 'external-link',
    component: Layout,
    children: [
      {
        path: 'https://panjiachen.github.io/vue-element-admin-site/#/',
        meta: { title: '相关链接', icon: 'link' }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support

  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router

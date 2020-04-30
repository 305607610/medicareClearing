import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home'),
    redirect: '/dashboard',
    children: [
      {
        path: '/dashboard',
        name: 'DashBoard',
        component: () => import('../components/DashBoard')
      },
      {
        path: '/userlist',
        name: 'UserList',
        component: () => import('../components/UserList')
      },
      {
        path: '/patientlist',
        name: 'PatientList',
        component: () => import('../components/PatientList')
      },
      {
        path: '/hoslist',
        name: 'HosList',
        component: () => import('../components/HosList')
      },
      {
        path: '/organlist',
        name: 'OrganList',
        component: () => import('../components/OrganList')
      },
      {
        path: '/icardlist',
        name: 'ICardList',
        component: () => import('../components/ICardList')
      },
      {
        path: '/druglist',
        name: 'DrugList',
        component: () => import('../components/DrugList')
      },
      {
        path: '/examine',
        name: 'Examine',
        component: () => import('../components/Examine')
      },
      {
        path: '/costentry',
        name: 'CostEntry',
        component: () => import('../components/CostEntry')
      },
      {
        path: '/payorder',
        name: 'PayOrder',
        component: () => import('../components/PayOrder')
      },
      {
        path: '/clearorder',
        name: 'ClearOrder',
        component: () => import('../components/ClearOrder')
      }
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login')
  },
  {
    path: '*',
    name: 'NotFound',
    component: () => import('../views/NotFound')
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  if (to.path === '/login') {
    return next()
  }
  const token = localStorage.getItem('token')
  if (!token) {
    return next('/login')
  }
  next()
})

export default router

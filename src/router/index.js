import Vue from 'vue'
import Router from 'vue-router'
import Tasks from '../views/tasks'
import Task from '../views/task'

Vue.use(Router)

export default new Router(
  {
    mode: 'history',
    routes: [
      {
        path: '/',
        redirect: '/tasks',
      },
      {
        path: '/tasks',
        component: Tasks,
      },
      {
        path: '/task/:taskId',
        component: Task,
        props: true
      }
    ],
    scrollBehavior(to, from, savedPosition) {
      if (savedPosition) {
        return savedPosition
      } else {
        return { x: 0, y: 0 }
      }
    }
  }
)

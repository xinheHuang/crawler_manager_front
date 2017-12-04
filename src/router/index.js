import Vue from 'vue'
import Router from 'vue-router'
import WorkFlows from '../views/main/workflows'
import WorkFlow from '../views/main/workflow'
import ExecutorGroups from '../views/main/executorGroups'
import Login from '../views/login'
import Main from '../views/main'

Vue.use(Router)

export default new Router(
  {
    // mode: 'history',
    routes: [
      {
        path: '/',
        redirect: '/main',
      },
      {
        path: '/login',
        name: 'login',
        component: Login,
      },
      {
        path: '/main',
        redirect: '/workflows',
        component: Main,
        children: [
          {
            path: '/workflows',
            name:'workflows',
            component: WorkFlows,
          },
          {
            path: '/workflow/:workflowId',
            component: WorkFlow,
            props: true
          },
          {
            path: '/executorGroups',
            name:'executorGroups',
            component: ExecutorGroups,
          },
        ]
      },
      //
      // {
      //   path: '/tasks',
      //   component: Tasks,
      // },
      // {
      //   path: '/task/:taskId',
      //   component: Task,
      //   props: true
      // }
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

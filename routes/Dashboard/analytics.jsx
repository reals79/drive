import Analytics from '~/views/Dashboard/Analytics'
import Landing from '~/views/Dashboard/Analytics/Landing'

const dashboardRoutes = [
  {
    path: '/analytics',
    to: '/analytics',
    name: 'Analytics',
    component: Landing,
  },
]

export default dashboardRoutes

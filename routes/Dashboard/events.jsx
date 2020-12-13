import Landing from '~/views/Dashboard/Events/Landing'

const eventsRoutes = [
  {
    path: '/events',
    to: '/auth/login',
    name: 'Events',
    component: Landing,
  },
]

export default eventsRoutes

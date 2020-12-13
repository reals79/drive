import Profile from '~/views/Dashboard/Community/Profile'
import { UserRoles } from '~/services/config'

const individualRoutes = [
  {
    path: '/in/:username/:tab',
    auth: false,
    title: 'Me',
    name: 'me',
    header: false,
    component: Profile,
    show: true,
    permission: UserRoles.EMPLOYEE,
  },
]

export default individualRoutes

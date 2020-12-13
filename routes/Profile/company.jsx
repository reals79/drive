import Profile from '~/views/Profile/Company/Profile'
import { UserRoles } from '~/services/config'

const companyRoutes = [
  {
    path: '/company/:id/:tab',
    auth: false,
    title: 'About',
    name: 'about',
    header: false,
    component: Profile,
    show: true,
    permission: UserRoles.EMPLOYEE,
  },
  {
    path: '/company/:id/:tab/:field',
    auth: false,
    title: 'About',
    name: 'about',
    header: false,
    component: Profile,
    show: true,
    permission: UserRoles.EMPLOYEE,
  },
]

export default companyRoutes

import SignIn from '~/layouts/SignIn'
import Register from '~/layouts/Register'
import Manage from '~/views/Dashboard/Manage'
import Develop from '~/views/Dashboard/Develop'
import Analytics from '~/views/Dashboard/Analytics'
import VendorRatings from '~/views/Dashboard/VendorRatings'
import Events from '~/views/Dashboard/Events'
import Community from '~/views/Dashboard/Community'
import Company from '~/views/Profile/Company'
import Individual from '~/views/Profile/Individual'

const dashboardRoutes = [
  {
    path: '/auth/login',
    name: 'SignIn',
    component: SignIn,
  },
  {
    path: '/auth/register',
    name: 'register',
    component: Register,
  },
  {
    path: '/hcm',
    name: 'HCM',
    component: Manage,
  },
  {
    path: '/library',
    name: 'Library',
    component: Develop,
  },
  {
    path: '/analytics',
    name: 'Analytics',
    component: Analytics,
  },
  {
    path: '/community',
    name: 'Community',
    component: Community,
  },
  {
    path: '/vendor-ratings',
    name: 'Vendor Ratings',
    component: VendorRatings,
  },
  {
    path: '/events',
    name: 'Events',
    component: Events,
  },
  {
    path: '/company',
    name: 'Company',
    component: Company,
  },
  {
    path: '/in',
    name: 'Individual',
    component: Individual,
  },
  {
    redirect: true,
    path: '/dashboard',
    to: '/develop',
    name: 'Dashboard',
  },
  {
    redirect: true,
    path: '/',
    to: '/hcm',
    name: 'Dashboard',
  },
]

export default dashboardRoutes

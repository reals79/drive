import { UserRoles } from '~/services/config'
import Home from '~/views/Dashboard/Community/Home'
import Profile from '~/views/Dashboard/Community/Profile'
import Blogs from '~/views/Dashboard/Community/Blogs'
import Forums from '~/views/Dashboard/Community/Forums'
import DepartmentFeed from '~/views/Dashboard/Community/Forums/DepartmentFeed'
import IndividualTopic from '~/views/Dashboard/Community/Forums/IndividualTopic'
import Network from '~/views/Dashboard/Community/Network'
import Landing from '~/views/Dashboard/VendorRatings/Landing'

const communityRoutes = [
  {
    path: '/community/community',
    auth: false,
    title: 'Community',
    name: 'community',
    header: true,
    show: true,
    permission: UserRoles.EMPLOYEE,
  },
  {
    path: '/community/home',
    auth: false,
    title: 'Home',
    name: 'home',
    header: false,
    component: Home,
    show: true,
    permission: UserRoles.EMPLOYEE,
  },
  {
    redirect: true,
    auth: false,
    path: '/community/profile',
    to: '/community/profile/about',
    title: 'Profile',
    name: 'profile',
    show: true,
    permission: UserRoles.EMPLOYEE,
  },
  {
    path: '/community/profile/:tab',
    auth: false,
    title: 'Profile',
    name: 'profile',
    header: false,
    component: Profile,
    show: false,
    permission: UserRoles.EMPLOYEE,
  },
  {
    path: '/community/blogs',
    auth: false,
    title: 'Blogs',
    name: 'blogs',
    header: false,
    component: Blogs,
    show: true,
    permission: UserRoles.EMPLOYEE,
  },
  {
    path: '/community/forums',
    auth: false,
    title: 'Forums',
    name: 'forum',
    header: false,
    component: Forums,
    show: true,
    permission: UserRoles.EMPLOYEE,
  },
  {
    path: '/community/forums/:topicId/:departId',
    auth: false,
    title: 'Forums',
    name: 'forum',
    header: false,
    component: IndividualTopic,
    show: false,
    permission: UserRoles.EMPLOYEE,
  },
  {
    path: '/community/forum-topic/:topicId/:departId',
    auth: false,
    title: 'Forums',
    name: 'forum',
    header: false,
    component: IndividualTopic,
    show: false,
    permission: UserRoles.EMPLOYEE,
  },
  {
    path: '/community/network',
    auth: true,
    title: 'Network',
    name: 'network',
    header: false,
    component: Network,
    show: true,
    permission: UserRoles.EMPLOYEE,
  },
  {
    path: '/community/forum-department-feed/:departId',
    auth: false,
    title: '',
    name: '',
    header: false,
    component: DepartmentFeed,
    show: true,
    permission: UserRoles.EMPLOYEE,
  },
  {
    redirect: true,
    path: '/community',
    to: '/community/home',
    name: 'community',
    component: Landing,
    permission: UserRoles.EMPLOYEE,
  },
]

export default communityRoutes

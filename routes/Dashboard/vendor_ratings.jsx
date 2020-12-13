import Home from '~/views/Dashboard/VendorRatings/Home'
import ByCategory from '~/views/Dashboard/VendorRatings/ByCategory'
import ByCategoryDetail from '~/views/Dashboard/VendorRatings/ByCategoryDetail'
import ByCompany from '~/views/Dashboard/VendorRatings/ByCompany'
import ByName from '~/views/Dashboard/VendorRatings/ByName'
import RateVendor from '~/views/Dashboard/VendorRatings/RateVendor'
import AddVendor from '~/views/Dashboard/VendorRatings/AddVendor'
import BuyerGuide from '~/views/Dashboard/VendorRatings/BuyerGuide'
import DealerSatisfactionAward from '~/views/Dashboard/VendorRatings/DealerSatisfactionAward'
import FAQ from '~/views/Dashboard/VendorRatings/FAQ'
import VendorSearch from '~/views/Dashboard/VendorRatings/VendorSearch'
import Landing from '~/views/Dashboard/VendorRatings/Landing'
import CompanyMgt from '~/views/Dashboard/VendorRatings/CompanyMgt'
import ContentMgt from '~/views/Dashboard/VendorRatings/ContentMgt'
import FeaturedContent from '~/views/Dashboard/VendorRatings/FeaturedContent'
import UserMgt from '~/views/Dashboard/VendorRatings/UserMgt'
import VRCategoryMgt from '~/views/Dashboard/VendorRatings/VRCategoryMgt'
import VRRatingMgt from '~/views/Dashboard/VendorRatings/VRRatingMgt'
import { UserRoles } from '~/services/config'

const vendorRoutes = [
  {
    path: '/vendor-ratings/vendor-ratings',
    auth: false,
    title: 'Vendor Ratings',
    name: 'Vendor Ratings',
    header: true,
    show: true,
    permission: UserRoles.EMPLOYEE,
  },
  {
    path: '/vendor-ratings/home',
    auth: false,
    title: 'Home',
    name: 'home',
    header: false,
    component: Home,
    show: true,
    permission: UserRoles.EMPLOYEE,
  },
  {
    path: '/vendor-ratings/by-category',
    auth: false,
    title: 'By Category',
    name: 'by-category',
    header: false,
    component: ByCategory,
    show: true,
    permission: UserRoles.EMPLOYEE,
  },
  {
    path: '/vendor-ratings/by-category/:id',
    auth: false,
    title: 'By Category Detail',
    name: 'by-category-detail',
    header: false,
    component: ByCategoryDetail,
    show: false,
    permission: UserRoles.EMPLOYEE,
  },
  {
    path: '/vendor-ratings/by-company',
    auth: false,
    title: 'By Company',
    name: 'by-company',
    header: false,
    component: ByCompany,
    show: true,
    permission: UserRoles.EMPLOYEE,
  },
  {
    path: '/vendor-ratings/dealer-satisfaction-award',
    auth: false,
    title: 'Dealer Satisfaction Award',
    name: 'dealer-satisfaction-award',
    header: false,
    component: DealerSatisfactionAward,
    show: true,
    permission: UserRoles.EMPLOYEE,
  },
  {
    path: '/vendor-ratings/buyer-guide',
    auth: true,
    title: `Buyer's Guide`,
    name: 'buyer-guide',
    header: false,
    component: BuyerGuide,
    show: true,
    permission: UserRoles.EMPLOYEE,
  },
  // {
  //   path: '/vendor-ratings/by-name',
  //   auth: true,
  //   title: 'By Name',
  //   name: 'by-name',
  //   header: false,
  //   component: ByName,
  //   show: true,
  //   permission: UserRoles.EMPLOYEE,
  // },
  // {
  //   path: '/vendor-ratings/rate-vendor',
  //   auth: true,
  //   title: 'Rate a Vendor',
  //   name: 'rate-vendor',
  //   header: false,
  //   component: RateVendor,
  //   show: true,
  //   permission: UserRoles.EMPLOYEE,
  // },
  // {
  //   path: '/vendor-ratings/add-vendor',
  //   auth: true,
  //   title: 'Add a Vendor',
  //   name: 'add-vendor',
  //   header: false,
  //   component: AddVendor,
  //   show: true,
  //   permission: UserRoles.ADMIN,
  // },
  {
    path: '/vendor-ratings/faq',
    auth: true,
    title: 'FAQ',
    name: 'faq',
    header: false,
    component: FAQ,
    show: true,
    permission: UserRoles.EMPLOYEE,
  },
  {
    path: '/vendor-ratings/search',
    auth: true,
    title: 'Search Result',
    name: 'search-result',
    header: false,
    component: VendorSearch,
    show: false,
    permission: UserRoles.EMPLOYEE,
  },
  {
    redirect: true,
    path: '/vendor-ratings',
    to: '/vendor-ratings/home',
    name: 'Vendor Ratings',
    component: Landing,
    permission: UserRoles.EMPLOYEE,
  },
  {
    path: '/vendor-ratings/super-admin',
    auth: false,
    title: 'Super Admin',
    name: 'Super Admin',
    header: true,
    show: true,
    permission: UserRoles.SUPER_ADMIN,
  },
  {
    path: '/vendor-ratings/company-mgt',
    auth: false,
    title: 'Company Mgt',
    name: 'Company Mgt',
    header: false,
    component: CompanyMgt,
    show: true,
    permission: UserRoles.SUPER_ADMIN,
  },
  {
    path: '/vendor-ratings/content-mgt',
    auth: false,
    title: 'Content Mgt',
    name: 'Content Mgt',
    header: false,
    component: ContentMgt,
    show: true,
    permission: UserRoles.SUPER_ADMIN,
  },
  {
    path: '/vendor-ratings/featured-content',
    auth: false,
    title: 'Featured Content',
    name: 'Featured Content',
    header: false,
    component: FeaturedContent,
    show: true,
    permission: UserRoles.SUPER_ADMIN,
  },
  {
    path: '/vendor-ratings/user-mgt',
    auth: false,
    title: 'User Mgt',
    name: 'User Mgt',
    header: false,
    component: UserMgt,
    show: true,
    permission: UserRoles.SUPER_ADMIN,
  },
  {
    path: '/vendor-ratings/vr-category-mgt',
    auth: false,
    title: 'VR Category Mgt',
    name: 'VR Category Mgt',
    header: false,
    component: VRCategoryMgt,
    show: true,
    permission: UserRoles.SUPER_ADMIN,
  },
  {
    path: '/vendor-ratings/vr-rating-mgt',
    auth: false,
    title: 'VR Rating Mgt',
    name: 'VR Rating Mgt',
    header: false,
    component: VRRatingMgt,
    show: true,
    permission: UserRoles.SUPER_ADMIN,
  },
]

export default vendorRoutes

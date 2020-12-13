import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { filter, isEmpty } from 'ramda'
import {
  CommunityBlogs,
  CommunitySlider,
  DepartmentForum,
  PremiumBlogs,
  RecentDepartment,
  RecentForum,
  FeaturedDepartments,
  Pagination,
} from '@components'
import AppActions from '~/actions/app'
import CompanyActions from '~/actions/company'
import CommunityActions from '~/actions/community'
import VendorActions from '~/actions/vendor'
import CommunityHeader from '~/views/Dashboard/Community/Header'
import './Home.scss'

class Home extends Component {
  componentDidMount() {
    this.props.getDepartments()
    this.props.getBlogs({ per_page: 30, page: 1 })
    if (this.props.authenticated) {
      const payload = { userId: this.props.user?.community_user?.id }
      this.props.fetchRecentBlogs(payload)
      this.props.getEditFeaturedItems()
    } else {
      this.props.getFeaturedItems()
    }
    this.props.getTopics({ category_id: 10, order: 'recent' })
    this.props.getCategories()
  }

  handleMenu = (event, item, page, perPage) => {
    if (event === 'edit') {
      this.props.toggleModal({
        type: 'Add Forum',
        data: { before: { topic: item, event: event, page: page, perPage: perPage } },
        callBack: null,
      })
    }
  }

  handlePagination = (page, per_page = 10) => {
    this.props.getBlogs({ category_id: 10, exclusive: 1, page, per_page })
  }

  render() {
    const { departments, featuredItems, forumBlogs, userRole, userName, topics } = this.props
    const premiumPosts = forumBlogs?.posts?.data ? filter(x => x.data?.exclusive, forumBlogs.posts.data) : []
    const communityPosts = forumBlogs?.posts?.data
      ? filter(x => !x.data?.exclusive && x.data?.approved, forumBlogs.posts.data)
      : []

    return (
      <div className="community-home">
        <CommunityHeader activeRoute="Home" />
        <CommunitySlider data={featuredItems} />
        <div className="row">
          <div className="col-6">
            <FeaturedDepartments title="Featured CRM" departments={departments} />
            <PremiumBlogs data={premiumPosts} title="Premium Blogs" />
            <CommunityBlogs data={communityPosts} title="Community Blogs" />
            <Pagination
              current={forumBlogs?.posts?.current_page}
              pers={[]}
              per={forumBlogs?.posts?.per_page}
              total={forumBlogs?.posts?.last_page}
              onChange={e => this.handlePagination(e)}
            />
          </div>
          <div className="col-6">
            <RecentForum
              title="Forum Activity"
              recentTopic={topics?.topics?.data || []}
              displayMenu
              userRole={userRole}
              userName={userName}
              page={1}
              perPage={10}
              onMenu={this.handleMenu}
            />
            <DepartmentForum title="Department Forums" departments={departments} />
            {departments.map((department, index) => (
              <RecentDepartment key={index} department={department} />
            ))}
          </div>
        </div>
      </div>
    )
  }
}

Home.propTypes = {
  authenticated: PropTypes.bool,
  user: PropTypes.shape({ id: PropTypes.number }),
  userName: PropTypes.string,
  userRole: PropTypes.number,
  departments: PropTypes.array,
  forumBlogs: PropTypes.shape({
    appends: PropTypes.shape({ categories: PropTypes.array }),
    posts: PropTypes.shape({ data: PropTypes.array }),
  }),
  featuredItems: PropTypes.array,
}

Home.defaultProps = {
  authenticated: false,
  user: { id: 0 },
  userName: '',
  userRole: 5,
  departments: [],
  forumBlogs: { appends: { categories: [] }, posts: { data: [] } },
  featuredItems: [],
}

const mapStateToProps = state => ({
  authenticated: !isEmpty(state.app.token),
  user: state.app.user,
  userName: state.app.first_name + ' ' + state.app.last_name,
  userRole: state.app.app_role_id,
  departments: state.company.blogCategories,
  forumBlogs: state.community.recentBlogs,
  featuredItems: state.community.featuredItems,
  topics: state.community.topics['10'],
})

const mapDispatchToProps = dispatch => ({
  getBlogs: e => dispatch(CommunityActions.getcomblogpostsRequest(e)),
  getCategories: () => dispatch(VendorActions.getcategoriesRequest()),
  getDepartments: () => dispatch(CompanyActions.getblogcategoriesRequest()),
  getEditFeaturedItems: () => dispatch(CommunityActions.geteditfeatureditemsRequest()),
  getFeaturedItems: () => dispatch(CommunityActions.getfeatureditemsRequest()),
  getTopics: e => dispatch(CommunityActions.gettopicsRequest(e)),
  fetchRecentBlogs: payload => dispatch(CommunityActions.getcommunityblogRequest(payload)),
  toggleModal: e => dispatch(AppActions.modalRequest(e)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Home)

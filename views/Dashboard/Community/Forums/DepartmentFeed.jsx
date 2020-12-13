import React from 'react'
import { connect } from 'react-redux'
import { Icon, Pagination } from '@components'
import { history } from '~/reducers'
import AppActions from '~/actions/app'
import CommunityActions from '~/actions/community'
import { ForumDepartmentIcons } from '~/services/config'
import CommunityHeader from '~/views/Dashboard/Community/Header'
import TopicList from './TopicList'
import './Forums.scss'

class DepartmentFeed extends React.Component {
  state = {
    departmentId: this.props.match.params.departId,
    page: 1,
    perPage: 10,
  }

  componentDidMount() {
    const { departmentId } = this.state
    this.props.getTopics({ category_id: departmentId, order: 'recent', page: 1, per_page: 10 })
  }

  handlePagination = page => {
    const { perPage, departmentId } = this.state
    this.props.getTopics({ category_id: departmentId, order: 'recent', page: page, per_page: perPage })
    this.setState({ page })
  }

  handlePer = perPage => {
    const { page, departmentId } = this.state
    this.props.getTopics({ category_id: departmentId, order: 'recent', page: page, per_page: perPage })
    this.setState({ perPage })
  }

  handleToggleModal = () => {
    this.props.toggleModal({ type: 'Add Forum', data: null, callBack: null })
  }

  render() {
    const { departments, topics } = this.props
    const { departmentId } = this.state
    const departmentData = departments?.filter(item => item.id == departmentId)[0] || []
    const data = topics[departmentId]?.topics

    return (
      <div className="community-forum">
        <CommunityHeader
          activeRoute="Forums"
          childRoute={departmentData.name}
          backTitle="Back to all forums"
          onBack={() => history.goBack()}
          onModal={this.handleToggleModal}
        />
        <div className="popular-forum-category pb-3 mb-2">
          <div className="dsl-b22 bold category-title">{departmentData.name}</div>
          <div className="back-hover-space">
            <div className="list-item mt-2 pb-2">
              <div className="d-flex-3">
                <span className="dsl-m12 text-400">Department</span>
              </div>
              <div className="d-flex-1 text-right">
                <span className="dsl-m12 text-400"># posts</span>
              </div>
              <div className="d-flex-1" />
              <div className="d-flex-3">
                <span className="dsl-m12 text-400">Stats</span>
              </div>
              <div className="d-flex-4">
                <span className="dsl-m12 text-400">Latest Post</span>
              </div>
            </div>
            <div className="list-item pb-2">
              <div className="d-flex-3 d-flex">
                <Icon name={ForumDepartmentIcons[departmentData.id]} size={13} color="#969faa" className="mr-3" />
                <span className="dsl-b16">{departmentData.name}</span>
              </div>
              <div className="d-flex-1 text-right">
                <span className="dsl-b16">{departmentData?.data?.stats?.blog_posts_abbr}</span>
              </div>
              <div className="d-flex-1" />
              <div className="d-flex-3">
                <Icon name="far fa-eye mr-2 text-500" size={12} color="#969faa" />
                <span className="dsl-d14 mr-3 text-400">{departmentData?.data?.stats?.forum__views_abbr}</span>
                <Icon name="fal fa-thumbs-up mr-2 text-500" size={12} color="#969faa" />
                <span className="dsl-d14 mr-3 text-400">{departmentData?.data?.stats?.forum_discussions}</span>
                <Icon name="far fa-comment mr-2 text-500" size={12} color="#969faa" />
                <span className="dsl-d14 text-400">{departmentData?.data?.stats?.blog__comments_abbr}</span>
              </div>
              <div className="d-flex-4 truncate-one">
                <span className="dsl-b16">{departmentData?.latest[0]?.name}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="popular-forum-category pb-4">
          <div className="d-flex mb-4 category-title">
            <div className="dsl-b22 bold d-flex-4 ">Recent Topics</div>
            <div
              className="dsl-p14 text-400 mr-2"
              onClick={() =>
                this.props.toggleModal({
                  type: 'Add Forum',
                  data: null,
                  callBack: null,
                })
              }
            >
              ADD TOPIC
            </div>
          </div>
          <div className="main-wrapper">
            <TopicList data={data?.data} departmentName={departmentData.name} />
          </div>
          <Pagination
            current={data?.current_page}
            total={Math.ceil(data?.last_page)}
            onChange={this.handlePagination}
            onPer={this.handlePer}
          />
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  departments: state.company.blogCategories,
  topics: state.community.topics,
})

const mapDispatchToProps = dispatch => ({
  getTopics: e => dispatch(CommunityActions.gettopicsRequest(e)),
  toggleModal: e => dispatch(AppActions.modalRequest(e)),
})

export default connect(mapStateToProps, mapDispatchToProps)(DepartmentFeed)

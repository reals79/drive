import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Tabs, Tab } from 'react-bootstrap'
import { Button, Pagination } from '@components'
import AppActions from '~/actions/app'
import CommunityActions from '~/actions/community'
import CommunityHeader from '~/views/Dashboard/Community/Header'
import TopicList from './TopicList'
import Department from './Department'
import './Forums.scss'

class Forums extends Component {
  state = {
    page: 1,
    perPage: 10,
    activeTab: 'recent',
  }

  componentDidMount() {
    this.props.getTopics({ category_id: 10, order: 'recent' })
  }

  handleAddForum = () => {
    this.props.toggleModal({ type: 'Add Forum', data: null, callBack: null })
  }

  handlePagination = e => {
    const payload = { category_id: 10, order: 'recent', page: e, per_page: 10 }
    this.props.getTopics(payload)
    this.setState({ page: e })
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

  render() {
    const { departments, topics, history, userRole, userName, activeTab } = this.props
    const { page, perPage } = this.state
    return (
      <div className="community-forum">
        <CommunityHeader activeRoute="Forums" searchTitle="Topic" onModal={this.handleAddForum} />
        <div className="popular-forum-category">
          <div className="dsl-b22 bold d-flex px-3">Forums</div>
          <Tabs
            className="px-3"
            id="community-forums"
            defaultActiveKey="recent"
            activeKey={activeTab}
            onSelect={e => this.setState({ activeTab: e })}
          >
            <Tab key="recent" eventKey="recent" title="Recent">
              <>
                <TopicList
                  data={topics?.topics?.data}
                  displayMenu={true}
                  userRole={userRole}
                  userName={userName}
                  page={page}
                  perPage={perPage}
                  onMenu={this.handleMenu}
                />
                <div className="d-flex justify-content-between pb-3 pr-3">
                  <Pagination
                    current={page}
                    per={perPage}
                    pers={[]}
                    total={topics?.topics?.last_page}
                    onChange={this.handlePagination}
                  />
                  <Button name="ADD TOPIC" onClick={() => this.handleAddForum} />
                </div>
              </>
            </Tab>
            <Tab key="department" eventKey="department" title="By Department">
              <Department departments={departments} history={history} onAdd={this.handleAddForum} />
            </Tab>
          </Tabs>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  userName: state.app.first_name + ' ' + state.app.last_name,
  userRole: state.app.app_role_id,
  departments: state.company.blogCategories,
  topics: state.community.topics['10'],
})

const mapDispatchToProps = dispatch => ({
  getTopics: e => dispatch(CommunityActions.gettopicsRequest(e)),
  toggleModal: e => dispatch(AppActions.modalRequest(e)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Forums)

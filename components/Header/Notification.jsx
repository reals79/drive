import React, { Component } from 'react'
import PropTypes from 'prop-types'
import InfiniteScroll from 'react-infinite-scroll-component'
import { Row, Col } from 'react-bootstrap'
import { equals, length, toLower, clone } from 'ramda'
import moment from 'moment'
import { Icon, Dropdown, EditDropdown, Button, Avatar } from '@components'
import { SortOptions, NotificationIcons, NOTIFICATION_STATUSES, InitialNotificationSettings } from '~/services/config'
import './Header.scss'

const TASK = {
  id: 0,
  parent_id: null,
  card_template_id: null,
  card_type_id: 8,
  feed_id: 0,
  status: 0,
  data: {
    name: '',
    type: 'single',
    due_date: 0,
    attachment: [],
    company_id: 5,
    description: '',
    promote_user_id: 0,
  },
  meta: [],
  created_at: '',
  updated_at: '',
  archived: 0,
  blocked_by: null,
  locked: 0,
  viewed: 0,
  assigned_by: 0,
  quota: null,
  completed_at: null,
  access_type: 1,
  due_at: '0',
  designation: 1,
  program_id: null,
  project_id: 166,
  track_id: null,
  user_id: 0,
  program_level: 1,
  performance_id: null,
  sub_type_id: 1,
  comments: [],
}

class Notification extends Component {
  state = {
    notifications: [],
  }

  componentDidMount() {
    this.props.onFetchSettings()
  }

  handleDropdown = notification => e => {
    if (equals(e, 'mark as read')) {
      this.props.onUpdate(notification.id, 'viewed')
    } else if (equals(e, 'unfollow')) {
      let settings = clone(this.props.settings)
      const { notification_type, notification_subtype } = notification.data
      settings.data[notification_type][notification_subtype]['notifications'] = {
        app: 0,
        text: 0,
        email: 0,
      }
      this.props.onUpdateSettings(settings)
    }
  }

  handleClickItem = notification => () => {
    const { id, url, notification_type } = notification.data
    if (url) {
      let after = null
      switch (notification_type) {
        case 'Task':
          after = {
            type: 'MODAL_REQUEST',
            payload: {
              type: 'Task Detail',
              data: { before: { card: { ...TASK, id }, after: null } },
              callBack: null,
            },
          }
          break

        case 'Career':
          after = {
            type: 'GETCAREERPROGRAM_REQUEST',
            programId: id,
            route: `/hcm/report-careers/employee/${notification.user_id}/view`,
          }
          break

        case 'Course':
          after = {
            type: 'FETCHTASKDETAIL_REQUEST',
            cardInstanceId: id,
            mode: 'Preview',
          }
          break

        case 'Scorecard':
          after = {
            type: 'GETSCORECARD_REQUEST',
            payload: {
              scorecardId: id,
              mode: 'preview',
            },
          }
          break

        case 'Approval Task':
          after = {
            type: 'MODAL_REQUEST',
            payload: {
              type: 'Task Detail',
              data: { before: { card: { ...TASK, id }, after: null } },
              callBack: null,
            },
          }
          break

        case 'Certification':
          after = {
            type: 'GETCAREERPROGRAM_REQUEST',
            programId: id,
            route: `/hcm/report-certifications/${notification.user_id}/${id}/view`,
          }
          break

        default:
          break
      }
      this.props.onUpdate(notification.id, 'viewed', after, `/${url}`)
    }
  }

  handleChangeSortOption = option => {}

  handleRefresh = () => {
    const { notifications } = this.props.data
    const { current_page, total, to } = notifications
    if (to < total) {
      this.props.onFetch(current_page + 1)
    }
  }

  renderLoader(loading = false) {
    const { total, to } = this.props.data.notifications
    if (total == to) return null
    return (
      <div className="d-flex justify-content-center align-items-center p-3">
        <p className="dsl-m12 mb-0">Loading More</p>
        {loading && <div className="loading-spinner ml-2" />}
      </div>
    )
  }

  render() {
    const { loading, data } = this.props
    const { notifications } = data

    return (
      <div id="notification-container" className="notification-container">
        <div className="d-flex justify-content-between align-items-center pl-4 pb-1">
          <Dropdown
            align="right"
            title="Sort by:"
            data={SortOptions}
            width={150}
            returnBy="data"
            defaultIds={[1]}
            disabled
            onChange={this.handleChangeSortOption}
          />
          <Button type="link" name="Show all" />
        </div>
        {length(notifications.data) > 0 && (
          <InfiniteScroll
            hasMore
            dataLength={length(notifications.data)}
            loader={this.renderLoader(loading)}
            next={this.handleRefresh}
            scrollableTarget="notification-container"
          >
            {notifications.data.map(notification => {
              const { id, status, data } = notification
              if (data.subtype) {
                const iconObj = NotificationIcons[toLower(data.subtype)]
                const isNew = status == NOTIFICATION_STATUSES.NEW
                const dropdownOptions = isNew ? ['Mark As Read', 'Unfollow'] : ['Unfollow']
                const due =
                  data.action !== 'Deleted' ? (data.due_date.length !== 0 ? moment(data.due_date[0].due_at) : '') : ''
                const isPast = moment(due).isBefore(moment())
                return (
                  <Row key={id} className={`align-items-center px-2 py-3 m-0 mb-1 ${isNew ? 'new-item' : ''}`}>
                    <Col
                      xs={2}
                      className="d-flex justify-content-center px-0"
                      onClick={this.handleClickItem(notification)}
                    >
                      <Avatar url={data.by_avatar} type="logo" />
                    </Col>
                    <Col xs={6} className="px-0" onClick={this.handleClickItem(notification)}>
                      <p className="dsl-p14 mb-1 truncate-one">{notification.message}</p>
                      <p className="dsl-b12 mb-0">
                        {moment
                          .utc(notification.created_at)
                          .local()
                          .format('MMM DD, YY')}
                      </p>
                    </Col>
                    <Col xs={3} className="d-flex flex-column align-items-center px-0">
                      <Icon name={`${iconObj.icon} p-1`} size={14} color="#5a6978" />
                      <div className="d-flex align-items-center">
                        {isPast ? (
                          <>
                            <Icon name="fal fa-exclamation-circle" size={14} color="#f00" />
                            &nbsp;
                            <p className="dsl-b12 mb-0 text-capitalize">past_due</p>
                          </>
                        ) : (
                          <p className="dsl-b12 mb-0 text-capitalize">{data.action}</p>
                        )}
                      </div>
                    </Col>
                    <Col xs={1} className="px-0">
                      <EditDropdown options={dropdownOptions} onChange={this.handleDropdown(notification)} />
                    </Col>
                  </Row>
                )
              }
            })}
          </InfiniteScroll>
        )}
      </div>
    )
  }
}

Notification.propTypes = {
  loading: PropTypes.bool,
  data: PropTypes.shape({
    total: PropTypes.number,
    new: PropTypes.number,
    viewed: PropTypes.number,
    notifications: PropTypes.shape({
      current_page: PropTypes.number,
      data: PropTypes.array,
      first_page_url: PropTypes.string,
      from: PropTypes.number,
      last_page: PropTypes.number,
      last_page_url: PropTypes.string,
      next_page_url: PropTypes.string,
      path: PropTypes.string,
      per_page: PropTypes.number,
      prev_page_url: PropTypes.string,
      to: PropTypes.number,
      total: PropTypes.number,
    }),
  }),
  settings: PropTypes.any,
  onFetch: PropTypes.func,
  onUpdate: PropTypes.func,
  onFetchSettings: PropTypes.func,
  onUpdateSettings: PropTypes.func,
}

Notification.defaultProps = {
  loading: false,
  data: {
    total: 0,
    new: 0,
    viewed: 0,
    status: [],
    notifications: {
      current_page: 1,
      data: [],
      first_page_url: '',
      from: 1,
      last_page: 2,
      last_page_url: '',
      next_page_url: '',
      path: '',
      per_page: 25,
      prev_page_url: null,
      to: 25,
      total: 34,
    },
  },
  settings: InitialNotificationSettings,
  onFetch: () => {},
  onUpdate: () => {},
  onFetchSettings: () => {},
  onUpdateSettings: () => {},
}

export default Notification

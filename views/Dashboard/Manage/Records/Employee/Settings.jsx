import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Tabs, Tab } from 'react-bootstrap'
import { connect } from 'react-redux'
import { clone, equals, keys, toLower, append, remove, not } from 'ramda'
import classNames from 'classnames'
import { Button, CheckBox, Icon } from '@components'
import DevActions from '~/actions/develop'
import { NotificationSettings, NotificationTypes, NotificationPeriod, UserRoles } from '~/services/config'
import './Employee.scss'

class Settings extends Component {
  state = {
    selectedTab: 'notifications',
    settings: this.props.data,
    userRole: this.props.userRole,
    notifications: [0],
  }

  componentDidUpdate(prevProps, prevState) {
    if (!equals(this.props.data, prevProps.data)) {
      this.setState({ settings: this.props.data })
    }
  }

  handleSelectTab = selectedTab => {
    this.setState({ selectedTab })
  }

  handleChangeChecked = (option, type, tag1, tag2, checked) => {
    let settings = clone(this.state.settings)
    if (type === 'unassigned') {
      settings.data[option]['deleted'][tag1][tag2] = checked ? 1 : 0
    } else {
      settings.data[option][type][tag1][tag2] = checked ? 1 : 0
    }
    this.setState({ settings })
  }

  handleVisibility = index => {
    let { notifications } = this.props
    if (notifications.includes(index)) {
      let notificationToggles = notifications.filter(item => item != index)
      this.props.setNotifications(notificationToggles)
    } else {
      notifications = append(index, notifications)
      this.props.setNotifications(notifications)
    }
  }

  handleSave = () => {
    const payload = {
      user_id: this.props.userId,
      data: this.state.settings.data,
    }
    this.props.onSave(payload)
  }

  renderPageData = (notificationOptions, settings, tab) => {
    const { notifications } = this.props
    const defaultNotfs = { app: 0, text: 0, email: 0 }
    const defaultNewsLetter = { daily: 0, weekly: 0, monthly: 0 }

    return notificationOptions.map((option, index) => (
      <div key={index}>
        <div key={index} className="pt-3" onClick={() => this.handleVisibility(index)}>
          <p className="dsl-b18 bold">
            {option}
            <span>
              <Icon name="fas fa-sort-down caret" />
            </span>
          </p>
        </div>
        <div className={classNames(notifications && notifications.includes(index) ? 'd-block' : 'd-none')}>
          <div className="d-flex">
            <div className="d-flex-1"></div>
            <div className="d-flex d-flex-1 justify-content-center">
              {NotificationTypes.map((item, index) => (
                <p className="check-item dsl-m12 mb-0" key={`${item.value}-${index}`}>
                  {item.label}
                </p>
              ))}
            </div>
            <div className="d-flex d-flex-1 justify-content-center">
              {NotificationPeriod.map((item, index) => (
                <p className="check-item dsl-m12 mb-0" key={`${item.value}-${index}`}>
                  {item.label}
                </p>
              ))}
            </div>
          </div>
          {NotificationSettings[option].map((item, index) => {
            const notfs = settings.data[option]
              ? equals(item, 'Unassigned')
                ? settings.data[option].deleted
                : settings.data[option][toLower(item)]
              : []
            const notifications = notfs && notfs.hasOwnProperty('notifications') ? notfs.notifications : defaultNotfs
            const newsletters = notfs && notfs.hasOwnProperty('newsletters') ? notfs.newsletters : defaultNewsLetter
            return (
              <div className="d-flex" key={`${item}-${index}`}>
                <div className="d-flex-1 dsl-m14">{item}</div>
                <div className="d-flex d-flex-1 justify-content-center">
                  {NotificationTypes.map((ntype, index) => (
                    <div className="check-item" key={`${ntype.value}-${index}`}>
                      <CheckBox
                        size="tiny"
                        id={`${option}-${ntype.value}-${item}`}
                        className="justify-content-center py-2"
                        checked={notifications[ntype.value] > 0 ? true : false}
                        onChange={e =>
                          this.handleChangeChecked(
                            option,
                            toLower(item),
                            'notifications',
                            ntype.value,
                            e.target.checked
                          )
                        }
                      />
                    </div>
                  ))}
                </div>
                <div className="d-flex d-flex-1 justify-content-center">
                  {NotificationPeriod.map((nperiod, index) => (
                    <div className="check-item" key={`${nperiod.value}-${index}`}>
                      <CheckBox
                        size="tiny"
                        id={`${option}-${nperiod.value}-${item}`}
                        className="justify-content-center py-2"
                        checked={newsletters[nperiod.value] > 0 ? true : false}
                        onChange={e =>
                          this.handleChangeChecked(
                            option,
                            toLower(item),
                            'newsletters',
                            nperiod.value,
                            e.target.checked
                          )
                        }
                      />
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    ))
  }

  render() {
    const { selectedTab, settings, userRole } = this.state
    const notificationOptions = keys(NotificationSettings)
    const isManager = userRole < 4 || selectedTab == 'account'
    const isAdmin = userRole < 3 || selectedTab == 'account'

    return (
      <div className="employee-settings">
        {isManager ? (
          <p className="dsl-b22 bold mb-0">Account Manager</p>
        ) : isAdmin ? (
          <p className="dsl-b22 bold mb-0">Account Admin</p>
        ) : (
          <p className="dsl-b22 bold mb-0">My Setting</p>
        )}

        <Tabs
          id="employee-settings"
          defaultActiveKey="notifications"
          activeKey={selectedTab}
          onSelect={this.handleSelectTab}
        >
          {userRole < UserRoles.USER && (
            <Tab eventKey="account" title="Account">
              {this.renderPageData(notificationOptions, settings, 'account')}
              <Button className="ml-auto mr-5" onClick={this.handleSave}>
                SAVE
              </Button>
            </Tab>
          )}

          <Tab eventKey="notifications" title="Notifications">
            {this.renderPageData(notificationOptions, settings, 'notification')}
            <Button className="ml-auto mr-5" onClick={this.handleSave}>
              SAVE
            </Button>
          </Tab>
          <Tab eventKey="permissions" title="Permissions"></Tab>
        </Tabs>
      </div>
    )
  }
}

Settings.propTypes = {
  data: PropTypes.any,
  userRole: PropTypes.number,
  setNotifications: PropTypes.func,
  notifications: PropTypes.array,
}

Settings.defaultProps = {
  data: {},
  userRole: 1,
  setNotifications: () => {},
  notifications: [],
}

const mapStateToProps = state => ({
  notifications: state.develop.notificationToggle,
})

const mapDispatchToProps = dispatch => ({
  setNotifications: index => dispatch(DevActions.notificationsetRequest(index)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Settings)

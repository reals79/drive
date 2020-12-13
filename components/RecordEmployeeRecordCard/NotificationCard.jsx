import React, { memo } from 'react'
import PropTypes from 'prop-types'
import { equals, values } from 'ramda'
import { CheckBox } from '@components'

const NotificationCard = ({ headers, notification, title, onChange }) => {
  const notificationDetail = values(notification)

  return (
    <div className="mt-0">
      <div className="d-flex justify-content-between mb-2">
        <span className="dsl-b22 bold">{title}</span>
      </div>
      <div className="d-flex">
        <div className="d-flex-2" />
        <div className="d-flex d-flex-2">
          <div className="d-flex-1 d-center">
            <span className="dsl-m12 text-400">In App</span>
          </div>
          <div className="d-flex-1 d-center">
            <span className="dsl-m12 text-400">Text</span>
          </div>
          <div className="d-flex-1 d-center">
            <span className="dsl-m12 text-400">Email</span>
          </div>
        </div>
        <div className="d-flex-1" />
        <div className="d-flex d-flex-2">
          <div className="d-flex-1 d-center">
            <span className="dsl-m12 text-400">Daily</span>
          </div>
          <div className="d-flex-1 d-center">
            <span className="dsl-m12 text-400">Monthly</span>
          </div>
          <div className="d-flex-1 d-center">
            <span className="dsl-m12 text-400">Weekly</span>
          </div>
        </div>
      </div>
      <div className="d-flex py-2">
        <div className="notification-title d-flex-2">
          {headers.map(header => (
            <div className="py-2">
              <span className="dsl-m12 text-400">{header}</span>
            </div>
          ))}
        </div>
        <div className="notification-data d-flex-2">
          {headers.map((item, index) => (
            <div className="d-flex py-2">
              <CheckBox
                className="d-center d-flex-1"
                id={`${title}${index}${item}-app`}
                key={`${title}${index}${item}-app`}
                checked={equals(notificationDetail[index].notifications.app, 1)}
                size="tiny"
                onChange={e => onChange(title, item, 'notifications', 'app', e.target.checked)}
              />
              <CheckBox
                className="d-center d-flex-1"
                id={`${title}${index}${item}-text`}
                key={`${title}${index}${item}-text`}
                checked={equals(notificationDetail[index].notifications.text, 1)}
                size="tiny"
                onChange={e => onChange(title, item, 'notifications', 'text', e.target.checked)}
              />
              <CheckBox
                className="d-center d-flex-1"
                id={`${title}${index}${item}-email`}
                key={`${title}${index}${item}-email`}
                checked={equals(notificationDetail[index].notifications.email, 1)}
                size="tiny"
                onChange={e => onChange(title, item, 'notifications', 'email', e.target.checked)}
              />
            </div>
          ))}
        </div>
        <div className="d-flex-1" />
        <div className="notifications-data d-flex-2">
          {headers.map((item, index) => (
            <div className="d-flex py-2">
              <CheckBox
                className="d-center d-flex-1"
                id={`${title}${index}${item}-news-daily`}
                key={`${title}${index}${item}-news-daily`}
                checked={equals(notificationDetail[index].newsletters.daily, 1)}
                size="tiny"
                onChange={e => onChange(title, item, 'newsletters', 'daily', e.target.checked)}
              />
              <CheckBox
                className="d-center d-flex-1"
                id={`${title}${index}${item}-news-weekly`}
                key={`${title}${index}${item}news-weekly`}
                checked={equals(notificationDetail[index].newsletters.weekly, 1)}
                size="tiny"
                onChange={e => onChange(title, item, 'newsletters', 'weekly', e.target.checked)}
              />
              <CheckBox
                className="d-center d-flex-1"
                id={`${title}${index}${item}-news-monthly`}
                key={`${title}${index}${item}-news-monthly`}
                checked={equals(notificationDetail[index].newsletters.monthly, 1)}
                size="tiny"
                onChange={e => onChange(title, item, 'newsletters', 'monthly', e.target.checked)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

NotificationCard.propTypes = {
  title: PropTypes.string,
  headers: PropTypes.array,
  notification: PropTypes.array,
  onChange: PropTypes.func,
}

NotificationCard.defaultProps = {
  title: '',
  headers: [],
  notification: [],
  onChange: () => {},
}

export default memo(NotificationCard)

import React, { memo } from 'react'
import PropTypes from 'prop-types'
import { Avatar } from '@components'
import { avatarBackgroundColor } from '~/services/util'
import './CareerUser.scss'

function Detail(props) {
  const { user, title, description, history } = props

  return (
    <div className="career-user">
      <div className="header">
        <span className="dsl-b22 bold">{user.name}</span>
      </div>
      <div className="career-user-content">
        <div className="avatar-container">
          <Avatar
            size="large"
            type="initial"
            url={user.profile.avatar}
            name={user.name}
            backgroundColor={avatarBackgroundColor(user.id)}
            onToggle={() => history.push(`/library/record-employee-info/${user.id}`)}
          />
        </div>
        <div className="d-flex-1 pl-4">
          <p className="dsl-b18 bold truncate-one">{title}</p>
          <p className="dsl-b16">{description}</p>
        </div>
      </div>
    </div>
  )
}

Detail.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string,
    profile: PropTypes.shape({
      avatar: PropTypes.string,
    }),
  }),
  title: PropTypes.string,
  description: PropTypes.string,
  history: PropTypes.any,
}

Detail.defaultProps = {
  user: {
    name: '',
    profile: {
      avatar: '',
    },
  },
  programs: '',
  description: '',
  history: {},
}

export default memo(Detail)

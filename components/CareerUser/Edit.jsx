import React from 'react'
import PropTypes from 'prop-types'
import { Avatar, Input } from '@components'
import './CareerUser.scss'

class Edit extends React.Component {
  state = {
    title: this.props.title,
    description: this.props.description,
    url: this.props.user.profile.avatar,
  }

  handleDrop = e => {
    this.setState({ url: e })
  }

  render() {
    const { url, title, description } = this.state
    const { user, history } = this.props

    return (
      <div className="career-user">
        <div className="header">
          <span className="dsl-b22 bold">{user.name}</span>
        </div>
        <div className="career-user-content">
          <div className="avatar-container">
            <Avatar
              size="large"
              url={url}
              name={user.name}
              type="logo"
              upload
              onToggle={() => history.push(`/library/record-employee-info/${user.id}`)}
              onDrop={this.handleDrop}
            />
          </div>
          <div className="d-flex-1 pl-2">
            <Input
              className="user-info"
              value={title}
              onChange={e => this.setState({ title: e })}
            />
            <Input
              className="user-info mt-2"
              as="textarea"
              rows={4}
              value={description}
              onChange={e => this.setState({ description: e })}
            />
          </div>
        </div>
      </div>
    )
  }
}

Edit.propTypes = {
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

Edit.defaultProps = {
  user: {
    name: '',
    profile: {
      avatar: '',
    },
  },
  title: '',
  description: '',
  history: {},
}

export default Edit

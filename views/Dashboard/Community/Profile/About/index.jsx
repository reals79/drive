import React from 'react'
import PropTypes from 'prop-types'
import Detail from './Detail'
import Edit from './Edit'

const About = ({ user, editable, authenticated, avatar, cover, onCancel, onLogin }) => {
  return editable ? (
    <Edit user={user} avatar={avatar} cover={cover} onCancel={onCancel} />
  ) : (
    <Detail user={user} authenticated={authenticated} onLogin={onLogin} />
  )
}

About.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number,
  }),
  avatar: PropTypes.string,
  cover: PropTypes.string,
  editable: PropTypes.bool,
  onCancel: PropTypes.func,
}

About.defaultProps = {
  user: {
    id: 0,
  },
  editable: false,
  avatar: '',
  cover: '',
  onCancel: () => {},
}

export default About

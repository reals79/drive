import React from 'react'
import PropTypes from 'prop-types'
import './ToastMessage.scss'

const ToastMessage = ({ title, description }) => (
  <div className="ds-tm">
    <div className="ds-tm--title">{title}</div>
    <div className="ds-tm--description">{description}</div>
  </div>
)

ToastMessage.propTypes = {
  title: PropTypes.string,
  description: PropTypes.any,
}

ToastMessage.defaultProps = {
  title: '',
  description: '',
}

export default ToastMessage

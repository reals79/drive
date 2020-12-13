import React from 'react'
import PropTypes from 'prop-types'
import './ComingSoon.scss'

const ComingSoon = props => (
  <div className="coming-soon mt-4">
    <span className="dsl-b50 text-uppercase">
      <strong>Coming soon...</strong>
    </span>
    <span className="dsl-b27 text-center">{props.description}</span>
  </div>
)

ComingSoon.propTypes = {
  description: PropTypes.string,
}

ComingSoon.defaultProps = {
  description: ' ',
}

export default ComingSoon

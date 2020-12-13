import React from 'react'
import PropTypes from 'prop-types'
import './Landing.scss'

const Landing = props => (
  <div className="coming-soon mt-4">
    <span className="dsl-b50 text-uppercase">
      <strong>Landing</strong>
    </span>
    <span className="dsl-b27 text-center">{props.description}</span>
  </div>
)

Landing.propTypes = {
  description: PropTypes.string,
}

Landing.defaultProps = {
  description: '',
}

export default Landing

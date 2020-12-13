import React from 'react'
import PropTypes from 'prop-types'
import { Icon } from '@components'
import './LandingClass.scss'

const LandingClass = props => (
  <div className="landing-class mx-auto">
    <div className="text-center mt-5 mb-2">
      <Icon name={props.brand} color="white" size={35} />
    </div>
    <h3 className="title text-center text-500">{props.title}</h3>
    <p className="dsl-w16 text-center">{props.info}</p>
  </div>
)

LandingClass.propTypes = {
  brand: PropTypes.string,
  title: PropTypes.string,
  info: PropTypes.string,
}

LandingClass.defaultProps = {
  brand: '',
  title: '',
  info: '',
}

export default LandingClass

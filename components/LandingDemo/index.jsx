import React, { memo } from 'react'
import PropTypes from 'prop-types'
import { Image } from 'react-bootstrap'
import { isNil, isEmpty } from 'ramda'
import './LandingDemo.scss'

const LandingDemo = props => (
  <div className="landing-demo">
    <div
      className="avatar-container"
      style={{
        borderColor:
          isNil(props.borderColor) || isEmpty(props.borderColor) ? '#376CAF' : props.borderColor,
      }}
    >
      <Image
        src={
          isNil(props.avatar) || isEmpty(props.avatar)
            ? '/images/default.png'
            : '/images/demo/' + props.avatar
        }
        width={120}
        height={120}
        roundedCircle
      />
    </div>
    <div className="text-center">
      <h3 className="dsl-b18 text-500 mt-2">{props.trackName}</h3>
      <p className="dsl-b16">{props.demoNotify}</p>
    </div>
  </div>
)

LandingDemo.propTypes = {
  avatar: PropTypes.string,
  borderColor: PropTypes.string,
  trackName: PropTypes.string,
  demoNotify: PropTypes.string,
}

LandingDemo.defaultProps = {
  avatar: '',
  borderColor: '#376CAF',
  trackName: '',
  demoNotify: '',
}

export default memo(LandingDemo)

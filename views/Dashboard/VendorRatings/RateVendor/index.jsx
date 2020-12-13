import React from 'react'
import PropTypes from 'prop-types'
import { ProfileHeader } from '@components'
import './RateVendor.scss'

const RateVendor = props => (
  <div className="coming-soon mt-4">
    <ProfileHeader />
  </div>
)

RateVendor.propTypes = {
  description: PropTypes.string,
}

RateVendor.defaultProps = {
  description: '',
}

export default RateVendor

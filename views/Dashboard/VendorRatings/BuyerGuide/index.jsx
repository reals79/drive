import React from 'react'
import PropTypes from 'prop-types'
import { ProfileHeader } from '@components'
import './BuyGuide.scss'

const BuyGuide = props => (
  <div className="mt-4">
    <ProfileHeader />
  </div>
)

BuyGuide.propTypes = {
  description: PropTypes.string,
}

BuyGuide.defaultProps = {
  description: ' ',
}

export default BuyGuide

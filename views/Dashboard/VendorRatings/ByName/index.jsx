import React from 'react'
import PropTypes from 'prop-types'
import { ProfileHeader } from '@components'
import './ByName.scss'

const ByName = props => (
  <div className="mt-4">
    <ProfileHeader />
  </div>
)

ByName.propTypes = {
  description: PropTypes.string,
}

ByName.defaultProps = {
  description: ' ',
}

export default ByName

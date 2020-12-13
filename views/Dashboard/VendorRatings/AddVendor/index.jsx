import React from 'react'
import PropTypes from 'prop-types'
import { ProfileHeader } from '@components'
import './AddVendor.scss'

const AddVendor = props => (
  <div className="mt-4">
    <ProfileHeader />
  </div>
)

AddVendor.propTypes = {
  description: PropTypes.string,
}

AddVendor.defaultProps = {
  description: ' ',
}

export default AddVendor

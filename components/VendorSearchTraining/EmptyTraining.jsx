import React, { memo } from 'react'
import PropTypes from 'prop-types'
import './VendorSearchTraining.scss'

const EmptyTraining = () => (
  <div className="vendor-search-training-empty">
    <p className="dsl-m14 mb-0">Sorry, we didn't find anything with your request.</p>
    <p className="dsl-m14 mb-0">Try to use another words.</p>
  </div>
)

EmptyTraining.propTypes = {}

EmptyTraining.defaultProps = {}

export default memo(EmptyTraining)

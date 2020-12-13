import React, { memo } from 'react'
import PropTypes from 'prop-types'
import './VendorSearchForums.scss'

const EmptyForum = () => (
  <div className="vendor-search-forums-empty">
    <p className="dsl-m14 mb-0">Sorry, we didn't find anything with your request.</p>
    <p className="dsl-m14 mb-0">Try to use another words.</p>
  </div>
)

EmptyForum.propTypes = {}

EmptyForum.defaultProps = {}

export default memo(EmptyForum)

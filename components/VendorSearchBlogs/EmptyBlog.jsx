import React, { memo } from 'react'
import PropTypes from 'prop-types'
import './VendorSearchBlogs.scss'

const EmptyBlog = () => (
  <div className="vendor-search-blogs-empty">
    <p className="dsl-m14 mb-0">Sorry, we didn't find anything with your request.</p>
    <p className="dsl-m14 mb-0">Try to use another words.</p>
  </div>
)

EmptyBlog.propTypes = {}

EmptyBlog.defaultProps = {}

export default memo(EmptyBlog)

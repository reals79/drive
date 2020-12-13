import React, { memo } from 'react'
import PropTypes from 'prop-types'
import './VendorSearchPeople.scss'

const EmptyPeople = () => (
  <div className="vendor-search-people-empty">
    <p className="dsl-m14 mb-0">Sorry, we didn't find anything with your request.</p>
    <p className="dsl-m14 mb-0">Try to use another words.</p>
  </div>
)

EmptyPeople.propTypes = {}

EmptyPeople.defaultProps = {}

export default memo(EmptyPeople)

import React, { memo } from 'react'
import PropTypes from 'prop-types'
import './VendorSearchCompanies.scss'

const EmptyCompany = () => (
  <div className="vendor-search-companies-empty">
    <p className="dsl-m14 text-center mb-0">Sorry, we didn't find anything with your request.</p>
    <p className="dsl-m14 mb-0">Try to use another words.</p>
  </div>
)

EmptyCompany.propTypes = {}

EmptyCompany.defaultProps = {}

export default memo(EmptyCompany)

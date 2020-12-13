import React, { memo } from 'react'
import PropTypes from 'prop-types'
import './VendorSearchProducts.scss'

const EmptyProduct = () => (
  <div className="vendor-search-product-empty">
    <p className="dsl-m14 mb-0">Sorry, we didn't find anything with your request.</p>
    <p className="dsl-m14 mb-0">Try to use another words.</p>
  </div>
)

EmptyProduct.propTypes = {}

EmptyProduct.defaultProps = {}

export default memo(EmptyProduct)

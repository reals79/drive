import React, { memo } from 'react'
import PropTypes from 'prop-types'
import { filter, equals } from 'ramda'
import { CheckBox } from '@components'
import './VendorProductDetail.scss'

const VendorProductDetail = ({ editable, products, vendorProducts, edit, onChangeProduct }) => (
  <div className="vendor-products">
    {vendorProducts.map((product, index) => (
      <div className="vendor-products__item dsl-m12" key={index}>
        <div>{product.name}</div>
        <CheckBox
          id={product.id}
          size="small"
          checked={filter(item => equals(item.id, product.id), products).length > 0 ? true : false}
          disabled={!editable || !edit}
          onChange={e => onChangeProduct(index, e.target.checked)}
        />
      </div>
    ))}
  </div>
)

VendorProductDetail.propTypes = {
  products: PropTypes.array,
  vendorProducts: PropTypes.array,
  edit: PropTypes.bool,
  onChangeProduct: PropTypes.func,
}

VendorProductDetail.defaultProps = {
  products: [],
  vendorProducts: [],
  edit: false,
  onChangeProduct: () => {},
}

export default memo(VendorProductDetail)

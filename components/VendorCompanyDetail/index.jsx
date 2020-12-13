import React, { memo } from 'react'
import PropTypes from 'prop-types'
import { isNil, equals } from 'ramda'
import { EditDropdown } from '@components'
import { VendorMenu } from '~/services/config'
import VendorProductDetail from '../VendorProductDetail'
import './VendorCompanyDetail.scss'

const VendorCompanyDetail = ({ editable, vendors, vendorProducts, selected, onOpen, onChange }) => (
  <div className="vendor-products">
    {!isNil(vendors) &&
      vendors.map((vendor, index) => (
        <div key={index}>
          <div className="d-flex justify-content-between mb-2">
            <div className="dsl-m14" onClick={() => onOpen(index, [3])}>
              {vendor.company.name}
            </div>
            <div>
              <EditDropdown
                options={editable ? VendorMenu[1] : VendorMenu[5]}
                onChange={e => onOpen(index, e)}
              />
            </div>
          </div>
          {equals(index, selected.selected) && (
            <VendorProductDetail
              editable={editable}
              products={vendor.products}
              vendorProducts={vendorProducts}
              edit={equals('edit', selected.status)}
              onChangeProduct={(productId, checked) => onChange(index, productId, checked)}
            />
          )}
        </div>
      ))}
  </div>
)

VendorCompanyDetail.propTypes = {
  vendors: PropTypes.array,
  vendorProducts: PropTypes.array,
  selected: PropTypes.object,
  onOpen: PropTypes.func,
  onChange: PropTypes.func,
}

VendorCompanyDetail.defaultProps = {
  vendors: [],
  vendorProducts: [],
  selected: {},
  onOpen: () => {},
  onChange: () => {},
}

export default memo(VendorCompanyDetail)

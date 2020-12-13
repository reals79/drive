import React from 'react'
import PropTypes from 'prop-types'
import { useImmer } from 'use-immer'
import _ from 'lodash'
import { Select, Button } from '@components'
import API from '~/services/api'
import { noop } from '~/services/util'
import './CompanyVendorCard.scss'

const api = API.create()
const selectStyle = {
  control: (provided, state) => ({
    ...provided,
    border: 'none',
  }),
  indicatorSeparator: (provide, state) => ({
    display: 'none',
  }),
}

const defaultVendorStack = {
  DMS: {},
  CRM: {},
  Websites: {},
  Inventory: {},
  HCM: {},
  PPC: {},
  SEO: {},
}

const CompanyVendorCard = ({ venCategories, onVendorChange, onNext }) => {
  const [vendorStack, updateVendorStack] = useImmer(defaultVendorStack)
  const handleSelectFocus = (vName, categoryId) => async () => {
    if (vendorStack[vName].products) return

    try {
      updateVendorStack(draft => {
        draft[vName].isLoading = true
      })
      const res = await api.getCategoryProducts(categoryId)
      if (res.data?.data) {
        updateVendorStack(draft => {
          draft[vName].isLoading = false
          draft[vName].products = res.data.data
        })
      }
    } catch (e) {
      console.error('>> Calling Vendor Product Error:', e)
    }
  }

  const handleDropdownChange = shortName => selectedItem => {
    const selectedProduct = vendorStack[shortName].products.find(
      product => product.id === selectedItem.value
    )
    const payload = {
      company: _.pick(selectedProduct.parent, ['id', 'name', 'slug']),
      products: [_.pick(selectedProduct, ['id', 'name', 'slug'])],
    }

    updateVendorStack(draft => {
      draft[shortName].value = payload
    })
    onVendorChange(shortName, payload)
  }

  return (
    <div className="card mb-3 vdra-vendor">
      <p className="dsl-b22 bold">Vendor Stack</p>

      {venCategories.map((venCat, idx) => (
        <div className="d-flex core-select py-2" key={idx}>
          <span className="dsl-b12 mr-2 core-select-label">{venCat.shortName}</span>

          <Select
            className="core-select-input"
            isLoading={vendorStack[venCat.shortName] && vendorStack[venCat.shortName].isLoading}
            onFocus={handleSelectFocus(venCat.shortName, venCat.id)}
            itemLabel="name"
            itemValue="id"
            field
            cacheOptions
            options={vendorStack[venCat.shortName].products || []}
            loadingMessage={() => 'Loading'}
            styles={selectStyle}
            onChange={handleDropdownChange(venCat.shortName)}
          />
        </div>
      ))}

      <div className="d-flex mt-3 justify-content-end">
        <Button name="NEXT" onClick={onNext} />
      </div>
    </div>
  )
}

CompanyVendorCard.propTypes = {
  venCategories: PropTypes.arrayOf(PropTypes.object).isRequired,
  onNext: PropTypes.func,
  onDropdownChange: PropTypes.func,
}

CompanyVendorCard.defaultProps = {
  onNext: noop,
  onDropdownChange: noop,
}

export default CompanyVendorCard

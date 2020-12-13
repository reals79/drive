import React, { memo, useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useImmer } from 'use-immer'
import { Button, Input, Select, StepBar } from '@components'
import { EXPOSURE_LEVELS } from '~/services/constants'
import './ProductConfig.scss'

const selectStyle = {
  control: (provided, state) => ({
    ...provided,
    border: 'none',
    backgroundColor: '#F6F7F8',
  }),
  indicatorSeparator: (provide, state) => ({
    display: 'none',
  }),
}

const ProductConfig = memo(() => {
  const companyName = useSelector(state => state.company.businessCompany?.name)
  const vendorCategories = useSelector(state => state.vendor.categories?.all || [])
  const [ products, updateProducts ] = useImmer([])
  const [ activeForm, updateActiveForm ] = useImmer({})
  const [ current, setCurrent ] = useState(1)

  useEffect(() => {
    if (!!products.length) {
      setCurrent(2)
    } else {
      setCurrent(1)
    }
  }, [products])

  const handleNameChange = (value) => {
    updateActiveForm(draft => { draft.name = value })
  }

  const handleSelectChange = name => item => {
    updateActiveForm(draft => { draft[name] = item.value })
  }

  const handleSubmit = () => {
    updateProducts(draft => { draft.push(activeForm) })
    updateActiveForm(draft => { draft = {} })
  }

  const handleSave = () => {}

  return (
    <div className="product-configuration">
      <div className="modal-header text-center bg-primary text-white">HCM Configuration</div>
      <div className="modal-body">
        <StepBar step={current} maxSteps={2} className="mb-3" />
        <div className="product-configuration-wrapper py-3">
          <div className="dsl-b16 bold">{companyName} Products</div>
          <div className="employee-list mb-5">
            <div className="list-item d-flex py-3 align-items-center mt-2 px-2">
              <div className="d-flex-6">
                <span className="dsl-m12">Name</span>
              </div>
              <div className="d-flex-6">
                <span className="dsl-m12">Category</span>
              </div>
              <div className="d-flex-3">
                <span className="dsl-m12">Exposure Level</span>
              </div>
              <div className="d-flex-3">
                <span className="dsl-m12">Optimization</span>
              </div>
              <div className="d-flex-1" />
            </div>
            {!products.length && (
              <div className="employee-list-none d-flex dsl-m14 align-items-center justify-content-center">
                No employees added yet.
              </div>
            )}

            {products.map(item => (
              <div className="list-item d-flex py-3 align-items-center mt-2 px-2">
                <div className="d-flex-6">
                  <span className="dsl-m12">{item.name}</span>
                </div>
                <div className="d-flex-6">
                  <span className="dsl-m12">{item.category}</span>
                </div>
                <div className="d-flex-3">
                  <span className="dsl-m12">{item.exposure}</span>
                </div>
                <div className="d-flex-3">
                  <span className="dsl-m12">Optimization</span>
                </div>
                <div className="d-flex-1" />
              </div>
            ))}
          </div>
          <div className="employee-form">
            <div className="dsl-b16 bold mb-3">Add Product</div>
            <Input title="Name" placeholder="Type here..." value={activeForm.name} onChange={handleNameChange} />
            <div className="core-input horizental">
              <div className="core-input-label">Category</div>
              <Select
                className="core-input-select"
                field
                cacheOptions
                options={vendorCategories}
                styles={selectStyle}
                itemLabel="name"
                itemValue="slug"
                onChange={handleSelectChange('category')}
              />
            </div>
            <div className="core-input horizental">
              <div className="core-input-label">Exposure Level</div>
              <Select
                className="core-input-select"
                field
                cacheOptions
                options={EXPOSURE_LEVELS}
                styles={selectStyle}
                onChange={handleSelectChange('exposure')}
              />
            </div>
          </div>

          <div className="d-flex mt-3 flex-column align-items-end">
            <Button className="submit-btn mb-2" type="medium" size="small" onClick={handleSubmit}>
              Submit
            </Button>
            <Button name="SAVE" onClick={handleSave} />
          </div>
        </div>
      </div>
    </div>
  )
})

export default ProductConfig

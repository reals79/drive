import React, { memo, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { useSelector, useDispatch } from 'react-redux'
import { find, isEmpty, propEq } from 'ramda'
import { toast } from 'react-toastify'
import { Avatar, Button, Dropdown, EditDropdown, Input, ProgressBar, StepBar } from '@components'
import AppActions from '~/actions/app'
import CompanyActions from '~/actions/company'
import VenActions from '~/actions/vendor'
import { EXPOSURE_LEVELS } from '~/services/constants'
import './HCMConfiguration.scss'

const HCMConfiguration = ({ onClose }) => {
  const dispatch = useDispatch()

  const [current, setCurrent] = useState(2)
  const categories = useSelector(state => state.vendor.categories.all)
  const [name, setName] = useState('')
  const [category, setCategory] = useState([])
  const [level, setLevel] = useState(null)

  const _md = useSelector(state => state.app.modalData)
  const _data = _md?.before?.data
  const companies = useSelector(state => state.company.business)
  const data = find(propEq('id', Number(_data?.id)), companies)
  const products = data?.vrs?.products || []

  useEffect(() => {
    dispatch(VenActions.getcategoriesRequest({ isCategory: true }))
  }, [])

  const callback = () => {
    toast.success('New product was added successfully!', {
      position: toast.POSITION.TOP_CENTER,
      pauseOnFocusLoss: false,
      hideProgressBar: true,
    })
    const isVR = !!data.slug
    const payload = {
      companyId: data.id,
      businessId: data.business_id,
      type: isVR ? 'vr' : 'hcm',
    }
    dispatch(VenActions.getvendorcompanyRequest(payload))
    dispatch(CompanyActions.getbusinessRequest({ id: data.id }))
  }

  const handleSave = () => {
    if (current === 1) setCurrent(2)
    else onClose()
  }

  const handleAddProduct = () => {
    setCurrent(2)
    onClose()
    const payload = {
      type: 'Basic Product Configuration',
      data: {
        before: { data: null, company: data.vrs },
        after: {
          type: 'GETBUSINESS_REQUEST',
          payload: { id: data.id },
          route: `/company/${data.id}/products/all`,
        },
      },
      callBack: {},
    }
    dispatch(AppActions.modalRequest(payload))
  }

  const handleSelected = e => {
    if (e === 'silver' || e === 'gold') {
      toast.error('You may only select basic exposure. Please contact to upgrade your listing.', {
        position: toast.POSITION.TOP_CENTER,
        pauseOnFocusLoss: false,
        hideProgressBar: true,
      })
    }
  }

  const getCategory = e => {
    const ct = find(propEq('id', Number(e)), categories)
    return ct?.name
  }

  return (
    <div className="hcm-configuration-modal">
      <div className="modal-header">
        <span className="dsl-w16">HCM Configuration</span>
      </div>
      <div className="modal-body">
        <StepBar step={current} maxSteps={2} className="mb-3" />
        <p className="dsl-b16 bold">{data?.name} Products</p>
        <Button className="ml-auto" type="link" name="+ Add Product" onClick={handleAddProduct} />
        <div className="d-flex border-bottom pb-2">
          <div className="d-flex-3">
            <span className="dsl-d12">Name</span>
          </div>
          <div className="d-flex-3">
            <span className="dsl-d12">Category</span>
          </div>
          <div className="d-flex-2">
            <span className="dsl-d12">Exposure Level</span>
          </div>
          <div className="d-flex-3">
            <span className="dsl-d12">Optimization</span>
          </div>
          <div className="d-flex-1" />
        </div>
        {products.length > 0 ? (
          products.map((item, index) => (
            <div className="d-flex align-items-center border-bottom py-2" key={index}>
              <div className="d-flex align-items-center d-flex-3">
                <Avatar />
                <span className="dsl-b14 ml-3">{item.name}</span>
              </div>
              <div className="d-flex-3">
                <span className="dsl-b14">{getCategory(item.data.category)}</span>
              </div>
              <div className="d-flex-2">
                <span className="dsl-b14">{item.level || 'Basic'}</span>
              </div>
              <div className="d-flex align-items-center d-flex-3">
                <ProgressBar value={item.optimization} />
              </div>
              <div className="d-flex-1">
                <EditDropdown options={['Edit', 'Delete']} />
              </div>
            </div>
          ))
        ) : (
          <div className="py-5 border-bottom">
            <p className="dsl-m16 text-center my-0">There are no products to show. Please add products.</p>
          </div>
        )}
      </div>
      <div className="modal-footer">
        <Button name={current === 1 ? 'Save & Next' : 'Close'} onClick={handleSave} />
      </div>
    </div>
  )
}

HCMConfiguration.propTypes = {
  title: PropTypes.string,
  body: PropTypes.string,
  info: PropTypes.string,
  yes: PropTypes.string,
  no: PropTypes.string,
  onYes: PropTypes.func,
  onNo: PropTypes.func,
}

HCMConfiguration.defaultProps = {
  title: '',
  body: '',
  info: '',
  yes: 'Yes',
  no: 'No',
  onYes: () => {},
  onNo: () => {},
}

export default memo(HCMConfiguration)

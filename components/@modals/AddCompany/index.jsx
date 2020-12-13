import React, { memo, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Icon, StepBar } from '@components'
import AppActions from '~/actions/app'
import CompanyActions from '~/actions/company'
import VendorActions from '~/actions/vendor'
import StepOne from './StepOne'
import StepTwo from './StepTwo'
import './AddCompany.scss'

const AddCompany = memo(() => {
  const [current, setCurrent] = useState(0)
  const [business, setBusiness] = useState(null)
  const status = useSelector(state => state.manage.status)

  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(VendorActions.getcategoriesRequest())
  }, [])

  const handleCreate = e => {
    const { bio: profile, franchises, vendorStack } = e
    const payload = {
      business: {
        name: profile.name,
        data: {
          profile: {
            url: profile.url,
            address: profile.address,
            cell_phone: profile.primary_phone,
            avatar: profile.avatar,
          },
          franchises,
          vendors: vendorStack,
        },
      },
    }
    dispatch(CompanyActions.savebzcompanyRequest(payload, e => setBusiness(e)))
    setCurrent(current + 1)
  }

  const handleEdit = e => {
    const { licences } = e
    const payload = {
      business: { ...business, data: { ...business?.data, licences } },
    }
    if (licences.hcm === 'enable') {
      const _payload = {
        company: {
          name: business.name,
          business_id: business.id,
        },
      }
      dispatch(CompanyActions.postsavehcmcompanyRequest(_payload))
    }
    dispatch(CompanyActions.savebzcompanyRequest(payload))
    setCurrent(current + 1)
  }

  const handlePrev = () => {
    if (current > 0) {
      setCurrent(current - 1)
    }
  }

  const handleExit = () => {
    const payload = { id: business?.id }
    const route = `/company/${business?.id}/about`
    dispatch(CompanyActions.getbusinessRequest(payload, route))
  }

  const renderSteps = () => {
    switch (current) {
      case 0:
        return <StepOne onNext={handleCreate} />
      case 1:
        return <StepTwo onNext={handleEdit} onPrev={handlePrev} />
      case 2:
        if (!status.length) {
          const modalPayload = {
            type: 'Show Success',
            data: {
              before: {
                message:
                  'Congratulations, your company is being added. You can finish your profile set up in just a moment.',
              },
            },
            callBack: {
              onExit: handleExit,
            },
          }

          dispatch(AppActions.modalRequest(modalPayload))
        }
        return null
    }
  }

  return (
    <div className="add-company-modal">
      <div className="modal-header">
        <Icon name="fal fa-plus-circle" color="#FFF" size={14} />
        <span className="dsl-w14 pl-2">Add Company</span>
      </div>
      <div className="modal-body p-0">
        <StepBar className="py-3 px-4" step={current + 1} maxSteps={2} />
        {renderSteps()}
      </div>
    </div>
  )
})

export default AddCompany

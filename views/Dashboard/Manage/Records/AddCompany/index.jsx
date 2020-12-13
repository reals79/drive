import React, { memo, useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { useImmer } from 'use-immer'
import { Button, Icon, StepBar } from '@components'
import AppActions from '~/actions/app'
import CompanyActions from '~/actions/company'
import VendorActions from '~/actions/vendor'
import StepOne from './StepOne'
import StepTwo from './StepTwo'

const defaultCompanyData = {
  bio: {},
  franchises: [],
  vendorStack: {},
}

const AddCompany = memo(() => {
  const dispatch = useDispatch()
  const companyId = useSelector(state => state.company.businessCompany?.id || ' ')
  const status = useSelector(state => state.manage.status)
  const history = useHistory()
  const [current, setCurrent] = useState(0)
  const [companyPayload, updateCompanyPayload] = useImmer(defaultCompanyData)

  useEffect(() => {
    dispatch(VendorActions.getcategoriesRequest())
  }, [])

  const handleBack = () => {
    history.goBack()
  }

  const handleNext = payload => {
    const { bio: profile, franchises, vendorStack } = companyPayload
    switch (current) {
      case 0:
        updateCompanyPayload(draft => {
          draft.bio = payload.bio
          draft.franchises = payload.franchises
          draft.vendorStack = payload.vendorStack
        })
        break
      case 1:
        const reqPayload = {
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
              licences: payload.licences,
              max_employees: payload.maxEmployee,
            },
          },
        }

        dispatch(CompanyActions.savebzcompanyRequest(reqPayload))
        break
    }

    if (current < 3) {
      setCurrent(current + 1)
    }
  }

  const handlePrev = () => {
    if (current > 0) {
      setCurrent(current - 1)
    }
  }

  const handleExit = () => {
    history.push(`/company/${companyId}/about`)
  }

  const renderSteps = () => {
    switch (current) {
      case 0:
        return <StepOne onNext={handleNext} />
      case 1:
        return <StepTwo onNext={handleNext} onPrev={handlePrev} />
      case 2:
        if (!status.length) {
          const modalPayload = {
            type: 'Show Success',
            data: {
              before: {
                message:
                  'Congratulations, your company is being added to  . You can finish your profile set up in just a moment.',
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
    <div className="vdra">
      <div className="d-flex justify-content-between mb-3 ml-3 ml-sm-0">
        <StepBar className="pt-3 pt-sm-0" step={current + 1} maxSteps={3} />
        <Button type="low" className="mr-5 mr-sm-0 pt-3 pt-sm-0" size="small" onClick={handleBack}>
          <Icon name="fal fa-arrow-left mr-2" size={12} color="#376caf" />
          Back to all companies
        </Button>
      </div>
      {renderSteps()}
    </div>
  )
})

export default AddCompany

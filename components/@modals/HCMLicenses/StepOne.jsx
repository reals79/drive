import React, { memo, useState } from 'react'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import classNames from 'classnames'
import { Button, CheckBox, Input } from '@components'
import CompanyActions from '~/actions/company'
import { HCM_FEATURES } from '~/services/constants'
import './HCMLicenses.scss'

const StepOne = ({ onNext }) => {
  const md = useSelector(state => state.app.modalData)
  const data = md?.before?.data
  const hcms = data?.hcms || {}

  const [counts, setCounts] = useState(hcms?.data?.license?.max_employees)
  const [active, setActive] = useState(hcms?.data?.license?.package || 'Basic')
  const handleFeatures = (type, e) => {
    setActive(type)
  }
  const dispatch = useDispatch()
  const handleNext = () => {
    const license = { max_employees: counts, package: active }
    const payload = { company: { ...hcms, data: { ...hcms.data, license } } }
    dispatch(CompanyActions.postsavehcmcompanyRequest(payload))
    onNext()
  }

  return (
    <>
      <p className="dsl-b18 bold mt-5">Licenses</p>
      <Input
        className="max-employee"
        title="Max active employees:"
        placeholder=""
        value={counts}
        onChange={e => setCounts(e)}
      />
      <p className="dsl-b18 bold mt-5">Features</p>
      <div className="d-flex mb-3">
        <div className={classNames('board', active === 'Basic' && 'active')}>
          {HCM_FEATURES['basic'].map(item => (
            <CheckBox
              key={`basic${item.id}`}
              id={`basic${item.id}`}
              className={classNames('mb-3 cursor-pointer', item.id === 0 && 'active')}
              checked={active === 'Basic'}
              size="tiny"
              title={item.label}
              onClick={() => handleFeatures('Basic', item)}
            />
          ))}
        </div>
        <div className={classNames('board', active === 'Plus' && 'active')}>
          {HCM_FEATURES['plus'].map(item => (
            <CheckBox
              key={`plus${item.id}`}
              id={`plus${item.id}`}
              className={classNames('mb-3 cursor-pointer', item.id === 0 && 'active')}
              checked={active === 'Plus'}
              size="tiny"
              title={item.label}
              onClick={() => handleFeatures('Plus', item)}
            />
          ))}
        </div>
        <div className={classNames('board', active === 'Premium' && 'active')}>
          {HCM_FEATURES['premium'].map(item => (
            <CheckBox
              key={`premium${item.id}`}
              id={`premium${item.id}`}
              className={classNames('cursor-pointer', item.id === 0 && 'active', item.id !== 8 && 'mb-3')}
              checked={active === 'Premium'}
              size="tiny"
              title={item.label}
              onClick={() => handleFeatures('Premium', item)}
            />
          ))}
        </div>
      </div>
      <div className="body-footer">
        <Button className="ml-3" name="NEXT" onClick={handleNext} />
      </div>
    </>
  )
}

StepOne.propTypes = {}

StepOne.defaultProps = {}

export default memo(StepOne)

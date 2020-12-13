import React, { memo, useState } from 'react'
import PropTypes from 'prop-types'
import { Button, CompanyFeatures, DefineOwners, Icon } from '@components'
import { COMPANY_FEATURES, FEATURE_OPTIONS } from '~/services/constants'

const StepTwo = ({ onPrev, onNext }) => {
  const defaultFeatures = COMPANY_FEATURES.map(item => ({ [item.id]: FEATURE_OPTIONS[1].value }))
  const [licences, setLicenses] = useState(defaultFeatures)
  const handleDropdownChange = id => item => {
    setLicenses({ ...licences, [id]: item[0] })
  }
  const handleClickNext = () => {
    onNext({ licences })
  }

  return (
    <>
      <CompanyFeatures onFeatures={handleDropdownChange} />
      {/* <DefineOwners /> */}
      <div className="d-flex p-4">
        <Button className="ml-auto" type="low" size="small" onClick={onPrev}>
          <Icon name="fal fa-arrow-left mr-2" size={10} color="#376caf" />
          Previous
        </Button>
        <Button name="SAVE" onClick={handleClickNext} />
      </div>
    </>
  )
}

export default memo(StepTwo)

import React, { memo, useState } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { Button, Icon, Input, Select } from '@components'
import { LICENCES_LIST } from '~/services/constants'

const licencesDefaultState = {
  vendor_rating: false,
  global_author: false,
  blogs: false,
  jobs: false,
  community: false,
  hcm: false,
}

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

const StepTwo = ({ onPrev, onNext }) => {
  const [maxEmployee, setMaxEmployee] = useState(0)
  const [licences, setLicenses] = useState(licencesDefaultState)
  const handleDropdownChange = licId => item => {
    setLicenses({ ...licences, [licId]: item.value === 'yes' })
  }

  const handleClickNext = () => {
    onNext({ maxEmployee, licences })
  }

  return (
    <div className="card vdra-subscriptions">
      <p className="dsl-b22 bold">Subscriptions</p>
      <div className="max-employ-form">
        <Input
          title="Max active employees:"
          type="number"
          value={maxEmployee}
          placeholder="Type here..."
          onChange={setMaxEmployee}
        />
      </div>

      <p className="dsl-b20 bold mt-4">Licences</p>
      <div className="d-flex">
        {LICENCES_LIST.map((lic, idx) => (
          <div key={lic.id} className={classNames('d-flex flex-column col-sm-2', idx === 0 && 'pl-0')}>
            <div className="mb-2">
              <span className="dsl-b12">{lic.label}</span>
              <img src="/images/icons/ic-circle-info.svg" className="ml-1 mb-1" />
            </div>
            <Select
              className="core-select-input"
              field
              cacheOptions
              defaultValue={lic.options[1]}
              options={lic.options}
              styles={selectStyle}
              onChange={handleDropdownChange(lic.id)}
            />
          </div>
        ))}
      </div>
      <div className="d-flex mt-5">
        <Button className="ml-auto" type="low" size="small" onClick={onPrev}>
          <Icon name="fal fa-arrow-left mr-2" size={10} color="#376caf" />
          Previous
        </Button>
        <Button name="NEXT" onClick={handleClickNext} />
      </div>
    </div>
  )
}

export default memo(StepTwo)

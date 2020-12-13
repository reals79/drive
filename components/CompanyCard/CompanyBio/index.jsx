import React, { memo } from 'react'
import PropTypes from 'prop-types'
import { Avatar, Dropdown, Input } from '@components'
import { noop } from '~/services/util'
import { CompanyType } from '~/services/config'
import './CompanyCard.scss'

const CompanyBio = ({ onInput, bio, onThumbnail }) => {
  const handleInputChange = name => value => {
    onInput(name, value)
  }
  const { name, info, primary_phone, address, url } = bio

  return (
    <div className="card mb-3 vdra-company">
      <div className="p-2">
        <p className="dsl-b22 bold mb-3">Select Company Type</p>
        <Dropdown
          className="mb-3"
          placeholder="Select company type"
          title="Type"
          width="fit-content"
          align="right"
          data={CompanyType}
          getValue={e => e.name}
          onChange={handleInputChange('type')}
        />
      </div>
      <div className="d-flex align-items-start flex-wrap p-2">
        <div className="d-flex-1">
          <div className="d-flex mb-3">
            <span className="dsl-m12 logospan">Logo</span>
            <Avatar
              type="logo"
              upload
              backgroundColor="#f5f6f8"
              borderColor="#f5f6f8"
              size="extraLarge"
              onDrop={onThumbnail}
            />
            <span className="dsl-m12 d-flex-1 mt-5 ml-3">
              Please keep in mind that your logo will be used as a rounded avatar.
            </span>
          </div>
          <Input title="Name" placeholder="Type here..." value={name} onChange={handleInputChange('name')} />
          <Input
            title="Info"
            name="info"
            placeholder="Type here..."
            value={info}
            onChange={handleInputChange('info')}
            as="textarea"
            rows="4"
          />
        </div>

        <div className="d-flex-1 ml-md-5">
          <Input
            title="Cell"
            placeholder="Type here..."
            value={primary_phone}
            onChange={handleInputChange('primary_phone')}
          />
          <Input title="Web" placeholder="Type here..." value={url} onChange={handleInputChange('url')} />
          <Input
            title="Address"
            placeholder="Type here..."
            value={address}
            onChange={handleInputChange('address')}
            as="textarea"
            rows="2"
          />
        </div>
      </div>
    </div>
  )
}

CompanyBio.propTypes = {
  onInput: PropTypes.func,
  onThumbnail: PropTypes.func,
}

CompanyBio.defaultProps = {
  onInput: noop,
  onThumbnail: noop,
}

export default memo(CompanyBio)

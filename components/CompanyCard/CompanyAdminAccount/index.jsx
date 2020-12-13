import React, { useState } from 'react'
import classNames from 'classnames'
import { Tabs, Tab } from 'react-bootstrap'
import { Select } from '@components'
import { LICENCES_LIST } from '~/services/constants'

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

const CompanyAdminAccount = ({ onLicenseChange, licences }) => {
  const [activeTabKey, setActiveTabKey] = useState('account')

  const handleTabSelect = tabKey => {
    setActiveTabKey(tabKey)
  }

  return (
    <div className="card company-about-section">
      <h4 className="dsl-b22 bold">Account Admin</h4>
      <Tabs defaultActiveKey="account" activeKey={activeTabKey} onSelect={handleTabSelect}>
        <Tab eventKey="account" title="Account">
          <h5 className="dsl-b18 bold my-3">Products</h5>
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
                  value={lic.options[licences[lic.id] ? 0 : 1]}
                  defaultValue={lic.options[1]}
                  options={lic.options}
                  styles={selectStyle}
                  onChange={onLicenseChange(lic.id)}
                />
              </div>
            ))}
          </div>
        </Tab>
        <Tab eventKey="permission" title="Permissions">
          <h5 className="dsl-b18 bold my-3">Permissions</h5>
        </Tab>
      </Tabs>
    </div>
  )
}

export default CompanyAdminAccount

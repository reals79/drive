import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'
import { Row, Col } from 'react-bootstrap'
import { clone } from 'ramda'
import { Button, Dropdown, Input } from '@components'
import CompanyActions from '~/actions/company'
import { COMPANY_FEATURES, FEATURE_OPTIONS } from '~/services/constants'
import './UpgradeCompanyProfile.scss'

const UpgradeCompanyProfile = ({ company, onClose }) => {
  const dispatch = useDispatch()

  const initialLicences = COMPANY_FEATURES.map(item => ({ [item.id]: FEATURE_OPTIONS[1].value }))

  const business = company.business?.data[0] || {}
  const [name, setName] = useState(business?.data?.profile?.admin_name || '')
  const [phone, setPhone] = useState(business?.data?.profile?.cell_phone || '')
  const [email, setEmail] = useState(business?.data?.profile?.address || '')
  const [message, setMessage] = useState(business?.data?.profile?.description || '')
  const [licences, setLicences] = useState(business?.data?.licences || initialLicences)

  const handleChange = key => e => {
    const liss = clone(licences)
    liss[key] = e[0]
    setLicences(liss)
  }

  const handleChangeName = e => {
    setName(e)
  }

  const handleChangePhone = e => {
    setPhone(e)
  }

  const handleChangeEmail = e => {
    setEmail(e)
  }

  const handleChangeMessage = e => {
    setMessage(e)
  }

  const handleUpdateProfile = () => {
    const payload = {
      data: {
        business: {
          id: company.business_id,
          name: company.business?.data[0]?.name,
          data: {
            profile: {
              admin_name: name,
              url: company.data?.website,
              address: email,
              cell_phone: phone,
              avatar: company.data?.avatar,
              cover: company.data?.cover,
              description: message,
            },
            licences,
          },
        },
      },
      company,
      after: {
        type: 'GETVENDORCOMPANY_REQUEST',
        payload: { companyId: company.id, companyName: company.name },
      },
    }
    dispatch(CompanyActions.savebusinessRequest(payload))
    onClose()
  }

  return (
    <div className="upgrade-company-profile-modal modal-content">
      <div className="modal-header">
        <p className="dsl-w14 m-0">Upgrade Company Profile</p>
      </div>
      <div className="modal-body p-4">
        <p className="dsl-b14">
          Select your profile upgrade. A   account exec will contact you to confirm and complete the upgrade.
        </p>
        <p className="dsl-b16 bold">Upgrade your profile:</p>
        <Row className="mx-0">
          {COMPANY_FEATURES.map(item => {
            const defaultIndex = licences[item.id] === 'enable' ? 0 : 1
            return (
              <Col xs={3} sm={2} key={item.id} className="p-0">
                <div className="mb-3">
                  <span className="dsl-b12">{item.name}</span>
                  <img src="/images/icons/ic-circle-info.svg" className="ml-1 mb-1" />
                  <Dropdown
                    width="fit-content"
                    placeholder="Select"
                    defaultIndexes={[defaultIndex]}
                    data={FEATURE_OPTIONS}
                    getId={e => e.value}
                    getValue={e => e.label}
                    onChange={handleChange(item.id)}
                  />
                </div>
              </Col>
            )
          })}
        </Row>
        <p className="dsl-b16 bold">{`${company.name} contact:`}</p>
        <Input className="mb-3" title="Admins name" value={name} onChange={handleChangeName} />
        <Input className="mb-3" title="Phone" value={phone} onChange={handleChangePhone} />
        <Input className="mb-3" title="Email" value={email} onChange={handleChangeEmail} />
        <Input
          className="align-items-start mb-3"
          title="Message"
          as="textarea"
          rows={3}
          value={message}
          onChange={handleChangeMessage}
        />
        <div className="d-h-end">
          <Button name="SEND" onClick={handleUpdateProfile} />
        </div>
      </div>
    </div>
  )
}

UpgradeCompanyProfile.propTypes = {
  company: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
  }),
  onClose: PropTypes.func,
}

UpgradeCompanyProfile.defaultProps = {
  company: {
    id: 0,
    name: '',
  },
  onClose: () => {},
}

export default UpgradeCompanyProfile

import React, { memo } from 'react'
import { Row, Col } from 'react-bootstrap'
import { isNil } from 'ramda'
import { EditDropdown, Thumbnail } from '@components'
import { LibraryQuotaMenu, QuotaSource } from '~/services/config'
import { removeAssign } from '~/services/util'
import './LibraryToDoQuota.scss'

const ListCard = ({ role, name, data, published, onToggle, onChange }) => {
  const options = removeAssign(LibraryQuotaMenu[role], published)
  const quotaType = isNil(data) ? 'N/A' : data.target_types == 'Integer' ? 'Number' : data.target_types
  const quotaSource = isNil(data)
    ? 'N/A'
    : data.source == 'Manual Input'
    ? 'Manual'
    : data.source == 'Data feed' || data.source == 'Dollar'
    ? 'Automatic'
    : data.source == 'HCM Metric'
    ? 'HCM'
    : data.source

  return (
    <div className="quota-list-card">
      <div className="d-flex-1" onClick={onToggle}>
        <div className="d-flex align-item-center w-100">
          <Thumbnail src="fal fa-location" label="Quota" dataCy="thumbnail" />
          <Row className="mx-1 w-100">
            <Col sm={12} md={6} className="mt-0 mt-md-0 text-wrap-ssm" data-cy="nameDescription">
              <span className="dsl-b16 text-400 mb-1" data-cy="name">
                {name}
              </span>
              <span className="dsl-m12 truncate-two text-400 d-none d-md-block" data-cy="description">
                {data.description}
              </span>
            </Col>
            <Col sm={12} md={3} className="d-flex d-md-block align-items-center">
              <p className="dsl-m12 text-400">Type</p>
              <p className="dsl-b16 text-400 mb-2" data-cy="quotaType">
                <span className="d-md-none pr-1">:</span>
                {quotaType}
              </p>
            </Col>
            <Col sm={12} md={3} className="d-flex d-md-block  align-items-center">
              <p className="dsl-m12 text-400">Source</p>
              <p className="dsl-b16 text-400 mb-2" data-cy="quotaSource">
                <span className="d-md-none pr-1">:</span>
                {quotaSource}
              </p>
            </Col>
          </Row>
        </div>
      </div>
      <div className="edit">
        <EditDropdown dataCy="editDropdown" options={options} onChange={onChange} />
      </div>
    </div>
  )
}

export default memo(ListCard)

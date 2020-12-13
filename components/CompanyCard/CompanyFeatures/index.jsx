import React from 'react'
import PropTypes from 'prop-types'
import { Dropdown } from '@components'
import { COMPANY_FEATURES, FEATURE_OPTIONS } from '~/services/constants'
import './CompanyFeatures.scss'

const CompanyFeatures = ({ onFeatures }) => {
  return (
    <div className="card mb-3 vdra-features">
      <p className="dsl-b22 bold">Select Features</p>

      {COMPANY_FEATURES.map(feature => (
        <div key={feature.id} className="d-flex align-items-center">
          <Dropdown
            title={feature.label}
            align="right"
            width="fit-content"
            defaultIds={['disable']}
            data={FEATURE_OPTIONS}
            getId={e => e.value}
            getValue={e => e.label}
            onChange={onFeatures(feature.id)}
          />
        </div>
      ))}
    </div>
  )
}

CompanyFeatures.propTypes = {
  onFeatures: PropTypes.func,
}

CompanyFeatures.defaultProps = {
  onFeatures: () => {},
}

export default CompanyFeatures

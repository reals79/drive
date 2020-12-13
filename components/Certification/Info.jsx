import React, { memo } from 'react'
import PropTypes from 'prop-types'
import { Avatar } from '@components'
import { convertUrl } from '~/services/util'
import './Certification.scss'

const CertificationInfo = ({ title, icon, description }) => {
  const url = convertUrl(icon, '/images/no-image.jpg')
  return (
    <div className="cert-info h-100">
      <div className="header">
        <span className="dsl-b22 bold">{title}</span>
      </div>
      <div className="cert-user-content">
        <div className="avatar-container">
          <Avatar size="large" url={url} type="logo" />
        </div>
        <div className="pl-4">
          <p className="dsl-b14">{description}</p>
        </div>
      </div>
    </div>
  )
}

CertificationInfo.propTypes = {
  title: PropTypes.string,
  icon: PropTypes.string,
  description: PropTypes.string,
}

CertificationInfo.defaultProps = {
  title: '',
  icon: '',
  description: '',
}

export default memo(CertificationInfo)

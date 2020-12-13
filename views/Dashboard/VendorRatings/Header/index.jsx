import React from 'react'
import { Icon } from '@components'

const SuperAdminHeader = ({ route }) => {
  return (
    <div className="d-flex mb-4">
      <span className="dsl-b14 text-400">Super Admin</span>
      <Icon name="far fa-chevron-right ml-2" size={12} color="#969faa" />
      <span className="dsl-m14 ml-2">{route}</span>
    </div>
  )
}

export default SuperAdminHeader

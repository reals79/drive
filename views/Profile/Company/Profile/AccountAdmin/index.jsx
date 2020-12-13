import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Tabs, Tab } from 'react-bootstrap'
import { clone, find, propEq } from 'ramda'
import { EditDropdown } from '@components'
import { SHOW_CASES } from '~/services/constants'
import Account from './Account'
import Permissions from './Permissions'
import Notifications from './Notifications'
import { UserRoles } from '~/services/config'
import CompActions from '~/actions/company'
import './AccountAdmin.scss'

const AccountAdmin = ({ data }) => {
  const dispatch = useDispatch()
  const [active, setActive] = useState('account')
  const [editable, setEditable] = useState(false)
  const userRole = useSelector(state => state.app.primary_role_id)

  if (!data) return null

  const handleTab = e => {
    setActive(e)
    setEditable(false)
  }

  const handleEdit = e => {
    if (e === 'edit') {
      setEditable(true)
      if (userRole === UserRoles.ADMIN) {
        const payload = {
          companyId: data.id,
          after: {
            type: 'MODAL_REQUEST',
            payload: {
              type: 'Upgrade Company Profile',
              data: { before: { company: data }, after: null },
              callBack: null,
            },
          },
        }
        dispatch(CompActions.getbzcompanyRequest(payload))
      }
    }
  }

  const defaultProducts = data?.products
    ? data.products.map(item => find(propEq('value', item.data.sponsored_level || 'wiki'), SHOW_CASES))
    : []
  const [products, setProducts] = useState(defaultProducts)

  const handleOptions = idx => e => {
    const _products = clone(products)
    _products[idx] = e
    setProducts(_products)
  }

  return (
    <div className="account-admin">
      <div className="card-header d-flex justify-content-between">
        <span className="dsl-b22 bold">Account Admin</span>
        {(userRole === UserRoles.SUPER_ADMIN || userRole === UserRoles.ADMIN) && (
          <EditDropdown className="edit-all" options={['Edit', 'Reports']} onChange={handleEdit} />
        )}
      </div>
      <Tabs className="card-content" defaultActiveKey="account" activeKey={active} onSelect={handleTab}>
        <Tab eventKey="account" title="Account">
          <Account data={data} products={products} role={userRole} onOptions={handleOptions} />
        </Tab>
        <Tab eventKey="permission" title="Permissions">
          <Permissions data={data} />
        </Tab>
        <Tab eventKey="notifications" title="Notifications">
          <Notifications />
        </Tab>
      </Tabs>
    </div>
  )
}

export default AccountAdmin

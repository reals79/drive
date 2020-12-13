import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import { Tabs, Tab } from 'react-bootstrap'
import { find, propEq } from 'ramda'
import { EditDropdown } from '@components'
import CommunityActions from '~/actions/community'
import Companies from './Companies'
import Default from './Default'
import Permission from './Permission'
import Password from './Password'
import ProfileOptimization from './ProfileOptimization'
import './AccountAdmin.scss'

const AccountAdmin = props => {
  const dispatch = useDispatch()
  const permissions = useSelector(state => state.community.permissions)
  const userPermission = find(propEq('user_id', props.user?.id), permissions)
  const [active, setActive] = useState('default')
  const [editable, setEditable] = useState(false)

  useEffect(() => {
    const { user } = props
    dispatch(CommunityActions.getuserpermissionsRequest({ userId: user.id }))
  }, [])

  const handleSelectOption = e => {
    setEditable(e === 'edit')
  }

  return (
    <div className="com-account-admin">
      <div className="card-header d-h-between">
        <span className="dsl-b22 bold">My Settings</span>
        {active === 'default' && <EditDropdown options={['Edit', 'Report']} onChange={handleSelectOption} />}
      </div>
      <Tabs className="card-content pb-2" defaultActiveKey="default" activeKey={active} onSelect={e => setActive(e)}>
        <Tab eventKey="default" title="Default">
          <Default editable={editable} onCancel={() => handleSelectOption('report')} />
        </Tab>
        <Tab eventKey="companies" title="Companies">
          <Companies permission={userPermission} />
        </Tab>
        <Tab eventKey="notifications" title="Notifications">
          <div>Notifications</div>
        </Tab>
        <Tab eventKey="password" title="Password">
          <Password />
        </Tab>
        <Tab eventKey="permissions" title="Permissions">
          <Permission permission={userPermission} />
        </Tab>
        <Tab eventKey="profile-optimization" title="Profile Optimization">
          <ProfileOptimization />
        </Tab>
      </Tabs>
    </div>
  )
}

AccountAdmin.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number,
  }),
}

AccountAdmin.defaultProps = {
  user: {
    id: 0,
  },
}

export default AccountAdmin

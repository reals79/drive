import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import PropTypes from 'prop-types'
import { Row, Col } from 'react-bootstrap'
import { includes, clone, filter, isEmpty, toLower } from 'ramda'
import { Avatar, Button, Search } from '@components'
import AppActions from '~/actions/app'
import VendorActions from '~/actions/vendor'
import './AddAdmin.scss'

const AddAdmin = ({ company, type, onClose }) => {
  const dispatch = useDispatch()
  const employees = useSelector(state => state.app.users)
  const selfId = useSelector(state => state.app.id)
  const selfCommunityId = useSelector(state => state.app.user?.community?.id)

  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState([])

  const handleChangeSearch = e => {
    setSearch(e.target.value)
  }

  const handleClickUser = user => () => {
    const { id, community_user_id } = user
    let selectedUsers = clone(selected)
    if (type === 'hcm') {
      if (includes(id, selected)) {
        selectedUsers = filter(x => x !== id, selected)
      } else {
        selectedUsers.push(id)
      }
    } else {
      if (includes(community_user_id, selected)) {
        selectedUsers = filter(x => x !== community_user_id, selected)
      } else {
        selectedUsers.push(community_user_id)
      }
    }
    setSelected(selectedUsers)
  }

  const handleAddAdmins = () => {
    if (type === 'vr') {
      const payload = {
        mode: 'add',
        data: {
          user_id: selected,
          company_id: company?.vrs?.id,
        },
        after: {
          type: 'GETBUSINESS_REQUEST',
          payload: { id: company.id },
        },
      }
      dispatch(VendorActions.postvrcompanyadminRequest(payload))
    }
    if (type === 'blog') {
      const payload = {
        mode: 'add',
        data: {
          user_id: selected,
          blog_id: company?.vrs?.blog?.id,
        },
        after: {
          type: 'GETBUSINESS_REQUEST',
          payload: { id: company.id },
        },
      }
      dispatch(VendorActions.postblogadminRequest(payload))
    }
    if (type === 'hcm') {
      let user = {}
      selected.forEach(userId => {
        user[userId] = { app_role_id: 2 }
      })
      const payload = { user }
      const companyId = company?.hcms?.id
      const after = { type: 'GETBUSINESS_REQUEST', payload: { id: company.id } }
      dispatch(AppActions.postcompanyusersRequest(payload, companyId, after))
    }
    onClose()
  }

  const users = filter(user => {
    if (search === '') return true
    if (!user.id) return false
    const name = toLower(user.name)
    return includes(toLower(search), name)
  }, employees)

  return (
    <div className="add-admin-modal">
      <Search className="add-admin-search" placeholder="Search..." onChange={handleChangeSearch} />
      <Row className="user-list mx-0 p-2">
        {users.map(user => {
          const { id, community_user_id, name } = user
          const isSelect = type === 'hcm' ? includes(id, selected) : includes(community_user_id, selected)
          if (!id) return null
          return (
            <Col
              key={id}
              xs={12}
              sm={4}
              className={`d-h-start p-2 cursor-pointer ${isSelect ? 'selected' : ''}`}
              onClick={handleClickUser(user)}
            >
              <Avatar size="extraTiny" url={user.profile?.avatar} name={name} />
              <p className="dsl-b14 ml-2 mb-0">
                {type === 'hcm'
                  ? id === selfId
                    ? 'Self'
                    : name
                  : community_user_id === selfCommunityId
                  ? 'Self'
                  : name}
              </p>
            </Col>
          )
        })}
      </Row>
      <div className="d-h-end p-3">
        <p className="dsl-b12 mb-0">{`Selected: ${selected.length}`}</p>
        <Button type="medium" className="ml-2" name="CLEAR" onClick={() => setSelected([])} />
        <Button className="ml-2" name="SAVE" disabled={isEmpty(selected)} onClick={handleAddAdmins} />
      </div>
    </div>
  )
}

AddAdmin.propTypes = {
  company: PropTypes.shape({
    id: PropTypes.number,
  }),
  type: PropTypes.oneOf(['hcm', 'blog', 'community', 'vr', 'global_author', 'jobs']),
  onClose: PropTypes.func,
}

AddAdmin.defaultProps = {
  company: {
    id: 0,
  },
  type: 'hcm',
  onClose: () => {},
}

export default AddAdmin

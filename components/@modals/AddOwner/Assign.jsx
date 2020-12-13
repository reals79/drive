import React, { memo, useState } from 'react'
import PropTypes from 'prop-types'
import { useSelector, useDispatch } from 'react-redux'
import { Row, Col } from 'react-bootstrap'
import { includes, clone, filter, isEmpty, toLower } from 'ramda'
import { Avatar, Button, Input, Icon } from '@components'
import AppActions from '~/actions/app'
import './AddOwner.scss'

const Assign = ({ onAdd }) => {
  const dispatch = useDispatch()
  const employees = useSelector(state => state.app.employees)
  const selfId = useSelector(state => state.app.id)

  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState([])

  const handleChangeSearch = e => {
    setSearch(e)
  }

  const handleClickUser = user => () => {
    const { id } = user
    let selectedUsers = clone(selected)
    if (includes(id, selected)) {
      selectedUsers = filter(x => x !== id, selected)
    } else {
      selectedUsers.push(id)
    }
    setSelected(selectedUsers)
  }

  const handleAdd = () => {
    onAdd(selected)
  }

  const users = filter(user => {
    if (search === '') return true
    if (!user.id) return false
    const name = toLower(`${user.profile?.first_name} ${user.profile?.last_name}`)
    return includes(toLower(search), name)
  }, employees)

  return (
    <div className="modal-body">
      <div className="search mb-3">
        <Icon name="far fa-search ml-3" size={14} color="#343f4b" />
        <Input
          className="d-flex-1"
          value={search}
          placeholder="Type here..."
          direction="vertical"
          onChange={handleChangeSearch}
        />
      </div>
      <Row className="employees mx-0 p-2">
        {users.map(user => {
          const name = `${user.profile?.first_name} ${user.profile?.last_name}`
          const isSelect = includes(user.id, selected)
          if (!user.id) return null
          return (
            <Col
              key={user.id}
              xs={12}
              sm={4}
              className={`d-h-start p-2 cursor-pointer ${isSelect ? 'selected' : ''}`}
              onClick={handleClickUser(user)}
            >
              <Avatar size="extraTiny" url={user.profile?.avatar} name={name} />
              <span className="dsl-b14 ml-2 mb-0">{user.id === selfId ? 'Self' : name}</span>
            </Col>
          )
        })}
      </Row>
      <div className="d-h-end p-3">
        <p className="dsl-b12 mb-0">{`Selected: ${selected.length}`}</p>
        <Button type="medium" className="ml-2" name="CLEAR" onClick={() => setSelected([])} />
        <Button className="ml-2" name="ADD" disabled={isEmpty(selected)} onClick={handleAdd} />
      </div>
    </div>
  )
}

Assign.propTypes = {}

Assign.defaultProps = {}

export default memo(Assign)

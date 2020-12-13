import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Dropdown } from '@components'
import AppActions from '~/actions/app'
import './AddGlobalAuthor.scss'

const AddGlobalAuthor = ({ onClose }) => {
  const allGlobalAuthors = useSelector(state => state.app.allAuthors.globalAuthors)
  const [global, setGlobal] = useState({})

  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(AppActions.getallauthorsRequest())
  }, [])

  const handleAdd = () => {
    const payload = {
      author: {
        id: global.id,
        name: global.name,
        business_id: global.business_id,
        data: {},
      },
    }
    const callback = { id: global.business_id }
    dispatch(AppActions.postsavebusinessauthorRequest(payload, callback))
  }

  return (
    <>
      <div className="modal-header">
        <span className="dsl-w14">Add Global Author</span>
      </div>
      <div className="modal-body addglobalauthor-modal">
        <p className="dsl-b16 text-400">Global Authors</p>
        <Dropdown
          className="mb-2"
          title="Global Authors"
          placeholder="Select"
          width="fit-content"
          returnBy="data"
          data={allGlobalAuthors}
          getValue={e => e.name}
          onChange={e => setGlobal(e[0])}
        />
        <Button className="ml-auto mb-3" name="Add" type="medium" onClick={handleAdd} />
        <div className="d-flex border-top py-3">
          <Button className="ml-auto mr-3" name="Cancel" type="link" onClick={onClose} />
          <Button name="Save" onClick={onClose} />
        </div>
      </div>
    </>
  )
}

export default AddGlobalAuthor

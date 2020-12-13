import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Dropdown, Input } from '@components'
import AppActions from '~/actions/app'
import './AddInternalAuthor.scss'

const AddInternalAuthor = ({ data, onClose }) => {
  const [authorname, setAuthorname] = useState('')
  // const [companyId, setCompanyId] = useState(null)
  // const companies = useSelector(state => state.app.companies)

  const dispatch = useDispatch()
  const handleAdd = () => {
    const payload = {
      author: {
        name: authorname,
        business_id: data.data.business_id,
        // company_id: companyId,
        data: {},
        type: 1,
      },
    }
    const callback = { id: data.data.business_id }
    dispatch(AppActions.postsavebusinessauthorRequest(payload, callback))
  }

  return (
    <>
      <div className="modal-header">
        <span className="dsl-w14">Add Internal Author</span>
      </div>
      <div className="modal-body addinternalauthor-modal">
        <p className="dsl-b16 text-400">Internal Authors</p>
        {/* <Dropdown
          className="mb-2"
          title="Company"
          placeholder="Select"
          data={companies}
          getValue={e => e.name}
          onChange={e => setCompanyId(e[0])}
        /> */}
        <Input
          className="mb-3"
          title="Author name"
          placeholder="Type here..."
          value={authorname}
          onChange={e => setAuthorname(e)}
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

export default AddInternalAuthor

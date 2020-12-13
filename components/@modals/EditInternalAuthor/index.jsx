import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Dropdown, Input } from '@components'
import AppActions from '~/actions/app'
import './EditInternalAuthor.scss'

const EditInternalAuthor = ({ data, onClose }) => {
  const [authorname, setAuthorname] = useState(data.author.name)
  // const [companyId, setCompanyId] = useState(null)
  // const companies = useSelector(state => state.app.companies)

  const dispatch = useDispatch()
  const handleSave = () => {
    const payload = {
      author: {
        id: data.author.id,
        name: authorname,
        business_id: data.data.business_id,
        // company_id: companyId,
        data: {},
      },
    }
    const callback = { id: data.data.business_id }
    dispatch(AppActions.postsavebusinessauthorRequest(payload, callback))
    onClose()
  }

  return (
    <>
      <div className="modal-header">
        <span className="dsl-w14">Edit Internal Author</span>
      </div>
      <div className="modal-body editinternalauthor-modal">
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
        <div className="d-flex border-top py-3">
          <Button className="ml-auto mr-3" name="Cancel" type="link" onClick={onClose} />
          <Button name="Save" onClick={handleSave} />
        </div>
      </div>
    </>
  )
}

export default EditInternalAuthor

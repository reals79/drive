import React, { memo } from 'react'
import moment from 'moment'
import { Button, Dropdown, Thumbnail } from '@components'
import { ToDoDotTypeAdmin } from '~/services/config'
import './LibraryDocumentCard.scss'

function Document(props) {
  const {
    name,
    description,
    iconName,
    documentName,
    updatedAt,
    attachments,
    modules,
    onShow,
    onToggle,
    onChange,
  } = props
  return (
    <div className="list-card">
      <div className="d-flex-1">
        <div className="d-flex align-item-center d-flex-1">
          <Thumbnail src={iconName} label={documentName} />
          <div className="d-flex align-items-center d-flex-1 mx-3" onClick={onToggle}>
            <div className="d-flex-1">
              <p className="dsl-b16 mb-2 text-400">{name}</p>
              <p className="dsl-m14 mb-0 truncate-two">{description}</p>
            </div>
            <div>
              <p className="dsl-m12">Edited {moment(updatedAt).format('MMM DD, YY')}</p>
              <Button type="link" name="Preview" onClick={onShow} />
            </div>
          </div>
          <div>
            <p className="dsl-m12 mt-1 text-right">Assigned: {modules ? modules : 0}</p>
            <a href={attachments}>
              <Button type="medium" name="Download" />
            </a>
          </div>
        </div>
      </div>
      <div className="edit">
        <Dropdown
          align="right"
          data={ToDoDotTypeAdmin}
          caret="dots-without-title"
          returnBy="data"
          onChange={onChange}
        />
      </div>
    </div>
  )
}

export default memo(Document)

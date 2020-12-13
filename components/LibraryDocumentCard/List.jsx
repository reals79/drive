import React, { memo } from 'react'
import moment from 'moment'
import { equals, includes } from 'ramda'
import { Button, Dropdown, Thumbnail } from '@components'
import { ToDoDotTypeAdmin, ToDoDotTypeUser } from '~/services/config'
import './LibraryDocumentCard.scss'

const ListCard = ({
  isAdmin,
  iconName,
  documentName,
  name,
  description,
  updated,
  attachments,
  modules,
  onShow,
  onToggle,
  onChange,
  documents,
}) => (
  <div className="document-list-card">
    <div className="d-flex-1">
      <div className="d-flex align-item-center d-flex-1">
        <Thumbnail src={iconName} label={documentName} />
        <div className="d-flex d-flex-1 mx-2" onClick={onToggle}>
          <div className="d-flex-1">
            <p className="dsl-b16 text-400">{name}</p>
            <p className="dsl-m14 truncate-two">{description}</p>
          </div>
          <div>
            {equals(documentName, 'Envelope') || equals(documentName, 'Packet') ? (
              <p className="dsl-m12">Documents: {documents ? documents : 0}</p>
            ) : (
              <p className="dsl-m12">Edited {moment(updated).format('MMM DD, YY')}</p>
            )}
            {equals(documentName, 'PDF') && <Button type="link" name="Preview" onClick={onShow} />}
          </div>
        </div>
        <div>
          <p className="dsl-m12">Assigned: {modules ? modules : 0}</p>
          {includes(documentName, ['Envelope', 'Packet']) ? (
            <>
              {equals('Envelope', documentName) && (
                <Button type="link" name="Preview" onClick={onShow} />
              )}
            </>
          ) : (
            <a href={attachments}>
              <Button type="medium" name="Download" />
            </a>
          )}
        </div>
      </div>
    </div>
    <div className="edit">
      <Dropdown
        align="right"
        data={isAdmin ? ToDoDotTypeAdmin : ToDoDotTypeUser}
        caret="dots-without-title"
        returnBy="data"
        onChange={onChange}
      />
    </div>
  </div>
)

export default memo(ListCard)

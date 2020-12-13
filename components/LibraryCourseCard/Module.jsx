import React, { memo } from 'react'
import { find, propEq } from 'ramda'
import { EditDropdown, Icon, Thumbnail } from '@components'
import { CardType, LibraryAttachMenu } from '~/services/config'

function Module(props) {
  const { data, role, onMenu } = props
  const name = data.name || data.data.name
  const description = data.data.description
  const thumbnail = data.data.thumb_url
  const type = data.card_type_id
  const TYPE = find(propEq('id', type), CardType) || CardType[17]

  return (
    <div className="field-header" data-cy={props.dataCy}>
      <div className="cursor-pointer d-flex d-flex-1" onClick={() => onMenu('preview view', data)}>
        <div className="status">
          <Thumbnail src={thumbnail} size="small" />
        </div>
        <div className="name">
          <p className="mb-0">
            <Icon name={`${TYPE.alias} mr-2`} color="#676757" />
            <span className="dsl-m12 text-400">{TYPE.label}</span>
          </p>
          <p className="dsl-b16 text-400 mb-1">{name}</p>
          <p className="dsl-m14 text-400 w-100 truncate-one mb-0">{description}</p>
        </div>
      </div>
      <div className="lock">
        <p className="dsl-m12 text-400 mb-3">Time lock</p>
        <p className="dsl-m14 text-400 mb-0">Immediately available</p>
      </div>
      <div className="ellipsis">
        <EditDropdown options={LibraryAttachMenu[role]} onChange={e => onMenu(e, data)} />
      </div>
    </div>
  )
}

export default memo(Module)

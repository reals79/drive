import React, { memo } from 'react'
import PropTypes from 'prop-types'
import { find, propEq, isNil } from 'ramda'
import { Icon, Thumbnail, EditDropdown } from '@components'
import { CardType, LibraryModuleMenu } from '~/services/config'
import { removeAssign } from '~/services/util'
import './LibraryModuleCard.scss'

const ListCard = ({ userRole, name, thumbnail, type, description, assigned, published, onPreview, onSelect }) => {
  const TYPE = isNil(type) ? null : find(propEq('id', type), CardType)
  const options = removeAssign(LibraryModuleMenu[userRole], published)
  return (
    <div className="library-module-card">
      <div className="lib-content">
        <div className="d-flex d-flex-1 cursor-pointer" onClick={() => onPreview()}>
          <Thumbnail src={thumbnail} />
          <div className="module-content">
            <div className="d-flex-1 mb-0 mr-4 cursor-pointer">
              {isNil(TYPE) ? (
                <>
                  <p className="dsl-b16 text-400 pb-0 mb-0">{name}</p>
                  <div className="dsl-m14 truncate-one mb-0" dangerouslySetInnerHTML={{ __html: description }} />
                </>
              ) : (
                <>
                  <div className="d-flex mb-1">
                    <Icon name={`${TYPE.alias} mr-2`} size={14} color="#676767" />
                    <span className="dsl-m12 text-400">{TYPE.label}</span>
                  </div>
                  <p className="dsl-b16 text-400 pb-0 mb-1 text-wrap-ssm">{name}</p>
                  <p className="dsl-m14 truncate-one mb-0 text-400" dangerouslySetInnerHTML={{ __html: description }} />
                </>
              )}
            </div>
            <div className="d-flex text-right courses-wrap">
              <div className="mr-4 assigned">
                <p className="dsl-m12 mb-1 no-wrap text-400">
                  Assigned<span className="d-md-none">:</span>
                </p>
                <p className="dsl-b16 mb-0 text-400">{assigned}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="edit">
          <EditDropdown options={options} onChange={onSelect} />
        </div>
      </div>
    </div>
  )
}

ListCard.propTypes = {
  userRole: PropTypes.number,
  name: PropTypes.string,
  thumbnail: PropTypes.string,
  type: PropTypes.number,
  assigned: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  onPreview: PropTypes.func,
  onSelect: PropTypes.func,
}

ListCard.defaultProps = {
  userRole: 1,
  name: '',
  thumbnail: '',
  type: 0,
  assigned: 0,
  onPreview: () => {},
  onSelect: () => {},
}

export default memo(ListCard)

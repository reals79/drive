import React from 'react'
import PropTypes from 'prop-types'
import { includes, filter, equals } from 'ramda'
import classNames from 'classnames'
import { EditDropdown, Thumbnail } from '@components'
import { LibraryTypes, LibraryProgramMenu } from '~/services/config'
import { removeAssign } from '~/services/util'
import './LibraryProgramsList.scss'

const ClosedList = ({
  role,
  name,
  description,
  thumbnail,
  type,
  modules,
  quotas,
  published,
  onToggle,
  onChange,
  dataCy,
}) => {
  const dotsMenu = equals(type, 'habits')
    ? filter(x => !includes('Assign', x), LibraryProgramMenu[role])
    : LibraryProgramMenu[role]
  const options = removeAssign(dotsMenu, published)
  return (
    <div className="library-programs-list" data-cy={dataCy}>
      <div className="programs-closed-list">
        <div className="list-detail" onClick={onToggle}>
          <Thumbnail
            src={thumbnail ? thumbnail : LibraryTypes[type].icon}
            label={LibraryTypes[type].label}
            dataCy="thumbnail"
          />
          <div
            className={classNames(
              'd-flex d-flex-1 ml-4 flex-column flex-md-row list-detail-info',
              type
            )}
          >
            <div className="d-flex-2">
              <p className="dsl-b16 text-400 mb-1 truncate-one" data-cy="name">
                {name}
              </p>
              <p className="dsl-m12 text-400 mb-0 truncate-one" data-cy="description">
                {description}
              </p>
            </div>

            {type === 'scorecards' ? (
              <>
                <div className="d-flex-1 text-right wrap-assigned assigned-flex">
                  <p className="dsl-m12 mb-1 text-400">Quota</p>
                  <p className="dsl-b14 mb-0 text-400" data-cy="quotaLength">
                    <span className="d-md-none pr-1">:</span>
                    {quotas.length}
                  </p>
                </div>
                <div className="text-right wrap-assigned assigned-flex">
                  <p className="dsl-m12 mb-1 text-400">Assigned</p>
                  <p className="dsl-b14 mb-0 text-400" data-cy="assigned">
                    <span className="d-md-none pr-1">:</span>
                    {modules}
                  </p>
                </div>
              </>
            ) : (
              <div className="text-right wrap-assigned assigned-flex">
                <p className="dsl-m12 mb-1 text-400" data-cy="assigned">
                  Assigned
                </p>
                <p className="dsl-b14 mb-0 text-400">
                  <span className="d-md-none pr-1">:</span>
                  {modules}
                </p>
              </div>
            )}
          </div>
        </div>
        <div className="edit" data-cy="editDropdown">
          <EditDropdown options={options} onChange={onChange} />
        </div>
      </div>
    </div>
  )
}

ClosedList.propTypes = {
  role: PropTypes.number,
  name: PropTypes.string,
  description: PropTypes.string,
  type: PropTypes.string,
  modules: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  onToggle: PropTypes.func,
  onChange: PropTypes.func,
}

ClosedList.defaultProps = {
  role: 1,
  name: '',
  description: '',
  type: 'careers',
  modules: 0,
  onToggle: () => {},
  onChange: () => {},
}

export default ClosedList

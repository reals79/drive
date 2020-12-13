import React, { memo } from 'react'
import PropTypes from 'prop-types'
import { isNil } from 'ramda'
import { Button, EditDropdown, Rating } from '@components'
import { getUnit } from '~/services/util'
import './LibraryToDoScoreCard.scss'

const dotsMenu = ['Move up', 'Move Down', 'Remove', 'Edit']

const Quota = ({ data, editable, index, onChange, onSelect, dataCy }) => {
  const stars = isNil(data.stars) ? data.star_values : data.stars

  return (
    <div className="lib-todo-scorecard card-item pt-2 py-3" data-cy={dataCy}>
      <div className="text-left mr-3">
        <p className="dsl-b14 m-0">{index}</p>
      </div>
      <div className="d-flex-8 d-flex-ssm-1">
        <p className="dsl-b14 mb-1 bold truncate-one">{data.name}</p>
        <p className="dsl-m12 mb-0 truncate-two">{data.data.description}</p>
      </div>
      {stars ? (
        <>
          <div className="d-flex-1 text-right">
            <p className="dsl-b14 text-400 my-1">{getUnit(stars[5], data.data.target_types)}</p>
          </div>
          <div className="d-flex-1 text-right mr-4">
            <p className="dsl-b14 text-400 my-1">{getUnit(stars[5], data.data.target_types)}</p>
            <p className="dsl-b14 text-400 my-2">{getUnit(stars[4], data.data.target_types)}</p>
            <p className="dsl-b14 text-400 my-2">{getUnit(stars[2], data.data.target_types)}</p>
          </div>
          <div className="d-flex-2">
            <Rating score={5} />
            <Rating className="mt-2" score={4} />
            <Rating className="mt-2" score={2} />
          </div>
        </>
      ) : (
        <>
          <div className="d-flex-1">
            <p className="dsl-b14 text-400 text-right my-1">N/A</p>
          </div>
          <div className="d-flex-1 text-right mr-4">
            <p className="dsl-b14 text-400 my-1">Outstanding</p>
            <p className="dsl-b14 text-400 my-2">Standard</p>
            <p className="dsl-b14 text-400 my-2">Poor</p>
          </div>
          <div className="d-flex-1 text-vcenter">
            <Button
              name="+ Add Scale"
              className="px-0"
              type="link"
              onClick={() => onChange('stars', ['0', '0', '0', '0', '0', '0'])}
            />
          </div>
        </>
      )}
      {editable && (
        <div className="edit d-none d-lg-flex">
          <EditDropdown options={dotsMenu} onChange={onSelect} />
        </div>
      )}
    </div>
  )
}

Quota.propTypes = {
  editable: PropTypes.bool,
  data: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    data: PropTypes.any,
  }),
  onChange: PropTypes.func,
  onSelect: PropTypes.func,
}

Quota.defaultProps = {
  editable: false,
  data: {
    id: 0,
    name: '',
    data: {},
  },
  onChange: () => {},
  onSelect: () => {},
}

export default memo(Quota)

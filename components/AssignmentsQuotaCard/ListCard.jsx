import React, { memo } from 'react'
import PropTypes from 'prop-types'
import { equals, isEmpty, isNil, filter } from 'ramda'
import { CheckIcon, Rating } from '@components'
import { UserRoles, AdminDotsType, UserDotsType } from '~/services/config'
import './AssignmentsQuotaCard.scss'

const ListCard = ({ userRole, data, title, onSelect }) => {
  let dotsMenu = userRole > UserRoles.MANAGER ? UserDotsType : AdminDotsType
  dotsMenu = filter(x => !equals(x, 'Preview View'), dotsMenu)
  return (
    <div className="assignment-quota-card" data-cy="qutoaListCard">
      <p className="dsl-b18 bold mb-1">{title} Quotas</p>
      <div className="card-item pt-2 py-3">
        <div className={`d-flex-3  ${title === 'Program' ? 'd-flex-md-8' : ''}`}>
          <p className="dsl-m12 text-400 m-0">Quotas</p>
        </div>
        <div className="d-flex-2">
          <p className="dsl-m12 text-400 m-0">{equals(title, 'Scorecard') ? 'Scale' : 'Calculation'}</p>
        </div>
        <div className="d-flex-1 text-right text-md-center">
          <p className={`dsl-m12 text-400 m-0 ${title === 'Program' ? 'd-none d-md-block' : ''}`}>Actual</p>
        </div>
        <div className="d-flex-1 d-none d-md-block">
          <p className="dsl-m12 text-400 m-0">{equals(title, 'Scorecard') ? 'Score' : 'Status'}</p>
        </div>
        <div className="" />
      </div>
      {isEmpty(data) ? (
        <div className="card-item border-top">
          <div className="d-flex-8">
            <span className="dsl-b12 text-400">No Quotas Assigned</span>
          </div>
          <div className="d-flex-2">
            <p className="dsl-m12 text-400 m-0">Na</p>
          </div>
          <div className="d-flex-1 text-center">
            <p className="dsl-m12 text-400 m-0">Na</p>
          </div>
          <div className="d-flex-1">
            <p className="dsl-m12 text-400 m-0">Na</p>
          </div>
          <div className="w-10" />
        </div>
      ) : (
        data.map(quota => (
          <div className="card-item border-top" key={quota.id}>
            {equals(title, 'Scorecard') ? (
              <div className="d-flex-3">
                <p className="dsl-b12 text-400 m-0">{quota.data.name || quota.name}</p>
              </div>
            ) : (
              <div className="d-flex d-flex-8">
                <div className="w-5">
                  <CheckIcon size={26} checked={!isNil(quota.completed_at)} />
                </div>
                <div className="d-flex-3 pl-4">
                  <p className="dsl-b14 text-400 m-0">{quota.data.name || quota.name}</p>
                  <p className="dsl-m12 text-400 m-0">{quota.data.description}</p>
                </div>
              </div>
            )}
            {equals(title, 'Scorecard') ? (
              <div className="d-flex-2">
                <Rating title={quota.data.star_values[0]} className="mb-2 pb-2" score={5} />
                <Rating title={quota.data.star_values[2]} className="mb-2 pb-2" score={4} />
                <Rating title={quota.data.star_values[3]} className="mb-2 pb-2" score={2} />
              </div>
            ) : (
              <div className="d-flex-2">
                <p className="dsl-b14 text-400"> {quota.data.quota_calculation}</p>
              </div>
            )}
            <div className={`d-flex-1 text-right text-md-center ${title === 'Program' ? 'd-none d-md-block' : ''}`}>
              <p className="dsl-b14 text-400">{quota.actuals[0] ? quota.actuals[0].actual : 0}</p>
            </div>
            <div className="d-flex-1 d-none d-md-block">
              {equals(title, 'Scorecard') ? (
                <Rating className="mb-2 pb-2" score={3} />
              ) : (
                <p className="dsl-b14 text-400">{quota.status}</p>
              )}
            </div>
            <div>{/* <EditDropdown options={dotsMenu} onChange={e => onSelect(e, quota)} /> */}</div>
          </div>
        ))
      )}
    </div>
  )
}

ListCard.propTypes = {
  userRole: PropTypes.number,
  userId: PropTypes.number,
  data: PropTypes.any,
  onSelect: PropTypes.func,
}

ListCard.defaultProps = {
  userRole: 1,
  userId: 0,
  data: {},
  onSelect: () => {},
}

export default memo(ListCard)

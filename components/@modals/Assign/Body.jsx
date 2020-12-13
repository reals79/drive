import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { equals, isNil, find, propEq, isEmpty } from 'ramda'
import {
  DatePicker,
  Dropdown,
  LibraryStatus,
  Thumbnail,
  Icon,
  Input,
  Pagination,
  TaskEmptyList,
} from '@components'
import { LibraryTypes } from '~/services/config'
import { length } from '~/services/util'

const AssignBody = ({
  type,
  data,
  isCompany,
  isAssigned,
  isDueDate,
  isEstDate,
  isLevel,
  isToogle,
  levelOptions,
  defaultLevel,
  selected,
  employees,
  companies,
  dueDate,
  userIds,
  companyIds,
  search,
  onAdd,
  onAssign,
  onDueDate,
  onPagination,
  onSearch,
  onSelectLevel,
}) => {
  let estDate =
    length(selected) > 0
      ? selected[0].data.days_to_complete ||
        selected[0].data.estimated_completion ||
        selected[0].estimated_days_to_complete ||
        selected[0].data.estimated_days_to_complete
      : 0
  estDate = Math.ceil(Number(estDate))
  const estimation = estDate ? `${estDate} days` : 'NA'
  const estDueDate = moment().add(estDate, 'days')

  return (
    <>
      <Input
        title="Search"
        dataCy={`hcm-assign-training-${type}-searchBar`}
        placeholder="Search here..."
        direction="vertical"
        value={search}
        onChange={onSearch}
      />

      <LibraryStatus
        className="px-0 my-3"
        type={type}
        counts={data.total}
        showToogle={isToogle}
        showCounts={false}
      />

      <div className="d-flex justify-content-between mt-2">
        <p className="dsl-m12">Viewing {data.total}</p>
        <p className="dsl-m12">Selected {length(selected)}</p>
      </div>
      <div className="list-container">
        <div className="list-content" data-cy={`hcm-assign-training-content`}>
          {data.data.map((item, index) => {
            const icon = LibraryTypes[type].icon
            const thumb = isEmpty(icon) ? item.thumbnail || item.data.thumb_url : icon
            const isSelected = !isNil(find(propEq('id', item.id), selected))
            return (
              <div className={`list-item${isSelected ? ' active' : ''}`} key={`lml${index}`}>
                <Thumbnail src={thumb} size="tiny" label={LibraryTypes[type].label} />
                <div className="d-flex-1 ml-2 mr-4">
                  <p className="dsl-b14 truncate-two mb-1">{item.name || item.title}</p>
                  <p className="dsl-b12 truncate-two mb-0">{item.data.description}</p>
                </div>
                <div
                  className="item-plus"
                  data-cy={`hcm-assign-training-addBtn${index}`}
                  onClick={() => onAdd(item)}
                >
                  <Icon name="fal fa-plus" size={24} color="#c3c7cc" />
                </div>
              </div>
            )
          })}
        </div>
        {equals(length(data.data), 0) && (
          <TaskEmptyList title="Warning" message="There are no data." />
        )}
        <Pagination
          total={Math.ceil(data.last_page)}
          current={data.current_page}
          onPer={e => onPagination(type, 1, e)}
          onChange={e => onPagination(type, e, Number(data.per_page))}
        />
      </div>
      <div className="d-flex mt-3">
        {isCompany && (
          <div className="d-flex-1">
            <Dropdown
              className="mt-3"
              multi
              title="Assign to"
              dataCy={`hcm-assign-training-${type}-assignTo`}
              width="fit-content"
              data={companies}
              direction="vertical"
              defaultIds={companyIds}
              getValue={e => e['name']}
              onChange={onAssign('company')}
            />
          </div>
        )}
        {isAssigned && (
          <div className="d-flex-1">
            <Dropdown
              className="mt-3"
              title={isCompany ? null : 'Assign to'}
              multi
              dataCy="hcm-assign-training-assignTo"
              width="fit-content"
              data={employees}
              direction="vertical"
              defaultIds={userIds}
              getValue={e => e['name']}
              onChange={isCompany ? onAssign('user') : onAssign}
            />
          </div>
        )}
        {isLevel && (
          <div className="d-flex-1">
            <Dropdown
              className="mt-3"
              title="Level"
              dataCy={`hcm-assign-training-${type}-level`}
              width="fit-content"
              data={levelOptions}
              direction="vertical"
              defaultIds={[defaultLevel]}
              onChange={onSelectLevel}
            />
          </div>
        )}
        {isDueDate && (
          <>
            {isEstDate && (
              <div className="d-flex-1 mt-3">
                <p className="dsl-m12 mb-2">Est complete</p>
                <p className="dsl-b14 text-400 ml-2">{estimation}</p>
              </div>
            )}
            <div className="d-flex-1" data-cy={`hcm-assign-training-${type}-dueDate`}>
              <DatePicker
                className="duedate-calender"
                title="Due date"
                direction="vertical"
                value={isNil(dueDate) ? estDueDate : moment(dueDate)}
                format="MMM DD, YY"
                fontColor="secondary"
                calendar="day"
                append="caret"
                as="span"
                append="caret"
                closeAfterSelect
                onSelect={onDueDate}
              />
            </div>
          </>
        )}
      </div>
    </>
  )
}

AssignBody.propTypes = {
  type: PropTypes.oneOf([
    'tracks',
    'courses',
    'modules',
    'habitslist',
    'habits',
    'quotas',
    'scorecards',
    'careers',
    'certifications',
    'badges',
    'powerpoint',
    'word',
    'pdf',
    'envelope',
  ]),
  isAssigned: PropTypes.bool,
  isDueDate: PropTypes.bool,
  isEstDate: PropTypes.bool,
  isLevel: PropTypes.bool,
  isToogle: PropTypes.bool,
}

AssignBody.defaultProps = {
  type: 'tracks',
  isCompany: false,
  isAssigned: true,
  isDueDate: true,
  isEstDate: false,
  isLevel: false,
  isToogle: true,
}

export default AssignBody

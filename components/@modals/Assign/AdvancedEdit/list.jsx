import React, { memo } from 'react'
import PropTypes from 'prop-types'
import { CheckBox, Pagination } from '@components'

const List = ({ data, title, className, current, perPage, total, onChangePage, onChangeDueDate, onUnassign }) => (
  <div className={`advanced-edit-list ${className}`}>
    <div className="list-label">
      <div className="d-flex-3">
        <p className="dsl-m14 text-400">{title}</p>
      </div>
      <div className="d-flex-3 pr-3">
        <p className="dsl-m14 text-right text-400">Due date</p>
      </div>
      <div className="d-flex-1 pl-5">
        <p className="dsl-m14 text-400">Unassign</p>
      </div>
    </div>
    {data.map(({ id, title, due_date, unassigned = false }) => (
      <div key={id} className="d-flex justify-content-between">
        <div className="d-flex-3">
          <p className="dsl-b15 text-400">{title}</p>
        </div>
        <div className="d-flex-3 pr-3 d-flex justify-content-end">
          {/* temporary disabled feature
          <DatePicker
            append="caret"
            format="MMM DD, YY"
            align="right"
            as="span"
            closeAfterSelect
            value={due_date || moment()}
            onSelect={e => onChangeDueDate(e, id)}
          /> */}
        </div>
        <div className="d-flex-1 pl-5">
          <CheckBox id={id} size="tiny" checked={unassigned} onChange={e => onUnassign(e, id)} />
        </div>
      </div>
    ))}
    <Pagination pers={[]} current={current} perPage={perPage} total={total} onChange={onChangePage} />
  </div>
)

List.propTypes = {
  current: PropTypes.number,
  perPage: PropTypes.number,
  total: PropTypes.number,
  title: PropTypes.string,
  data: PropTypes.array,
  className: PropTypes.string,
  onChangeDueDate: PropTypes.func,
  onUnassign: PropTypes.func,
  onChangePage: PropTypes.func,
}

List.defaultProps = {
  current: 1,
  perPage: 5,
  total: 0,
  title: '',
  data: [],
  className: '',
  onChangeDueDate: () => {},
  onUnassign: () => {},
  onChangePage: () => {},
}

export default memo(List)

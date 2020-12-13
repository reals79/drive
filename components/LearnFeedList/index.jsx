import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { equals, isNil, includes, clone } from 'ramda'
import moment from 'moment'
import { Thumbnail, CheckIcon, EditDropdown, CheckBox } from '@components'
import { UserRoles, AdminDotsType, UserDotsType } from '~/services/config'
import './LearnFeedList.scss'

class LearnFeedList extends Component {
  constructor(props) {
    super(props)

    this.state = {
      status: '',
      dueDate: null,
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { course } = nextProps
    const { due_at, data } = course
    const dueDate = moment(due_at).format('MMM D')
    let status = ''
    const now = moment()
    const result = moment(due_at).isBefore(now)
    if (result) {
      status = 'Past due, '
    } else {
      status = ''
    }
    if (equals(data.child_count, 0) || equals(data.completed, 0)) {
      status = status + 'Not Started'
    } else if (equals(data.child_count, data.completed)) {
      status = status + 'Completed'
    } else {
      status = status + 'In Progress'
    }

    return { status, dueDate }
  }

  render() {
    const {
      bulk,
      selected,
      user,
      userRole,
      course,
      onClick,
      onSelect,
      onBulkSelect,
      dataCy,
    } = this.props
    const { data, program_id, assigned_by, archived } = course
    const { child_count, completed, thumb_url } = data
    const { dueDate, status } = this.state
    const dotsMenu = userRole > UserRoles.MANAGER ? clone(UserDotsType) : AdminDotsType
    if (
      userRole > UserRoles.MANAGER &&
      equals(assigned_by, user) &&
      !includes('Delete', dotsMenu)
    ) {
      dotsMenu.push('Delete')
    }

    return (
      <div className={`learn-feed-list-container ${selected ? 'bulked' : ''}`} data-cy={dataCy}>
        <div className="learn-feed-list">
          <div className="list-contents">
            <div className={`feed-container${equals(archived, 1) ? ' opacity-6' : ''}`}>
              <div
                className="d-flex d-flex-5 pr-0 pr-md-4 cursor-pointer"
                onClick={() => onClick()}
              >
                <div className="d-flex d-flex-1 mr-0 mr-md-2 align-items-center">
                  <div className=" mr-0 mr-md-2">
                    <CheckIcon size={26} checked={equals(child_count, completed)} />
                  </div>
                  <Thumbnail src={thumb_url} size="tiny" />
                </div>
                <div className="d-flex-3 ml-2">
                  <p
                    data-cy="learnFeedTitle"
                    className={`dsl-b14 mb-1  text-wrap-ssm text-400 ${
                      equals(child_count, completed) ? ' text-line-through' : ''
                    }`}
                  >
                    {data.name}
                  </p>
                  <p className="dsl-m12 mb-0 text-wrap-sm text-400">
                    Assigned:
                    {isNil(program_id)
                      ? equals(assigned_by, user)
                        ? ' Self Assigned'
                        : ' Manager Assigned'
                      : ` Program:Carrer`}
                  </p>
                </div>
              </div>
              <div className="d-center align-items-baseline d-flex-5 d-flex-ssm-2">
                <div className="d-flex-2 text-right dsl-b12 modules-ssm text-400">
                  {child_count || 0}
                </div>
                <div className="d-flex-2 text-right truncate dsl-b12 text-400">{completed}</div>
                <div className="d-flex-2 text-right truncate dsl-b12 ml-3 text-400 d-none d-md-block">
                  {dueDate}
                </div>
                <div className="d-flex-1 text-400 d-none d-md-block" />
                <div className="d-flex-4 text-left truncate dsl-b12 text-400 d-none d-md-block">
                  {status}
                </div>
                <div className="d-flex-1 justify-content-end d-none d-md-flex">
                  <EditDropdown
                    options={dotsMenu}
                    disabled={bulk}
                    onChange={onSelect}
                    dataCy="threeDotMenu"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        {bulk && (
          <div className="bulk-unassign">
            {isNil(program_id) && (
              <CheckBox
                size="tiny"
                id={course.id}
                checked={selected}
                reversed={bulk && selected}
                onChange={e => onBulkSelect(course, e.target.checked)}
              />
            )}
          </div>
        )}
      </div>
    )
  }
}

LearnFeedList.propTypes = {
  bulk: PropTypes.bool,
  user: PropTypes.number,
  userRole: PropTypes.number,
  course: PropTypes.any,
  onClick: PropTypes.func,
  onSelect: PropTypes.func,
  onBulkSelect: PropTypes.func,
}

LearnFeedList.defaultProps = {
  bulk: false,
  user: 0,
  userRole: 1,
  course: {},
  onClick: () => {},
  onSelect: () => {},
  onBulkSelect: () => {},
}

export default LearnFeedList

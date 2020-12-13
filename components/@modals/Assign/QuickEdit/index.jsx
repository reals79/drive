import React, { Component } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { equals, isNil, isEmpty, type as RamdaType, dropLast, includes, find, filter } from 'ramda'
import { Button, Dropdown, DatePicker } from '@components'
import { UserRoles, ProgramTypes } from '~/services/config'
import '../Assign.scss'

class QuickEdit extends Component {
  constructor(props) {
    super(props)

    const { data, userId } = props
    const isArray = equals(RamdaType(data), 'Array')
    const selected = isArray ? data[0] : data
    const dueDate = isEmpty(selected)
      ? null
      : isEmpty(selected.due_at) || isNil(selected.due_at)
      ? null
      : moment(selected.due_at)

    this.state = {
      data,
      dueDate,
      oldDate: dueDate,
      selected,
      assignee: [userId || selected.user_id],
      users: [userId || selected.user_id],
      companyId: props.companyId,
    }

    this.handleAssignTo = this.handleAssignTo.bind(this)
    this.handleDueDate = this.handleDueDate.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleDelete = this.handleDelete.bind(this)
    this.handleChangeModule = this.handleChangeModule.bind(this)
  }

  componentDidMount() {
    this.props.onFetchEmployees()
  }

  handleAssignTo(assignee) {
    this.setState({ assignee })
  }

  handleDueDate(dueDate) {
    this.setState({ dueDate })
  }

  handleSubmit() {
    const { selected, dueDate, oldDate, assignee, companyId } = this.state
    const { type, after, from, callback } = this.props
    const due_date = isNil(dueDate) ? moment().format('YYYY-MM-DD') : dueDate.format('YYYY-MM-DD')

    let payload = {
      user_id: assignee,
      card_template_id: equals(from, 'template') ? selected.id : selected.card_template_id,
      card_type: type,
      due_date,
      company_id: companyId,
    }
    if (type === 'courses' && from === 'instance') {
      const newCourse = {
        ...selected,
        due_at: due_date,
        data: {
          ...selected.data,
          due_date: moment(due_date).unix(),
          attachment: selected.data.attachments || [],
        },
      }
      const payload = { event: 'update', cardId: selected.id, card: newCourse, after }
      this.props.onClose()
      this.props.onUpdate(payload)
      return
    }
    if (type === 'tracks') {
      payload = {
        user_id: assignee,
        track_id: from === 'template' ? selected.id : selected.card_template_id,
        card_type: type,
        due_date,
        company_id: companyId,
      }
    }
    if (includes(type, ProgramTypes) || type === 'programs') {
      payload = { card_type: 'program', data: { user_id: assignee, program_id: selected.id, company_id: companyId } }
      this.props.onClose()
      this.props.onAssign(payload, after)
      return
    }
    if (type === 'scorecards') {
      const { employees } = this.props
      const preAssignees = filter(
        x => includes(x.id, assignee) && !isEmpty(x.extra) && !isEmpty(x.extra.scorecards),
        employees
      )
      let preAssigned = ''
      for (const employee of preAssignees) {
        preAssigned = isEmpty(preAssigned) ? employee.name : `${preAssigned}, ${employee.name}`
      }
      if (!isEmpty(preAssigned)) {
        this.props.onModal({
          type: 'Confirm',
          data: {
            before: {
              title: 'Warning',
              body: `${preAssigned} already ${
                preAssignees.length > 1 ? 'have' : 'has'
              } the assigned scorecard.\n Are you sure continue to assign this scorecard to them?`,
            },
          },
          callBack: {
            onYes: () => {
              const payload = {
                card_type: 'scorecards',
                user_id: assignee,
                scorecard_id: selected.id,
                preAssignees,
                after,
                company_id: companyId,
              }
              this.props.onAssign(payload)
            },
          },
        })
      } else {
        payload = {
          card_type: 'scorecards',
          user_id: assignee,
          scorecard_id: selected.id,
          company_id: companyId,
          after,
        }
        this.props.onAssign(payload)
      }
      return
    }

    if (type === 'performanceScorecards') {
      callback && callback.onAssign && callback.onAssign()
      return
    }

    if (!equals(dueDate, oldDate)) {
      this.props.onModal({
        type: 'Important',
        data: {
          before: {
            body: 'This action will change the sub assignment due dates accordingly.',
          },
        },
        callBack: {
          onYes: () => this.props.onAssign(payload, after),
        },
      })
    } else {
      this.props.onClose()
      this.props.onAssign(payload, after)
    }
  }

  handleDelete() {
    const { after, callback, type } = this.props
    const { selected, assignee } = this.state
    if (includes(type, ProgramTypes) || type === 'programs') {
      this.props.onClose()
      const payload = {
        data: { user_id: assignee, program_id: selected.id },
        event: 'stop',
        after,
      }
      this.props.onModal({
        type: 'Confirm',
        data: {
          before: {
            title: 'UnAssign',
            body: 'This will permanently unassign this program.  Are you sure?',
          },
        },
        callBack: {
          onYes: () => {
            if (callback && callback.onDelete) {
              callback.onDelete(selected)
            } else {
              this.props.assignPrograms(payload)
            }
          },
        },
      })
    }
    if (type === 'performanceScorecards') {
      this.props.onClose()
      callback && callback.onDelete && callback.onDelete(selected)
      return
    } else {
      this.props.onClose()
      this.props.onModal({
        type: 'Confirm',
        data: {
          before: {
            title: 'Delete',
            body: 'This will permanently delete this assignment.  Are you sure?',
          },
        },
        callBack: {
          onYes: () => {
            callback && callback.onDelete && callback.onDelete(selected)
            this.props.onClose()
          },
        },
      })
    }
  }

  handleChangeModule(e) {
    const { userId } = this.props
    const card = e[0]
    this.setState({ selected: card, users: [card.user_id || userId] })
  }

  render() {
    const { role, employees, type, deletable, from, deleteTitle } = this.props
    const { selected, data, dueDate, oldDate, assignee, users } = this.state

    if (isNil(data)) return null

    const isArray = equals(RamdaType(data), 'Array')
    const isProgram = includes(type, ProgramTypes) || type === 'programs'
    const isPerformanceReview = type === 'performanceScorecards'

    const title =
      isEmpty(selected) && isPerformanceReview
        ? 'No Scorecard '
        : selected.name || selected.title || selected.data.name || selected.data.title
    const disabled = equals(dueDate, oldDate) && equals(assignee, users) && !isEmpty(selected) && from !== 'template'
    let moduleType = dropLast(1, type)
    moduleType = moduleType.charAt(0).toUpperCase() + moduleType.slice(1)
    moduleType = isPerformanceReview ? 'ScoreCard' : moduleType

    let estDate =
      isEmpty(selected) && isPerformanceReview
        ? 0
        : selected.data.estimated_completion || selected.estimated_days_to_complete || 0
    estDate = Math.ceil(Number(estDate))
    const estDueDate = isArray ? 0 : moment().add(estDate, 'days')
    const assigneeName = find(item => equals(item.id, assignee[0]), employees)

    return (
      <div className="assign-modal" dataCy="quickAssignModal">
        <div className="modal-header">
          <span className="dsl-w14">Quick Edit</span>
        </div>
        <div className="modal-body">
          <div className="mt-3">
            {isArray && !isProgram ? (
              <Dropdown
                title={`${moduleType} name`}
                dataCy="moduleType"
                direction="vertical"
                width="fit-content"
                defaultIndexes={[0]}
                data={data}
                getValue={e => e['title'] || e.data['name']}
                returnBy="data"
                onChange={this.handleChangeModule}
              />
            ) : (
              <>
                <p className="dsl-m12 mb-2">{`${moduleType} name`}</p>
                <p className="dsl-b16" dataCy="moduleTitle">
                  {title}
                </p>
              </>
            )}
          </div>
          {!isArray && !isProgram && !isPerformanceReview && (
            <>
              <div className="d-flex-1 mt-4">
                <p className="dsl-m12 mb-2">Est complete</p>
                <p className="dsl-b14 ml-2" dataCy="estimatedComplete">
                  {estDate} days
                </p>
              </div>
              <DatePicker
                title="Due date"
                dataCy="dueDate"
                direction="vertical"
                value={isNil(dueDate) ? estDueDate : dueDate}
                format="MMM DD, YY"
                fontColor="secondary"
                calendar="day"
                append="caret"
                as="span"
                closeAfterSelect
                className="duedate-calender mt-4"
                onSelect={this.handleDueDate}
              />
            </>
          )}
          {isProgram || type === 'scorecards' || isPerformanceReview ? (
            <>
              <p className="dsl-m12 mb-2 mt-4">Assign to</p>
              <p className="dsl-b16" dataCy="assigneeName">
                {assigneeName.name}
              </p>
            </>
          ) : (
            <Dropdown
              className="mt-4"
              dataCy="assignTo"
              disabled={role > UserRoles.MANAGER}
              defaultIds={assignee}
              multi={!equals(from, 'instance')}
              splitted
              title="Assign to"
              width="fit-content"
              data={employees}
              direction="vertical"
              getValue={e => e['name']}
              onChange={this.handleAssignTo}
            />
          )}
        </div>
        <div className="modal-footer">
          {role < UserRoles.USER && deletable && (
            <Button
              type="link"
              disabled={isEmpty(selected)}
              name={deleteTitle}
              dataCy="deleteBtn"
              onClick={this.handleDelete}
            />
          )}
          <Button
            name={isPerformanceReview ? 'ASSIGN' : 'SAVE'}
            disabled={disabled}
            dataCy="saveBtn"
            onClick={this.handleSubmit}
          />
        </div>
      </div>
    )
  }
}

QuickEdit.propTypes = {
  data: PropTypes.oneOfType([PropTypes.array, PropTypes.any]),
  employees: PropTypes.array,
  type: PropTypes.string,
  from: PropTypes.oneOf(['template', 'instance']),
  userId: PropTypes.number,
  role: PropTypes.number,
  after: PropTypes.any,
  deletable: PropTypes.bool,
  deleteTitle: PropTypes.string,
  onFetchEmployees: PropTypes.func,
}

QuickEdit.defaultProps = {
  data: {},
  employees: [],
  type: '',
  from: 'template',
  userId: 0,
  role: 1,
  after: null,
  deletable: true,
  deleteTitle: 'UNASSIGN',
  onFetchEmployees: () => {},
}

export default QuickEdit

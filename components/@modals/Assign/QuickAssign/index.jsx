import React, { Component } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { toast } from 'react-toastify'
import { equals, isNil, isEmpty, split } from 'ramda'
import { Button, Dropdown, DatePicker } from '@components'
import '../Assign.scss'

class QuickAssign extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: null,
      oldData: null,
      dueDate: null,
      oldDate: null,
      assignee: [],
      users: [],
      companyId: props.companyId,
    }
    this.handleAssignTo = this.handleAssignTo.bind(this)
    this.handleDueDate = this.handleDueDate.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { data, userId } = nextProps
    const { oldData } = prevState
    if (!equals(oldData, data)) {
      let dueDate = moment()
      if (isNil(data.due_at) || isEmpty(data.due_at)) {
        dueDate = moment().add(Number(data.estimated_days_to_complete || data.data.estimated_completion), 'days')
      } else {
        dueDate = moment(data.due_at)
      }
      return {
        data,
        oldData: data,
        dueDate,
        oldDate: dueDate,
        users: [data.user_id || userId],
        assignee: [data.user_id || userId],
      }
    }

    return null
  }

  handleAssignTo(assignee) {
    this.setState({ assignee })
  }

  handleDueDate(dueDate) {
    this.setState({ dueDate })
  }

  handleSubmit() {
    const { data, dueDate, assignee, companyId } = this.state
    const { type, after } = this.props
    const due_date = dueDate.format('YYYY-MM-DD')

    if (equals(type, 'Track')) {
      const payload = {
        user_id: assignee,
        track_id: data.id,
        due_date,
        company_id: companyId,
      }
      this.props.onAssign(payload)
      this.props.onClose(data)
    } else if (equals(type, 'careers')) {
      const payload = {
        event: 'start',
        data: {
          user_id: assignee,
          program_id: data.id,
          company_id: companyId,
        },
      }

      this.props.onModal({
        type: 'Important',
        data: {
          before: {
            body: 'This action will change the sub assignment due dates accordingly.',
          },
        },
        callBack: {
          onYes: () => this.props.onAssignPrograms(payload),
        },
      })
    } else {
      if (isNil(data.card_template_id)) {
        toast.warn('This template has no content and cannot be assigned to a user.', {
          position: toast.POSITION.TOP_CENTER,
        })
      } else {
        const payload = {
          user_id: assignee,
          card_template_id: data.card_template_id || data.id,
          card_type: equals(type, 'Course') ? 'courses' : 'modules',
          due_date,
          company_id: companyId,
        }
        this.props.onAssign(payload, after)
      }
      this.props.onClose(data)
    }
  }

  render() {
    const { from, employees, type, userId } = this.props
    const { data, dueDate, oldData, oldDate, assignee, users } = this.state

    if (isNil(data)) return null

    const title = data.name || data.title || data.data.name || data.data.title
    const disabled =
      equals(data, oldData) && equals(dueDate, oldDate) && equals(assignee, users) && !equals(from, 'template')

    return (
      <div className="quick-assign-modal" data-cy="quickQssignModal">
        <div className="modal-header">
          <span className="dsl-w14">Quick Assign</span>
        </div>
        <div className="modal-body">
          <div className="d-flex flex-column">
            <span className="dsl-m12 mb-2" data-cy={`name${type.replace(/[^A-Z0-9]+/gi, '')}`}>{`${type} name`}</span>
            <span className="dsl-m16" data-cy="title">
              {title}
            </span>
          </div>
          <DatePicker
            title="Due date"
            dataCy="dueDate"
            direction="vertical"
            value={dueDate}
            format="MMM DD, YY"
            fontColor="secondary"
            calendar="day"
            append="caret"
            as="span"
            closeAfterSelect
            className="duedate-calender mt-3"
            onSelect={this.handleDueDate}
          />
          <Dropdown
            className="mt-3"
            multi
            title="Assign to"
            dataCy="assignTo"
            width="fit-content"
            data={employees}
            direction="vertical"
            defaultIds={[userId]}
            getValue={e => e['name']}
            onChange={this.handleAssignTo}
          />
        </div>
        <div className="modal-footer">
          <Button name="Save" dataCy="saveBtn" disabled={disabled} onClick={this.handleSubmit} />
        </div>
      </div>
    )
  }
}

QuickAssign.propTypes = {
  data: PropTypes.any.isRequired,
  employees: PropTypes.array,
  type: PropTypes.string,
  userId: PropTypes.number,
  from: PropTypes.string,
}

QuickAssign.defaultProps = {
  data: {},
  employees: [],
  type: '',
  userId: 0,
  from: '',
}

export default QuickAssign

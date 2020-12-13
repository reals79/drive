import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Tabs, Tab } from 'react-bootstrap'
import moment from 'moment'
import { clone, equals, includes, isNil, find, propEq, filter, isEmpty } from 'ramda'
import { history } from '~/reducers'
import { UserRoles } from '~/services/config'
import Header from '../Header'
import Body from '../Body'
import Footer from '../Footer'
import '../Assign.scss'

const TABS = [
  { name: 'habits', label: 'Habit' },
  { name: 'habitslist', label: 'Habit Schedule' },
  { name: 'quotas', label: 'Quota' },
  { name: 'scorecards', label: 'Scorecard' },
]

class AssignToDo extends Component {
  constructor(props) {
    super(props)
    const tabs = filter(tab => !includes(tab.name, props.disabled), TABS)
    this.state = {
      type: tabs[0].name,
      tabs,
      selected: props.selected,
      search: '',
      dueDate: null,
      assignees: props.userIds,
      companyIds: props.companyIds,
      after: props.after,
    }
  }

  componentDidMount() {
    const { type } = this.state
    this.props.onSearch({ mode: type, publish: true })
    this.props.onFetchEmployees()
  }

  handleAdd = item => {
    const selected = clone(this.state.selected)
    const isSelected = !isNil(find(propEq('id', item.id), selected))
    if (isSelected) {
      const newSelects = filter(x => !equals(x.id, item.id), selected)
      this.setState({ selected: newSelects })
    } else {
      selected.push(item)
      this.setState({ selected })
    }
  }

  handleAddNew = () => {
    const { type } = this.state
    this.props.onClose([])
    history.push(`/library/to-do/${type}/new`)
  }

  handleAssignTo = type => ids => {
    if (type === 'user') {
      this.setState({ assignees: ids })
    } else {
      this.setState({ companyIds: ids })
    }
  }

  handleDueDate = dueDate => {
    this.setState({ dueDate })
  }

  handlePagination = (type, page, per) => {
    const { search } = this.state
    this.props.onSearch({ filter: search, mode: type, current: page, per, publish: true })
  }

  handleSearch = search => {
    const { type } = this.state
    this.props.onSearch({ mode: type, filter: search, publish: true })
    this.setState({ search })
  }

  handleSubmit = () => {
    const { selected, dueDate, assignees, type, after, companyIds } = this.state
    const due_date = isNil(dueDate) ? moment().format('YYYY-MM-DD') : moment(dueDate).format('YYYY-MM-DD')
    const templates = selected.map(e => e.id)
    if (type === 'track') {
      const payload = { user_id: assignees, track_id: templates, due_date, after }
      this.props.onAssign(payload)
    } else if (type === 'scorecards') {
      const { employees } = this.props
      const preAssignees = filter(
        x => includes(x.id, assignees) && !isEmpty(x.extra) && !isEmpty(x.extra.scorecards),
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
                card_type: type,
                user_id: assignees,
                scorecard_id: templates[0],
                company_id: companyIds[0],
                preAssignees,
                due_date,
                after,
              }
              this.props.onAssign(payload)
              this.props.onClose(selected)
            },
          },
        })
      } else {
        const payload = {
          card_type: type,
          user_id: assignees,
          scorecard_id: templates[0],
          company_id: companyIds[0],
          due_date,
          after,
        }
        this.props.onAssign(payload)
        this.props.onClose(selected)
      }
      return
    } else {
      const payload = {
        user_id: assignees,
        card_template_id: templates,
        company_id: companyIds[0],
        card_type: type,
        due_date,
        after,
      }
      this.props.onAssign(payload)
    }
    this.props.onClose(selected)
  }

  handleTab = type => {
    const { search } = this.state
    this.props.onSearch({ filter: search, mode: type, publish: true })
    this.setState({ type })
  }

  render() {
    const { role, data, employees, companies } = this.props
    const { tabs, type, dueDate, selected, search, assignees, companyIds } = this.state

    return (
      <div className="assign-modal">
        <div className="modal-header">
          <Header title="Assign ToDo" />
        </div>
        <div className="modal-body">
          <Tabs defaultActiveKey="career" activeKey={type} id="assign-todo" onSelect={this.handleTab}>
            {tabs.map(tab => (
              <Tab key={tab.name} eventKey={tab.name} title={tab.label}>
                <Body
                  type={tab.name}
                  data={data[`${tab.name}`]}
                  search={search}
                  selected={selected}
                  employees={employees}
                  companies={companies}
                  userIds={assignees}
                  companyIds={companyIds}
                  dueDate={dueDate}
                  isCompany
                  isDueDate={false}
                  onAdd={this.handleAdd}
                  onAssign={this.handleAssignTo}
                  onDueDate={this.handleDueDate}
                  onPagination={this.handlePagination}
                  onSearch={this.handleSearch}
                />
              </Tab>
            ))}
          </Tabs>
        </div>
        <div className="modal-footer">
          <Footer
            selected={selected}
            onAssign={this.handleSubmit}
            onAdd={role < UserRoles.MANAGER ? this.handleAddNew : null}
          />
        </div>
      </div>
    )
  }
}

AssignToDo.propTypes = {
  role: PropTypes.number,
  data: PropTypes.any.isRequired,
  disabled: PropTypes.array, // disable some tabs initially
  employees: PropTypes.array,
  companies: PropTypes.array,
  after: PropTypes.any,
  onAssign: PropTypes.func,
  onClose: PropTypes.func,
  onSearch: PropTypes.func,
  onModal: PropTypes.func,
  onFetchEmployees: PropTypes.func,
}

AssignToDo.defaultProps = {
  role: 1,
  data: {},
  disabled: [],
  employees: [],
  companies: [],
  after: null,
  onAssign: () => {},
  onClose: () => {},
  onSearch: () => {},
  onModal: () => {},
  onFetchEmployees: () => {},
}

export default AssignToDo

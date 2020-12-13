import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Tabs, Tab } from 'react-bootstrap'
import { filter, includes, isEmpty, isNil, length, values } from 'ramda'
import { history } from '~/reducers'
import { UserRoles } from '~/services/config'
import Header from '../Header'
import Body from '../Body'
import Footer from '../Footer'
import '../Assign.scss'

const TABS = [
  { name: 'careers', label: 'Career' },
  { name: 'certifications', label: 'Certificate' },
  // { name: 'badges', label: 'Badge' }, // upcomping feature
]

class AssignProgram extends Component {
  constructor(props) {
    super(props)
    const tabs = filter(tab => !includes(tab.name, props.disabled), TABS)
    const levels = isEmpty(props.levels) ? 0 : length(values(props.levels))
    const levelOptions = [...Array(levels)].map((e, index) => ({
      id: index + 1,
      value: `Level ${index + 1}`,
    }))
    const level = isEmpty(props.levels) ? 0 : 1

    this.state = {
      type: tabs[0].name,
      tabs,
      selected: props.selected,
      search: '',
      dueDate: null,
      assignees: props.userIds,
      companyId: props.companyId,
      level: level,
      levelOptions: levelOptions,
      after: props.after,
    }
    this.handleAdd = this.handleAdd.bind(this)
    this.handleAddNew = this.handleAddNew.bind(this)
    this.handleAssignTo = this.handleAssignTo.bind(this)
    this.handleDueDate = this.handleDueDate.bind(this)
    this.handlePagination = this.handlePagination.bind(this)
    this.handleSearch = this.handleSearch.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleTab = this.handleTab.bind(this)
    this.handleSelectLevel = this.handleSelectLevel.bind(this)
  }

  componentDidMount() {
    const { type } = this.state
    this.props.onSearch({ filter: '', mode: type, publish: true })
  }

  handleAdd(item) {
    const levels = isNil(item.data) ? 0 : length(values(item.data.levels))
    const levelOptions = [...Array(levels)].map((e, index) => ({
      id: index + 1,
      value: `Level ${index + 1}`,
    }))
    this.setState({ selected: [item], level: 1, levelOptions })
  }

  handleAddNew() {
    const { type } = this.state
    this.props.onSearch({ mode: type, publish: true })
    this.props.onClose([])
    history.push(`/library/programs/${type}/new`)
  }

  handleAssignTo(assignees) {
    this.setState({ assignees })
  }

  handleDueDate(dueDate) {
    this.setState({ dueDate })
  }

  handlePagination(type, page, per) {
    const { search } = this.state
    this.props.onSearch({ filter: search, mode: type, current: page, per, publish: true })
  }

  handleSearch(search) {
    const { type } = this.state
    this.props.onSearch({ mode: type, filter: search, publish: true })
    this.setState({ search })
  }

  handleSubmit() {
    const { companyId, level, selected, assignees, after } = this.state
    const payload = {
      event: 'start',
      data: {
        user_id: assignees,
        company_id: companyId,
        program_level: level,
        program_id: selected[0].id,
      },
      after,
    }
    this.props.onModal({
      type: 'Important',
      data: {
        before: {
          body: 'This action will change the sub assignment due dates accordingly.',
        },
      },
      callBack: {
        onYes: () => this.props.onAssign(payload),
      },
    })
  }

  handleTab(type) {
    const { search } = this.state
    this.props.onSearch({ filter: search, mode: type, publish: true })
    this.setState({ type, selected: [], level: 1 })
  }

  handleSelectLevel(e) {
    this.setState({ level: e[0] })
  }

  render() {
    const { userIds, role, data, employees } = this.props
    const { tabs, type, level, levelOptions, selected, search, dueDate, assignees } = this.state

    return (
      <div className="assign-modal">
        <div className="modal-header">
          <Header title="Assign Program" />
        </div>
        <div className="modal-body">
          <Tabs defaultActiveKey="career" activeKey={type} id="assign-program" onSelect={this.handleTab}>
            {tabs.map(tab => (
              <Tab key={tab.name} eventKey={tab.name} title={tab.label}>
                <Body
                  isEstDate
                  isLevel
                  levelOptions={levelOptions}
                  defaultLevel={level}
                  type={tab.name}
                  data={data[`${tab.name}`]}
                  search={search}
                  selected={selected}
                  employees={employees}
                  userIds={assignees}
                  dueDate={dueDate}
                  onAdd={this.handleAdd}
                  onAssign={this.handleAssignTo}
                  onDueDate={this.handleDueDate}
                  onPagination={this.handlePagination}
                  onSearch={this.handleSearch}
                  onSelectLevel={this.handleSelectLevel}
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

AssignProgram.propTypes = {
  role: PropTypes.number,
  data: PropTypes.any.isRequired,
  disabled: PropTypes.array, // disable some tabs initially
  levels: PropTypes.object,
  after: PropTypes.any,
  onAssign: PropTypes.func,
  onSearch: PropTypes.func,
  onClose: PropTypes.func,
}

AssignProgram.defaultProps = {
  role: 1,
  data: {},
  disabled: [],
  levels: {},
  after: {},
  onAssign: () => {},
  onSearch: () => {},
  onClose: () => {},
}

export default AssignProgram

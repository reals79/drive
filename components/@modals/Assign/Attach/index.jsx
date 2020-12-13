import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Tabs, Tab } from 'react-bootstrap'
import moment from 'moment'
import { clone, equals, includes, isNil, isEmpty, length, find, propEq, filter, values } from 'ramda'
import { UserRoles } from '~/services/config'
import Header from '../Header'
import Body from '../Body'
import Footer from '../Footer'
import '../Assign.scss'

const TABS = [
  { name: 'trainings', label: 'Trainings' },
  { name: 'assignments', label: 'Assignments' },
  { name: 'courses', label: 'Courses' },
  { name: 'tracks', label: 'Tracks' },
  { name: 'modules', label: 'Modules' },
  { name: 'careers', label: 'Careers', noDue: true, singleSelect: true },
  { name: 'certifications', label: 'Certifications', noDue: true, singleSelect: true },
  { name: 'badges', label: 'Badges' },
  { name: 'powerpoint', label: 'PowerPoints', addNew: true },
  { name: 'word', label: 'Words', addNew: true },
  { name: 'pdf', label: 'Pdfs', addNew: true },
  { name: 'envelope', label: 'Evenlopes' },
  { name: 'habits', label: 'Habits', addNew: true },
  { name: 'habitslist', label: 'Habits Schedules' },
  { name: 'quotas', label: 'Quotas', noDue: true, addNew: true },
  { name: 'scorecards', label: 'Scorecards', noDue: true, singleSelect: true },
  { name: 'assessment', label: 'Assessments' },
  { name: 'survey', label: 'Survey' },
  { name: 'review', label: 'Review' },
]

class AttachLibrary extends Component {
  constructor(props) {
    super(props)
    const tabs = filter(tab => includes(tab.name, props.show), TABS)
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
      dueDate: moment().format('YYYY-MM-DD'),
      assignees: props.userIds,
      isProgram: tabs[0].name === 'careers' || tabs[0].name === 'certifications',
      level: level,
      levelOptions: levelOptions,
    }
    this.handleAdd = this.handleAdd.bind(this)
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
    const selected = clone(this.state.selected)
    const isSelected = !isNil(find(propEq('id', item.id), selected))
    if (this.state.tabs[0].singleSelect) {
      if (this.state.isProgram) {
        const levels = isNil(item.data) ? 0 : length(values(item.data.levels))
        const levelOptions = [...Array(levels)].map((e, index) => ({
          id: index + 1,
          value: `Level ${index + 1}`,
        }))
        this.setState({ selected: [item], level: 1, levelOptions })
      } else this.setState({ selected: [item] })
    } else if (isSelected) {
      const newSelects = filter(x => !equals(x.id, item.id), selected)
      this.setState({ selected: newSelects })
    } else {
      selected.push(item)
      this.setState({ selected })
    }
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
    this.props.onSearch({ filter: search, mode: type, publish: true })
    this.setState({ search })
  }

  handleSubmit() {
    const { callback } = this.props
    const { selected, dueDate, type, level } = this.state
    const due_date = isNil(dueDate) ? moment().format('YYYY-MM-DD') : moment(dueDate).format('YYYY-MM-DD')

    if (callback.onAttach) {
      callback.onAttach({
        templates: selected,
        dueDate: due_date,
        type,
        level,
      })
    }

    this.props.onClose()
  }

  handleTab(type) {
    const { search } = this.state
    this.props.onSearch({ filter: search, mode: type, publish: true })
    this.setState({ type })
  }

  handleSelectLevel(e) {
    this.setState({ level: e[0] })
  }

  handleAddLibrary = () => {
    const { role, callback } = this.props
    const { tabs } = this.state
    role < UserRoles.MANAGER && tabs[0].addNew ? callback.onAdd() : null
  }

  render() {
    const { tabs, type, dueDate, selected, search, level, levelOptions, isProgram } = this.state
    const { data, employees } = this.props
    const title = tabs[0].singleSelect ? (isProgram ? 'Attach To Program' : 'Attach To Scorecard') : 'Attach'

    return (
      <div className="assign-modal">
        <div className="modal-header">
          <Header title={title} />
        </div>
        <div className="modal-body">
          <Tabs defaultActiveKey="courses" activeKey={type} id="attach-library" onSelect={this.handleTab}>
            {tabs.map(tab => (
              <Tab key={tab.name} eventKey={tab.name} title={tab.label}>
                <Body
                  type={tab.name}
                  data={data[tab.name]}
                  search={search}
                  selected={selected}
                  employees={employees}
                  dueDate={dueDate}
                  isLevel={isProgram}
                  levelOptions={levelOptions}
                  defaultLevel={level}
                  isAssigned={false}
                  isDueDate={!tab.noDue}
                  isToogle={false}
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
            title="ATTACH"
            selected={selected}
            add={!tabs[0].addNew}
            onAssign={this.handleSubmit}
            onAdd={this.handleAddLibrary}
          />
        </div>
      </div>
    )
  }
}

AttachLibrary.propTypes = {
  role: PropTypes.number,
  data: PropTypes.any.isRequired,
  disabled: PropTypes.array, // disable some tabs initially
  callback: PropTypes.any,
  onSearch: PropTypes.func,
  onClose: PropTypes.func,
}

AttachLibrary.defaultProps = {
  role: 1,
  data: {},
  show: ['modules', 'courses', 'tracks'],
  callback: {},
  onSearch: () => {},
  onClose: () => {},
}

export default AttachLibrary

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Tabs, Tab } from 'react-bootstrap'
import moment from 'moment'
import { clone, equals, includes, isNil, find, propEq, filter } from 'ramda'
import { UserRoles } from '~/services/config'
import Header from '../Header'
import Body from '../Body'
import Footer from '../Footer'
import '../Assign.scss'

const TABS = [
  { name: 'powerpoint', label: 'Power Point' },
  { name: 'word', label: 'Word' },
  { name: 'pdf', label: 'PDF' },
  // Hiding Envelope tab for now [TOP-2430]
  // { name: 'envelope', label: 'Envelope' },
]

class AssignDocument extends Component {
  constructor(props) {
    super(props)
    const tabs = filter(tab => !includes(tab.name, props.disabled), TABS)
    this.state = {
      type: tabs[0].name,
      tabs,
      selected: [],
      search: '',
      dueDate: null,
      assignees: props.userIds,
    }
    this.handleAdd = this.handleAdd.bind(this)
    this.handleAddNew = this.handleAddNew.bind(this)
    this.handleAssignTo = this.handleAssignTo.bind(this)
    this.handleDueDate = this.handleDueDate.bind(this)
    this.handlePagination = this.handlePagination.bind(this)
    this.handleSearch = this.handleSearch.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleTab = this.handleTab.bind(this)
  }

  componentDidMount() {
    const { type } = this.state
    this.props.onSearch({ mode: type })
  }

  handleAdd(item) {
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

  handleAddNew() {
    this.props.onModal({
      type: 'Add Document',
      data: { before: { modules: [] }, after: [] },
      callBack: null,
    })
  }

  handleAssignTo(assignees) {
    this.setState({ assignees })
  }

  handleDueDate(dueDate) {
    this.setState({ dueDate })
  }

  handlePagination(type, page, per) {
    const { search } = this.state
    this.props.onSearch({ filter: search, mode: type, current: page, per })
  }

  handleSearch(search) {
    const { type } = this.state
    this.props.onSearch({ mode: type, filter: search })
    this.setState({ search })
  }

  handleSubmit() {
    const { selected, dueDate, assignees, type } = this.state
    const due_date = isNil(dueDate)
      ? moment().format('YYYY-MM-DD')
      : moment(dueDate).format('YYYY-MM-DD')
    const templates = selected.map(e => e.id)
    const payload = {
      user_id: assignees,
      card_template_id: templates,
      card_type: type,
      due_date,
    }
    this.props.onAssign(payload)
    this.props.onClose(selected)
  }

  handleTab(type) {
    const { search } = this.state
    this.props.onSearch({ mode: type, filter: search })
    this.setState({ type })
  }

  render() {
    const { userIds, role, data, employees } = this.props
    const { tabs, type, dueDate, selected, search } = this.state

    return (
      <div className="assign-modal">
        <div className="modal-header">
          <Header title="Assign Document" />
        </div>
        <div className="modal-body">
          <Tabs
            defaultActiveKey="track"
            activeKey={type}
            id="assign-document"
            onSelect={this.handleTab}
          >
            {tabs.map(tab => (
              <Tab key={tab.name} eventKey={tab.name} title={tab.label}>
                <Body
                  type={tab.name}
                  data={data[`${tab.name}`]}
                  search={search}
                  selected={selected}
                  employees={employees}
                  userIds={userIds}
                  dueDate={dueDate}
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

AssignDocument.propTypes = {
  role: PropTypes.number,
  data: PropTypes.any.isRequired,
  disabled: PropTypes.array, // disable some tabs initially
  onAssign: PropTypes.func,
  onSearch: PropTypes.func,
  onClose: PropTypes.func,
  onModal: PropTypes.func,
}

AssignDocument.defaultProps = {
  role: 1,
  data: {},
  disabled: [],
  onAssign: () => {},
  onSearch: () => {},
  onClose: () => {},
  onModal: () => {},
}

export default AssignDocument

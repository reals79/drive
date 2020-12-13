import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Tabs, Tab } from 'react-bootstrap'
import moment from 'moment'
import { clone, equals, includes, isNil, find, propEq, filter, dropLast } from 'ramda'
import { toast } from 'react-toastify'
import { history } from '~/reducers'
import { UserRoles } from '~/services/config'
import Header from '../Header'
import Body from '../Body'
import Footer from '../Footer'
import '../Assign.scss'

const TABS = [
  { name: 'tracks', label: 'Tracks' },
  { name: 'courses', label: 'Courses' },
]

class AssignTraining extends Component {
  constructor(props) {
    super(props)
    const tabs = filter(tab => !includes(tab.name, props.disabled), TABS)
    this.state = {
      type: tabs.length > 1 ? tabs[1].name : tabs[0].name,
      tabs,
      selected: props.selected,
      search: '',
      dueDate: null,
      assignees: props.userIds,
      companyId: props.companyId,
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
    this.props.onSearch({ mode: type, publish: true })
  }

  handleAdd(item) {
    const { type } = this.state
    if (equals(type, 'tracks')) {
      this.setState({ selected: [item] })
      toast.warn('You can only select and assign  one track at a time.', {
        position: toast.POSITION.TOP_CENTER,
      })
    } else {
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
  }

  handleAddNew() {
    const { type } = this.state
    if (equals(type, 'modules')) {
      this.props.onModal({
        type: 'Add New Module',
        data: { before: null, after: null },
        callBack: null,
      })
    } else {
      this.props.onClose([])
      history.push(`/library/training/${type}/new`)
    }
  }

  handleAssignTo(assignees) {
    this.setState({ assignees })
  }

  handleDueDate(e) {
    const dueDate = moment(e).format('YYYY-MM-DD')
    if (!equals(dueDate, this.state.dueDate)) {
      this.setState({ dueDate })
    }
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
    const { selected, assignees, type, companyId } = this.state
    const templates = selected.map(e => e.id)

    let dueDate = clone(this.state.dueDate)
    if (isNil(dueDate)) {
      let estDate =
        selected.length > 0 ? selected[0].data.estimated_completion || selected[0].estimated_days_to_complete : 0
      estDate = Math.ceil(Number(estDate))
      dueDate = moment()
        .add(estDate, 'days')
        .format('YYYY-MM-DD')
    }

    if (callback.onAssign) {
      this.props.callback.onAssign({
        templates,
        due_date: dueDate,
        type,
      })
      this.props.onClose()
    } else {
      let payload = {}
      if (equals(type, 'tracks')) {
        payload = {
          user_id: assignees,
          track_id: templates,
          card_type: type,
          due_date: dueDate,
          company_id: companyId,
        }
      } else {
        payload = {
          user_id: assignees,
          card_template_id: templates,
          card_type: type,
          due_date: dueDate,
          company_id: companyId,
        }
      }

      if (isNil(this.state.dueDate) || equals(type, 'courses')) {
        this.props.onAssign(payload)
        this.props.onClose()
      } else {
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
    }
  }

  handleTab(type) {
    const { search } = this.state
    this.props.onSearch({ filter: search, mode: type, publish: true })
    this.setState({ type })
  }

  render() {
    const { role, data, employees } = this.props
    const { tabs, type, assignees, dueDate, selected, search } = this.state

    return (
      <div className="assign-modal" data-cy="hcm-assign-training-modal">
        <div className="modal-header">
          <Header title="Assign Training" />
        </div>
        <div className="modal-body">
          <Tabs
            defaultActiveKey="courses"
            data-cy={`hcm-assign-training-tabs`}
            activeKey={type}
            id="assign-training"
            onSelect={this.handleTab}
          >
            {tabs.map(tab => (
              <Tab key={tab.name} eventKey={tab.name} title={tab.label}>
                <Body
                  isEstDate
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
                />
              </Tab>
            ))}
          </Tabs>
        </div>
        <div className="modal-footer">
          <Footer
            disabled={isNil(dueDate)}
            selected={selected}
            onAssign={this.handleSubmit}
            onAdd={role < UserRoles.MANAGER ? this.handleAddNew : null}
          />
        </div>
      </div>
    )
  }
}

AssignTraining.propTypes = {
  role: PropTypes.number,
  data: PropTypes.any.isRequired,
  userIds: PropTypes.array, // assigned users initially
  disabled: PropTypes.array, // disable some tabs initially
  callback: PropTypes.any,
  onAssign: PropTypes.func,
  onSearch: PropTypes.func,
  onModal: PropTypes.func,
  onClose: PropTypes.func,
}

AssignTraining.defaultProps = {
  role: 1,
  data: {},
  userIds: [],
  disabled: [],
  callback: {},
  onAssign: () => {},
  onSearch: () => {},
  onModal: () => {},
  onClose: () => {},
}

export default AssignTraining

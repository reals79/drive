import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { toast } from 'react-toastify'
import { equals, filter, find, includes, isEmpty } from 'ramda'
import moment from 'moment'
import { Pagination, RecordHeader, RecordItem } from '@components'
import { history } from '~/reducers'
import { UserType } from '~/services/config'
import './Company.scss'

class Employees extends Component {
  state = {
    current: 1,
    perPage: 25,
    search: '',
    employees: this.props.employees,
    viewMode: false,
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (isEmpty(prevState.search)) return { employees: nextProps.employees }
    const employees = filter(
      employee => includes(prevState.search.toLowerCase(), employee.name.toLowerCase()),
      nextProps.employees
    )
    return { employees }
  }

  handleSwitchMngUsrView = value => {
    const { editable } = this.props

    if (editable) {
      this.setState({ viewMode: value })
    } else {
      toast.error('Sorry, you do not have permission to do that.')
    }
  }

  handleFilter = e => {
    this.setState({ search: e.target.value })
  }

  handleChange = user => e => {
    if (e === 'edit') {
      history.push(`/library/record-employee-info/${user.id}?edit=about`)
    } else if (e === 'detail view') {
      history.push(`/library/record-employee-info/${user.id}`)
    } else if (e === 'terminate') {
      const payload = {
        user_id: [user.id],
        date: moment(new Date()).format('YYYY-MM-DD'),
      }
      this.props.onTerminate(user.company_id, payload)
    }
  }

  handlePage = e => {
    this.setState({ current: e })
  }

  handlePer = e => {
    if (e > 50) {
      this.setState({ current: 1, perPage: e })
    } else this.setState({ perPage: e })
  }

  handleAssign = user => e => {
    let type = 'Training'

    switch (e) {
      case 'Training':
        type = 'Assign Training'
        break
      case 'Scorecard':
        type = 'Assign ToDo'
        break
      case 'Habit':
        type = 'Assign ToDo'
        break
      case 'Program':
        type = 'Assign Program'
        break
      case 'Certifications':
        type = 'Assign Program'
        break
    }
    const payload = {
      type,
      data: { before: { assignees: [user.id], companyId: user.company_id }, after: {} },
      callBack: {},
    }
    this.props.onModal(payload)
  }

  render() {
    const { companies, departments, managers, roles, history } = this.props
    const { employees, current, perPage, viewMode } = this.state

    return (
      <div className="mt-2">
        <RecordHeader
          employees={employees.length}
          departments={departments.length}
          teams={2}
          roles={roles.length}
          supervisors={managers.length}
          viewMode={viewMode}
          onChange={this.handleFilter}
          onChangeView={this.handleSwitchMngUsrView}
        />
        {employees.map((user, index) => {
          if (index < perPage * current && index >= perPage * (current - 1)) {
            return (
              <RecordItem
                key={user.id}
                data={user}
                company={find(e => equals(e.id, user.company_id))(companies)}
                department={find(e => equals(e.id, user.department_id))(departments)}
                supervisor={
                  find(e => equals(e.id, user.manager_id))(managers) || {
                    profile: { first_name: '', last_name: '' },
                  }
                }
                permission={find(e => equals(e.id, user.app_role_id))(UserType)}
                jobRole={find(e => equals(e.id, user.job_role_id))(roles) || { job_role: {} }}
                expanded={viewMode}
                history={history}
                onChange={this.handleChange(user)}
                onAssign={this.handleAssign(user)}
              />
            )
          }
        })}
        <Pagination
          current={current}
          total={Math.ceil(employees.length / perPage)}
          onChange={this.handlePage}
          onPer={this.handlePer}
        />
      </div>
    )
  }
}

Employees.propTypes = {
  companies: PropTypes.array.isRequired,
  employees: PropTypes.array.isRequired,
  roles: PropTypes.array.isRequired,
  editable: PropTypes.bool.isRequired,
  fetchUsers: PropTypes.func.isRequired,
}

Employees.defaultProps = {
  companies: [],
  employees: [],
  roles: [],
  editable: false,
  fetchUsers: () => {},
}

export default Employees

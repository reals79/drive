import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { compose, equals, filter, find, includes, prop, propEq, sortBy, toLower } from 'ramda'
import { ErrorBoundary, Filter, Pagination, RecordHeader, RecordItem } from '@components'
import AppActions from '~/actions/app'
import { UserType } from '~/services/config'
import './Company.scss'

class CompanyRoster extends Component {
  state = {
    current: 1,
    perPage: 10,
    data: [],
    employees: this.props.employees,
    search: '',
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const sortByName = sortBy(compose(toLower, prop('name')))
    let employees = sortByName(nextProps.employees)
    employees = filter(item => includes(toLower(prevState.search), toLower(item.name)), employees)
    return { employees }
  }

  componentDidMount() {
    this.props.fetchUsers()
  }

  handleFilter = e => {
    this.setState({ search: e.target.value })
  }

  handleChange = user => e => {
    if (e === 'edit') {
      this.props.history.push(`/library/record-employee-info/${user.id}?edit=about`)
    } else if (e === 'view') {
      this.props.history.push(`/library/record-employee-info/${user.id}`)
    }
  }

  handlePage = e => {
    this.setState({ current: e })
  }

  handleModal = () => {
    const payload = { type: 'Add Employee', data: { before: null, after: null }, callBack: null }
    this.props.toggleModal(payload)
  }

  render() {
    const { companies, companyId } = this.props
    const { employees, current, perPage } = this.state
    const company = find(propEq('id', companyId), companies)
    const departments = company.departments
    const managers = company.managers
    const roles = company.job_roles

    return (
      <ErrorBoundary className="dev-company-roster">
        <Filter addTitle="Employee" onAdd={this.handleModal} />
        <RecordHeader
          departments={departments.length}
          teams={2}
          roles={roles.length}
          supervisors={managers.length}
          employees={employees.length}
          onChange={this.handleFilter}
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
                onChange={this.handleChange(user)}
              />
            )
          }
        })}
        <Pagination current={current} total={Math.ceil(employees.length / perPage)} onChange={this.handlePage} />
      </ErrorBoundary>
    )
  }
}

CompanyRoster.propTypes = {
  userId: PropTypes.number.isRequired,
  companyId: PropTypes.number.isRequired,
  companies: PropTypes.array.isRequired,
  employees: PropTypes.array.isRequired,
  roles: PropTypes.array.isRequired,
  fetchUsers: PropTypes.func.isRequired,
}

CompanyRoster.defaultProps = {
  userId: 0,
  companyId: 0,
  companies: [],
  employees: [],
  roles: [],
  fetchUsers: () => {},
}

const mapStateToProps = state => ({
  userId: state.app.id,
  companyId: state.app.company_info.id,
  companies: state.app.companies,
  employees: state.app.employees,
})

const mapDispatchToProps = dispatch => ({
  fetchUsers: () => dispatch(AppActions.postmulticompanydataRequest()),
  updateUsers: (payload, companyId) => dispatch(AppActions.postcompanyusersRequest(payload, companyId)),
  toggleModal: e => dispatch(AppActions.modalRequest(e)),
})

export default connect(mapStateToProps, mapDispatchToProps)(CompanyRoster)

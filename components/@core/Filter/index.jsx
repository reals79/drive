import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { clone, filter, includes, isNil, prepend, uniq } from 'ramda'
import classNames from 'classnames'
import { Button, Dropdown, Icon } from '@components'
import AppActions from '~/actions/app'
import { UserRoles, SPECIALOPTIONS } from '~/services/config'
import './Filter.scss'

class Filter extends Component {
  state = {
    companies: [],
    employees: [],
    defaultIds: [
      this.props.defaultIds[0].length ? this.props.defaultIds[0] : this.props.company,
      this.props.defaultIds[1].length ? this.props.defaultIds[1] : this.props.employee[this.props.type],
    ],
    disabled: this.props.disabled,
    selectedCompanies: this.props.company,
    selectedEmployees: this.props.employee[this.props.type],
  }

  handleChange = type => e => {
    if (e.length < 1) return

    const { removed } = this.props
    const { disabled, selectedCompanies } = this.state
    const ID = e[0].id
    let companyIds = []
    let employeeIds = []
    if (type === 'company') {
      if (ID === SPECIALOPTIONS.ALL) {
        // User select All Companies option
        companyIds = this.props.companies.map(item => item.id)
        disabled[0].push(SPECIALOPTIONS.ALL)
        disabled[0] = uniq(disabled[0])

        const INDIVIDUAL = includes(SPECIALOPTIONS.LIST, removed[1])
          ? this.props.employee['individual']
          : [SPECIALOPTIONS.LIST]
        this.props.updateFilter([ID], {
          individual: INDIVIDUAL,
          team: this.props.employee['team'],
        })

        this.setState({
          selectedCompanies: [ID],
          selectedEmployees: INDIVIDUAL,
          disabled,
        })

        this.props.pullEmployees({ company_id: companyIds })
      } else {
        // User select companies
        companyIds = e.map(item => item.id)
        disabled[0] = filter(e => e !== SPECIALOPTIONS.ALL && e == SPECIALOPTIONS.LIST, disabled[0])

        // When user select from All Companies to a company...
        if (ID !== SPECIALOPTIONS.ALL && selectedCompanies[0] == SPECIALOPTIONS.ALL) {
          const _employees = filter(e => e.company_id == ID, this.props.employees)
          this.props.onChange('employee', _employees)
        }

        this.props.updateFilter(companyIds, this.props.employee)

        this.setState({ selectedCompanies: companyIds, disabled })

        this.props.pullEmployees({ company_id: companyIds })
      }
      this.props.pullCompanies()
      this.props.onChange(type, e)
    } else if (type === 'employee') {
      if (ID == SPECIALOPTIONS.ALL) {
        // User select All Employees
        this.props.updateFilter(this.props.company, {
          individual: [ID],
          team: this.props.employee['team'],
        })
        this.setState({ selectedEmployees: [ID] })
        this.props.onChange(type, e)
      } else if (ID === SPECIALOPTIONS.LIST) {
        // User select List Companies
        companyIds = this.props.companies.map(item => item.id)
        employeeIds = this.props.employees.map(item => item.id)
        disabled[1].push(SPECIALOPTIONS.ALL)
        disabled[1] = uniq(disabled[1])
        this.props.updateFilter([SPECIALOPTIONS.ALL], {
          individual: [ID],
          team: this.props.employee['team'],
        })
        this.setState({
          selectedCompanies: [SPECIALOPTIONS.ALL],
          selectedEmployees: [ID],
          disabled,
        })
        this.props.pullCompanies()
        this.props.onChange('company', [{ id: SPECIALOPTIONS.ALL, name: 'All Companies' }])
      } else {
        // User select normal Employees
        employeeIds = e.map(item => item.id)
        this.props.updateFilter(this.props.company, {
          individual: employeeIds,
          team: this.props.employee['team'],
        })
        this.setState({ selectedEmployees: employeeIds })
        this.props.onChange(type, e)
      }
    }
  }

  render() {
    const {
      className,
      filters,
      aligns,
      multi,
      mountEvent,
      addPrefix,
      addTitle,
      backTitle,
      role,
      removed,
      dataCy,
    } = this.props
    const { defaultIds, disabled } = this.state

    let companies = clone(this.props.companies)
    let employees = clone(this.props.employees)

    if (role < UserRoles.EMPLOYEE) {
      employees = prepend({ id: SPECIALOPTIONS.LIST, name: 'List Companies' }, employees)
      employees = prepend({ id: SPECIALOPTIONS.ALL, name: 'All Employees' }, employees)
    }

    if (role < UserRoles.EMPLOYEE && role > UserRoles.SUPER_ADMIN) {
      companies = prepend({ id: SPECIALOPTIONS.ALL, name: 'All Companies' }, companies)
    }

    filters.forEach((item, index) => {
      if (item === 'company' && removed[index].length > 0) {
        companies = filter(e => !includes(e.id, removed[index]), companies)
      }
      if (item === 'employee' && removed[index].length > 0) {
        employees = filter(e => !includes(e.id, removed[index]), employees)
      }
    })

    return (
      <div className={classNames('core-filter border-5', className)} data-cy={dataCy}>
        <div className="d-flex">
          {filters.map((item, index) => (
            <div key={`core-filter-${index}`}>
              {item === 'company' && (
                <div className="d-flex align-items-center" data-cy="companyDropdownBox">
                  <Dropdown
                    key={`core-filter-${item}`}
                    align={aligns[index]}
                    disabledOptions={disabled[index]}
                    data={companies}
                    multi={multi}
                    defaultIds={defaultIds[index]}
                    getValue={item => item['name']}
                    returnBy="data"
                    mountEvent={mountEvent}
                    title="Company :"
                    onChange={this.handleChange('company')}
                  />
                </div>
              )}

              {item === 'employee' && (
                <div className="d-flex align-items-center" data-cy="employeeDropdownBox">
                  <Dropdown
                    className="custom-box"
                    key={`core-filter-${item}`}
                    align={aligns[index]}
                    disabledOptions={disabled[index]}
                    data={employees}
                    multi={multi}
                    defaultIds={defaultIds[index]}
                    getValue={item => item['name']}
                    returnBy="data"
                    mountEvent={mountEvent}
                    title="Assignee :"
                    onChange={this.handleChange('employee')}
                  />
                </div>
              )}
              {index !== filters.length - 1 && <span className="vert-line" />}
            </div>
          ))}
        </div>
        {!isNil(addTitle) && role < UserRoles.MANAGER && (
          <Button
            type="low"
            size="small"
            className={classNames('desktop-screen', addTitle == 'esign' && 'text-capitalize')}
            name={`+ ${addPrefix} ${addTitle == 'esign' ? 'eSign' : addTitle}`}
            onClick={this.props.onAdd}
          />
        )}
        {!isNil(backTitle) && (
          <Button className="d-flex justify-content-end pr-3 pl-3" type="low" size="small" onClick={this.props.onBack}>
            <Icon name="fal fa-arrow-left mr-3" size={12} color="#376caf" />
            <div className="d-none d-lg-block">{backTitle == 'Back' ? 'Back' : `Back to ${backTitle}`}</div>
          </Button>
        )}
      </div>
    )
  }
}

Filter.propTypes = {
  className: PropTypes.string,
  filters: PropTypes.array,

  defaultIds: PropTypes.array,
  aligns: PropTypes.array,
  disabled: PropTypes.array,
  removed: PropTypes.array,
  multi: PropTypes.bool,
  mountEvent: PropTypes.bool,
  companies: PropTypes.array.isRequired,
  employees: PropTypes.array.isRequired,
  role: PropTypes.number.isRequired,
  company: PropTypes.array.isRequired,
  employee: PropTypes.object.isRequired,
  addPrefix: PropTypes.string,
  addTitle: PropTypes.string,
  backTitle: PropTypes.string,
  onAdd: PropTypes.func,
  onBack: PropTypes.func,
  onChange: PropTypes.func,
}

Filter.defaultProps = {
  className: '',
  filters: ['company', 'employee'],
  type: 'team',
  defaultIds: [[], []],
  aligns: ['left', 'right'],
  disabled: [[], []],
  removed: [[], []],
  multi: false,
  mountEvent: false,
  company: [-1],
  employee: [-1],
  addPrefix: 'Add',
  addTitle: null,
  backTitle: null,
  onAdd: () => {},
  onBack: () => {},
  onChange: (type, data) => {},
}

const mapStateToProps = state => ({
  role: state.app.primary_role_id,
  userId: state.app.id,
  companies: state.app.companies,
  employees: state.app.employees,
  company: state.app.selectedCompany,
  employee: state.app.selectedEmployee,
})

const mapDispatchToProps = dispatch => ({
  pullCompanies: () => dispatch(AppActions.postmulticompanydataRequest()),
  pullEmployees: e => dispatch(AppActions.postcompanyemployeesRequest(e)),
  updateFilter: (companies, employees) => dispatch(AppActions.globalfilterRequest(companies, employees)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Filter)

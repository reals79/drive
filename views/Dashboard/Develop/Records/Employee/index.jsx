import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { equals, find, isEmpty, isNil, propEq } from 'ramda'
import queryString from 'query-string'
import { Avatar, Filter, Dropdown, RecordEmployeeRecordCard } from '@components'
import AppActions from '~/actions/app'
import DevActions from '~/actions/develop'
import { convertUrl } from '~/services/util'
import { SPECIALOPTIONS } from '~/services/config'
import './Employee.scss'

class Employee extends Component {
  constructor(props) {
    super(props)
    const userId = Number(props.match.params.id)
    const values = queryString.parse(props.location.search)
    this.state = {
      company: {},
      employee: {},
      editing: isNil(values.edit) ? '' : values.edit,
      userId: userId || props.userId,
      avatarUploaded: null,
      selectedPage: 'Employee Record',
    }
    this.handleDiscard = this.handleDiscard.bind(this)
    this.handleDrop = this.handleDrop.bind(this)
    this.handleFilter = this.handleFilter.bind(this)
    this.handleSave = this.handleSave.bind(this)
    this.handlePage = this.handlePage.bind(this)
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const item = find(d => equals(d.id, prevState.userId), nextProps.employees)
    if (isEmpty(prevState.employee) && !isNil(item)) {
      const employee = {
        app_role_id: item.app_role_id,
        company_id: item.company_id,
        department_id: item.department_id,
        email: item.email,
        email2: item.email2,
        hired_at: item.hired_at,
        id: item.id,
        job_role_id: item.job_role_id,
        job_title_id: item.job_title_id,
        manager_id: item.manager_id,
        name: item.name,
        avatar: convertUrl(item.profile.avatar, '/images/default.png'),
        first_name: item.profile.first_name,
        last_name: item.profile.last_name,
        phone: item.profile.phone,
        secondary_phone: item.profile.secondary_phone,
        career: item.profile.career_goal,
        about: item.profile.about_me,
      }
      return { employee }
    }
    return null
  }

  componentDidMount() {
    this.props.fetchUsers()
    this.props.fetchNotifications()
  }

  handleDiscard() {
    const item = find(d => equals(d.id, this.state.userId), this.props.employees)
    if (!isNil(item)) {
      const employee = {
        app_role_id: item.app_role_id,
        company_id: item.company_id,
        department_id: item.department_id,
        email: item.email,
        email2: item.email2,
        hired_at: item.hired_at,
        id: item.id,
        job_role_id: item.job_role_id,
        job_title_id: item.job_title_id,
        manager_id: item.manager_id,
        name: item.name,
        avatar: convertUrl(item.profile.avatar, '/images/default.png'),
        first_name: item.profile.first_name,
        last_name: item.profile.last_name,
        phone: item.profile.phone,
        secondary_phone: item.profile.secondary_phone,
        career: item.profile.career_goal,
        about: item.profile.about_me,
      }
      this.setState({ employee, editing: '' })
    }
  }

  handleDrop(file) {
    const reader = new FileReader()
    reader.onload = e => {
      this.setState({ avatarUploaded: e.target.result })
    }
    reader.readAsDataURL(file)
  }

  handleFilter(type, e) {
    if (isNil(e[0])) return
    if (type === 'employee') {
      if (e[0].id !== SPECIALOPTIONS.ALL) {
        const userId = Number(this.props.match.params.id)
        const item = userId ? find(d => equals(d.id, userId), this.props.employees) : e[0]
        this.setState({
          employee: {
            app_role_id: item.app_role_id,
            company_id: item.company_id,
            department_id: item.department_id,
            email: item.email,
            email2: item.email2,
            hired_at: item.hired_at,
            id: item.id,
            job_role_id: item.job_role_id,
            job_title_id: item.job_title_id,
            manager_id: item.manager_id,
            name: item.name,
            avatar: convertUrl(item.profile.avatar, '/images/default.png'),
            first_name: item.profile.first_name,
            last_name: item.profile.last_name,
            phone: item.profile.phone,
            secondary_phone: item.profile.secondary_phone,
            career: item.profile.career_goal,
            about: item.profile.about_me,
          },
        })
      }
    }

    if (type === 'company') {
      if (e[0].id !== SPECIALOPTIONS.ALL) {
        this.setState({
          company: {
            id: e[0].id,
            name: e[0].name,
            logo: convertUrl(e[0].data.logo, '/images/default.png'),
            street: e[0].data.profile.address.street,
            city: e[0].data.profile.address.city,
            state: e[0].data.profile.address.state,
            zip: e[0].data.profile.address.zip,
            phone: e[0].data.profile.primary_phone,
            website: e[0].data.profile.url,

            parent_id: e[0].parent_id,
            status: e[0].status,
          },
        })
      }
    }
  }

  handlePage(e) {
    this.setState({ selectedPage: e[0].value })
  }

  handleSave(company, employee) {
    const { avatarUploaded } = this.state

    if (this.props.admin) {
      const payload = {
        company: {
          id: company.id,
          parent_id: company.parent_id,
          name: company.name,
          data: {
            profile: {
              url: company.website,
              address: {
                zip: company.zip,
                city: company.city,
                state: company.state,
                street: company.street,
              },
            },
          },
        },
      }
      this.props.updateCompany(payload, company.id)
    } else {
      const payload = {
        user: {
          [employee.id]: {
            id: employee.id,
            first_name: employee.first_name,
            last_name: employee.last_name,
            company_id: employee.company_id,
            job_role_id: employee.job_role_id,
            job_title_id: employee.job_title_id,
            hired_at: employee.hired_at,
            email: employee.email,
            email2: employee.email2,
            phone: employee.phone,
            secondary_phone: employee.secondary_phone,
            career_goal: employee.career,
            about_me: employee.about,
            cropped_image: avatarUploaded,
          },
        },
      }
      this.props.updateUsers(payload, employee.company_id)
    }
  }

  render() {
    const { companyId, notificationsData, updateNotifications, history, companies } = this.props
    const { company, employee, editing, userId, selectedPage, editable } = this.state
    const _company = find(propEq('id', companyId), companies)
    const roles = _company.job_roles

    return (
      <div className="lib-employee-record">
        <Filter mountEvent backTitle="all employees" onBack={() => history.goBack()} onChange={this.handleFilter} />
        <div className="info">
          <div className="top">
            <div className="left">
              <Avatar
                url={employee.avatar}
                type="logo"
                borderColor="white"
                borderWidth={4}
                upload={!isEmpty(editing)}
                size="extraLarge"
                noCrop
                onDrop={this.handleDrop}
              />
            </div>
            <div className="right">
              <div>
                <p className="dsl-w24 mb-2">
                  {employee.first_name} {employee.last_name}
                </p>
                <p className="dsl-w14 text-200">Company: {company.name}</p>
                {/* <div className="d-flex align-items-end">
                  <span className="dsl-w12 text-200">No Subscription</span>
                  <Icon name="far fa-question-circle mr-4 mb-0" color="white" size={12} />
                  <Rating score={5} />
                  <span className="dsl-w14 text-200 ml-2">0 Recommendations</span>
                  <Icon name="fa fa-chevron-right ml-1" color="#fff" size={12} />
                </div> */}
              </div>
            </div>
          </div>
          <div className="bottom">
            <div className="tab active">
              <Dropdown
                width="fit-content"
                data={[
                  { id: 1, value: 'Employee Record' },
                  { id: 2, value: 'Notification Settings' },
                ]}
                defaultIds={[1]}
                direction="vertical"
                returnBy="data"
                onChange={this.handlePage}
              />
            </div>
            <div className="gap" />
            {/* Hiding this section for now */}
            {/* <div className="tab">
              <span className="dsl-w14">Blog</span>
              <span className="dsl-w10 text-200 ml-2">(0)</span>
            </div>
            <div className="gap" />
            <div className="tab">
              <span className="dsl-w14">Connections</span>
              <span className="dsl-w10 text-200 ml-2">(0)</span>
            </div>
            <div className="gap" />
            <div className="tab">
              <span className="dsl-w14">Recommendations</span>
              <span className="dsl-w10 text-200 ml-2">(0)</span>
            </div> */}
          </div>
        </div>
        {selectedPage === 'Employee Record' && (
          <RecordEmployeeRecordCard.EmployeeRecord
            company={company}
            employee={employee}
            editing={editing}
            editable={editable}
            roles={roles}
            onSave={this.handleSave}
            onDiscard={this.handleDiscard}
          />
        )}
        {selectedPage === 'Notification Settings' && (
          <RecordEmployeeRecordCard.Settings
            notificationsData={notificationsData}
            userId={userId}
            onSave={updateNotifications}
          />
        )}
      </div>
    )
  }
}

Employee.propTypes = {
  editable: PropTypes.bool.isRequired,
  userId: PropTypes.number.isRequired,
  companyId: PropTypes.number.isRequired,
  fetchUsers: PropTypes.func.isRequired,
  fetchNotifications: PropTypes.func.isRequired,
  updateNotifications: PropTypes.func.isRequired,
}

Employee.defaultProps = {
  editable: false,
  userId: 0,
  companyId: 0,
  fetchUsers: () => {},
  fetchNotifications: () => {},
  updateNotifications: () => {},
}

const mapStateToProps = state => ({
  editable: state.app.app_role_id < 4,
  userId: state.app.id,
  companyId: state.app.company_info.id,
  employees: state.app.employees,
  companies: state.app.companies,
  notificationsData: state.develop.notificationsSettings,
})

const mapDispatchToProps = dispatch => ({
  fetchUsers: () => dispatch(AppActions.postmulticompanydataRequest()),
  fetchNotifications: () => dispatch(DevActions.fetchnotificationssettingsRequest()),
  updateNotifications: payload => dispatch(DevActions.updatenotificationssettingsRequest(payload)),
  updateUsers: (payload, companyId) => dispatch(AppActions.postcompanyusersRequest(payload, companyId)),
  updateCompany: (payload, companyId) => dispatch(DevActions.postcompanyinfoRequest(payload, companyId)),
  upload: payload => dispatch(AppActions.uploadRequest(payload)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Employee)

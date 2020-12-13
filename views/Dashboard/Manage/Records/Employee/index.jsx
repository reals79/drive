import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Tabs, Tab } from 'react-bootstrap'
import { equals, find, filter, isEmpty, isNil, propEq } from 'ramda'
import queryString from 'query-string'
import moment from 'moment'
import { Avatar, Button, DatePicker, Dropdown, EditDropdown, Filter, Icon, Input } from '@components'
import AppActions from '~/actions/app'
import DevActions from '~/actions/develop'
import { EmployeeMenuItems, SPECIALOPTIONS, UserType, UserRoles } from '~/services/config'
import { convertUrl } from '~/services/util'
import Settings from './Settings'
import './Employee.scss'

class Employee extends Component {
  constructor(props) {
    super(props)
    const userId = Number(props.match.params.id)
    const values = queryString.parse(props.location.search)
    const company = find(propEq('id', props.companyId), props.companies) || { id: props.companyId }
    const roles = company.job_roles || []
    this.state = {
      company: {},
      employee: {},
      editing: isNil(values.edit) ? '' : values.edit,
      userId: userId || props.userId,
      avatarUploaded: null,
      editable: false,
      selectedTab: 'about',
      jobDescription: [],
      roles,
    }
    this.handleDrop = this.handleDrop.bind(this)
    this.handleFilter = this.handleFilter.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleSave = this.handleSave.bind(this)
    this.handleDropdown = this.handleDropdown.bind(this)
    this.handleSelectTab = this.handleSelectTab.bind(this)
    this.handleChangeNotificationSettings = this.handleChangeNotificationSettings.bind(this)
    this.handleDiscard = this.handleDiscard.bind(this)
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
      const jobRole = filter(role => equals(employee.job_role_id, role.id), prevState.roles)
      const jobDescription = jobRole.length == 0 ? [] : jobRole[0].titles

      return { employee, jobDescription }
    }
    return null
  }

  componentDidMount() {
    this.props.fetchUsers()
    this.props.fetchNotificationSettings()
  }

  handleChange(key, value) {
    const { company, employee } = this.state
    if (this.props.admin) {
      company[key] = value
      this.setState({ company })
    } else {
      if (key === 'job_role_id') {
        employee[key] = value[0].id
        this.setState({ employee, jobDescription: value[0].titles })
      }
      if (key === 'app_role_id') {
        employee[key] = value[0].id
        this.setState({ employee })
      } else {
        employee[key] = value
        this.setState({ employee })
      }
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
    const { employees } = this.props
    const { roles } = this.state
    if (isNil(e[0])) return
    if (type === 'employee') {
      if (e[0].id !== SPECIALOPTIONS.ALL) {
        const userId = this.state.userId === e[0].id ? userId : e[0].id
        const item = userId ? find(d => d.id === userId, employees) : e[0]
        const jobRole = filter(role => item.job_role_id === role.id, roles)
        const jobDescription = jobRole.length == 0 ? [] : jobRole[0].titles
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
          jobDescription,
        })
      } else return
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

  handleDropdown(section, employee, event) {
    const { roles } = this.state
    switch (event) {
      case 'edit': {
        this.setState({ editing: section, editable: true })
        break
      }
      case 'delete': {
        this.props.toggleModal({
          type: 'Confirm',
          data: {
            before: {
              title: 'Delete',
              body: 'Are you sure you want to delete this User?',
            },
          },
          callBack: {
            onYes: () => this.props.deleteUser(employee.id, employee.company_id),
          },
        })
        const item = find(d => equals(d.id, this.props.userId), this.props.employees)
        const jobRole = filter(role => equals(item.job_role_id, role.id), roles)
        const jobDescription = jobRole.length == 0 ? [] : jobRole[0].titles
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
          jobDescription,
        })
        break
      }
      case 'terminate': {
        const payload = {
          user_id: [employee.id],
          date: moment().format('YYYY-MM-DD'),
        }
        this.props.toggleModal({
          type: 'Confirm',
          data: {
            before: {
              title: 'Terminate',
              body: 'Are you sure you want to Terminate this user?',
            },
          },
          callBack: {
            onYes: () => this.props.terminateUser(payload, employee.company_id, event),
          },
        })
        const item = find(d => equals(d.id, this.props.userId), this.props.employees)
        const jobRole = filter(role => equals(item.job_role_id, role.id), roles)
        const jobDescription = jobRole.length == 0 ? [] : jobRole[0].titles
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
          jobDescription,
        })
        break
      }
      default:
        break
    }
  }

  handleSave() {
    const { company, avatarUploaded } = this.state

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
      const { employee } = this.state
      let user = {}
      user[employee.id] = {
        app_role_id: employee.app_role_id,
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
      }
      const payload = {
        user,
      }
      this.props.updateUser(payload, employee.company_id)
    }

    this.setState({ editing: false, editable: false })
  }

  handleDiscard() {
    const item = find(d => equals(d.id, this.state.userId), this.props.employees)
    const jobRole = filter(role => equals(item.job_role_id, role.id), this.state.roles)
    const jobDescription = jobRole.length == 0 ? [] : jobRole[0].titles
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
      this.setState({ employee, jobDescription, editing: '', editable: false })
    }
  }

  handleSelectTab(selectedTab) {
    this.setState({ selectedTab })
  }

  handleChangeNotificationSettings(e) {
    this.props.updateNotificationSettings(e)
  }

  render() {
    const { company, employee, editing, jobDescription, editable, selectedTab, roles } = this.state
    const { userRole, notificationSettings } = this.props
    const aboutMenuitems = editable
      ? filter(x => x !== 'Edit', EmployeeMenuItems[userRole])
      : EmployeeMenuItems[userRole]
    const positionMenuitems = ['Edit']
    const userType = UserType.filter(type => !(type.label === 'Super Admin'))

    return (
      <div className="employee-info">
        <Filter mountEvent onChange={this.handleFilter} />
        <div className="info">
          <div className="top">
            <div className="left">
              <div className="avatar-box">
                <Avatar
                  url={employee.avatar}
                  borderColor="white"
                  borderWidth={4}
                  upload={!isEmpty(editing)}
                  size="extraLarge"
                  type="logo"
                  onDrop={this.handleDrop}
                />
              </div>
            </div>
            <div className="right">
              <div>
                <p className="dsl-w24 mb-2">
                  {employee.first_name} {employee.last_name}
                </p>
                <p className="dsl-w14 text-200">{company.name}</p>
              </div>
            </div>
          </div>
          <Tabs defaultActiveKey="career" activeKey={selectedTab} id="employee-info" onSelect={this.handleSelectTab}>
            <Tab eventKey="about" title={<div className="tab-name">About</div>}>
              <div className="card">
                <div className="d-flex justify-content-between mb-2">
                  <span className="dsl-b22 bold">About</span>
                  <EditDropdown options={aboutMenuitems} onChange={this.handleDropdown.bind(this, 'about', employee)} />
                </div>
                <Input
                  title="First name"
                  value={employee.first_name}
                  disabled={!equals('about', editing)}
                  onChange={this.handleChange.bind(this, 'first_name')}
                />
                <Input
                  title="Last name"
                  value={employee.last_name}
                  disabled={!equals('about', editing)}
                  onChange={this.handleChange.bind(this, 'last_name')}
                />
                <Input
                  title="Cell phone"
                  value={employee.phone}
                  disabled={!equals('about', editing)}
                  onChange={this.handleChange.bind(this, 'phone')}
                />
                <Input
                  title="Office phone"
                  value={employee.secondary_phone}
                  disabled={!equals('about', editing)}
                  onChange={this.handleChange.bind(this, 'secondary_phone')}
                />
                <Input
                  title="Work email"
                  value={employee.email}
                  disabled={!equals('about', editing)}
                  onChange={this.handleChange.bind(this, 'email')}
                />
                <Input
                  title="Other email"
                  value={employee.email2}
                  disabled={!equals('about', editing)}
                  onChange={this.handleChange.bind(this, 'email2')}
                />
                <Input
                  title="About me"
                  value={employee.about}
                  disabled={!equals('about', editing)}
                  onChange={this.handleChange.bind(this, 'about')}
                />
                <Input
                  title="3 year career goal"
                  value={employee.career}
                  disabled={!equals('about', editing)}
                  onChange={this.handleChange.bind(this, 'career')}
                />
                {editing === 'about' && (
                  <div className="d-flex justify-content-end mt-3">
                    <Button type="medium" className="mr-3" name="Discard" onClick={this.handleDiscard} />
                    <Button name="Save" onClick={this.handleSave} />
                  </div>
                )}
              </div>
              <div className="card">
                <div className="d-flex justify-content-between mb-2">
                  <span className="dsl-b22 bold">Position</span>
                  <EditDropdown
                    options={positionMenuitems}
                    onChange={this.handleDropdown.bind(this, 'position', employee)}
                  />
                </div>
                <DatePicker
                  title="Hire date"
                  value={employee.hired_at}
                  disabled={!equals('position', editing)}
                  calendar="day"
                  append="caret"
                  as="input"
                  onSelect={this.handleChange.bind(this, 'hired_at')}
                />
                <Dropdown
                  title="Job title"
                  data={roles}
                  defaultIds={[employee.job_role_id]}
                  disabled={!equals('position', editing)}
                  placeholder="Select"
                  returnBy="data"
                  getId={data => data['id']}
                  getValue={data => data['name']}
                  onChange={this.handleChange.bind(this, 'job_role_id')}
                />
                <Dropdown
                  title="Job description"
                  data={jobDescription}
                  defaultIds={[employee.job_title_id]}
                  disabled={editing !== 'position'}
                  placeholder="Select"
                  returnBy="data"
                  getId={data => data['id']}
                  getValue={data => data['name']}
                  onChange={this.handleChange.bind(this, 'job_title_id')}
                />
                <Input title="Direct reports" value="None" disabled />
                <Dropdown
                  className="permission"
                  title="Permissions"
                  data={userType}
                  defaultIds={[employee.app_role_id]}
                  disabled={!equals('position', editing) || !(userRole < UserRoles.MANAGER)}
                  placeholder="Select"
                  returnBy="data"
                  getId={data => data['id']}
                  getValue={data => data['label']}
                  onChange={this.handleChange.bind(this, 'app_role_id')}
                />
                {editing === 'position' && (
                  <div className="d-flex justify-content-end mt-3">
                    <Button type="medium" className="mr-3" name="Discard" onClick={this.handleDiscard} />
                    <Button name="Save" onClick={this.handleSave} />
                  </div>
                )}
              </div>
            </Tab>
            <Tab
              eventKey="settings"
              title={
                <div className="tab-name">
                  <Icon name="fal fa-cog" color="white" size={14} />
                </div>
              }
            >
              <Settings
                userId={this.props.userId}
                data={notificationSettings}
                onSave={this.handleChangeNotificationSettings}
                userRole={userRole}
              />
            </Tab>
          </Tabs>
        </div>
      </div>
    )
  }
}

Employee.propTypes = {
  userId: PropTypes.number.isRequired,
  userRole: PropTypes.number,
  companyId: PropTypes.number.isRequired,
  companies: PropTypes.array.isRequired,
  notificationSettings: PropTypes.any,
  fetchUsers: PropTypes.func.isRequired,
  toggleModal: PropTypes.func,
  terminateUser: PropTypes.func,
  deleteUser: PropTypes.func,
  fetchNotificationSettings: PropTypes.func,
  updateNotificationSettings: PropTypes.func,
}

Employee.defaultProps = {
  userId: 0,
  userRole: 1,
  companyId: 0,
  notificationSettings: {},
  fetchUsers: () => {},
  toggleModal: () => {},
  terminateUser: () => {},
  deleteUser: () => {},
  fetchNotificationSettings: () => {},
  updateNotificationSettings: () => {},
}

const mapStateToProps = state => ({
  userId: state.app.id,
  userRole: state.app.app_role_id,
  companyId: state.app.company_info.id,
  employees: state.app.employees,
  companies: state.app.companies,
  notificationSettings: state.develop.notificationsSettings,
})

const mapDispatchToProps = dispatch => ({
  fetchUsers: () => dispatch(AppActions.postmulticompanydataRequest()),
  updateUser: (payload, companyId) => dispatch(AppActions.postcompanyusersRequest(payload, companyId)),
  updateCompany: (payload, companyId) => dispatch(DevActions.postcompanyinfoRequest(payload, companyId)),
  upload: payload => dispatch(AppActions.uploadRequest(payload)),
  toggleModal: e => dispatch(AppActions.modalRequest(e)),
  terminateUser: (payload, companyId, event) =>
    dispatch(DevActions.postterminateuserRequest(payload, companyId, event)),
  deleteUser: (userId, companyId) => dispatch(DevActions.postdeleteuserRequest(userId, companyId)),
  fetchNotificationSettings: () => dispatch(DevActions.fetchnotificationssettingsRequest()),
  updateNotificationSettings: e => dispatch(DevActions.updatenotificationssettingsRequest(e)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Employee)

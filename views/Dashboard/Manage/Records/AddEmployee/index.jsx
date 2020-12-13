import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { find, isEmpty, isNil, propEq } from 'ramda'
import moment from 'moment'
import { Avatar, Button, DatePicker, Dropdown, Filter, Input } from '@components'
import AppActions from '~/actions/app'
import { UserType } from '~/services/config'
import './AddEmployee.scss'

class AddEmployee extends Component {
  state = {
    disabled: true,
    companyId: this.props.companyId,
    thumbnail: '/images/default.png',
    firstName: '',
    lastName: '',
    cellPhone: '',
    officePhone: '',
    workEmail: '',
    otherEmail: '',
    aboutMe: '',
    careerGoal: '',
    hireDate: moment(),
    appRole: UserType[3],
    jobRole: null,
    department: null,
    manager: null,
    team: null,
    payPlan: null,
    supervisor: null,
    directReports: null,
    careerProgram: null,
    scorecards: null,
    badges: null,
    habitSchedule: null,
    certifications: null,
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { firstName, lastName, workEmail, jobRole, hireDate, appRole } = prevState
    const disabled = isEmpty(firstName) || isEmpty(lastName) || isNil(jobRole) || isNil(appRole)

    return { disabled }
  }

  handleDrop = e => {
    this.setState({ thumbnail: e })
  }

  handleFilter = (type, data) => {
    if (data[0].id < 0) this.setState({ companyId: this.props.companyId })
    else this.setState({ companyId: data[0].id })
  }

  handleSubmit = () => {
    const {
      disabled,
      firstName,
      lastName,
      cellPhone,
      officePhone,
      workEmail,
      otherEmail,
      aboutMe,
      careerGoal,
      jobRole,
      hireDate,
      appRole,
      manager,
    } = this.state

    if (disabled) return

    const payload = {
      new_user: [
        {
          first_name: firstName,
          last_name: lastName,
          phone: cellPhone,
          secondary_phone: officePhone,
          email: workEmail,
          email2: otherEmail,
          about_me: aboutMe,
          career_goal: careerGoal,
          manager_id: manager.id,
          app_role_id: appRole.id,
          job_role_id: jobRole.id,
          job_title_id: jobRole.titles[0].id,
          birthday: null,
          biography: null,
          timezone: null,
          hired_at: hireDate.format('YYYY-MM-DD'),
        },
      ],
    }
    this.props.addUsers(payload, this.state.companyId)

    this.setState({
      disabled: true,
      thumbnail: '/images/default.png',
      firstName: '',
      lastName: '',
      cellPhone: '',
      officePhone: '',
      workEmail: '',
      otherEmail: '',
      aboutMe: '',
      careerGoal: '',
      hireDate: moment(),
      appRole: UserType[3],
      jobRole: null,
      department: null,
      manager: null,
      team: null,
      payPlan: null,
      supervisor: null,
      directReports: null,
      careerProgram: null,
      scorecards: null,
      badges: null,
      habitSchedule: null,
      certifications: null,
    })
  }

  handleModal = type => {
    if (type === 'career') {
      this.props.toggleModal({
        type: 'Assign Program',
        data: { before: { disabled: ['certifications'] }, after: {} },
        callBack: null,
      })
    } else if (type === 'certifications') {
      this.props.toggleModal({
        type: 'Assign Program',
        data: { before: { disabled: ['careers'] }, after: {} },
        callBack: null,
      })
    } else if (type === 'scorecard') {
      this.props.toggleModal({
        type: 'Assign ToDo',
        data: { before: { disabled: ['habits', 'habitslist', 'quotas'] }, after: {} },
        callBack: null,
      })
    } else {
      this.props.toggleModal({
        type: 'Assign ToDo',
        data: { before: { disabled: ['habits', 'scorecards', 'quotas'] }, after: {} },
        callBack: null,
      })
    }
  }

  render() {
    const { companies, companyId } = this.props
    const {
      thumbnail,
      firstName,
      lastName,
      cellPhone,
      officePhone,
      workEmail,
      otherEmail,
      aboutMe,
      careerGoal,
      hireDate,
    } = this.state
    const userType = UserType.filter(type => !(type.label === 'Super Admin'))
    const company = find(propEq('id', companyId), companies)
    const departments = company.departments
    const managers = company.managers
    const roles = company.job_roles

    return (
      <div className="mng-add-employee">
        <Filter mountEvent filters={['company']} onChange={this.handleFilter} />
        <div className="card">
          <div className="permission">
            <div className="pb-4 border-bottom-light">
              <p className="dsl-b16 bold">Permissions</p>
              <Dropdown
                title="User Type"
                data={userType}
                width={250}
                align="right"
                placeholder="User"
                returnBy="data"
                defaultIds={[4]}
                getId={data => data['id']}
                getValue={data => data['label']}
                onChange={e => this.setState({ appRole: e[0] })}
              />
            </div>
          </div>
          <div className="d-flex">
            <Avatar
              url={thumbnail}
              borderColor="white"
              borderWidth={4}
              upload
              size="extraLarge"
              type="logo"
              onDrop={this.handleDrop}
            />
            <div className="info">
              <div className="py-4 border-bottom-light">
                <p className="dsl-b16 bold">About</p>
                <Input
                  title="First name"
                  placeholder="Type here..."
                  value={firstName}
                  onChange={e => this.setState({ firstName: e })}
                />
                <Input
                  title="Last name"
                  placeholder="Type here..."
                  value={lastName}
                  onChange={e => this.setState({ lastName: e })}
                />
                <Input
                  title="Cell phone"
                  placeholder="Type here..."
                  value={cellPhone}
                  onChange={e => this.setState({ cellPhone: e })}
                />
                <Input
                  title="Office phone"
                  placeholder="Type here..."
                  value={officePhone}
                  onChange={e => this.setState({ officePhone: e })}
                />
                <Input
                  title="Work email"
                  placeholder="Type here..."
                  value={workEmail}
                  onChange={e => this.setState({ workEmail: e })}
                />
                <Input
                  title="Other email"
                  placeholder="Type here..."
                  value={otherEmail}
                  onChange={e => this.setState({ otherEmail: e })}
                />
              </div>
              <Input
                title="About me"
                placeholder="Type here..."
                value={aboutMe}
                onChange={e => this.setState({ aboutMe: e })}
              />
              <Input
                title="3 year career goal"
                placeholder="Type here..."
                value={careerGoal}
                onChange={e => this.setState({ careerGoal: e })}
              />
              <div className="py-4 border-bottom-light">
                <p className="dsl-b16 bold">Position</p>
                <div className="d-flex">
                  <div className="d-flex-1">
                    <DatePicker
                      title="Hire date"
                      value={hireDate}
                      calendar="day"
                      append="caret"
                      format="MMM D, YY"
                      as="input"
                      onSelect={e => this.setState({ hireDate: e })}
                    />
                    <Dropdown
                      title="Department"
                      data={departments}
                      width={250}
                      align="right"
                      placeholder="Select"
                      getValue={data => data['name']}
                      onChange={e => this.setState({ department: e })}
                    />
                    {/* <Dropdown
                      title="Team"
                      data={[]}
                      width={250}
                      align="right"
                      placeholder="Select"
                      getValue={data => data['name']}
                      onChange={e => this.setState({ team: e })}
                    /> */}
                    {/* <Dropdown
                      title="Supervisor"
                      data={[]}
                      width={250}
                      align="right"
                      placeholder="Select"
                      getValue={data => data['name']}
                      onChange={e => this.setState({ supervisor: e })}
                    /> */}
                  </div>
                  <div className="d-flex-1">
                    <Dropdown
                      title="Job role"
                      data={roles}
                      width={250}
                      align="right"
                      placeholder="Select"
                      returnBy="data"
                      getId={data => data['id']}
                      getValue={data => data['name']}
                      onChange={e => this.setState({ jobRole: e[0] })}
                    />
                    {/* <Dropdown
                      title="Pay plan"
                      data={[]}
                      width={250}
                      align="right"
                      placeholder="Select"
                      getValue={data => data['name']}
                      onChange={e => this.setState({ payPlan: e })}
                    /> */}
                    {/* <Dropdown
                      title="Direct reports"
                      data={[]}
                      width={250}
                      align="right"
                      placeholder="Select"
                      getValue={data => data['name']}
                      onChange={e => this.setState({ directReports: e })}
                    /> */}
                    <Dropdown
                      title="Manager"
                      data={managers}
                      width={250}
                      align="right"
                      placeholder="Select"
                      returnBy="data"
                      getId={data => data['id']}
                      getValue={data => `${data.profile.first_name} ${data.profile.last_name}`}
                      onChange={e => this.setState({ manager: e[0] })}
                    />
                  </div>
                </div>
              </div>
              <div className="py-4">
                <p className="dsl-b16 bold">Assignments</p>
                <div className="d-flex">
                  <div className="d-flex-1">
                    <div className="assign">
                      <span className="dsl-m12">Career program</span>
                      <Button type="low" name="Assign" onClick={this.handleModal.bind(this, 'career')} />
                    </div>
                    <div className="assign">
                      <span className="dsl-m12">Certifications</span>
                      <Button type="low" name="Assign" onClick={this.handleModal.bind(this, 'certifications')} />
                    </div>
                  </div>
                  <div className="d-flex-1">
                    <div className="assign">
                      <span className="dsl-m12">Scorecards</span>
                      <Button type="low" name="Assign" onClick={this.handleModal.bind(this, 'scorecard')} />
                    </div>
                    <div className="assign">
                      <span className="dsl-m12">Habit schedule</span>
                      <Button type="low" name="Assign" onClick={this.handleModal.bind(this, 'habitschedule')} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="d-flex mt-3">
          <Button className="ml-auto" name="Save" onClick={this.handleSubmit} />
        </div>
      </div>
    )
  }
}

AddEmployee.propTypes = {
  userId: PropTypes.number.isRequired,
  companyId: PropTypes.number.isRequired,
  companies: PropTypes.array.isRequired,
  onAdd: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
}

AddEmployee.defaultProps = {
  userId: 0,
  companyId: 0,
  companies: [],
  onAdd: () => {},
  onClose: () => {},
}

const mapStateToProps = state => ({
  userId: state.app.id,
  companyId: state.app.company_info.id,
  companies: state.app.companies,
})

const mapDispatchToProps = dispatch => ({
  addUsers: (payload, companyId) => dispatch(AppActions.postcompanyusersRequest(payload, companyId)),
  toggleModal: payload => dispatch(AppActions.modalRequest(payload)),
})

export default connect(mapStateToProps, mapDispatchToProps)(AddEmployee)

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { equals, isEmpty, isNil, find, propEq } from 'ramda'
import moment from 'moment'
import { Avatar, Button, Filter, Input, DatePicker, Dropdown, Icon } from '@components'
import './AddEmployee.scss'

class AddEmployee extends Component {
  constructor(props) {
    super(props)

    this.state = {
      thumbnail: '/images/default.png',
      firstName: '',
      lastName: '',
      cellPhone: '',
      officePhone: '',
      workEmail: '',
      otherEmail: '',
      hireDate: moment(),
      jobRole: null,
      department: null,
      jobDescription: '',
      team: null,
      payPlan: null,
      supervisor: null,
      directReports: null,
      careerProgram: null,
      scorecards: null,
      badges: null,
      habitSchedule: null,
      certifications: null,
      temp: [{ id: 0, name: 'Select' }],
    }

    this.handleDrop = this.handleDrop.bind(this)
    this.handleModal = this.handleModal.bind(this)
  }

  handleDrop(e) {
    this.setState({ thumbnail: e })
  }

  handleSubmit() {
    const { firstName, lastName, workEmail, jobRole, hireDate } = this.state
    if (isEmpty(firstName) || isEmpty(lastName) || isNil(jobRole)) return
    const jobTitle = find(propEq('name', jobRole.job_role.name), jobRole.job_role.titles)
    const payload = {
      new_user: [
        {
          first_name: firstName,
          last_name: lastName,
          email: workEmail,
          manager_id: null,
          app_role_id: 5,
          job_role_id: jobRole.job_role.id,
          job_title_id: jobTitle.id,
          birthday: null,
          biography: null,
          timezone: null,
          hired_at: hireDate.format('MM-DD-YYYY'),
        },
      ],
    }
    this.props.onAdd(payload)
    this.props.onClose()
  }

  handleModal(type) {
    if (equals('career', type)) {
      this.props.onModal({
        type: 'Assign Program',
        data: { before: {}, after: {} },
        callBack: null,
      })
    }
  }

  render() {
    const { roles, departments } = this.props
    const {
      thumbnail,
      firstName,
      lastName,
      cellPhone,
      officePhone,
      workEmail,
      otherEmail,
      hireDate,
      temp,
    } = this.state

    return (
      <div className="add-employee">
        <div className="modal-header bg-primary text-white">
          <Icon name="fal fa-plus-circle mr-2" color="white" size={17} />
          <span>Add Employee</span>
        </div>
        <Filter showTitle filters={['company']} />
        <div className="modal-body">
          <div className="d-flex">
            <Avatar
              url={thumbnail}
              type="logo"
              borderColor="white"
              borderWidth={4}
              upload
              size="extraLarge"
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
                      width={200}
                      align="right"
                      placeholder="Select"
                      getValue={data => data['name']}
                      onChange={e => this.setState({ department: e })}
                    />
                    <Dropdown
                      title="Team"
                      data={temp}
                      width={200}
                      align="right"
                      placeholder="Select"
                      getValue={data => data['name']}
                      onChange={e => this.setState({ team: e })}
                    />
                    <Dropdown
                      title="Supervisor"
                      data={temp}
                      width={200}
                      align="right"
                      placeholder="Select"
                      getValue={data => data['name']}
                      onChange={e => this.setState({ supervisor: e })}
                    />
                  </div>
                  <div className="d-flex-1">
                    <Dropdown
                      title="Job role"
                      data={roles}
                      width={200}
                      align="right"
                      placeholder="Select"
                      returnBy="data"
                      getId={data => data['id']}
                      getValue={data => data['name']}
                      onChange={e => this.setState({ jobRole: e[0] })}
                    />
                    <Dropdown
                      title="Pay plan"
                      data={temp}
                      width={200}
                      align="right"
                      placeholder="Select"
                      getValue={data => data['name']}
                      onChange={e => this.setState({ payPlan: e })}
                    />
                    <Dropdown
                      title="Direct reports"
                      data={temp}
                      width={200}
                      align="right"
                      placeholder="Select"
                      getValue={data => data['name']}
                      onChange={e => this.setState({ directReports: e })}
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
                      <Button
                        type="low"
                        name="Assign"
                        onClick={this.handleModal.bind(this, 'career')}
                      />
                    </div>
                    <div className="assign">
                      <span className="dsl-m12">Certifications</span>
                      <Button type="low" name="Assign" />
                    </div>
                  </div>
                  <div className="d-flex-1">
                    <div className="assign">
                      <span className="dsl-m12">Scorecards</span>
                      <Button type="low" name="Assign" />
                    </div>
                    <div className="assign">
                      <span className="dsl-m12">Habit schedule</span>
                      <Button type="low" name="Assign" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <Button name="Save" onClick={() => this.handleSubmit()} />
        </div>
      </div>
    )
  }
}

AddEmployee.propTypes = {
  roles: PropTypes.array.isRequired,
  onAdd: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
}

AddEmployee.defaultProps = {
  roles: [],
  onAdd: () => {},
  onClose: () => {},
}

export default AddEmployee

import React from 'react'
import PropTypes from 'prop-types'
import { equals, filter } from 'ramda'
import { Button, Input, DatePicker, Dropdown, EditDropdown } from '@components'
import { NotificationSettings } from '~/services/config'
import NotificationCard from './NotificationCard'

class EmployeeRecord extends React.PureComponent {
  constructor(props) {
    super(props)

    this.state = {
      editing: props.editing,
      company: props.company,
      employee: props.employee,
      jobDescription: [],
    }
    this.handleToggle = this.handleToggle.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleDropdown = this.handleDropdown.bind(this)
    this.handleSave = this.handleSave.bind(this)
    this.handleDiscard = this.handleDiscard.bind(this)
  }

  static getDerivedStateFromProps(nextProps) {
    const { company, employee } = nextProps
    const jobRole = filter(role => equals(employee.job_role_id, role.id), nextProps.roles)
    const jobDescription = jobRole[0].titles
    return { company, employee, jobDescription }
  }

  handleToggle(e) {
    this.props.onToggle(e)
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
      } else if (key === 'job_title_id') {
        employee[key] = value[0].id
        this.setState({ employee })
      } else {
        employee[key] = value
        this.setState({ employee })
      }
    }
  }

  handleDropdown(section, e) {
    if (equals('edit', e)) {
      this.setState({ editing: section })
    }
  }

  handleSave() {
    const { company, employee } = this.state
    this.props.onSave(company, employee)
    this.setState({ editing: false })
  }

  handleDiscard() {
    this.props.onDiscard()
    this.setState({ editing: false })
  }

  render() {
    const { editing, employee, jobDescription } = this.state
    const { editable, roles } = this.props
    const employeeMenu = ['Edit']

    return (
      <>
        <div className="card">
          <div className="d-flex justify-content-between mb-2">
            <span className="dsl-b22 bold">About</span>
            {editable && (
              <EditDropdown
                options={employeeMenu}
                onChange={this.handleDropdown.bind(this, 'about')}
              />
            )}
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
          {equals('about', editing) && (
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
              options={employeeMenu}
              onChange={this.handleDropdown.bind(this, 'position')}
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
          {/* <Input title="Department" value="Sales" disabled={!equals('position', editing)} />
          <Input title="Team" value="NA" disabled={!equals('position', editing)} />
          <Input
            title="Supervisor"
            value="Bart Wilson"
            disabled={!equals('position', editing)}
          />
          <Input
            title="Job role"
            value="Sr Sales Manager"
            disabled={!equals('position', editing)}
          /> */}
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
            disabled={!equals('position', editing)}
            placeholder="Select"
            returnBy="data"
            getId={data => data['id']}
            getValue={data => data['name']}
            onChange={this.handleChange.bind(this, 'job_title_id')}
          />
          {/* <Input
            title="Pay plan"
            value="2000 USD / 2 weeks"
            disabled={!equals('position', editing)}
          /> */}
          <Input title="Direct reports" value="7 Direct Reports" disabled />
          {/* <Input
            title="Executed documents"
            value="New Employee Package, 1/1/18 Pay Plan"
            disabled={!equals('position', editing)}
          /> */}
          {equals('position', editing) && (
            <div className="d-flex justify-content-end mt-3">
              <Button type="medium" className="mr-3" name="Discard" onClick={this.handleDiscard} />
              <Button name="Save" onClick={this.handleSave} />
            </div>
          )}
        </div>
        {/* <div className="card">
          <div className="d-flex justify-content-between mb-2">
            <span className="dsl-b22 bold">Enrollments</span>
            {editable && (
              <Dropdown
                className="ellipsis"
                data={MenuItems}
                defaultIds={[0]}
                align="right"
                caret="dots-without-title"
                iconColor="#c3c7cc"
                iconSize={15}
                selectable={false}
                placeholder=""
                onChange={this.handleDropdown.bind(this, 'enrollments')}
              />
            )}
          </div>
          <Input
            title="Career programs"
            value="Jun 17, 16"
            disabled={!equals('enrollments', editing)}
          />
          <Input title="Badges" value="Sales" disabled={!equals('enrollments', editing)} />
          <Input title="Certifications" value="NA" disabled={!equals('enrollments', editing)} />
          <Input
            title="Scorecards"
            value="Bart Wilson"
            disabled={!equals('enrollments', editing)}
          />
          <Input
            title="Habits schedule"
            value="Sr Sales Manager"
            disabled={!equals('enrollments', editing)}
          />
        </div>
        <div className="card">
          <div className="d-flex justify-content-between mb-2">
            <span className="dsl-b22 bold">Performance</span>
            {editable && (
              <Dropdown
                className="ellipsis"
                data={MenuItems}
                defaultIds={[0]}
                align="right"
                caret="dots-without-title"
                iconColor="#c3c7cc"
                iconSize={15}
                selectable={false}
                placeholder=""
                onChange={this.handleDropdown.bind(this, 'performance')}
              />
            )}
          </div>
          <Input
            title="Hire date"
            value="Dec 3, 18"
            disabled={!equals('performance', editing)}
          />
          <Rating className="mt-2" title="Score" titleWidth={120} score={3} />
          <Rating className="mt-2 mb-1" title="YTD avg score" titleWidth={120} score={4} />
          <Input
            title="Open commitments"
            value="3"
            disabled={!equals('performance', editing)}
          />
          <Input title="Tasks" value="4" disabled={!equals('performance', editing)} />
          <Input title="Training" value="2" disabled={!equals('performance', editing)} />
        </div> */}
      </>
    )
  }
}

EmployeeRecord.propTypes = {
  data: PropTypes.array,
  onToggle: PropTypes.func,
}

EmployeeRecord.defaultProps = {
  data: [],
  onToggle: () => {},
}

class Settings extends React.PureComponent {
  constructor(props) {
    super(props)

    this.state = {
      notificationsData: props.notificationsData,
      development: null,
      management: null,
      training: null,
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { notificationsData } = prevState

    const data = notificationsData.data ? notificationsData.data : []
    const approvalType = data['Approval Task'] ? data['Approval Task'] : []
    const careerType = data.Career ? data.Career : []
    const certificationType = data.Certification ? data.Certification : []
    const courseType = data.Course ? data.Course : []
    const habitScheduleType = data['Habit Schedule'] ? data['Habit Schedule'] : []

    const trainingType = data['Training Schedule'] ? data['Training Schedule'] : []
    const scorecardType = data.Scorecard ? data.Scorecard : []
    const taskType = data.Task ? data.Task : []
    const trackType = data.Track ? data.Track : []

    return {
      approvalType,
      careerType,
      certificationType,
      courseType,
      habitScheduleType,
      trainingType,
      scorecardType,
      taskType,
      trackType,
    }
  }

  handleChange(index, paritem, childitem, type, e) {
    let data = []
    paritem = paritem.toLowerCase()
    let item,
      notification,
      approval,
      career,
      certification,
      course,
      habitSchedule,
      trainingSchedule,
      scorecard,
      task,
      track = null

    const { notificationsData } = this.state
    switch (index) {
      case 'Approval Task':
        item = {
          ...notificationsData.data['Approval Task'][paritem][childitem],
          [type]: equals(true, e) ? 1 : 0,
        }
        notification = {
          ...notificationsData.data['Approval Task'][paritem],
          [childitem]: item,
        }
        approval = { ...notificationsData.data['Approval Task'], [paritem]: notification }
        data = { ...notificationsData.data, 'Approval Task': approval }
        break
      case 'Career':
        item = {
          ...notificationsData.data['Career'][paritem][childitem],
          [type]: equals(true, e) ? 1 : 0,
        }
        notification = {
          ...notificationsData.data['Career'][paritem],
          [childitem]: item,
        }
        career = { ...notificationsData.data['Career'], [paritem]: notification }
        data = { ...notificationsData.data, Career: career }
        break
      case 'Certifications':
        item = {
          ...notificationsData.data['Certification'][paritem][childitem],
          [type]: equals(true, e) ? 1 : 0,
        }
        notification = {
          ...notificationsData.data['Certification'][paritem],
          [childitem]: item,
        }
        certification = { ...notificationsData.data['Certification'], [paritem]: notification }
        data = { ...notificationsData.data, Certification: certification }
        break
      case 'Courses':
        item = {
          ...notificationsData.data['Course'][paritem][childitem],
          [type]: equals(true, e) ? 1 : 0,
        }
        notification = {
          ...notificationsData.data['Course'][paritem],
          [childitem]: item,
        }
        course = { ...notificationsData.data['Course'], [paritem]: notification }
        data = { ...notificationsData.data, Course: course }
        break

      case 'Habit Schedule':
        item = {
          ...notificationsData.data['Habit Schedule'][paritem][childitem],
          [type]: equals(true, e) ? 1 : 0,
        }
        notification = {
          ...notificationsData.data['Habit Schedule'][paritem],
          [childitem]: item,
        }
        habitSchedule = { ...notificationsData.data['Habit Schedule'], [paritem]: notification }
        data = { ...notificationsData.data, 'Habit Schedule': habitSchedule }
        break
      case 'Training Schedule':
        item = {
          ...notificationsData.data['Training Schedule'][paritem][childitem],
          [type]: equals(true, e) ? 1 : 0,
        }
        notification = {
          ...notificationsData.data['Training Schedule'][paritem],
          [childitem]: item,
        }
        trainingSchedule = {
          ...notificationsData.data['Training Schedule'],
          [paritem]: notification,
        }
        data = { ...notificationsData.data, 'Training Schedule': trainingSchedule }
        break
      case 'Scorecards':
        item = {
          ...notificationsData.data['Scorecard'][paritem][childitem],
          [type]: equals(true, e) ? 1 : 0,
        }
        notification = {
          ...notificationsData.data['Scorecard'][paritem],
          [childitem]: item,
        }
        scorecard = { ...notificationsData.data['Scorecard'], [paritem]: notification }
        data = { ...notificationsData.data, Scorecard: scorecard }
        break
      case 'Tasks':
        item = {
          ...notificationsData.data['Task'][paritem][childitem],
          [type]: equals(true, e) ? 1 : 0,
        }
        notification = {
          ...notificationsData.data['Task'][paritem],
          [childitem]: item,
        }
        task = { ...notificationsData.data['Task'], [paritem]: notification }
        data = { ...notificationsData.data, Task: task }
        break
      case 'Tracks':
        item = {
          ...notificationsData.data['Track'][paritem][childitem],
          [type]: equals(true, e) ? 1 : 0,
        }
        notification = {
          ...notificationsData.data['Track'][paritem],
          [childitem]: item,
        }
        track = { ...notificationsData.data['Track'], [paritem]: notification }
        data = { ...notificationsData.data, Track: track }
        break

      default:
        break
    }
    const payload = {
      ...notificationsData,
      data,
      user_id: this.props.userId,
    }
    this.setState({ notificationsData: payload })
  }

  handleSubmit() {
    this.props.onSave(this.state.notificationsData)
  }

  render() {
    const {
      approvalType,
      careerType,
      certificationType,
      courseType,
      habitScheduleType,
      trainingType,
      scorecardType,
      taskType,
      trackType,
    } = this.state
    return (
      <div className="card">
        <NotificationCard
          notification={approvalType}
          title="Approval Task"
          headers={NotificationSettings.ApprovalTask}
          onChange={this.handleChange}
        />
        <NotificationCard
          notification={careerType}
          title="Career"
          headers={NotificationSettings.Career}
          onChange={this.handleChange}
        />
        <NotificationCard
          notification={certificationType}
          title="Certifications"
          headers={NotificationSettings.Certification}
          onChange={this.handleChange}
        />
        <NotificationCard
          notification={courseType}
          title="Courses"
          headers={NotificationSettings.Courses}
          onChange={this.handleChange}
        />
        <NotificationCard
          notification={habitScheduleType}
          title="Habit Schedule"
          headers={NotificationSettings.HabitSchedule}
          onChange={this.handleChange}
        />
        <NotificationCard
          notification={trainingType}
          title="Training Schedule"
          headers={NotificationSettings.TrainingSchedule}
          onChange={this.handleChange}
        />
        <NotificationCard
          notification={scorecardType}
          title="Scorecards"
          headers={NotificationSettings.Scorecards}
          onChange={this.handleChange}
        />
        <NotificationCard
          notification={taskType}
          title="Tasks"
          headers={NotificationSettings.Tasks}
          onChange={this.handleChange}
        />
        <NotificationCard
          notification={trackType}
          title="Tracks"
          headers={NotificationSettings.Track}
          onChange={this.handleChange}
        />
        <div className="p-2">
          <Button className="float-right" name="Save" onClick={this.handleSubmit} />
        </div>
      </div>
    )
  }
}

Settings.propTypes = {
  development: PropTypes.array,
  management: PropTypes.array,
  training: PropTypes.array,
}

Settings.defaultProps = {
  development: [],
  management: [],
  training: [],
}

export { EmployeeRecord, Settings }

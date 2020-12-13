import React, { memo } from 'react'
import PropTypes from 'prop-types'
import { Row, Col } from 'react-bootstrap'
import { path } from 'ramda'
import moment from 'moment'
import { Avatar, Input, EditDropdown } from '@components'
import { convertUrl, avatarBackgroundColor } from '~/services/util'
import AssignmentDetail from './AssignmentDetail'
import './RecordItem.scss'

function RecordItem(props) {
  const {
    data,
    company,
    supervisor,
    department,
    permission,
    jobRole,
    expanded,
    onChange,
    onAssign,
    history,
  } = props
  const avatar = convertUrl(data.profile.avatar, '/images/default.png')

  return (
    <div className="record-item">
      <div className="d-flex">
        <div className="record-item-header">
          <Avatar
            url={avatar}
            size="medium"
            type="initial"
            name={data.name}
            backgroundColor={avatarBackgroundColor(data.id)}
            onToggle={() => history.push(`/library/record-employee-info/${data.id}`)}
          />
          <p className="dsl-m12 text-center my-3">Since</p>
          <p className="dsl-b14 text-center">{moment(data.hired_at).format('MMM DD, YY')}</p>
        </div>
        <div className="record-item-body">
          <div className="d-flex justify-content-between">
            <span className="dsl-b16 bold">{data.name}</span>
            <EditDropdown options={['Detail View', 'Edit', 'Terminate']} onChange={onChange} />
          </div>
          <Row className="mt-3">
            <Col xs={12} sm={6} md={4}>
              <Input title="Company" tooltip disabled value={company.name} />
              <Input title="Department" value={department.name} tooltip disabled />
              <Input title="Team" value="N/A" tooltip disabled />
              <Input title="Job role" value={jobRole.name} tooltip disabled />
              <Input
                title="Supervisor"
                value={`${supervisor.profile.first_name} ${supervisor.profile.last_name}`}
                tooltip
                disabled
              />
            </Col>
            <Col xs={12} sm={6} md={4}>
              <Input title="Phone" value={data.profile.phone} tooltip disabled />
              <Input title="Email" value={data.email} tooltip disabled />
              <Input title="Permissions" value={permission.label} tooltip disabled />
              <Input title="Status" value="N/A" tooltip disabled />
            </Col>
            <Col xs={12} sm={6} md={4}>
              {expanded && (
                <AssignmentDetail
                  training={path(['extra', 'trainings'], data)}
                  scorecards={path(['extra', 'scorecards'], data)}
                  habitSchedule={path(['extra', 'habit_schedules'], data)}
                  career={path(['extra', 'programs'], data)}
                  certifications={path(['extra', 'certifications'], data)}
                  onAssign={onAssign}
                />
              )}
            </Col>
          </Row>
        </div>
      </div>
    </div>
  )
}

RecordItem.propTypes = {
  data: PropTypes.object.isRequired,
  company: PropTypes.any.isRequired,
  supervisor: PropTypes.any.isRequired,
  department: PropTypes.any.isRequired,
  permission: PropTypes.any.isRequired,
  roles: PropTypes.array.isRequired,
  expanded: PropTypes.bool.isRequired,
  onAssign: PropTypes.func,
}

RecordItem.defaultProps = {
  data: {},
  company: [],
  supervisor: {},
  department: {},
  permission: {},
  roles: [],
  expanded: false,
  onAssign: () => {},
}

export default memo(RecordItem)

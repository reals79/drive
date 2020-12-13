import React, { Component } from 'react'
import classNames from 'classnames'
import { OverlayTrigger } from 'react-bootstrap'
import { values } from 'ramda'
import { AverageTooltip, Icon, Rating } from '@components'
import OrgEmployeeList from './OrgEmployeeList'

class OrgChart extends Component {
  state = {
    isOpen: false,
    departmentColumn: null,
  }

  handleVisibility = index => {
    const { isOpen } = this.state
    this.setState({ isOpen: !isOpen, departmentColumn: index })
  }

  render() {
    const { isOpen, departmentColumn } = this.state
    const { data, userRole, column, onReport, onSelectMenu } = this.props
    const { departments } = data
    return (
      <>
        <div className="list-title mt-2 pb-2 pl-0">
          <div className="d-flex-4 dsl-m12 mr-3 mr-md-0">Departments</div>
          <div className="d-flex-2 dsl-m12 ml-2 text-right">Teams</div>
          <div className="d-flex-2 dsl-m12 pl-3 pl-md-0 text-right">Employees</div>
          <div className="d-flex-3 dsl-m12 text-right">Completed</div>
          <div className="d-flex-1" />
          <div className="d-flex-3 dsl-m12 text-left">Score</div>
        </div>
        {departments?.map((item, index) => {
          const { department, totals } = item
          const employees = values(item?.employees)
          return (
            <div key={index}>
              <div className="list-item cursor-pointer" onClick={() => this.handleVisibility(index)}>
                <div className="d-flex-4 list-item-title mr-3 mr-md-0">
                  <Icon
                    name={`fal fa-angle-${isOpen && departmentColumn === index ? 'down' : 'right'}`}
                    size={14}
                    color="#343f4b"
                    className="icon-text"
                  />
                  <OverlayTrigger
                    placement="bottom-end"
                    overlay={AverageTooltip(totals, department?.name || department)}
                  >
                    <span className="dsl-b14 ml-2">{department?.name || department}</span>
                  </OverlayTrigger>
                </div>
                <div className="d-flex-2 ml-2 text-right">
                  <span className="dsl-b14">0</span>
                </div>
                <div className="d-flex-2 pl-3 pl-md-0 text-right">
                  <span className="dsl-b14">{totals?.employees?.count || 0}</span>
                </div>
                <div className="d-flex-3 text-right">
                  <span className="dsl-b14">{totals?.reviews_completed?.count || 0}</span>
                </div>
                <div className="d-flex-1" />
                <div className="d-flex-3 dsl-m12 text-left">
                  <Rating score={totals?.completed_average_star_score?.stars} />
                </div>
              </div>
              <div className={classNames('ml-3', isOpen && departmentColumn === index ? 'd-block' : 'd-none')}>
                {employees.length !== 0 && (
                  <OrgEmployeeList
                    column={column}
                    employees={employees}
                    userRole={userRole}
                    onReport={onReport}
                    onSelectMenu={onSelectMenu}
                  />
                )}
              </div>
            </div>
          )
        })}
      </>
    )
  }
}

export default OrgChart

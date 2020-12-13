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
    const {
      data,
      userRole,
      column,
      startDate,
      endDate,
      onRowClick,
      onReport,
      onSelectMenu,
      onScorecardDetail,
    } = this.props
    const { departments } = data
    return (
      <div className="card orgchart-block">
        <div className="list-title mt-2 pb-2">
          <div className="d-flex-4 mr-3 mr-md-0">
            <span className="dsl-m12">Departments</span>
          </div>
          <div className="d-flex-2 ml-2 text-right">
            <span className="dsl-m12">Teams</span>
          </div>
          <div className="d-flex-2 pl-3 pl-md-0 text-right">
            <span className="dsl-m12">Employees</span>
          </div>
          <div className="d-flex-3 text-right">
            <span className="dsl-m12">Completed</span>
          </div>
          <div className="d-flex-1" />
          <div className="d-flex-3 text-left">
            <span className="dsl-m12">Score</span>
          </div>
        </div>
        {departments?.map((item, index) => {
          const { department, totals } = item
          const employees = values(item?.employees)
          return (
            <div key={index}>
              <div className="list-item cursor-pointer" onClick={() => this.handleVisibility(index)}>
                <div className="d-flex-4 list-item-title mr-3 mr-md-0">
                  <span>
                    {isOpen && departmentColumn === index ? (
                      <Icon name="fal fa-angle-down" size={14} color="#343f4b" className="icon-text" />
                    ) : (
                      <Icon name="fal fa-angle-right" size={14} color="#343f4b" className="icon-text" />
                    )}
                  </span>
                  <OverlayTrigger
                    placement="bottom-end"
                    overlay={AverageTooltip(totals, department?.name || department)}
                  >
                    <span className="dsl-b14 ml-2">{department?.name || department}</span>
                  </OverlayTrigger>
                </div>
                <div className="d-flex-2 ml-2 text-right listing">
                  <label className="dsl-b12 mb-0">Teams</label>
                  <span className="dsl-b14">0</span>
                </div>
                <div className="d-flex-2 pl-3 pl-md-0 text-right listing">
                  <label className="dsl-b12 mb-0">Employees</label>
                  <span className="dsl-b14">{totals?.employees?.count}</span>
                </div>
                <div className="d-flex-3 text-right listing">
                  <label className="dsl-b12 mb-0">Completed</label>
                  <span className="dsl-b14">{totals?.reviews_completed?.count}</span>
                </div>
                <div className="d-flex-1 d-flex-ssm-2" />
                <div className="d-flex-3 text-left listing">
                  <label className="dsl-b12 mb-0">Score</label>
                  <Rating score={totals?.completed_average_star_score?.stars} />
                </div>
              </div>
              <div className={classNames('pt-2 ml-3', isOpen && departmentColumn === index ? 'd-block' : 'd-none')}>
                {employees.length !== 0 && (
                  <OrgEmployeeList
                    column={column}
                    employees={employees}
                    startDate={startDate}
                    endDate={endDate}
                    userRole={userRole}
                    onRowClick={onRowClick}
                    onReport={onReport}
                    onSelectMenu={onSelectMenu}
                    onScorecardDetail={onScorecardDetail}
                  />
                )}
              </div>
            </div>
          )
        })}
      </div>
    )
  }
}

export default OrgChart

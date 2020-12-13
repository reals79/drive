import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Row, Col } from 'react-bootstrap'
import { Icon, Filter } from '@components'
import { UserRoles } from '~/services/config'
import './Reports.scss'

class Reports extends Component {
  state = { companyId: this.props.company.id }

  handleFilter = (type, e) => {
    if (equals('company', type) && e.length > 0) {
      this.setState({ companyId: e[0].id })
    }
  }

  render() {
    const { history, userRole } = this.props
    const isManager = userRole <= UserRoles.MANAGER

    return (
      <div className="mng-reports">
        <Filter onChange={this.handleFilter} />
        <div className="card">
          <div className="d-flex py-3 py-md-2 p-1 p-md-3">
            <p className="dsl-b22 bold mt-0 mt-md-2 mt-lg-2" data-cy="reportText">
              Reports
            </p>
            <div className="d-flex-1" />
            <Icon name="fas fa-th desktop-screen" color="#343f4b" size={14} />
            <Icon name="fas fa-th-list ml-2 desktop-screen" size={14} />
          </div>
          <Row className="items mt-4" data-cy="reportIconShowcase">
            <Col
              className="text-center contents my-4"
              data-cy="anniversaryReport"
              xs={6}
              sm={4}
              onClick={() => history.push('/hcm/report-anniversary')}
            >
              <Icon name="fal fa-calendar-day mt-2" color="#343f4b" size={22} />
              <p className="dsl-m16 mt-3">Anniversary Report</p>
            </Col>
            <Col
              className="text-center contents my-4"
              data-cy="assignmentReport"
              xs={6}
              sm={4}
              onClick={() => history.push('/hcm/report-assignments')}
            >
              <Icon name="fal fa-edit mt-2" color="#343f4b" size={22} />
              <p className="dsl-m16 mt-3">Assignments</p>
            </Col>
            <Col
              className="text-center contents my-4"
              data-cy="birthdayReport"
              xs={6}
              sm={4}
              onClick={() => history.push('/hcm/report-birthday')}
            >
              <Icon name="fal fa-birthday-cake mt-2" color="#343f4b" size={22} />
              <p className="dsl-m16 mt-3">Birthday Report</p>
            </Col>
            <Col
              className="text-center contents my-4"
              data-cy="careerReport"
              xs={6}
              sm={4}
              onClick={() => history.push('/hcm/report-careers')}
            >
              <Icon name="fal fa-user-tie mt-2" color="#343f4b" size={22} />
              <p className="dsl-m16 mt-3">Career</p>
            </Col>
            <Col
              className="text-center contents my-4"
              data-cy="CertificationReport"
              xs={6}
              sm={4}
              onClick={() => history.push('/hcm/report-certifications')}
            >
              <Icon name="fal fa-file-certificate mt-2" color="#343f4b" size={22} />
              <p className="dsl-m16 mt-3">Certifications</p>
            </Col>
            <Col
              className="text-center contents my-4"
              data-cy="companyInfoReport"
              xs={6}
              sm={4}
              onClick={() => history.push('/hcm/record-company-info')}
            >
              <Icon name="fal fa-car-building mt-2" color="#343f4b" size={22} />
              <p className="dsl-m16 mt-3">Company Info</p>
            </Col>
            <Col
              className="text-center contents my-4"
              data-cy="employeeInfoReport"
              xs={6}
              sm={4}
              onClick={() => history.push('/hcm/record-employee-info')}
            >
              <Icon name="fal fa-user mt-2" color="#343f4b" size={22} />
              <p className="dsl-m16 mt-3">Employee Info</p>
            </Col>
            <Col
              className="text-center contents my-4"
              data-cy="engagementReport"
              xs={6}
              sm={4}
              onClick={() => history.push('/hcm/report-engagement')}
            >
              <Icon name="fal fa-chart-network mt-2" color="#343f4b" size={22} />
              <p className="dsl-m16 mt-3">Engagement</p>
            </Col>
            {isManager && (
              <Col
                className="text-center contents my-4"
                data-cy="managerDashboardReport"
                xs={6}
                sm={4}
                onClick={() => history.push('/hcm/report-manager-dashboard')}
              >
                <Icon name="fal fa-tachometer-alt mt-2" color="#343f4b" size={22} />
                <p className="dsl-m16 mt-3">Manager Dashboard</p>
              </Col>
            )}
            {isManager && (
              <Col
                className="text-center contents my-4"
                data-cy="newHireOrientationReport"
                xs={6}
                sm={4}
                onClick={() => history.push('/hcm/report-new-hire-orientation')}
              >
                <Icon name="fal fa-user-plus mt-2" color="#343f4b" size={22} />
                <p className="dsl-m16 mt-3">New Hire Orientation</p>
              </Col>
            )}
            <Col
              className="text-center contents my-4"
              data-cy="performanceReport"
              xs={6}
              sm={4}
              onClick={() => history.push('/hcm/report-performance')}
            >
              <Icon name="fal fa-user-chart mt-2" color="#343f4b" size={22} />
              <p className="dsl-m16 mt-3">Performance</p>
            </Col>
            <Col
              xs={6}
              sm={4}
              className="text-center my-4 contents"
              data-cy="quotasReport"
              onClick={() => history.push('/hcm/report-quota')}
            >
              <Icon name="fal fa-location mt-2" color="#343f4b" size={22} />
              <p className="dsl-m16 mt-3">Quotas</p>
            </Col>
            <Col data-cy="signaturePacketReport" className="text-center my-4 contents" xs={6} sm={4}>
              <Icon name="fal fa-envelope-open-text mt-2" color="#343f4b" size={22} />
              <p className="dsl-m16 mt-3">Signature Packets</p>
            </Col>
            <Col
              className="text-center  contents my-4"
              data-cy="taskReport"
              xs={6}
              sm={4}
              onClick={() => history.push('/hcm/report-task')}
            >
              <Icon name="fal fa-check-circle mt-2" color="#343f4b" size={22} />
              <p className="dsl-m16 mt-3">Task</p>
            </Col>
            <Col
              className="text-center contents my-4"
              data-cy="trainingReport"
              xs={6}
              sm={4}
              onClick={() => history.push('/hcm/report-training')}
            >
              <Icon name="fal fa-university mt-2" color="#343f4b" size={22} />
              <p className="dsl-m16 mt-3">Training</p>
            </Col>
            <Col
              xs={6}
              sm={4}
              className="text-center my-4 contents"
              data-cy="trainingCompetencyReport"
              onClick={() => history.push('/hcm/report-training-competency')}
            >
              <Icon name="fal fa-hand-receiving mt-2" color="#343f4b" size={22} />
              <p className="dsl-m16 mt-3">Training Competency</p>
            </Col>
            <Col
              className="text-center  contents my-4"
              data-cy="trainingScheduleReport"
              xs={6}
              sm={4}
              onClick={() => history.push('/hcm/report-training-schedule')}
            >
              <Icon name="fal fa-business-time mt-2" color="#343f4b" size={22} />
              <p className="dsl-m16 mt-3">Training Schedule</p>
            </Col>
            {/* <Col xs={6} sm={4} className="text-center my-4 contents">
                <Icon name="fal fa-calendar-day mt-2" color="#343f4b" size={22} />
                <p className="dsl-m16 mt-3">Anniversary Report</p>
              </Col> */}
          </Row>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  company: state.app.companies[0],
  userRole: state.app.app_role_id,
})

export default connect(mapStateToProps)(Reports)

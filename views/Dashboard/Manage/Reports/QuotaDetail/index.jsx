import React, { Component } from 'react'
import { connect } from 'react-redux'
import { find, propEq, split } from 'ramda'
import originalMoment from 'moment'
import { extendMoment } from 'moment-range'
import { Avatar, DatePicker, EditDropdown, Filter, Icon } from '@components'
import { history } from '~/reducers'
import { avatarBackgroundColor } from '~/services/util'
import QuotaDetailPdf from '~/views/Dashboard/Manage/Reports/QuotaDetail/QuotaDetailPdf'
import './QuotaDetail.scss'

const moment = extendMoment(originalMoment)

class QuotaDetail extends Component {
  state = {
    startDate: moment().startOf('month'),
    endDate: moment().endOf('month'),
  }

  handlePdf = async () => {
    const { startDate, endDate } = this.state
    const {
      quotaReports: { quota_templates },
    } = this.props
    const nameQuota = this.props.match.params.id
    const tab = this.props.match.params.tab
    const quota_employee = find(propEq('id', parseInt(nameQuota)), quota_templates)
    const date = moment.range(startDate, endDate)

    const pdfData = { tab, date, nameQuota, employeeDetails: quota_employee }
    const blob = await QuotaDetailPdf(pdfData)
    const url = URL.createObjectURL(blob)
    window.open(url, '__blank')
  }

  render() {
    const { startDate, endDate } = this.state
    const {
      quotaReports: { quota_templates },
    } = this.props
    const nameQuota = this.props.match.params.id
    const quota_employee = find(propEq('id', parseInt(nameQuota)), quota_templates)
    const date = moment.range(startDate, endDate)

    return (
      <div className="quota-reports-details">
        <Filter backTitle="all quotas" onBack={() => history.goBack()} />
        <div className="card">
          <div className="d-flex justify-content-between align-items-center">
            <span className="dsl-b22 bold">{quota_employee.name}</span>
            <div className="d-flex">
              <DatePicker
                calendar="month"
                append="caret"
                format="MMM YY"
                as="span"
                align="right"
                append="caret"
                value={date}
              />
              <div className="d-flex justify-content-end cursor-pointer ml-3" onClick={this.handlePdf}>
                <Icon name="fal fa-print" color="#343f4b" size={16} />
              </div>
            </div>
          </div>
          <div className="list-item mt-5 pb-2 d-flex">
            <div className="d-flex-4 mr-3 dsl-b16">
              <span className="dsl-m12">Employee</span>
            </div>
            <div className="d-flex-4 ml-2 dsl-b16">
              <span className="dsl-m12">Assignment</span>
            </div>
            <div className="d-flex-2 text-right dsl-b16">
              <span className="dsl-m12">Since</span>
            </div>
            <div className="d-flex-1 ml-3 dsl-b16 text-right">
              <p className="dsl-m12 d-flex-1 mb-0">Average</p>
              <p className="dsl-m12 d-flex-1"> Actuals</p>
            </div>
            <div className="d-flex-3 dsl-b16 text-right">
              <span className="dsl-m12">Recent Actual</span>
            </div>
            <div className="d-flex-2 text-right dsl-b16">
              <span className="dsl-m12 pl-1 pl-md-0">Acutal</span>
            </div>
            <div className="d-flex-1 " />
          </div>

          {quota_employee?.users?.map((empQuota, index) => (
            <div className="list-item pb-3 pt-3 d-flex" key={index}>
              <div className="d-flex-4 mr-3">
                <div className="d-flex d-flex-4">
                  <Avatar
                    className="d-flex-1"
                    url={empQuota?.profile?.avatar}
                    size="tiny"
                    type="initial"
                    name={empQuota.profile?.first_name + ' ' + empQuota.profile?.last_name}
                    backgroundColor={avatarBackgroundColor(empQuota.user_id)}
                  />
                  <div className="d-flex-3 dsl-b14 text-400 ml-2 text-left align-self-center">
                    {empQuota.profile?.first_name + ' ' + empQuota.profile?.last_name}
                  </div>
                </div>
              </div>
              <div className="d-flex-4 ml-2 dsl-b14 text-400 text-left">
                {empQuota?.quota_source ? split(':', empQuota?.quota_source)[0] : 'Not Assign'}
              </div>
              <div className="d-flex-2 text-right dsl-b14 text-400">
                {empQuota.assigned ? moment(empQuota.assigned).format('MMM DD, YYYY') : 'N/A'}
              </div>
              <div className="d-flex-1 dsl-b14 text-400 ml-3 text-right">{empQuota.actual_average}</div>
              <div className="d-flex-3 dsl-b14 text-400 text-right">
                {empQuota.last_saved ? moment(empQuota.last_saved).format('MMM, YYYY') : 'N/A'}
              </div>
              <div className="d-flex-2 text-right dsl-b14 text-400">{empQuota.recent_actual || 0}</div>
              <div className="d-flex-1">
                <EditDropdown />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  quotaReports: state.manage.quotaReports,
})

export default connect(mapStateToProps, null)(QuotaDetail)

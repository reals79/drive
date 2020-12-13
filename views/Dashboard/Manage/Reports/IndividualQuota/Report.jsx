import React from 'react'
import originalMoment from 'moment'
import { extendMoment } from 'moment-range'
import { values } from 'ramda'
import { Pagination } from '@components'
import './IndividualQuota.scss'

const moment = extendMoment(originalMoment)

const dateArray = (start, end) => {
  let months = []
  while (start.isBefore(end)) {
    months.push({ name: start.format('MMM'), value: start.format('YYYY-MMM') })
    start.add(1, 'month')
  }
  return months
}

class Report extends React.PureComponent {
  state = { current: 1, per: 25 }

  handlePagination = e => {
    this.props.onPage(e, this.state.per)
    this.setState({ current: e })
  }

  handlePer = e => {
    this.props.onPage(this.state.current, e)
    this.setState({ per: e })
  }

  render() {
    const { data, startDate, endDate } = this.props
    const { employee_name, quota_data, last_page } = data
    const dateStart = moment(startDate)
    const dateEnd = moment(endDate)
    const months = dateArray(dateStart, dateEnd)

    return (
      <div className="individaul-quota-reports">
        <p className="dsl-b18 bold my-4">{employee_name}</p>
        <div className="report-item">
          <div className="d-flex-5 text-left text-400 mb-2">
            <p className="dsl-m12 text-400">Scorecard Quotas</p>
          </div>
          {months.map((month, index) => (
            <div className="d-flex-1 text-right" key={`header-${index}`}>
              <p className="dsl-m12 text-400">{month.name}</p>
            </div>
          ))}
          <div className="d-flex-1 mb-2" />
        </div>
        {values(quota_data).map((item, index) => {
          const { quota_name } = item
          return (
            <div className="report-item py-4" key={`quota-${index}`}>
              <div className="d-flex-5 text-left text-400 mb-2">
                <p className="dsl-b14 mb-0 text-400">{quota_name}</p>
              </div>
              {months.map((month, index) => {
                const actual =
                  item[month.value] === 'NA' ? 'NA' : item[month.value] ? item[month.value].actual[0].actual : 'NA'
                return (
                  <div className="d-flex-1 text-right" key={`list-${index}`}>
                    <p className="dsl-b14 mb-0 text-400">{actual}</p>
                  </div>
                )
              })}
              <div className="d-flex-1 mb-2" />
            </div>
          )
        })}
        <Pagination
          current={this.state.current}
          total={last_page}
          onChange={this.handlePagination}
          onPer={this.handlePer}
        />
      </div>
    )
  }
}

export default Report

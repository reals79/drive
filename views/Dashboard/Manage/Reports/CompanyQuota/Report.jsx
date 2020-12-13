import React from 'react'
import { isEmpty, length, slice } from 'ramda'
import { Pagination } from '@components'
import EmployeeQuotaList from './EmployeeQuotaList'
import './CompanyQuota.scss'

class Report extends React.PureComponent {
  state = { current: 1, per: 25 }

  handlePagination = e => {
    this.setState({ current: e })
  }

  handlePer = e => {
    this.setState({ per: e })
  }

  render() {
    const { quota_templates } = this.props.data
    const { current, per } = this.state

    const from = (current - 1) * per
    const to = current * per
    const totalPage = Math.ceil(length(quota_templates) / per)
    const selected = slice(from, to, quota_templates)

    return (
      <div className="quota-reports">
        <p className="dsl-b18 bold my-4">Actuals</p>
        <div className="report-item">
          <div className="d-flex-5 text-left text-400 mb-2">
            <p className="dsl-m12 text-400">Quotas</p>
          </div>
          <div className="d-flex-1 text-right mb-2">
            <p className="dsl-m12 mb-1 text-400">Employees</p>
            <p className="dsl-m12 mb-1 text-400">assigned</p>
          </div>
          <div className="d-flex-2 text-right mb-2">
            <p className="dsl-m12 mb-1 text-400">Actuals</p>
            <p className="dsl-m12 mb-1 text-400">saved</p>
          </div>
          <div className="d-flex-2 text-right mb-2">
            <p className="dsl-m12 mb-1 text-400">% Actuals</p>
            <p className="dsl-m12 mb-1 text-400">saved</p>
          </div>
          <div className="d-flex-2 text-right mb-2">
            <p className="dsl-m12 mb-1 text-400">Low</p>
          </div>
          <div className="d-flex-2 text-right mb-2">
            <p className="dsl-m12 mb-1 text-400">High</p>
          </div>
          <div className="d-flex-2 text-right mb-2">
            <p className="dsl-m12 mb-1 text-400">Average</p>
          </div>
          <div className="d-flex-1 mb-2" />
        </div>
        {selected?.map((quota, index) => {
          const { name, data, users, actual_count, id } = quota
          const { actual_saved_percentage, high, low, average } = data
          return (
            !isEmpty(quota) && (
              <div className="report-item py-4" key={index}>
                <div
                  className="d-flex-5 text-left text-400 mb-2"
                  onClick={() => this.props.history.push(`/hcm/report-quota-employee/${id}/${this.props.tab}`)}
                >
                  <p className="dsl-b14 mb-0 text-400">{name}</p>
                </div>
                <div className="d-flex-1 text-right mb-2 employees-detail">
                  <p className="dsl-b14 mb-0 text-400">{users?.length || 'NA'}</p>
                  <div className="employees-detail-modal">
                    {users && (
                      <EmployeeQuotaList
                        data={users}
                        quota={quota}
                        history={this.props.history}
                        onReport={this.props.onReport}
                        onShowModal={() => this.props.onShowModal(quota)}
                      />
                    )}
                  </div>
                </div>
                <div className="d-flex-2 text-right mb-2">
                  <p className="dsl-b14 mb-0 text-400">{actual_count}</p>
                </div>
                <div className="d-flex-2 text-right mb-2">
                  <p className="dsl-b14 mb-0 text-400">{Number(actual_saved_percentage).toFixed(2) || 'NA'}</p>
                </div>
                <div className="d-flex-2 text-right mb-2">
                  <p className="dsl-b14 mb-0 text-400">{Number(low).toFixed(2) || 'NA'}</p>
                </div>
                <div className="d-flex-2 text-right mb-2">
                  <p className="dsl-b14 mb-0 text-400">{Number(high).toFixed(2) || 'NA'}</p>
                </div>
                <div className="d-flex-2 text-right mb-2">
                  <p className="dsl-b14 mb-0 text-400">{Number(average).toFixed(2) || 'NA'}</p>
                </div>
                <div className="d-flex-1 mb-2" />
              </div>
            )
          )
        })}
        <Pagination current={current} total={totalPage} onChange={this.handlePagination} onPer={this.handlePer} />
      </div>
    )
  }
}

export default Report

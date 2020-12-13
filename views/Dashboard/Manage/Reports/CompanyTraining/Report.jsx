import React from 'react'
import PropTypes from 'prop-types'
import { isEmpty, equals } from 'ramda'
import classNames from 'classnames'
import { Avatar, Pagination, Icon } from '@components'
import { UserRoles } from '~/services/config'
import { avatarBackgroundColor } from '~/services/util'
import './CompanyTraining.scss'

class Report extends React.PureComponent {
  state = { current: 1, per: 25 }

  handleClick = e => {
    if (this.props.userRole > UserRoles.MANAGER) return
    if (this.props.companyId < 0) {
      this.props.onCompany(e)
    } else {
      this.props.history.push(`/hcm/report-training/${this.props.companyId}/${e.id}`)
    }
  }

  handlePagination = e => {
    this.props.onPage(e, this.state.per)
    this.setState({ current: e })
  }

  handlePer = e => {
    this.props.onPage(this.state.current, e)
    this.setState({ per: e })
  }

  render() {
    const { current, per } = this.state
    const { total, data, type, mode, column } = this.props
    const totalPage = Math.ceil(data[mode].total / data[mode].per_page)
    const selected = equals('individual', mode) ? data[mode].individuals : data[mode].companies

    if (isEmpty(total)) return null
    return (
      <>
        <div className="report-item mt-3">
          <div className="d-flex-3 text-left text-400 mb-2">
            <p className="dsl-m12 text-400">Employees</p>
          </div>
          <div className={classNames('d-flex-2 text-right mb-2', column == 2 && 'd-none d-md-block')}>
            <p className="dsl-m12 mb-1 text-400">Assigned</p>
            <p className="dsl-m12 mb-1 text-400">Courses</p>
          </div>
          <div className={classNames('d-flex-2 text-right mb-2', column == 2 && 'd-none d-md-block')}>
            <p className="dsl-m12 mb-1 text-400">Incomplete</p>
            <p className="dsl-m12 mb-1 text-400">Courses</p>
          </div>
          <div className={classNames('d-flex-2 text-right mb-2', column == 2 && 'd-none d-md-block')}>
            <p className="dsl-m12 mb-1 text-400">Past Due</p>
            <p className="dsl-m12 mb-1 text-400">Courses</p>
          </div>
          <div className={classNames('d-flex-2 text-right mb-2 d-none d-md-block', column == 2 && 'd-block')}>
            <p className="dsl-m12 mb-1 text-400">Completed</p>
            <p className="dsl-m12 mb-1 text-400">Courses</p>
          </div>
          <div className={classNames('d-flex-2 text-right mb-2 d-none d-md-block', column == 2 && 'd-block')}>
            <p className="dsl-m12 mb-1 text-400">Completed</p>
            <p className="dsl-m12 mb-1 text-400">on time</p>
          </div>
          <div className={classNames('d-flex-2 text-right mb-2 d-none d-md-block', column == 2 && 'd-block')}>
            <p className="dsl-m12 mb-1 text-400">Completed</p>
            <p className="dsl-m12 mb-1 text-400">past due</p>
          </div>
          <div className={classNames('d-flex-1 d-none d-md-block', column == 2 && 'd-flex')} />
        </div>
        <div className="report-item py-0 py-md-3">
          <div className="title d-flex-3 custom-br-ssm mb-0 mb-md-3">
            <span className="dsl-b14 mb-0 text-400">Total</span>
          </div>
          <div
            className={classNames('d-flex-2 text-right custom-br-ssm pt-3 pt-md-0', column == 2 && 'd-none d-md-block')}
          >
            <p className="dsl-b14 mb-1 text-400">{total.courses_assigned.count}</p>
            <p className="dsl-m12 mb-0 text-400">{total.courses_assigned.percent}%</p>
          </div>
          <div
            className={classNames('d-flex-2 text-right custom-br-ssm pt-3 pt-md-0', column == 2 && 'd-none d-md-block')}
          >
            <p className="dsl-b14 mb-1 text-400">{total.courses_incompleted.count}</p>
            <p className="dsl-m12 mb-0 text-400">{total.courses_incompleted.percent}%</p>
          </div>
          <div className={classNames('d-flex-2 text-right pt-3 pt-md-0', column == 2 && 'd-none d-md-block')}>
            <p className="dsl-b14 mb-1 text-400">{total.courses_past_due.count}</p>
            <p className="dsl-m12 mb-0 text-400">{total.courses_past_due.percent}%</p>
          </div>
          <div
            className={classNames(
              'd-flex-2 text-right d-none d-md-block custom-br-ssm pt-3 pt-md-0',
              column == 2 && 'd-block'
            )}
          >
            <p className="dsl-b14 mb-1 text-400">{total.courses_completed.count}</p>
            <p className="dsl-m12 mb-0 text-400">{total.courses_completed.percent}%</p>
          </div>
          <div
            className={classNames(
              'd-flex-2 text-right d-none d-md-block custom-br-ssm pt-3 pt-md-0',
              column == 2 && 'd-block'
            )}
          >
            <p className="dsl-b14 mb-1 text-400">{total.courses_completed_on_time.count}</p>
            <p className="dsl-m12 mb-0 text-400">{total.courses_completed_on_time.percent}%</p>
          </div>
          <div
            className={classNames(
              'd-flex-2 text-right d-none d-md-block pt-3 pt-md-0 custom-br-ssm',
              column == 2 && 'd-block'
            )}
          >
            <p className="dsl-b14 mb-1 text-400">{total.courses_completed_past_due.count}</p>
            <p className="dsl-m12 mb-0 text-400">{total.courses_completed_past_due.percent}%</p>
          </div>
          <div className={classNames('d-flex-1 d-none d-md-block pt-4 pt-md-0', column == 2 && 'd-block')}>
            <Icon name="fas fa-ellipsis-h text-500 ml-4" color="#969faa" size={16} />
          </div>
        </div>
        {selected.map(item => {
          const { id, name, avatar, report } = item
          return (
            <div className="report-item py-0 py-md-3 text-400" key={id}>
              <div className="d-flex-3 d-flex align-items-center custom-br-ssm mr-2 mr-md-0">
                <Avatar
                  size="tiny"
                  type="initial"
                  url={`${avatar}${Date.now()}`}
                  name={name}
                  backgroundColor={avatarBackgroundColor(id)}
                />
                <span className="dsl-b14 ml-3 cursor-pointer text-400" onClick={this.handleClick.bind(this, item)}>
                  {name}
                </span>
              </div>
              <div
                className={classNames(
                  'd-flex-2 text-right custom-br-ssm pt-3 pt-md-0',
                  column == 2 && 'd-none d-md-block'
                )}
              >
                <p className="dsl-b14 mb-1 text-400">{report[type].courses_assigned.count}</p>
                <p className="dsl-m12 mb-0 text-400">{report[type].courses_assigned.percent}%</p>
              </div>
              <div
                className={classNames(
                  'd-flex-2 text-right custom-br-ssm pt-3 pt-md-0',
                  column == 2 && 'd-none d-md-block'
                )}
              >
                <p className="dsl-b14 mb-1 text-400">{report[type].courses_incompleted.count}</p>
                <p className="dsl-m12 mb-0 text-400">{report[type].courses_incompleted.percent}%</p>
              </div>
              <div className={classNames('d-flex-2 text-right pt-3 pt-md-0', column == 2 && 'd-none d-md-block')}>
                <p className="dsl-b14 mb-1 text-400">{report[type].courses_past_due.count}</p>
                <p className="dsl-m12 mb-0 text-400">{report[type].courses_past_due.percent}%</p>
              </div>
              <div
                className={classNames(
                  'd-flex-2 text-right d-none d-md-block custom-br-ssm pt-3 pt-md-0',
                  column == 2 && 'd-block'
                )}
              >
                <p className="dsl-b14 mb-1 text-400">{report[type].courses_completed.count}</p>
                <p className="dsl-m12 mb-0 text-400">{report[type].courses_completed.percent}%</p>
              </div>
              <div
                className={classNames(
                  'd-flex-2 text-right d-none d-md-block custom-br-ssm pt-3 pt-md-0',
                  column == 2 && 'd-block'
                )}
              >
                <p className="dsl-b14 mb-1 text-400">{report[type].courses_completed_on_time.count}</p>
                <p className="dsl-m12 mb-0 text-400">{report[type].courses_completed_on_time.percent}%</p>
              </div>
              <div
                className={classNames(
                  'd-flex-2 text-right d-none d-md-block pt-3 pt-md-0 custom-br-ssm',
                  column == 2 && 'd-block'
                )}
              >
                <p className="dsl-b14 mb-1 text-400">{report[type].courses_completed_past_due.count}</p>
                <p className="dsl-m12 mb-0 text-400">{report[type].courses_completed_past_due.percent}%</p>
              </div>
              <div className={classNames('d-flex-1 d-none d-md-block pt-4 pt-md-0', column == 2 && 'd-block')}>
                <Icon name="fas fa-ellipsis-h text-500 ml-4" color="#969faa" size={16} />
              </div>
            </div>
          )
        })}
        <Pagination
          current={current}
          per={per}
          total={totalPage}
          onChange={this.handlePagination}
          onPer={this.handlePer}
        />
      </>
    )
  }
}

Report.propTypes = {
  type: PropTypes.string,
  userRole: PropTypes.number,
  total: PropTypes.any,
  data: PropTypes.object,
  history: PropTypes.any,
}

Report.defaultProps = {
  type: 'metrics',
  userRole: 1,
  total: {},
  data: {},
  history: {},
}

export default Report

import React, { memo } from 'react'
import { filter, includes, isEmpty } from 'ramda'
import originalMoment from 'moment'
import { extendMoment } from 'moment-range'
import { Avatar, Button, Input } from '@components'
import { avatarBackgroundColor } from '~/services/util'
import './QuotaEmployeeList.scss'

const moment = extendMoment(originalMoment)

class QuotaEmployeeList extends React.Component {
  state = { search: '', users: this.props.data.users }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (isEmpty(prevState.search)) return { users: nextProps.data.users }
    const users = filter(employee => includes(prevState.search, employee.user_name), nextProps.data.users)
    return { users }
  }

  handleSearch = search => {
    this.setState({ search })
  }

  handleIndividualReport = employee => {
    const startDate = moment()
      .subtract(11, 'months')
      .startOf('month')
      .format('YYYY-MM-DD')
    const endDate = moment()
      .endOf('month')
      .format('YYYY-MM-DD')
    const payload = {
      user_id: employee,
      date_start: startDate,
      date_end: endDate,
      fliter: 'scorecard',
      page: 1,
      per_page: 25,
    }
    const route = `/hcm/report-quota/${employee}`
    this.props.getIndividualQuotaReport(payload, route)
    this.props.onClose()
  }

  render() {
    const { data } = this.props
    const { users } = this.state
    return (
      <div className="quota-employees-list-modal">
        <div className="modal-header text-center bg-primary text-white">Employees Assigned</div>
        <div className="modal-body p-4">
          <div className="d-h-start pb-3">
            <p className="dsl-b18 bold my-2">{data.name}</p>
          </div>
          <Input
            title="Search by name"
            placeholder="Search here..."
            direction="vertical"
            value={this.state.search}
            onChange={this.handleSearch}
          />
          <div className="d-flex justify-content-between mt-4">
            <p className="dsl-m12">Viewing {data.users.length}</p>
          </div>
          <div className="d-h-between py-3">
            <div className="d-flex-5">
              <p className="dsl-m12 mb-0">Employee</p>
            </div>
            <div className="d-flex-2 px-3">
              <p className="dsl-m12 text-right mb-0">Actual</p>
            </div>
          </div>
          <div className="list-container">
            <div className="list-content">
              {users?.map((item, index) => {
                const { id, profile, actual_average } = item
                const { first_name, last_name, avatar } = profile
                return (
                  <div
                    className="d-h-between py-3 cursor-pointer"
                    key={`lml${index}`}
                    onClick={() => this.handleIndividualReport(id)}
                  >
                    <div className="d-flex-5 d-flex">
                      <Avatar
                        className="d-flex-1"
                        url={avatar}
                        size="tiny"
                        type="initial"
                        name={`${first_name} ${last_name}`}
                        backgroundColor={avatarBackgroundColor(id)}
                        onToggle={() => history.push(`/library/record-employee-info/${id}`)}
                      />
                      <div className="d-flex-4 dsl-b14 ml-2 text-left text-400 align-self-center">
                        {`${first_name} ${last_name}`}
                      </div>
                    </div>
                    <div className="d-flex-2 px-3">
                      <p className="dsl-b12 text-400 text-right mb-0">{actual_average}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
          <div className="d-h-end">
            <Button className="modal-button" name="CLOSE" onClick={() => this.props.onClose()} />
          </div>
        </div>
      </div>
    )
  }
}

export default memo(QuotaEmployeeList)

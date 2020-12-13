import React from 'react'
import { connect } from 'react-redux'
import { isNil } from 'ramda'
import { Filter, TaskReport } from '@components'
import AppActions from '~/actions/app'
import MngActions from '~/actions/manage'
import './CompanyTask.scss'

class CompanyTask extends React.Component {
  state = {
    companyId: this.props.companyId,
    userId: null,
    dateStart: null,
    dateEnd: null,
  }

  handleFilter = (type, data) => {
    const { dateStart, dateEnd } = this.state

    if (isNil(data)) return
    if (type === 'employee' && data.length > 0) {
      if (data[0].id > 0) {
        const payload = {
          company_id: this.state.companyId,
          user_id: data[0].id,
          date_start: dateStart,
          date_end: dateEnd,
        }
        this.props.getReports(payload)
        this.setState({ userId: data[0].id })
      } else {
        const payload = {
          company_id: this.state.companyId,
          user_id: null,
          date_start: dateStart,
          date_end: dateEnd,
        }
        this.props.getReports(payload)
        this.setState({ userId: null })
      }
    } else {
      const companyId = data[0].id
      if (companyId < 0) return
      const payload = {
        company_id: [companyId],
        user_id: this.state.userId,
        date_start: dateStart,
        date_end: dateEnd,
      }
      this.props.getReports(payload)
      this.setState({ companyId })
    }
  }

  handleNavigation = id => {
    this.props.history.push(`/hcm/report-task/${id}`)
  }

  handleTasks = (start, end) => {
    const { companyId, userId } = this.state
    const payload = {
      company_id: [companyId],
      user_id: userId,
      date_start: start,
      date_end: end,
    }
    this.props.getReports(payload)
    this.setState({ dateStart: start, dateEnd: end })
  }

  render() {
    const { data } = this.props
    const { userId } = this.state

    return (
      <div className="reports-task">
        <Filter mountEvent onChange={this.handleFilter} />
        <TaskReport
          data={data}
          selected={userId}
          onClick={this.handleNavigation}
          onTasks={this.handleTasks}
          onToggle={this.props.toggleModal}
        />
      </div>
    )
  }
}

const mapStateToProps = state => ({
  userId: state.app.id,
  companyId: state.app.selectedCompany[0],
  data: state.manage.tasksReport,
})

const mapDispatchToProps = dispatch => ({
  getReports: payload => dispatch(MngActions.companyindividualRequest(payload)),
  toggleModal: e => dispatch(AppActions.modalRequest(e)),
})

export default connect(mapStateToProps, mapDispatchToProps)(CompanyTask)

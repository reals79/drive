import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Tabs, Tab } from 'react-bootstrap'
import { filter, isNil, path } from 'ramda'
import originalMoment from 'moment'
import { extendMoment } from 'moment-range'
import { DatePicker, Dropdown, Filter, Icon, Pagination, ToggleColumnMenu } from '@components'
import AppActions from '~/actions/app'
import MngActions from '~/actions/manage'
import { SPECIALOPTIONS, EngagementTabs } from '~/services/config'
import { exportCsv } from '~/services/util'
import Body from './Body'
import { KEYS, TITLES } from './Constants'
import './Engagement.scss'

const moment = extendMoment(originalMoment)

class Engagement extends Component {
  constructor(props) {
    super(props)

    const today = moment()
    const date = moment.range(today.clone().subtract(7, 'days'), today.clone())

    this.state = { activeTab: 'trainings', date, companyIds: [], userIds: [], current: 1, per: 25, column: 1 }
  }

  handleDate = date => {
    const { activeTab, companyIds } = this.state
    if (companyIds.length === 0) return
    const payload = {
      company_id: companyIds,
      date_start: date.start.format('YYYY-MM-DD'),
      date_end: date.end.format('YYYY-MM-DD'),
    }
    this.props.fetchEngagement(payload, 'company', activeTab)
    this.setState({ date })
  }

  handleFilter = (type, e) => {
    const { activeTab, date } = this.state

    let companyIds = this.state.companyIds
    let userIds = this.state.userIds
    let by = 'company'

    if (isNil(e)) return
    if (type === 'company') {
      if (SPECIALOPTIONS.ALL === e[0].id) {
        companyIds = this.props.companies.map(item => item.id)
      } else {
        companyIds = e.map(item => item.id)
      }
      companyIds = filter(a => a > 0, companyIds)
      this.setState({ companyIds })
    } else if (type === 'employee') {
      by = 'individual'
      if (e[0].id > 0) {
        userIds = e.map(item => item.id)
      } else {
        userIds = []
      }
      this.setState({ userIds })
    }

    if (companyIds.length === 0) return

    const payload = {
      company_id: companyIds,
      date_start: date.start.format('YYYY-MM-DD'),
      date_end: date.end.format('YYYY-MM-DD'),
    }
    this.props.fetchEngagement(payload, by, activeTab)
  }

  handlePage = e => {
    this.setState({ current: e })
  }

  handlePer = e => {
    this.setState({ per: e })
  }

  handleTabs = activeTab => {
    const { date, companyIds, userIds } = this.state
    const payload = {
      company_id: companyIds,
      date_start: moment(date.start).format('YYYY-MM-DD'),
      date_end: moment(date.end).format('YYYY-MM-DD'),
    }
    const by = userIds.length === 0 ? 'company' : 'individual'
    this.props.fetchEngagement(payload, by, activeTab)
    this.setState({ activeTab, column: 1 })
  }

  handleVisible = column => {
    this.setState({ column })
  }

  handleExcelReport = () => {
    this.props.toggleModal({
      type: 'Confirm',
      data: {
        before: {
          title: 'Confirm',
          body: 'Would you like to download this reports data to excel?',
        },
      },
      callBack: {
        onYes: () => {
          this.handleExcel()
        },
      },
    })
  }

  handleExcel = () => {
    const { engagements } = this.props
    const { activeTab } = this.state
    const data = engagements[activeTab]
    const total = engagements.totals
    let engagementData = []
    let keys = []
    keys.push('Company')
    TITLES[activeTab].map(title => {
      keys.push(title.join('\n '))
    })
    total.map(total => {
      let excelData = { Company: 'Total' }
      KEYS[activeTab].map(key => {
        excelData[key.replace('_', '  \n').toUpperCase()] = `${
          key.includes('completion') ? path(['complete'], total[key]) : path(['count'], total[key]) || 0
        } \n${path(['percent'], total[key]) || 0}%`
      })
      engagementData.push(excelData)
    })
    data.map(company => {
      let excelData = {
        Company: company.name,
      }
      KEYS[activeTab].map(key => {
        excelData[key.replace('_', '  \n').toUpperCase()] = `${
          key.includes('completion')
            ? path(['complete'], company.report[key])
            : path(['count'], company.report[key]) || 0
        } \n${path(['percent'], company.report[key]) || 0}%`
      })

      engagementData.push(excelData)
    })
    exportCsv(engagementData, keys, `Engagement-${activeTab}`, true)
  }

  render() {
    const { engagements } = this.props
    const { activeTab, current, per, date, column, userIds } = this.state
    const total = activeTab == 'trainings' || activeTab == 'tasks' || activeTab == 'careers' ? 3 : 4

    return (
      <div className="mng-engagement">
        <Filter multi mountEvent direction="vertical" onChange={this.handleFilter} />
        <div className="card">
          <div className="d-flex justify-content-between mb-0 mb-md-3">
            <span className="dsl-b22 bold text-capitalize">Engagement Report</span>
            <div className="d-flex">
              <DatePicker
                calendar="range"
                append="caret"
                format="MMM D"
                as="span"
                align="right"
                value={date}
                closeAfterSelect
                onSelect={this.handleDate}
              />
              <div className="d-flex justify-content-end cursor-pointer ml-3" onClick={this.handleExcelReport}>
                <Icon name="fal fa-file-excel" color="#343f4b" size={16} />
              </div>
            </div>
          </div>
          <div className="custom-dropdown-mobile mb-4">
            <Dropdown
              className="mobile-screen"
              data={EngagementTabs}
              defaultIds={[0]}
              returnBy="data"
              getValue={e => e.label}
              onChange={e => this.handleTabs(e[0].name)}
            />
          </div>
          <ToggleColumnMenu
            className="d-md-none mb-2"
            column={column}
            activeTab={activeTab}
            total={total}
            onVisible={this.handleVisible}
          />
          <Tabs
            className="d-none d-md-flex"
            id="engagement"
            defaultActiveKey="training"
            activeKey={activeTab}
            onSelect={this.handleTabs}
          >
            {EngagementTabs.map(tab => (
              <Tab key={tab.name} eventKey={tab.name} title={tab.label}>
                <Body
                  data={engagements[tab.name]}
                  type={tab.name}
                  page={current}
                  per={per}
                  total={engagements.totals}
                  column={column}
                  totalColumn={total}
                  userIds={userIds}
                />
                <Pagination
                  current={current}
                  total={Math.ceil(engagements[tab.name].length / per)}
                  onChange={this.handlePage}
                  onPer={this.handlePer}
                />
              </Tab>
            ))}
          </Tabs>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  companies: state.app.companies,
  engagements: state.manage.engagementReport,
})

const mapDispatchToProps = dispatch => ({
  fetchEngagement: (payload, by, mode) => dispatch(MngActions.fetchengagementreportRequest(payload, by, mode)),
  toggleModal: e => dispatch(AppActions.modalRequest(e)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Engagement)

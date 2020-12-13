import React, { Component } from 'react'
import { Tabs, Tab } from 'react-bootstrap'
import originalMoment from 'moment'
import { extendMoment } from 'moment-range'
import { DatePicker, Filter, Icon, Pagination } from '@components'
import Employees from './Employees'
import Packets from './Packets'
import './SignatureList.scss'

const moment = extendMoment(originalMoment)

class SignatureList extends Component {
  state = {
    activeTab: 'employees',
    startDate: moment()
      .startOf('month')
      .format('YYYY-MM-DD'),
    endDate: moment()
      .endOf('month')
      .format('YYYY-MM-DD'),
  }

  handleDate = e => {}

  handleFilter = (type, e) => {
    if (isNil(e)) return

    if (type == 'employee' && e.length > 0) {
      if (e[0].id > 0) {
      } else {
      }
    }
  }

  handlePage = e => {}

  handlePer = e => {}

  handlePdf = e => {}

  handleSelectTab = e => {
    this.setState({ activeTab: e })
  }

  render() {
    const { activeTab, startDate, endDate } = this.state
    const date = moment.range(startDate, endDate)

    return (
      <div className="reports-signature">
        <Filter onChange={this.handleFilter} />
        <div className="card">
          <div className="d-flex align-items-center mb-3 pt-1 pt-md-2">
            <div className="dsl-b22 text-500 d-flex-1">Company Signature Packet Report</div>
            <DatePicker
              calendar="range"
              append="caret"
              format="MMM D"
              align="right"
              as="span"
              value={date}
              onSelect={this.handleDate}
            />
          </div>
          <div className="d-flex justify-content-end cursor-pointer" onClick={this.handlePdf}>
            <Icon name="fal fa-print" color="#343f4b" size={16} />
          </div>
          <Tabs
            id="signature-report"
            defaultActiveKey="employees"
            activeKey={activeTab}
            onSelect={this.handleSelectTab}
          >
            <Tab key="employees" eventKey="employees" title="Employees">
              <Employees />
            </Tab>
            <Tab key="packets" eventKey="packets" title="Packets">
              <Packets />
            </Tab>
          </Tabs>
          <Pagination onChange={this.handlePage} onPer={this.handlePer} />
        </div>
      </div>
    )
  }
}

export default SignatureList

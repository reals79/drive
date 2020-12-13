import React, { useState } from 'react'
import { Tabs, Tab } from 'react-bootstrap'
import { useDispatch } from 'react-redux'
import originalMoment from 'moment'
import { extendMoment } from 'moment-range'
import VenActions from '~/actions/vendor'
import Ratings from './Ratings'
import Visibility from './Visibility'

const moment = extendMoment(originalMoment)

const VendorRatings = ({ data }) => {
  const [active, setActive] = useState('ratings')
  const handleTab = e => {
    setActive(e)
  }

  const [date, setDate] = useState(
    moment.range(
      moment()
        .startOf('month')
        .format('YYYY-MM-DD'),
      moment()
        .endOf('month')
        .format('YYYY-MM-DD')
    )
  )
  const dispatch = useDispatch()
  const handleDate = e => {
    dispatch(VenActions.getvrcompanyRequest(data.id, e.start.format('YYYY-MM-DD'), e.end.format('YYYY-MM-DD')))
  }

  return (
    <div className="reports">
      <p className="card-header dsl-b22 bold">Vendor Ratings Reports</p>
      <Tabs className="card-content pb-3" defaultActiveKey="ratings" activeKey={active} onSelect={handleTab}>
        <Tab eventKey="ratings" title="Ratings">
          <Ratings data={data} date={date} onDateChange={handleDate} />
        </Tab>
        <Tab eventKey="visibility" title="Visibility">
          <Visibility />
        </Tab>
        <Tab eventKey="category" title="Category" />
        <Tab eventKey="completion" title="Completion" />
        <Tab eventKey="nps" title="NPS" />
        <Tab eventKey="dealer-satisfaction-award" title="Dealer Satisfaction Award" />
      </Tabs>
    </div>
  )
}

export default VendorRatings

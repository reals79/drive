import React from 'react'
import { Col, Row } from 'react-bootstrap'
import { toast } from 'react-toastify'
import { history } from '~/reducers'
import { Icon } from '@components'

const handleRoute = item => {
  if (
    item.name === 'about' ||
    item.name === 'products' ||
    item.name === 'library' ||
    item.name === 'jobs' ||
    item.name === 'blog' ||
    item.name === 'connections'
  ) {
    toast.info('Stay tuned.  This will be released Soon', {
      position: toast.POSITION.TOP_CENTER,
    })
  }
}

const Reports = ({ id, routesList }) => {
  const reportList = routesList.filter(item => item.name !== 'about')

  return (
    <div className="card">
      <div className="d-flex justify-content-between">
        <span className="dsl-b22 bold">Reports</span>
        <div className="d-flex">
          <Icon name="fas fa-th" color="#343f4b" size={14} />
          <Icon name="fas fa-th-list ml-2" size={14} />
        </div>
      </div>
      <Row className="items mt-4">
        {reportList.map((item, index) => (
          <Col
            className="text-center contents my-4 cursor-pointer report-hover"
            key={index}
            xs={6}
            sm={4}
            onClick={() => (item.name === 'human-capital' ? history.push('/hcm/reports') : handleRoute(item))}
          >
            <Icon name={`${item.icon} mt-2`} color="#343f4b" size={22} />
            <p className="dsl-m16 mt-3">{item.label == 'library' ? 'Store' : item.label}</p>
          </Col>
        ))}
      </Row>
    </div>
  )
}

export default Reports

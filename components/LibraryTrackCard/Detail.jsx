import React from 'react'
import PropTypes from 'prop-types'
import { Row, Col } from 'react-bootstrap'
import { isNil } from 'ramda'
import { Accordion, EditDropdown, Filter, Pagination, Thumbnail, Toggle } from '@components'
import { LibraryCardDetailMenu } from '~/services/config'
import { getSettings, inPage } from '~/services/util'
import Course from './Course'
import './LibraryTrackCard.scss'

class Detail extends React.PureComponent {
  state = { page: 1, per: 5 }

  handlePage = page => {
    this.setState({ page })
  }

  handlePer = per => {
    this.setState({ per })
  }

  render() {
    const { data, role, authors, departments, competencies, categories, onCardMenu, onChildMenu } = this.props
    const { page, per } = this.state

    return (
      <>
        <Filter aligns={['left', 'right']} backTitle="all tracks" onBack={() => this.props.history.goBack()} />
        <div className="library-track-card border-5">
          <div className="detail-content">
            <div className="d-flex justify-content-between">
              <p className="dsl-b22 bold">{data.name || data.title}</p>
              <EditDropdown options={LibraryCardDetailMenu[role]} onChange={onCardMenu} />
            </div>
            <div className="d-flex mb-4">
              <Thumbnail src={data.data.thumbnail || data.thumbnail} size="medium" />
              <div className="pl-4">
                <p className="dsl-m12">Description</p>
                <p className="dsl-b16">{data.data.description || data.description}</p>
              </div>
            </div>
            {!isNil(data.data.objectives) && data.data.objectives.length > 0 && (
              <>
                <p className="dsl-m12 mt-4">Learning objectives:</p>
                {data.data.objectives.map((item, index) => (
                  <div className="d-flex mt-1" key={index}>
                    <div className="circle">{index + 1}</div>
                    <span className="dsl-b14 pl-2 m-0 w-100 pt-1">{item}</span>
                  </div>
                ))}
              </>
            )}
            <Accordion className="settings">
              <Row>
                <Col sm={12} md={6} className="mt-3">
                  <p className="dsl-m12">Author</p>
                  <p className="dsl-b16 ml-2">{getSettings([data.author_id], authors, 'N/A')}</p>
                </Col>
                <Col sm={12} md={6} className="mt-3">
                  <p className="dsl-m12">Departments</p>
                  <p className="dsl-b16 ml-2">{getSettings(data.data.department, departments, 'N/A')}</p>
                </Col>
                <Col sm={12} md={6} className="mt-3">
                  <p className="dsl-m12">Competencies</p>
                  <p className="dsl-b16 ml-2">{getSettings(data.data.competency, competencies, 'N/A')}</p>
                </Col>
                <Col sm={12} md={6} className="mt-3">
                  <p className="dsl-m12">Categories</p>
                  <p className="dsl-b16 ml-2">{getSettings(data.data.category, categories, 'N/A')}</p>
                </Col>
                <Col sm={12} md={6} className="mt-3">
                  <p className="dsl-m12">Associated metrics</p>
                  <p className="dsl-b16 ml-2">Facebook</p>
                </Col>
                <Col sm={12} md={6} className="mt-3">
                  <p className="dsl-m12">Est days to complete</p>
                  <p className="dsl-b16 ml-2">45</p>
                </Col>
                <Col sm={12} md={6} className="mt-3">
                  <Toggle
                    checked={data.data.chronological_lock || false}
                    title="Chronology Lock"
                    leftLabel="Off"
                    rightLabel="On"
                  />
                </Col>
                <Col sm={12} md={6} className="mt-3">
                  <Toggle checked={data.data.time_lock || false} title="Time Lock" leftLabel="Off" rightLabel="On" />
                </Col>
              </Row>
            </Accordion>
          </div>
        </div>
        <div className="library-track-card my-2 border-5">
          <div className="modules-content">
            <div className="courses-header">
              <div className="dsl-b18 bold">Courses Inside</div>
            </div>
            {data?.data?._cards?.map(
              (course, index) =>
                inPage(index, page, per) && <Course key={course.id} course={course} role={role} onMenu={onChildMenu} />
            )}
            <Pagination
              pers={[5, 10, 'all']}
              per={per}
              current={page}
              total={data.data.cards ? Math.ceil(data.data.cards.length / per) : 0}
              onChange={this.handlePage}
              onPer={this.handlePer}
            />
          </div>
        </div>
      </>
    )
  }
}

Detail.propTypes = {
  data: PropTypes.any,
}

Detail.defaultProps = {
  data: {},
}

export default Detail

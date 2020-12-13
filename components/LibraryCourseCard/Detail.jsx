import React from 'react'
import { Row, Col } from 'react-bootstrap'
import { isNil, isEmpty, slice } from 'ramda'
import { Accordion, EditDropdown, Filter, Thumbnail, Toggle, Pagination } from '@components'
import { LibraryCardDetailMenu } from '~/services/config'
import { getSettings } from '~/services/util'
import Module from './Module'
import './LibraryCourseCard.scss'

class Detail extends React.Component {
  state = { currentPage: 1, perPage: 25 }

  handlePage = e => {
    this.setState({ currentPage: e })
  }

  handlePer = e => {
    this.setState({ perPage: e })
  }

  render() {
    const { data, role, authors, departments, competencies, categories, history, onCardMenu, onChildMenu } = this.props
    const { currentPage, perPage } = this.state
    const modules = isEmpty(data.children) ? [] : data.children
    const from = (currentPage - 1) * perPage
    const to = currentPage * perPage
    const totalPage = Math.ceil(modules.length / perPage)
    const selected = slice(from, to, modules)

    return (
      <>
        <div className="mobile-back-button">
          <Filter aligns={['left', 'right']} backTitle="all courses" onBack={() => history.goBack()} />
        </div>
        <div className="library-course-card border-5">
          <div className="detail-content">
            <div className="d-flex justify-content-between">
              <p className="dsl-b22 bold" data-cy="courseDetailTitle">
                {data.name || data.data.name}
              </p>
              <div className="desktop-screen">
                <EditDropdown options={LibraryCardDetailMenu[role]} onChange={onCardMenu} />
              </div>
            </div>
            <div className="d-block d-sm-flex mb-4">
              <Thumbnail src={data.thumbnail || data.data.thumb_url} size="medium" />
              <div className="pl-sm-4 mt-3">
                <p className="dsl-m12">Description</p>
                <p className="dsl-b16">{data.description || data.data.description}</p>
              </div>
            </div>
            {!isNil(data.data.objectives) && (
              <>
                <p className="dsl-m12">Learning objectives</p>
                {data.data.objectives.map((item, index) => (
                  <div className="d-flex mt-1" key={index}>
                    <div className="circle">{index + 1}</div>
                    <span className="dsl-b14 w-100 pt-1">{item}</span>
                  </div>
                ))}
              </>
            )}
            <Accordion className="settings mt-3">
              <Row>
                <Col xs={6} className="my-3">
                  <p className="dsl-m12">Author</p>
                  <p className="dsl-b16 ml-2">{getSettings([data.author_id], authors, 'N/A')}</p>
                </Col>
                <Col xs={6} className="my-3">
                  <p className="dsl-m12">Departments</p>
                  <p className="dsl-b16 ml-2">{getSettings(data.data.department, departments, 'N/A')}</p>
                </Col>
                <Col xs={6} className="my-3">
                  <p className="dsl-m12">Competencies</p>
                  <p className="dsl-b16 ml-2">{getSettings(data.data.competency, competencies, 'N/A')}</p>
                </Col>
                <Col xs={6} className="my-3">
                  <p className="dsl-m12">Categories</p>
                  <p className="dsl-b16 ml-2">{getSettings(data.data.category, categories, 'N/A')}</p>
                </Col>
              </Row>
              <Row className="mt-3">
                <Col xs={6}>
                  <Toggle
                    checked={data.data.chronological_lock || false}
                    title="Chronology Lock"
                    leftLabel="Off"
                    rightLabel="On"
                    disabled
                  />
                </Col>
                <Col xs={6}>
                  <Toggle
                    checked={data.data.time_lock || false}
                    title="Time Lock"
                    leftLabel="Off"
                    rightLabel="On"
                    disabled
                  />
                </Col>
              </Row>
            </Accordion>
          </div>
        </div>
        <div className="library-course-card mt-2 border-5">
          <div className="modules-content">
            <div className="modules-header border-bottom pb-2">
              <span className="dsl-b18 bold">Modules Inside</span>
            </div>
            {selected.map((item, index) => (
              <Module key={index} data={item} role={role} onMenu={onChildMenu} />
            ))}
          </div>
        </div>
        <Pagination
          pers={[25, 50, 'all']}
          current={currentPage}
          per={perPage}
          total={totalPage}
          onChange={this.handlePage}
          onPer={this.handlePer}
        />
      </>
    )
  }
}

export default Detail

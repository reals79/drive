import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Row, Col } from 'react-bootstrap'
import Slider from 'react-slick'
import { find, isEmpty, isNil, length, propEq, type, values } from 'ramda'
import { Accordion, Toggle, EditDropdown, CareerRequiredInstances as Instances } from '@components'
import { getSettings } from '~/services/util'
import { LibraryProgramDetailMenu } from '~/services/config'
import CustomArrow from './CustomArrow'
import './LibraryProgramsCareer.scss'

class Detail extends Component {
  state = { job: {} }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { data, jobs } = nextProps
    if (!isNil(data) && !isNil(data.data) && data == !prevState.data) {
      const job = find(propEq('id', data.job_role_id), jobs) || {}
      return { job }
    }
    return null
  }

  render() {
    const { job } = this.state
    const { userRole, data, onSelect, authors, departments, competencies, categories } = this.props

    if (isNil(data) || isEmpty(data)) return null

    const isLevel = !isNil(data.data.levels) && !isEmpty(data.data.levels)
    const levelData = isLevel ? values(data.data.levels) : []

    return (
      <div className="lib-programs-career">
        <div className="settings-contents">
          <div className="d-flex justify-content-between pt-2 pb-4">
            <span className="dsl-b22 bold">{data.title}</span>
            <EditDropdown options={LibraryProgramDetailMenu[userRole]} onChange={onSelect} />
          </div>
          <p className="dsl-m12 mb-2 text-400">Description</p>
          <p className="dsl-b16 p-2">{data.data.description || data.description}</p>
          <Accordion className="settings-career">
            <Row className="mx-0">
              <Col xs={12} sm={6} className="px-0 my-3">
                <p className="dsl-m12 mb-2">Levels</p>
                <p className="dsl-b16 normal mx-2">{`Level ${data.level}`}</p>
              </Col>
              <Col xs={12} sm={6} className="px-0 my-3">
                <p className="dsl-m12 mb-2">Role</p>
                <p className="dsl-b16 normal mx-2">{job.name}</p>
              </Col>
              <Col xs={12} sm={6} className="px-0 my-3">
                <p className="dsl-m12 mb-2">Author</p>
                <p className="dsl-b16 normal mx-2">{getSettings([data.author_id], authors, 'N/A')}</p>
              </Col>
              <Col xs={12} sm={6} className="px-0 my-3">
                <p className="dsl-m12 mb-2">Department</p>
                <p className="dsl-b16 normal mx-2">{getSettings(data.data.department_id, departments, 'N/A')}</p>
              </Col>
              <Col xs={12} sm={6} className="px-0 my-3">
                <p className="dsl-m12 mb-2">Competencies</p>
                <p className="dsl-b16 normal mx-2">{getSettings(data.data.competency_id, competencies, 'N/A')}</p>
              </Col>
              <Col xs={12} sm={6} className="px-0 my-3">
                <p className="dsl-m12 mb-2">Categories</p>
                <p className="dsl-b16 normal mx-2">{getSettings(data.data.category_id, categories, 'N/A')}</p>
              </Col>
            </Row>
          </Accordion>
        </div>
        <div className="modules-contents mt-3">
          <Slider
            infinite
            adaptiveHeight
            prevArrow={<CustomArrow name="left" />}
            nextArrow={<CustomArrow name="right" />}
            ref={slider => (this.slider = slider)}
          >
            {levelData.map((e, index) => {
              const { title, chronology_lock, time_lock, habits, quotas, trainings, documents } = e
              const habitsLength =
                type(habits) === 'Object'
                  ? length(habits.day) + length(habits.week) + length(habits.month)
                  : length(habits)
              return (
                <div key={`level-${index}`}>
                  <p className="dsl-b22 bold mb-4">{`Level ${index + 1}`}</p>
                  <p className="dsl-m12 mb-2 text-400">Job Title</p>
                  <p className="dsl-b16 normal mb-4 mt-3 mx-3 text-400">{title}</p>
                  <Row className="mx-0">
                    <Col xs={6} className="px-0">
                      <p className="dsl-m12 text-400 mb-2">Estimated Time to Complete</p>
                      <p className="dsl-l16 normal text-400 mt-3 mx-3">This will autofill automatically</p>
                    </Col>
                  </Row>
                  <Accordion className="settings-career pb-2">
                    <Row className="mx-0">
                      <Col xs={12} sm={12} md={4} className="px-0 my-3">
                        <p className="dsl-m12 mb-3 text-400">Estimated Time to Complete</p>
                        <p className="dsl-b16 mb-4 mx-2 text-400">Default from courses</p>
                        <p className="dsl-b16 mb-0 mx-2 text-400">Target for track</p>
                      </Col>
                      <Col xs={12} sm={6} md={4} className="px-0 my-3">
                        <Toggle
                          title="Chronology Lock"
                          leftLabel="Off"
                          rightLabel="On"
                          disabled
                          checked={chronology_lock || false}
                        />
                      </Col>
                      <Col xs={12} sm={6} md={4} className="px-0 my-3">
                        <Toggle
                          title="Time Lock"
                          leftLabel="Off"
                          rightLabel="On"
                          disabled
                          checked={time_lock || false}
                        />
                      </Col>
                    </Row>
                  </Accordion>
                  <div className="required-field pt-4">
                    <p className="dsl-b18 text-500">Required Quotas</p>
                    {length(quotas) > 0 ? (
                      <Instances.QuotasDetail data={quotas} type="template" />
                    ) : (
                      <Instances.Empty />
                    )}
                  </div>
                  <div className="required-field pt-4">
                    <p className="dsl-b18 text-500">Required Habits</p>
                    {habitsLength > 0 ? (
                      <Instances.HabitsDetail data={habits} stats={data.stats} type="template" />
                    ) : (
                      <Instances.Empty />
                    )}
                  </div>
                  <div className="required-field pt-4">
                    <p className="dsl-b18 text-500">Required Training</p>
                    {length(trainings.items) > 0 ? (
                      <Instances.TrainingsDetail data={trainings.items} type="template" />
                    ) : (
                      <Instances.Empty />
                    )}
                  </div>
                </div>
              )
            })}
          </Slider>
        </div>
      </div>
    )
  }
}

Detail.propTypes = {
  userRole: PropTypes.number,
  data: PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string,
    data: PropTypes.any,
  }),
  authors: PropTypes.array.isRequired,
  departments: PropTypes.array.isRequired,
  competencies: PropTypes.array.isRequired,
  categories: PropTypes.array.isRequired,
  jobs: PropTypes.array,
  onModal: PropTypes.func,
  onSave: PropTypes.func,
  onSelect: PropTypes.func,
}

Detail.defaultProps = {
  userRole: 1,
  data: { id: 0, title: '', data: {} },
  authors: [],
  departments: [],
  competencies: [],
  categories: [],
  jobs: [],
  onModal: () => {},
  onSave: () => {},
  onSelect: () => {},
}

export default Detail

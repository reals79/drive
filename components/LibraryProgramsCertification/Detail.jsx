import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Row, Col } from 'react-bootstrap'
import Slider from 'react-slick'
import { equals, isEmpty, isNil, length, propEq, type, values } from 'ramda'
import {
  Accordion,
  Thumbnail,
  Toggle,
  EditDropdown,
  CareerRequiredInstances as Instances,
} from '@components'
import { LibraryProgramDetailMenu } from '~/services/config'
import { getSettings } from '~/services/util'
import CustomArrow from './CustomArrow'
import './LibraryProgramsCertification.scss'

class Detail extends Component {
  state = { curLevel: 0, job: null }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { data, jobs } = nextProps
    if (!isNil(data) && !isNil(data.data) && !equals(data, prevState.data)) {
      const job = find(propEq('id', data.job_role_id), jobs) || {}
      return { job }
    }
    return null
  }

  handleLink = link => () => {
    if (!isNil(link) && !isEmpty(link)) {
      const win = window.open(link, '_blank')
      win.focus()
    }
  }

  render() {
    const { job, curLevel } = this.state
    const { userRole, data, onSelect, authors, departments, competencies, categories } = this.props

    if (isNil(data) || isEmpty(data)) return null

    const isLevel = !isNil(data.data.levels) && !isEmpty(data.data.levels)
    const levelData = isLevel ? values(data.data.levels) : []
    const attachments = data.data.attachments ? data.data.attachments[0] : []

    return (
      <div className="lib-programs-certification">
        <div className="certification-detail">
          <div className="d-flex justify-content-between py-2">
            <p className="dsl-b22 bold text-left">{data.title}</p>
            <EditDropdown options={LibraryProgramDetailMenu[userRole]} onChange={onSelect} />
          </div>
          <p className="dsl-m12 mb-2 text-400">Description</p>
          <p className="dsl-b16 p-2">{data.data.description || data.description}</p>
          <div>
            <p className="dsl-m12 mb-3 text-400">Certificate</p>
            <Thumbnail
              src={data.data.attachments ? data.data.attachments[0] : 'fal fa-file-pdf'}
              className="certificate-thumbnail"
              onClick={this.handleLink(attachments)}
            />
          </div>
          <Accordion className="settings-certificate mt-3">
            <Row className="mx-0">
              <Col xs={12} sm={6} className="px-0 my-3">
                <p className="dsl-m12 mb-2 text-400">Levels</p>
                <p className="dsl-b16 normal mx-2">{`Level ${data.level}`}</p>
              </Col>
              <Col xs={12} sm={6} className="px-0 my-3">
                <p className="dsl-b14 mb-0 px-2">
                  {isNil(levelData[curLevel].valid_months)
                    ? 'Never'
                    : levelData[curLevel].valid_months}
                </p>
              </Col>
              <Col xs={12} sm={6} className="px-0 my-3">
                <p className="dsl-m12 mb-2 text-400">Author</p>
                <p className="dsl-b16 normal mx-2">
                  {getSettings([data.author_id], authors, 'N/A')}
                </p>
              </Col>
              <Col xs={12} sm={6} className="px-0 my-3">
                <p className="dsl-m12 mb-2 text-400">Departments</p>
                <p className="dsl-b16 normal mx-2">
                  {getSettings(data.data.department_id, departments, 'N/A')}
                </p>
              </Col>
              <Col xs={12} sm={6} className="px-0 my-3">
                <p className="dsl-m12 mb-2 text-400">Competencies</p>
                <p className="dsl-b16 normal mx-2">
                  {getSettings(data.data.competency_id, competencies, 'N/A')}
                </p>
              </Col>
              <Col xs={12} sm={6} className="px-0 my-3">
                <p className="dsl-m12 mb-2 text-400">Categories</p>
                <p className="dsl-b16 normal mx-2">
                  {getSettings(data.data.category_id, categories, 'N/A')}
                </p>
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
            afterChange={ind => this.setState({ curLevel: ind })}
          >
            {levelData.map((e, index) => {
              const { title, chronology_lock, time_lock, habits, quotas, trainings, documents } = e
              const habitsLength = equals(type(habits), 'Object')
                ? length(habits.day) + length(habits.week) + length(habits.month)
                : length(habits)

              return (
                <div key={`level-${index} mb-4`}>
                  <p className="dsl-b22 bold">{`Level ${index + 1}`}</p>
                  <div>
                    <p className="dsl-m12 mb-2 text-400">Job Title</p>
                    <p className="dsl-b16 p-2 text-400">{title}</p>
                  </div>
                  <div>
                    <p className="dsl-m12 mb-2 text-400">Estimated Time to Complete</p>
                    <p className="dsl-l16 normal text-400 mt-3 mx-3">
                      This will autofill automatically
                    </p>
                  </div>
                  <Accordion className="settings-certificate pb-2">
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
                    {quotas && length(quotas) > 0 ? (
                      <Instances.QuotasDetail data={quotas} type="template" />
                    ) : (
                      <Instances.Empty />
                    )}
                  </div>
                  <div className="required-field pt-4">
                    <p className="dsl-b18 text-500">Required Habits</p>
                    {habitsLength > 0 ? (
                      <Instances.HabitsDetail data={habits} type="template" />
                    ) : (
                      <Instances.Empty />
                    )}
                  </div>
                  <div className="required-field pt-4 mb-5">
                    <p className="dsl-b18 text-500">Required Training</p>
                    {trainings && length(trainings.items) > 0 ? (
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
  onSelect: PropTypes.func,
}

Detail.defaultProps = {
  userRole: 1,
  data: { id: 0, title: '', data: {} },
  authors: [],
  departments: [],
  competencies: [],
  categories: [],
  onSelect: () => {},
}

export default Detail

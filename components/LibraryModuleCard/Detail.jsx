import React, { memo } from 'react'
import PropTypes from 'prop-types'
import { Row, Col } from 'react-bootstrap'
import { drop, equals, find, indexOf, isNil, join, propEq, split } from 'ramda'
import { Accordion, EditDropdown, Filter, Thumbnail, Toggle } from '@components'
import { CardType, LibraryCardDetailMenu } from '~/services/config'
import { getSettings } from '~/services/util'
import './LibraryModuleCard.scss'

function Detail(props) {
  const { data, role, authors, departments, competencies, categories, history, onCardMenu } = props
  const TYPE = isNil(data.card_type_id) ? null : find(propEq('id', data.card_type_id), CardType)
  const managerApproval = equals(data.data.action_approval, 'manager') ? true : false
  const attachments = data.data.attachments.map(item => {
    const idx = indexOf('attachments', item)
    const link = drop(idx, item)
    if (indexOf('%2F', link) > -1) {
      return split('%2F', link)[2]
    } else {
      return split('/', link)[2]
    }
  })
  const attachment = join(', ', attachments) || 'N/A'

  return (
    <>
      <Filter aligns={['left', 'right']} backTitle="all modules" onBack={() => history.goBack()} />
      <div className="library-module-card border-5">
        <div className="detail-content">
          <div className="d-flex justify-content-between">
            <p className="dsl-b22 bold">{data.name}</p>
            <EditDropdown options={LibraryCardDetailMenu[role]} onChange={onCardMenu} />
          </div>
          <div>
            <p className="dsl-m12 text-400">Module Type</p>
            <p className="dsl-b16">{TYPE ? TYPE.label : 'N/A'}</p>
          </div>
          <div className="d-flex mb-4">
            <div>
              <p className="dsl-m12 text-400">Module Image</p>
              <Thumbnail src={data.data.thumb_url} size="medium" />
            </div>
            <div className="pl-4">
              <p className="dsl-m12">Description</p>
              <p className="dsl-b16">{data.data.description}</p>
            </div>
          </div>
          <div>
            <p className="dsl-m12 text-400">File</p>
            <p className="dsl-b16">{attachment}</p>
          </div>
          <Row className="mt-3">
            <Col sm={6} md={6}>
              <p className="dsl-m12">Time To Complete</p>
              <p className="dsl-b16 ml-2">{data.data.estimated_completion} days</p>
            </Col>
            <Col sm={6} md={6}>
              <Toggle
                checked={managerApproval}
                title="Manager Approval"
                leftLabel="Off"
                rightLabel="On"
              />
            </Col>
          </Row>
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
          <Accordion accordion={false}>
            <Row className="mt-3">
              <Col sm={6} md={6}>
                <p className="dsl-m12">Author</p>
                <p className="dsl-b16 ml-2">{getSettings([data.author_id], authors)}</p>
              </Col>
              <Col sm={6} md={6}>
                <p className="dsl-m12">Departments</p>
                <p className="dsl-b16 ml-2">{getSettings(data.data.department, departments)}</p>
              </Col>
            </Row>
            <Row className="mt-3">
              <Col sm={6} md={6}>
                <p className="dsl-m12">Competencies</p>
                <p className="dsl-b16 ml-2">{getSettings(data.data.competency, competencies)}</p>
              </Col>
              <Col sm={6} md={6}>
                <p className="dsl-m12">Categories</p>
                <p className="dsl-b16 ml-2">{getSettings(data.data.category, categories)}</p>
              </Col>
            </Row>
          </Accordion>
        </div>
      </div>
    </>
  )
}

Detail.propTypes = {
  data: PropTypes.any.isRequired,
  role: PropTypes.number.isRequired,
  authors: PropTypes.array.isRequired,
  departments: PropTypes.array.isRequired,
  competencies: PropTypes.array.isRequired,
  categories: PropTypes.array.isRequired,
  history: PropTypes.any.isRequired,
  onCardMenu: PropTypes.func.isRequired,
}

Detail.defaultProps = {
  data: {},
  role: 2,
  authors: [],
  departments: [],
  competencies: [],
  categories: [],
  history: {},
  onCardMenu: () => {},
}

export default memo(Detail)

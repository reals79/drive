import React from 'react'
import PropTypes from 'prop-types'
import { Row, Col } from 'react-bootstrap'
import { isNil, isEmpty, length } from 'ramda'
import { Accordion, Filter, EditDropdown } from '@components'
import { LibraryToDoScorecardMenu } from '~/services/config'
import { getSettings } from '~/services/util'
import Quota from './Quota'
import './LibraryToDoScoreCard.scss'

class Detail extends React.PureComponent {
  state = { quotas: [] }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { data } = nextProps
    if (!isNil(data.data)) {
      if (length(data.data.quotas) > 0) {
        const quota = data.data.quotas[0]
        if (!isNil(quota.data)) {
          const quotas = data.data.quotas
          return { quotas }
        }
      }
    }
    return null
  }

  render() {
    const { data, authors, departments, competencies, categories, history, userRole, onSelect } = this.props
    const { quotas } = this.state

    if (isNil(data) || isEmpty(data)) return null

    return (
      <>
        <Filter aligns={['left', 'right']} backTitle="all scorecards" onBack={() => history.goBack()} />
        <div className="lib-todo-scorecard" data-cy="scorecardDetail">
          <div className="scorecard-detail">
            <div className="d-flex justify-content-between py-2">
              <p className="dsl-b22 bold" data-cy="title">
                {data.title}
              </p>
              <EditDropdown
                dataCy="scorecardEditDropdown"
                options={LibraryToDoScorecardMenu[userRole]}
                onChange={onSelect}
              />
            </div>
            <div className="">
              <p className="dsl-m12 mb-2">Scorecard description</p>
              <p className="dsl-b16 p-2" data-cy="scorecardDescription">
                {data.data.description || data.description}
              </p>
            </div>
            <Accordion className="settings-scorecard" expanded={false}>
              <Row className="mx-0">
                <Col xs={12} sm={6} className="px-0 my-3">
                  <p className="dsl-m12 mb-2">Trigger performance review</p>
                  <p className="dsl-b16 p-2">Monthly</p>
                </Col>
                <Col xs={12} sm={6} className="px-0 my-3" />
                <Col xs={12} sm={6} className="px-0 my-3">
                  <p className="dsl-m12">Author</p>
                  <p className="dsl-b16 ml-2" data-cy="author">
                    {getSettings([data.author_id], authors, 'N/A')}
                  </p>
                </Col>
                <Col xs={12} sm={6} className="px-0 my-3">
                  <p className="dsl-m12">Departments</p>
                  <p className="dsl-b16 ml-2" data-cy="departments">
                    {getSettings(data.data.department, departments, 'N/A')}
                  </p>
                </Col>
                <Col xs={12} sm={6} className="px-0 my-3">
                  <p className="dsl-m12">Competencies</p>
                  <p className="dsl-b16 ml-2" data-cy="competencies">
                    {getSettings(data.data.competency, competencies, 'N/A')}
                  </p>
                </Col>
                <Col xs={12} sm={6} className="px-0 my-3">
                  <p className="dsl-m12">Categories</p>
                  <p className="dsl-b16 ml-2" data-cy="categories">
                    {getSettings(data.data.category, categories, 'N/A')}
                  </p>
                </Col>
              </Row>
            </Accordion>
          </div>
          {length(data.data.quotas) > 0 && (
            <div className="detail-list mt-3" data-cy="quotasList">
              {length(quotas) > 0 && (
                <>
                  <div className="dsl-b18 bold pt-2">Quotas</div>
                  <div className="card-item pt-2 py-3">
                    <div className="text-left mr-3">
                      <p className="dsl-m12 text-400 m-0">#</p>
                    </div>
                    <div className="d-flex-8 d-flex-ssm-1">
                      <p className="dsl-m12 text-400 m-0" data-cy="quotaLength">
                        Quotas ({length(data.data.quotas)})
                      </p>
                    </div>
                    <div className="d-flex-1 text-right">
                      <p className="dsl-m12 text-400 m-0">Target</p>
                    </div>
                    <div className="d-flex-1 text-right mr-4">
                      <p className="dsl-m12 text-400 m-0">Actual</p>
                    </div>
                    <div className="d-flex-2">
                      <p className="dsl-m12 text-400 m-0">Scale</p>
                    </div>
                  </div>
                </>
              )}
              {quotas.map((quota, index) => (
                <Quota dataCy="quotaListItem" data={quota} key={quota.id} index={index + 1} />
              ))}
            </div>
          )}
        </div>
      </>
    )
  }
}

Detail.propTypes = {
  data: PropTypes.any,
  authors: PropTypes.array,
  departments: PropTypes.array,
  competencies: PropTypes.array,
  categories: PropTypes.array,
}

Detail.defaultProps = {
  data: {},
  authors: [],
  departments: [],
  competencies: [],
  categories: [],
}

export default Detail

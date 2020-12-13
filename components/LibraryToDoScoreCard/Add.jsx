import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Row, Col } from 'react-bootstrap'
import { toast } from 'react-toastify'
import { clone, equals, find, findIndex, isEmpty, isNil, length, move, propEq, reverse, remove } from 'ramda'
import { Accordion, Button, Dropdown, Input, Filter, LibraryProgramsList as ProgramsList } from '@components'
import { PerformanceReviewType } from '~/services/config'
import Quota from './Quota'
import './LibraryToDoScoreCard.scss'

class Add extends Component {
  state = {
    title: '',
    description: '',
    selected: { author: [], department: [], competency: [], category: [] },
    quotas: [],
    review: [],
    visible: false,
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { modalData } = nextProps
    if (modalData.after) {
      const { quotas } = modalData.after
      if (quotas) {
        if (!equals(quotas, prevState.quotas)) {
          return { quotas: quotas, visible: true }
        }
      }
    }
    return null
  }

  componentDidUpdate(prevState) {
    const { visible } = this.state
    if (visible && !prevState.visible) {
      this.handleAddQuotas()
      this.setState({ visible: false })
    }
  }

  handleAddQuotas = () => {
    const { quotas } = this.state
    this.props.onModal({
      type: 'Attach Library',
      data: { before: { show: ['quotas'], modules: [], selected: quotas }, after: quotas },
      callBack: {
        onAttach: e => this.setState({ quotas: e.templates }),
        onAdd: () => this.handleNewQuota(),
      },
    })
  }

  handleNewQuota = () => {
    const { quotas } = this.state
    this.props.onModal({
      type: 'Add New Quota',
      data: { before: null, after: { quotas } },
    })
  }

  handleChangeQuota = ind => (type, e) => {
    if (type == 'stars') {
      const quota = this.state.quotas[ind]
      this.props.onModal({
        type: 'Add Quota Stars',
        data: {
          before: {
            title: quota.name,
            unit: quota.data.target_types,
            direction: quota.quota_direction,
          },
          after: e,
        },
        callBack: {
          onYes: stars => {
            const quotas = clone(this.state.quotas)
            quotas[ind].stars = stars
            this.setState({ quotas })
          },
        },
      })
    }
    if (type == 'type') {
      const quotas = clone(this.state.quotas)
      quotas[ind].data.target_types = e.name
      this.setState({ quotas })
    }
    if (type == 'source') {
      const quotas = clone(this.state.quotas)
      quotas[ind].data.source = e.name
      this.setState({ quotas })
    }
  }

  handleSelectTags = key => tags => {
    const { selected } = this.state
    if (!equals(selected[key], tags)) {
      selected[key] = tags
      this.setState({ selected })
    }
  }

  handleSelectMenu = quota => event => {
    const quotaLen = length(this.state.quotas)
    let quotas = clone(this.state.quotas)
    const indx = findIndex(propEq('id', quota.id), quotas)
    if (indx < 0) return

    switch (event) {
      case 'move up':
        if (indx !== 0) quotas = move(indx, indx - 1, quotas)
        break
      case 'move down':
        if (quotaLen !== indx + 1) quotas = move(indx, indx + 1, quotas)
        break
      case 'remove':
        quotas = remove(indx, 1, quotas)
        break
      case 'edit':
        const e = quota.star_values || quota.stars
        this.props.onModal({
          type: 'Add Quota Stars',
          data: {
            before: {
              title: quota.name,
              unit: quota.data.target_types,
              direction: quota.quota_direction,
            },
            after: e,
          },
          callBack: {
            onYes: stars => {
              quotas[indx].star_values = stars
              quotas[indx].stars = stars
              this.setState({ quotas })
            },
          },
        })
        break
      default:
        break
    }

    this.setState({ quotas })
  }

  handleSubmit = published => () => {
    const { companyId } = this.props
    const { title, description, selected, quotas } = this.state
    let isValid = true
    const noStars = find(x => isNil(x.stars), quotas)
    if (isEmpty(title) || isEmpty(description) || isEmpty(selected.author) || isEmpty(quotas) || !!noStars) return

    const _quotas = quotas.map(quota => {
      let stars = quota.stars
      if (isNil(stars)) {
        isValid = false
      } else {
        if (equals(quota.quota_direction, 1) && quota.stars[0] > quota.stars[1]) {
          stars = reverse(quota.stars)
        }
        if (equals(quota.quota_direction, 2) && quota.stars[0] < quota.stars[1]) {
          stars = reverse(quota.stars)
        }
      }
      return {
        quota_template_id: quota.id,
        star_values: stars,
      }
    })

    if (!isValid && published) {
      toast.error('You missed quota scale. \nPlease add the scale and then try it again.', {
        position: toast.POSITION.TOP_CENTER,
        pauseOnFocusLoss: false,
        hideProgressBar: true,
      })
      return
    }

    const data = {
      scorecard: {
        status: 0,
        title,
        published,
        company_id: companyId,
        author_id: selected.author[0],
        data: {
          description,
          category: selected.category,
          competency: selected.competency,
          department: selected.department,
          quotas: _quotas,
        },
      },
    }
    const payload = { type: 'scorecards', data }
    this.props.onCreate(payload)
  }

  render() {
    const { title, description, selected, quotas } = this.state
    const { authors, departments, competencies, categories } = this.props

    return (
      <>
        <Filter
          className="scorecard-add-filter btn-mr0"
          aligns={['left', 'right']}
          backTitle="all scorecards"
          onBack={() => this.props.history.goBack()}
          dataCy="scorecardFilter"
        />
        <div className="lib-todo-scorecard" data-cy="addScorecardForm">
          <div className="scorecard-detail">
            <div className="d-flex py-2">
              <p className="dsl-b18 bold mb-0">Add Scorecard</p>
            </div>
            <Input
              className="input-field"
              title="Scorecard name"
              dataCy="scorecardName"
              type="text"
              direction="vertical"
              value={title}
              placeholder="Type here..."
              onChange={e => this.setState({ title: e })}
            />
            <Input
              title="Scorecard description"
              dataCy="scorecardDescription"
              className="input-field input-textarea"
              type="text"
              value={description}
              as="textarea"
              rows="2"
              direction="vertical"
              value={description}
              placeholder="Type here..."
              onChange={e => this.setState({ description: e })}
            />

            <Accordion className="settings-scorecard">
              <Row className="mx-0 mb-4">
                <Col xs={12} sm={6} className="px-0">
                  <Dropdown
                    dataCy="performanceReview"
                    title="Trigger performance review"
                    direction="vertical"
                    width="fit-content"
                    defaultIndexes={[0]}
                    data={PerformanceReviewType}
                  />
                </Col>
                <Col xs={12} sm={6} className="px-0"></Col>
              </Row>
              <Row className="mx-0">
                <Col xs={12} sm={6} className="px-0 my-3">
                  <Dropdown
                    title="Author"
                    dataCy="author"
                    direction="vertical"
                    width="fit-content"
                    data={authors}
                    getValue={e => e.name}
                    onChange={this.handleSelectTags('author')}
                  />
                </Col>
                <Col xs={12} sm={6} className="px-0 my-3">
                  <Dropdown
                    multi
                    title="Departments"
                    dataCy="department"
                    direction="vertical"
                    width="fit-content"
                    data={departments}
                    getValue={e => e.name}
                    onChange={this.handleSelectTags('department')}
                  />
                </Col>
                <Col xs={12} sm={6} className="px-0 my-3">
                  <Dropdown
                    multi
                    title="Competencies"
                    dataCy="competencies"
                    direction="vertical"
                    width="fit-content"
                    data={competencies}
                    getValue={e => e.name}
                    onChange={this.handleSelectTags('competency')}
                  />
                </Col>
                <Col xs={12} sm={6} className="px-0 my-3">
                  <Dropdown
                    multi
                    title="Categories"
                    dataCy="categories"
                    direction="vertical"
                    width="fit-content"
                    data={categories}
                    getValue={e => e.name}
                    onChange={this.handleSelectTags('category')}
                  />
                </Col>
              </Row>
            </Accordion>
          </div>
          <div className="detail-list mt-3" data-cy="quotaLists">
            <div className="scorecard-quota-head">
              <p className="dsl-b22 bold">Quotas</p>
              <div className="justify-content-end d-flex px-3">
                <Button
                  name="+ Add Quota"
                  dataCy="addQuota"
                  className="px-0 my-0 auto-height"
                  type="link"
                  onClick={this.handleAddQuotas}
                />
              </div>
            </div>

            {isEmpty(quotas) ? (
              <ProgramsList.EmptyList />
            ) : (
              quotas.map((quota, index) => (
                <Quota
                  editable
                  data={quota}
                  dataCy="quotaList"
                  key={quota.id}
                  onChange={this.handleChangeQuota(index)}
                  onSelect={this.handleSelectMenu(quota)}
                />
              ))
            )}

            <div className="d-flex justify-content-end mt-3">
              <Button name="Save Draft" dataCy="saveDraft" className="btn-save mr-3" onClick={this.handleSubmit(0)} />
              <Button name="Save & Publish" dataCy="savePublish" className="btn-save" onClick={this.handleSubmit(1)} />
            </div>
          </div>
        </div>
      </>
    )
  }
}

Add.propTypes = {
  tags: PropTypes.array,
  companyId: PropTypes.number,
  onCreate: PropTypes.func,
  onModal: PropTypes.func,
}

Add.defaultProps = {
  tags: [],
  companyId: 0,
  onCreate: () => {},
  onModal: () => {},
}

export default Add

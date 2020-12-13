import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Row, Col } from 'react-bootstrap'
import { toast } from 'react-toastify'
import {
  clone,
  equals,
  find,
  findIndex,
  isEmpty,
  isNil,
  length,
  move,
  path,
  propEq,
  remove,
  reverse,
  values,
} from 'ramda'
import { Accordion, Button, Dropdown, EditDropdown, Filter, Input } from '@components'
import { RecurringType, LibraryToDoScorecardMenu } from '~/services/config'
import Quota from './Quota'
import './LibraryToDoScoreCard.scss'

class Edit extends Component {
  state = { scorecard: this.props.data, quotas: null, visible: false }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { data, modalData } = nextProps
    let { scorecard } = prevState
    if (isNil(scorecard)) scorecard = data
    if (isNil(prevState.quotas)) {
      if (path(['data'], data)) {
        if (length(path(['data', 'quotas'], data)) > 0) {
          const quota = data.data.quotas[0]
          if (!isNil(quota.data)) {
            let quotas = clone(data.data.quotas)
            if (nextProps.history.location.state && nextProps.history.location.state.card) {
              quotas.push(nextProps.history.location.state.card)
            }
            return { quotas }
          }
        }
        return { scorecard }
      }
    }
    if (modalData.after) {
      const { quotas } = modalData.after
      if (quotas) {
        const { data } = nextProps
        if (!equals(data.data.quotas, quotas)) {
          return { quotas, visible: true }
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
      data: { before: { show: ['quotas'], modules: [], selected: quotas }, after: null },
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
            quotas[ind].star_values = stars
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

  handleChangeScorecard = type => e => {
    const { scorecard } = this.state
    if (type == 'title') {
      this.setState({ scorecard: { ...scorecard, [type]: e } })
    } else if (type == 'description') {
      this.setState({ scorecard: { ...scorecard, data: { ...scorecard.data, [type]: e } } })
    }
  }

  handleFrequency = () => {}

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
        if (quotaLen == indx + 1) quotas = move(indx, indx + 1, quotas)
        break
      case 'remove':
        quotas = remove(indx, 1, quotas)
        break
      case 'edit':
        const e = quota.star_values
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

  handleSettings = type => e => {
    const { scorecard } = this.state
    if (type == 'author_id') {
      this.setState({ scorecard: { ...scorecard, author_id: e[0] } })
    } else {
      this.setState({ scorecard: { ...scorecard, data: { ...scorecard.data, [type]: e } } })
    }
  }

  handleSubmit = published => () => {
    const { scorecard } = this.state
    let isValid = true
    const quotas = this.state.quotas.map(quota => {
      let stars = quota.star_values
      if (isNil(stars)) {
        isValid = false
      } else {
        if (equals(quota.quota_direction, 1) && quota.star_values[0] > quota.star_values[1]) {
          stars = reverse(quota.star_values)
        }
        if (equals(quota.quota_direction, 2) && quota.star_values[0] < quota.star_values[1]) {
          stars = reverse(quota.star_values)
        }
      }

      return {
        quota_template_id: quota.quota_template_id || quota.id,
        star_values: stars,
      }
    })
    if (!isValid) {
      toast.error('You missed quota scale. \nPlease add the scale and then try it again.', {
        position: toast.POSITION.TOP_CENTER,
        pauseOnFocusLoss: false,
        hideProgressBar: true,
      })
      return
    }
    const payload = {
      scorecard: {
        id: scorecard.id,
        user_id: scorecard.user_id,
        status: scorecard.status,
        title: scorecard.title,
        data: { ...scorecard.data, quotas },
        company_id: scorecard.company_id,
        author_id: scorecard.author_id,
        published,
      },
    }
    this.props.onSubmit(payload)
    this.props.history.goBack()
  }

  render() {
    const { authors, departments, competencies, categories, userRole, onSelect, history } = this.props
    const { scorecard, quotas } = this.state

    if (isNil(scorecard) || isEmpty(scorecard)) return null

    const stars = quotas ? find(x => isNil(x.star_values), quotas) : null
    const disabled = (equals(scorecard, this.props.data) && equals(scorecard.data.quotas, quotas)) || !!stars

    return (
      <>
        <Filter
          dataCy="editScorecardFilter"
          aligns={['left', 'right']}
          backTitle="all scorecards"
          onBack={() => history.goBack()}
        />
        <div className="lib-todo-scorecard" data-cy="editScorecardForm">
          <div className="scorecard-detail">
            <div className="d-flex justify-content-between">
              <p className="dsl-m12 mb-1">Title</p>
              <EditDropdown
                dataCy="topthreedotDropdown"
                options={LibraryToDoScorecardMenu[userRole]}
                onChange={onSelect}
              />
            </div>
            <Input
              className="input-field"
              type="text"
              direction="vertical"
              dataCy="title"
              value={scorecard.title}
              placeholder="Type here..."
              onChange={this.handleChangeScorecard('title')}
            />
            <Input
              className="input-field input-textarea"
              title="Description"
              dataCy="description"
              type="text"
              as="textarea"
              rows="4"
              direction="vertical"
              value={scorecard.data.description || scorecard.description}
              placeholder="Type here..."
              onChange={this.handleChangeScorecard('description')}
            />
            <Accordion className="settings-scorecard" expanded>
              <Row className="mx-0">
                <Col xs={12} sm={6} className="px-0 my-3">
                  <Dropdown
                    title="Trigger performance review"
                    dataCy="performanceReviewDropdown"
                    direction="vertical"
                    width="fit-content"
                    data={values(RecurringType)}
                    getValue={e => e.label}
                    returnBy="data"
                    defaultIds={[2]}
                    onChange={this.handleFrequency}
                  />
                </Col>
                <Col xs={12} sm={6} className="px-0 my-3" />
                <Col xs={12} sm={6} className="px-0 my-3">
                  <Dropdown
                    title="Author"
                    dataCy="author"
                    direction="vertical"
                    width="fit-content"
                    getValue={e => e.name}
                    defaultIds={path(['author_id'], scorecard) ? [path(['author_id'], scorecard)] : []}
                    data={authors}
                    onChange={this.handleSettings('author_id')}
                  />
                </Col>
                <Col xs={12} sm={6} className="px-0 my-3">
                  <Dropdown
                    multi
                    title="Departments"
                    dataCy="departments"
                    direction="vertical"
                    width="fit-content"
                    getValue={e => e.name}
                    defaultIds={path(['data', 'department'], scorecard) || []}
                    data={departments}
                    onChange={this.handleSettings('department')}
                  />
                </Col>
                <Col xs={12} sm={6} className="px-0 my-3">
                  <Dropdown
                    multi
                    title="Competencies"
                    dataCy="competencies"
                    direction="vertical"
                    width="fit-content"
                    getValue={e => e.name}
                    defaultIds={path(['data', 'competency'], scorecard) || []}
                    data={competencies}
                    onChange={this.handleSettings('competency')}
                  />
                </Col>
                <Col xs={12} sm={6} className="px-0 my-3">
                  <Dropdown
                    multi
                    title="Categories"
                    dataCy="categories"
                    direction="vertical"
                    width="fit-content"
                    getValue={e => e.name}
                    defaultIds={path(['data', 'category'], scorecard)}
                    data={categories}
                    onChange={this.handleSettings('category')}
                  />
                </Col>
              </Row>
            </Accordion>
          </div>
          <div className="detail-list mt-3" data-cy="quotasList">
            <div className="d-flex">
              <div className="d-flex-1 align-items-start dsl-b18 bold pt-2">Quotas</div>
              <div className="justify-content-end">
                <Button name="+ Add Quota" type="link" onClick={this.handleAddQuotas} />
              </div>
            </div>
            {length(quotas) > 0 && (
              <>
                <div className="card-item pt-2 py-3">
                  <div className="text-left mr-3">
                    <p className="dsl-m12 text-400 m-0">#</p>
                  </div>
                  <div className="d-flex-8 d-flex-ssm-1">
                    <p className="dsl-m12 text-400 m-0">Quotas ({length(quotas)})</p>
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
                  <div className="edit d-none d-lg-flex" />
                </div>
                {quotas.map((quota, index) => (
                  <Quota
                    key={quota.id}
                    data={quota}
                    dataCy="quotaListItem"
                    editable
                    index={index + 1}
                    onChange={this.handleChangeQuota(index)}
                    onSelect={this.handleSelectMenu(quota)}
                  />
                ))}
              </>
            )}
          </div>
          <div className="d-flex align-items-end flex-column">
            <div className="mt-4 d-flex justify-content-end">
              <Button
                dataCy="saveDraft"
                className="mr-3"
                name="Save Draft"
                disabled={disabled}
                onClick={this.handleSubmit(0)}
              />
              <Button data-cy="savePublish" disabled={disabled} name="Save & Publish" onClick={this.handleSubmit(1)} />
            </div>
          </div>
        </div>
      </>
    )
  }
}

Edit.propTypes = {
  authors: PropTypes.array,
  departments: PropTypes.array,
  competencies: PropTypes.array,
  categories: PropTypes.array,
  data: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    data: PropTypes.any,
    author_id: PropTypes.number,
  }),
  onModal: PropTypes.func,
  onSubmit: PropTypes.func.isRequired,
}

Edit.defaultProps = {
  authors: [],
  departments: [],
  competencies: [],
  categories: [],
  data: {
    id: 0,
    name: '',
    data: {},
    author_id: 0,
  },
  onModal: () => {},
  onSubmit: () => {},
}

export default Edit

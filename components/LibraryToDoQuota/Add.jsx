import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Row, Col } from 'react-bootstrap'
import { isEmpty, equals, isNil } from 'ramda'
import { Accordion, Button, Dropdown, Filter, Input, Toggle } from '@components'
import { QuotaType, QuotaSource, QuotaDirections } from '~/services/config'
import './LibraryToDoQuota.scss'

class Add extends Component {
  state = {
    title: '',
    description: '',
    selected: {
      author: [],
      department: [],
      competency: [],
      category: [],
      types: [],
      source: [],
      track: false,
      direction: null,
    },
  }

  handleSelectTags = key => tags => {
    const { selected } = this.state
    if (!equals(selected[key], tags)) {
      selected[key] = tags
      this.setState({ selected })
    }
  }

  handleSubmit = published => () => {
    const { title, description, selected } = this.state
    if (isEmpty(title) || isEmpty(selected.author) || isEmpty(selected.types) || isEmpty(selected.source)) return
    const data = {
      quota_template: {
        name: title,
        data: {
          description,
          source: selected.source[0].name,
          target_types: selected.types[0].name,
          track_daily: selected.track ? 'yes' : 'no',
          category: selected.category,
          competency: selected.competency,
          department: selected.department,
        },
        author_id: selected.author[0],
        quota_direction: isNil(selected.direction) ? QuotaDirections[0].value : selected.direction[0].value,
        published,
      },
    }
    const payload = { type: 'quotas', data }
    this.props.onCreate(payload)
  }

  render() {
    const { title, description, selected } = this.state
    const { authors, departments, competencies, categories } = this.props

    return (
      <>
        <Filter
          aligns={['left', 'right']}
          backTitle="all quotas"
          onBack={() => this.props.history.goBack()}
          dataCy="addQotaFilter"
        />
        <div className="lib-todo-quota" data-cy="quotaAddForm">
          <div className="quota-detail">
            <div className="d-flex py-2">
              <p className="dsl-b18 bold mb-0">Add New Quota</p>
            </div>
            <Input
              className="input-field"
              dataCy="title"
              title="Title"
              type="text"
              direction="vertical"
              value={title}
              placeholder="Type here..."
              onChange={e => this.setState({ title: e })}
            />
            <Input
              title="Description"
              dataCy="description"
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
            <Accordion className="settings-quota">
              <Row className="mx-0">
                <Col xs={12} sm={6} className="px-0 my-3">
                  <Dropdown
                    title="Type"
                    direction="vertical"
                    dataCy="quotaType"
                    width="fit-content"
                    data={QuotaType}
                    getValue={e => e.name}
                    returnBy="data"
                    onChange={this.handleSelectTags('types')}
                  />
                </Col>
                <Col xs={12} sm={6} className="px-0 my-3">
                  <Dropdown
                    title="Source"
                    direction="vertical"
                    dataCy="quotaSource"
                    width="fit-content"
                    data={QuotaSource}
                    getValue={e => e.name}
                    returnBy="data"
                    onChange={this.handleSelectTags('source')}
                  />
                </Col>
                <Col xs={12} sm={6} className="px-0 my-3">
                  <Dropdown
                    title="Author"
                    direction="vertical"
                    width="fit-content"
                    dataCy="authors"
                    data={authors}
                    getValue={e => e.name}
                    onChange={this.handleSelectTags('author')}
                  />
                </Col>
                <Col xs={12} sm={6} className="px-0 my-3">
                  <Dropdown
                    multi
                    title="Departments"
                    dataCy="departments"
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
                    direction="vertical"
                    dataCy="categories"
                    width="fit-content"
                    data={categories}
                    getValue={e => e.name}
                    onChange={this.handleSelectTags('category')}
                  />
                </Col>
                <Col xs={12} sm={6} className="px-0 my-3">
                  <Toggle
                    checked={selected.track}
                    title="Track Daily"
                    leftLabel="Off"
                    rightLabel="On"
                    dataCy="trackDaily"
                    onChange={this.handleSelectTags('track')}
                  />
                </Col>
                <Col xs={12} sm={6} className="px-0 my-3">
                  <Dropdown
                    title="Direction"
                    direction="vertical"
                    width="fit-content"
                    data={QuotaDirections}
                    getValue={e => e['name']}
                    dataCy="quotaDirections"
                    returnBy="data"
                    onChange={this.handleSelectTags('direction')}
                  />
                </Col>
              </Row>
            </Accordion>
            <div className="mt-4 d-flex justify-content-end">
              <Button name="Save Draft" dataCy="saveDraft" className="mr-3" onClick={this.handleSubmit(0)} />
              <Button dataCy="savePublish" name="Save & Publish" onClick={this.handleSubmit(1)} />
            </div>
          </div>
        </div>
      </>
    )
  }
}

Add.propTypes = {
  authors: PropTypes.array.isRequired,
  departments: PropTypes.array.isRequired,
  competencies: PropTypes.array.isRequired,
  categories: PropTypes.array.isRequired,
  history: PropTypes.any.isRequired,
  onCreate: PropTypes.func.isRequired,
}

Add.defaultProps = {
  authors: [],
  departments: [],
  competencies: [],
  categories: [],
  history: [],
  onCreate: () => {},
}

export default Add

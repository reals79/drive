import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Row, Col } from 'react-bootstrap'
import { equals, find, isNil, propEq } from 'ramda'
import { Button, Accordion, Dropdown, Filter, Input, Toggle } from '@components'
import { QuotaType, QuotaSource, QuotaDirections } from '~/services/config'

class Edit extends Component {
  state = {
    id: this.props.data.id,
    title: this.props.data.name,
    description: this.props.data.data.description,
    selected: {
      author: [this.props.data.author_id],
      department: this.props.data.data.department || [],
      competency: this.props.data.data.competency || [],
      category: this.props.data.data.category || [],
      types: [find(propEq('name', this.props.data.data.target_types))(QuotaType) || QuotaType[0]],
      source: [find(propEq('name', this.props.data.data.source))(QuotaSource) || QuotaSource[0]],
      track: this.props.data.data.track_daily || false,
      direction: [find(propEq('value', this.props.data.quota_direction))(QuotaDirections)],
    },
    disabled: true,
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { data } = nextProps
    const { title, description, selected } = prevState
    const disabled =
      data.name == title &&
      data.data.description == description &&
      equals(selected.author, [data.author_id]) &&
      equals(selected.department, data.data.department || []) &&
      equals(selected.competency, data.data.competency || []) &&
      equals(selected.category, data.data.category || []) &&
      equals(selected.types, [find(propEq('name', data.data.target_types))(QuotaType) || QuotaType[0]]) &&
      equals(selected.source, [find(propEq('name', data.data.source))(QuotaSource) || QuotaType[0]]) &&
      equals(selected.track, data.data.track_daily || false) &&
      equals(selected.direction, [find(propEq('value', data.quota_direction))(QuotaDirections)])
    return { disabled }
  }

  handleSelectTags = key => tags => {
    const { selected } = this.state
    if (!equals(selected[key], tags)) {
      if (equals(key, 'track')) selected[key] = tags ? 'yes' : 'no'
      else selected[key] = tags
      this.setState({ selected })
    }
  }

  handleSubmit = published => () => {
    const { id, title, description, selected } = this.state

    const data = {
      quota_template: {
        id,
        name: title,
        data: {
          description,
          source: selected.source[0].name,
          target_types: selected.types[0].name,
          track_daily: equals(selected.track, 'yes') ? 'yes' : 'no',
          category: selected.category,
          competency: selected.competency,
          department: selected.department,
        },
        author_id: selected.author[0],
        quota_direction: selected.direction[0].value,
        published,
      },
    }
    const payload = {
      type: 'quotas',
      data,
    }
    this.props.onUpdate(payload)
  }

  render() {
    const { title, description, selected, disabled } = this.state
    const { authors, departments, competencies, categories, history } = this.props
    const target_types = isNil(selected.types[0]) ? 0 : selected.types[0].id
    const sourceId = isNil(selected.source[0]) ? 0 : selected.source[0].id
    const track = isNil(selected.track) ? false : equals(selected.track, 'yes') ? true : false

    return (
      <>
        <Filter
          dataCy="editQuotaFilter"
          aligns={['left', 'right']}
          backTitle="all quotas"
          onBack={() => history.goBack()}
        />
        <div className="lib-todo-quota" data-cy="editQuotaForm">
          <div className="quota-detail">
            <div className="d-flex py-2">
              <p className="dsl-b18 bold mb-0">Edit Quota</p>
            </div>
            <Input
              className="input-field"
              title="Title"
              dataCy="title"
              type="text"
              direction="vertical"
              value={title}
              placeholder="Type here..."
              onChange={title => this.setState({ title })}
            />
            <Input
              title="Description"
              className="input-field input-textarea"
              type="text"
              dataCy="description"
              value={description}
              as="textarea"
              rows="2"
              direction="vertical"
              value={description}
              placeholder="Type here..."
              onChange={description => this.setState({ description })}
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
                    defaultIds={[target_types]}
                    getValue={e => e.name}
                    returnBy="data"
                    onChange={this.handleSelectTags('types')}
                  />
                </Col>
                <Col xs={12} sm={6} className="px-0 my-3">
                  <Dropdown
                    title="Source"
                    direction="vertical"
                    width="fit-content"
                    data={QuotaSource}
                    dataCy="quotaSource"
                    defaultIds={[sourceId]}
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
                    dataCy="author"
                    data={authors}
                    returnBy="id"
                    defaultIds={selected.author}
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
                    defaultIds={selected.department}
                    getValue={e => e.name}
                    data={departments}
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
                    defaultIds={selected.competency}
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
                    defaultIds={selected.category}
                    getValue={e => e.name}
                    onChange={this.handleSelectTags('category')}
                  />
                </Col>
                <Col xs={12} sm={6} className="px-0 my-3">
                  <Toggle
                    checked={track}
                    title="Track Daily"
                    dataCy="trackDaily"
                    leftLabel="Off"
                    rightLabel="On"
                    onChange={this.handleSelectTags('track')}
                  />
                </Col>
                <Col xs={12} sm={6} className="px-0 my-3">
                  <Dropdown
                    title="Direction"
                    direction="vertical"
                    dataCy="quotaDirection"
                    width="fit-content"
                    data={QuotaDirections}
                    defaultIds={[selected.direction[0].id]}
                    getValue={e => e['name']}
                    returnBy="data"
                    onChange={this.handleSelectTags('direction')}
                  />
                </Col>
              </Row>
            </Accordion>
            <div className="mt-4 d-flex justify-content-end">
              <Button
                name="Save Draft"
                dataCy="saveDraft"
                className="mr-3"
                disabled={disabled}
                onClick={this.handleSubmit(0)}
              />
              <Button dataCy="savePublish" name="Save & Publish" disabled={disabled} onClick={this.handleSubmit(1)} />
            </div>
          </div>
        </div>
      </>
    )
  }
}

Edit.propTypes = {
  data: PropTypes.any,
  name: PropTypes.string,
  description: PropTypes.string,
  departments: PropTypes.array,
  competencies: PropTypes.array,
  categories: PropTypes.array,
  courses: PropTypes.array,
  onUpdate: PropTypes.func,
}

Edit.defaultProps = {
  quota: {},
  id: null,
  name: '',
  description: '',
  departments: [],
  competencies: [],
  categories: [],
  courses: [],
  onUpdate: () => {},
}

export default Edit

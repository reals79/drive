import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Row, Col } from 'react-bootstrap'
import { isEmpty } from 'ramda'
import { Accordion, Button, Dropdown, Icon, Input, Toggle } from '@components'
import { QuotaType, QuotaSource, QuotaDirections } from '~/services/config'
import './AddNewQuota.scss'

class AddNewQuota extends Component {
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
      direction: [],
    },
  }

  handleSubmit = () => {
    const { title, description, selected } = this.state
    const payload = {
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
        quota_direction: isEmpty(selected.direction) ? QuotaDirections[0].value : selected.direction[0].value,
        published: 1,
      },
    }
    this.props.onCreate(payload, this.props.selected)
  }

  handleSelectTags = key => tags => {
    const { selected } = this.state
    if (selected[key] == !tags) {
      selected[key] = tags
      this.setState({ selected })
    }
  }

  render() {
    const { title, description, selected } = this.state
    const { authors, departments, competencies, categories } = this.props
    const disabled =
      title === '' ||
      isEmpty(selected.author) ||
      isEmpty(selected.types) ||
      isEmpty(selected.source) ||
      isEmpty(selected.direction)

    return (
      <div className="add-new-quota-modal">
        <div className="modal-header">
          <Icon name="fal fa-plus-circle mr-2" color="white" size={16} />
          <span className="dsl-w12 ml-1">Add Quota</span>
        </div>
        <div className="modal-body">
          <Input
            className="input-field"
            title="Quota Title"
            type="text"
            direction="vertical"
            value={title}
            placeholder="Type here..."
            onChange={e => this.setState({ title: e })}
          />
          <Input
            title="Description"
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

          <Row className="p-3">
            <Col xs={12} sm={6} className="px-0 my-3">
              <Dropdown
                title="Type"
                direction="vertical"
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
                width="fit-content"
                data={QuotaSource}
                getValue={e => e.name}
                returnBy="data"
                onChange={this.handleSelectTags('source')}
              />
            </Col>
            <Col xs={12} sm={6} className="px-0 my-3">
              <Toggle
                checked={selected.track}
                title="Track Daily"
                leftLabel="Off"
                rightLabel="On"
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
                returnBy="data"
                onChange={this.handleSelectTags('direction')}
              />
            </Col>
          </Row>
          <Accordion className="settings-quota" expanded>
            <Row className="mx-0">
              <Col xs={12} sm={6} className="px-0 my-3">
                <Dropdown
                  title="Author"
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
                  width="fit-content"
                  data={categories}
                  getValue={e => e.name}
                  onChange={this.handleSelectTags('category')}
                />
              </Col>
            </Row>
          </Accordion>
        </div>
        <div className="modal-footer  mx-0 pb-4">
          <Button disabled={disabled} name="ADD Quota" onClick={this.handleSubmit} />
        </div>
      </div>
    )
  }
}

AddNewQuota.propTypes = {
  authors: PropTypes.array.isRequired,
  departments: PropTypes.array.isRequired,
  competencies: PropTypes.array.isRequired,
  categories: PropTypes.array.isRequired,
  onCreate: PropTypes.func.isRequired,
}

AddNewQuota.defaultProps = {
  departments: [],
  competencies: [],
  categories: [],
  onCreate: () => {},
}

export default AddNewQuota

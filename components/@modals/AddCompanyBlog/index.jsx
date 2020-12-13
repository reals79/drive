import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Row, Col } from 'react-bootstrap'
import ReactQuill from 'react-quill'
import { equals } from 'ramda'
import { Button, Dropdown, Icon, Input, Toggle } from '@components'
import './AddCompanyBlog.scss'

class AddCompanyBlog extends PureComponent {
  state = {
    title: '',
    composer: null,
    selected: {
      author: [],
      department: [],
      competency: [],
      category: [],
    },
    featured: false,
  }

  handleSelectTags = key => tags => {
    const { selected } = this.state
    if (!equals(selected[key], tags)) {
      selected[key] = tags
      this.setState({ selected })
    }
  }

  handleSubmit = status => () => {
    const { title, composer } = this.state
    const { data, entity } = this.props
    const payload = {
      data: {
        post: {
          id: data.id,
          name: title,
          entity_id: entity?.id,
          status,
          data: {
            ...data.data,
            body: composer,
          },
        },
      },
    }
    this.props.onSubmit(payload)
    this.props.onClose()
  }

  render() {
    const { title, composer, featured } = this.state
    const { authors, departments, competencies, categories } = this.props

    return (
      <div className="add-blog-modal">
        <div className="modal-header">
          <Icon name="fal fa-plus-circle" size={12} color="#fff" />
          <span className="dsl-w12 ml-1">Add Post</span>
        </div>
        <div className="modal-body">
          <div className="d-flex align-items-end">
            <Input
              className="d-flex-1"
              title="Title"
              value={title}
              placeholder="Type here..."
              direction="vertical"
              onChange={e => this.setState({ title: e })}
            />
            <Button className="ml-5" type="link">
              <Icon name="fal fa-eye" size={14} color="#376caf" />
              <span className="dsl-p14 text-400 ml-1">Preview</span>
            </Button>
          </div>
          <p className="dsl-m12 mt-3">Composer</p>
          <ReactQuill value={composer} onChange={e => this.setState({ composer: e })} />

          <Row className="mt-3">
            <Col xs={12} sm={6} className="my-3">
              <Dropdown
                title="Author"
                direction="vertical"
                width="fit-content"
                data={authors}
                getValue={e => e.name}
                onChange={this.handleSelectTags('author')}
              />
            </Col>
            <Col xs={12} sm={6} className="my-3">
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
            <Col xs={12} sm={6} className="my-3">
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
            <Col xs={12} sm={6} className="my-3">
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

          <Row className="mt-3">
            <Col>
              <Toggle
                checked={featured}
                title="Featured"
                leftLabel="Off"
                rightLabel="On"
                onChange={e => this.setState({ featured: e })}
              />
            </Col>
          </Row>

          <div className="d-flex align-items-center">
            <Button className="ml-auto" type="link" name="Draft" onClick={this.handleSubmit(2)} />
            <Button className="ml-2" name="Post" onClick={this.handleSubmit(0)} />
          </div>
        </div>
      </div>
    )
  }
}

AddCompanyBlog.propTypes = {
  authors: PropTypes.array,
  departments: PropTypes.array,
  competencies: PropTypes.array,
  categories: PropTypes.array,
  data: PropTypes.any,
  entity: PropTypes.shape({
    id: PropTypes.number,
  }),
}

AddCompanyBlog.defaultProps = {
  authors: [],
  departments: [],
  competencies: [],
  categories: [],
  data: {},
  entity: {
    id: 0,
  },
}

export default AddCompanyBlog

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { Row, Col } from 'react-bootstrap'
import { clone, equals } from 'ramda'
import { Accordion, Button, Dropdown, Filter, Icon, Input } from '@components'
import './LibraryDocumentCard.scss'

class Edit extends Component {
  constructor(props) {
    super(props)
    this.handleUpdate = this.handleUpdate.bind(this)
    this.handleSelectTags = this.handleSelectTags.bind(this)
    this.state = {
      name: props.document.name || props.document.title,
      description: props.document.data.description,
      selected: {
        author: props.document.author_id,
        department: props.document.data.department,
        competency: props.document.data.competency,
        category: props.document.data.category,
      },
    }
  }

  handleUpdate() {
    const { name, description, selected } = this.state
    const payload = {
      document: {
        id: this.props.document.id,
        name: name,
        data: {
          category: selected.category,
          competency: selected.competency,
          department: selected.department,
          description: description,
          type: this.props.type,
          attachment: this.props.attachment,
        },
        author_id: selected.author,
      },
    }
    this.props.onUpdate(payload)
  }

  handleSelectTags(key, tags) {
    const selected = clone(this.state.selected)
    if (!equals(selected[key], tags)) {
      selected[key] = tags
      this.setState({ selected })
    }
  }

  render() {
    const { name, description, selected } = this.state
    const { type, document, authors, departments, competencies, categories, history } = this.props

    return (
      <>
        <Filter
          aligns={['left', 'right']}
          backTitle="all documents"
          onBack={() => history.goBack()}
        />
        <div className="library-document-card border-5">
          <div className="detail-content">
            <div className="d-flex justify-content-between py-1">
              <p className="dsl-b16 bold mb-0">Document Name</p>
              <Icon name="far fa-ellipsis-h" size={14} color="#c3c7cc" />
            </div>
            <div className="py-2">
              <Input direction="vertical" value={name} onChange={e => this.setState({ name: e })} />
            </div>
            <div className="py-2">
              <Input
                title="Document Description"
                direction="vertical"
                value={description}
                onChange={e => this.setState({ description: e })}
              />
            </div>
            {equals('esign', type) ? (
              <Row className="mx-0 mt-2">
                <Col xs={12} sm={6} className="px-0">
                  <p className="dsl-m12 mb-0">Singers</p>
                  <div className="p-2">
                    <p className="dsl-b16 mb-0">15</p>
                  </div>
                </Col>
                <Col xs={12} sm={6} className="px-0">
                  <p className="dsl-m12 mb-0">Countersingers</p>
                  <div className="p-2">
                    <p className="dsl-b16 mb-0">3</p>
                  </div>
                </Col>
              </Row>
            ) : (
              <Row className="mx-0 mt-2">
                <Col xs={12} sm={6} className="px-0">
                  <p className="dsl-m12 mb-0">File</p>
                  <div className="p-2">
                    <p className="dsl-b16 mb-0">
                      {document.data.file ? document.data.file : 'N/A'}
                    </p>
                  </div>
                </Col>
                <Col xs={12} sm={6} className="px-0">
                  <p className="dsl-m12 mb-0">Last time Changed</p>
                  <div className="p-2">
                    <p className="dsl-b16 mb-0">
                      {moment
                        .utc(document.updated_at)
                        .local()
                        .format('MMM DD, YYYY')}
                    </p>
                  </div>
                </Col>
              </Row>
            )}
            <Accordion className="settings">
              <Row className="mt-3">
                <Col xs={12} sm={6} className="my-3">
                  <Dropdown
                    title="Author"
                    direction="vertical"
                    width="fit-content"
                    data={authors}
                    defaultIds={[selected.author]}
                    getValue={e => e.name}
                    onChange={this.handleSelectTags.bind(this, 'author')}
                  />
                </Col>
                <Col xs={12} sm={6} className="my-3">
                  <Dropdown
                    multi
                    title="Departments"
                    direction="vertical"
                    width="fit-content"
                    data={departments}
                    defaultIds={selected.department}
                    getValue={e => e.name}
                    onChange={this.handleSelectTags.bind(this, 'department')}
                  />
                </Col>
                <Col xs={12} sm={6} className="my-3">
                  <Dropdown
                    multi
                    title="Competencies"
                    direction="vertical"
                    width="fit-content"
                    data={competencies}
                    defaultIds={selected.competency}
                    getValue={e => e.name}
                    onChange={this.handleSelectTags.bind(this, 'competency')}
                  />
                </Col>
                <Col xs={12} sm={6} className="my-3">
                  <Dropdown
                    multi
                    title="Categories"
                    direction="vertical"
                    width="fit-content"
                    data={categories}
                    defaultIds={selected.category}
                    getValue={e => e.name}
                    onChange={this.handleSelectTags.bind(this, 'category')}
                  />
                </Col>
              </Row>
            </Accordion>
            <div className="mt-3 text-right">
              <Button name="Save Document" onClick={this.handleUpdate} />
            </div>
          </div>
        </div>
      </>
    )
  }
}

Edit.propTypes = {
  document: PropTypes.any.isRequired,
}

Edit.defaultProps = {
  document: {},
}

export default Edit

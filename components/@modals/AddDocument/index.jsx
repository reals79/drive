import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { equals, clone } from 'ramda'
import { Button, Icon, Input, Dropdown, Upload } from '@components'
import { DocumentType } from '~/services/config'
import './AddDocument.scss'

class AddDocument extends Component {
  constructor(props) {
    super(props)
    this.handleCreate = this.handleCreate.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleDrop = this.handleDrop.bind(this)
    this.state = {
      name: '',
      description: '',
      attachment: null,
      submitted: false,
      documentType: props.type.name,
      selected: {
        department: [],
        competency: [],
        category: [],
      },
    }
  }

  handleCreate() {
    const { name, description, selected, documentType, attachment } = this.state
    const payload = {
      document: {
        author_id: 1,
        title: name,
        data: {
          description: description,
          type: documentType,
          category: selected.category,
          competency: selected.competency,
          department: selected.department,
          file: attachment.name,
        },
      },
    }

    this.props.onCreate(payload, attachment)
  }

  handleSelectTags(key, tags) {
    const selected = clone(this.state.selected)
    if (!equals(selected[key], tags)) {
      selected[key] = tags
      this.setState({ selected })
    }
  }

  handleChange(e) {
    let type = ''
    if (equals(e[0], 0)) {
      type = 'Power Point'
    } else if (equals(e[0], 1)) {
      type = 'Word'
    } else if (equals(e[0], 2)) {
      type = 'PDF'
    }
    this.setState({ documentType: type })
  }

  handleDrop(e) {
    this.setState({ attachment: e[0] })
  }

  render() {
    const { name, description, attachment, documentType } = this.state
    const { departments, competencies, categories, type } = this.props
    return (
      <div className="modal-content add-document-modal">
        <div className="modal-header">
          <Icon name="fal fa-plus-circle" size={10} color="#fff" />
          <span className="dsl-w12 ml-1">Add Document</span>
        </div>
        <div className="modal-body clearfix">
          <p className="dsl-m12 mb-1 py-2">Document Type:</p>
          <Dropdown
            width="fit-content"
            placeholder="Select"
            defaultIds={[type.id]}
            getValue={DocumentType => DocumentType['name']}
            data={DocumentType}
            onChange={this.handleChange}
          />
          <div className="py-2">
            <Input title="Document Name" direction="vertical" value={name} onChange={e => this.setState({ name: e })} />
          </div>
          {equals(documentType, 'Power Point') && (
            <div className="mb-4 py-2">
              <p className="dsl-m12 ">File</p>
              <div className="d-flex">
                {attachment ? (
                  <p className="dsl-b16  ml-4">{attachment.name}</p>
                ) : (
                  <Upload
                    accept=".ppt, .pptx, .pot, .potx, .odp"
                    title="UPLOAD FILE"
                    icon="fal fa-file-import"
                    color="#376caf"
                    onDrop={this.handleDrop}
                  />
                )}
              </div>
            </div>
          )}
          {equals(documentType, 'Word') && (
            <div className="mb-4 py-2">
              <p className="dsl-m12 ">File</p>
              <div className="d-flex">
                {attachment ? (
                  <p className="dsl-b16  ml-4">{attachment.name}</p>
                ) : (
                  <Upload
                    accept=".doc"
                    title="UPLOAD FILE"
                    icon="fal fa-file-import"
                    color="#376caf"
                    onDrop={this.handleDrop}
                  />
                )}
              </div>
            </div>
          )}
          {equals(documentType, 'PDF') && (
            <div className="mb-4 py-2">
              <p className="dsl-m12 ">File</p>
              <div className="d-flex">
                {attachment ? (
                  <p className="dsl-b16  ml-4">{attachment.name}</p>
                ) : (
                  <Upload
                    accept="application/pdf"
                    title="UPLOAD FILE"
                    icon="fal fa-file-import"
                    color="#376caf"
                    onDrop={this.handleDrop}
                  />
                )}
              </div>
            </div>
          )}
          <div className="py-2">
            <Input
              as="textarea"
              title="File Description"
              direction="vertical"
              value={description}
              onChange={e => this.setState({ description: e })}
            />
          </div>
          <div className="py-2">
            <p className="dsl-m12">Department</p>
            <Dropdown
              multi
              className="tag-dropdown"
              width="fit-content"
              data={departments}
              placeholder="Select multiple"
              getValue={e => e['name']}
              onChange={e => this.handleSelectTags('department', e)}
            />
          </div>
          <div className="py-2">
            <p className="dsl-m12 ">Competencies</p>
            <Dropdown
              multi
              className="tag-dropdown"
              width="fit-content"
              placeholder="Select multiple"
              data={competencies}
              getValue={e => e['name']}
              onChange={e => this.handleSelectTags('competency', e)}
            />
          </div>
          <div className="py-2">
            <p className="dsl-m12 ">Categories</p>
            <Dropdown
              multi
              className="tag-dropdown"
              width="fit-content"
              placeholder="Select multiple"
              data={categories}
              getValue={e => e.name}
              onChange={e => this.handleSelectTags('category', e)}
            />
          </div>
        </div>
        <div className="modal-footer mx-0 pb-4 pull-right">
          <Button className="ml-3" name="Add" onClick={this.handleCreate} />
        </div>
      </div>
    )
  }
}

AddDocument.propTypes = {
  departments: PropTypes.array,
  competencies: PropTypes.array,
  categories: PropTypes.array,
  onCreate: PropTypes.func.isRequired,
}

AddDocument.defaultProps = {
  departments: [],
  competencies: [],
  categories: [],
  onCreate: () => {},
}

export default AddDocument

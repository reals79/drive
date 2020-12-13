import React from 'react'
import ReactQuill from 'react-quill'
import { Col, Row } from 'react-bootstrap'
import PropTypes from 'prop-types'
import { history } from '~/reducers'
import { Button, Dropdown, Icon, Input } from '@components'
import './AddForum.scss'

class AddForum extends React.PureComponent {
  state = {
    eventType: this.props.event,
    parent_id: this.props.data?.id,
    category_id: this.props.data ? this.props.data?.categories[0]?.id : 8,
    title: this.props.data?.name || '',
    body: this.props.data ? this.props.data?.comments[0]?.body : null,
    page: this.props.page,
    perPage: this.props.perPage,
    anonymous: false,
    tos_accepted: 1,
  }

  modules = {
    toolbar: [
      [{ font: [] }],
      [{ size: ['small', false, 'large', 'huge'] }],
      ['bold', 'italic', 'underline'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ align: [] }],
      [{ color: [] }, { background: [] }],
      ['clean'],
    ],
  }

  handleDropdownChange = (type, value) => {
    this.setState({ [type]: value })
  }

  handleSubmit = () => {
    const { category_id, title, body } = this.state
    const { token, onModal } = this.props
    const payload = { category_id, topic: { name: title, data: { body } } }
    const route = history.location.pathname

    if (token) {
      this.props.onAddTopic(payload)
      this.props.onClose()
    } else {
      onModal({
        type: 'Authentication',
        data: {
          before: {
            route,
            after: {
              type: 'ADDFORUMTOPIC_REQUEST',
              payload,
            },
          },
        },
        callBack: null,
      })
    }
  }

  handleEditSubmit = () => {
    const { data } = this.props
    const { body, parent_id, page, perPage } = this.state
    const comment_id = data?.comments[0].id
    const payload = {
      data: { comment: { parent_id, id: comment_id, data: { body } } },
      pagination: { page, perPage },
    }
    this.props.onEditTopic(payload)
    this.props.onClose()
  }

  render() {
    const { departmentsList, onClose, event } = this.props
    const { body, title, category_id } = this.state
    const disabled = body === null || title === '' || category_id === ''
    const disable = event === ''

    return (
      <div className="add-forum-model">
        <div className="modal-header">
          <Icon name="fal fa-plus-circle" size={10} color="#fff" />
          <span className="dsl-w12 ml-1">Add Forum Topic</span>
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
              disabled={!disable}
            />
          </div>
          <p className="dsl-m12 mt-3">Topic body</p>
          <ReactQuill theme="snow" value={body} modules={this.modules} onChange={e => this.setState({ body: e })} />
          <Row className="mt-3">
            <Col xs={12} sm={6} className="my-3">
              <Dropdown
                title="Departments"
                className="pt-3"
                data={departmentsList}
                direction="vertical"
                defaultIds={[category_id]}
                returnBy="data"
                getValue={e => e.name}
                onChange={e => this.handleDropdownChange('category_id', e[0].id)}
                disabled={!disable}
              />
            </Col>
          </Row>

          <div className="modal-footer mx-0 pb-4 pull-right">
            <Button className="ml-3 text-uppercase" type="link" name="Discard" onClick={onClose} />
            <Button
              className="ml-3 text-uppercase"
              name={disable ? 'Post' : 'Edit'}
              disabled={disabled}
              onClick={disable ? this.handleSubmit : this.handleEditSubmit}
            />
          </div>
        </div>
      </div>
    )
  }
}

AddForum.propTypes = {
  event: PropTypes.string,
  departmentsList: PropTypes.array,
  onAddTopic: PropTypes.func,
  onEditTopic: PropTypes.func,
  onClose: PropTypes.func,
}

AddForum.defaultProps = {
  event: '',
  departmentsList: [],
  onAddTopic: () => {},
  onEditTopic: () => {},
  onClose: () => {},
}

export default AddForum

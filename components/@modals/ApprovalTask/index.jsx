import React, { Component } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { Button, Form } from 'react-bootstrap'
import { isNil, length } from 'ramda'
import { CommentItem } from '@components'
import './ApprovalTask.scss'

class ApprovalTask extends Component {
  state = { comment: '' }

  createComment = () => {
    const { task } = this.props
    if (task) {
      const payload = {
        comment: {
          card_instance_id: task.id,
          data: {
            body: this.state.comment,
          },
        },
      }
      this.setState({ comment: '' })
      this.props.onAdd(payload, 'career-comment')
    }
  }

  render() {
    const { task } = this.props
    const { comment } = this.state

    return (
      <div className="approval-task modal-content">
        <div className="modal-header bg-primary">
          <span className="text-center">Approval Task</span>
        </div>
        <div className="modal-body p-0">
          <div className="p-4">
            <p className="text-muted">Title</p>
            <h5>{task.data.name}</h5>
          </div>
          <div className="px-4">
            <p className="text-muted">Description</p>
            <h5 className="text-400">{task.data.description}</h5>
          </div>
          <div className="px-4 pb-4">
            <div className="d-flex">
              <p className="text-muted pr-1">
                {moment
                  .utc(task.created_at)
                  .local()
                  .format('M/D/YYYY')}
                :
              </p>
              <p className="text-muted">Request Approval</p>
            </div>
          </div>
          {!isNil(task.comments) && length(task.comments) > 0 && (
            <div className="comment-contents">
              <p className="dsl-d14 mb-0">Comments:</p>
              {task.comments.map(comment => (
                <CommentItem data={comment} key={comment.id} />
              ))}
            </div>
          )}
          <Form.Group controlId="commentTextarea" className="p-4">
            <Form.Label className="text-muted text-400">Send comment</Form.Label>
            <Form.Control
              as="textarea"
              placeholder="Type here..."
              className="border-r0"
              value={comment}
              onChange={e => this.setState({ comment: e.target.value })}
            />
          </Form.Group>
        </div>
        <div className="modal-footer border-0 pt-0">
          <div className="text-right">
            <Button variant="primary" onClick={this.createComment}>
              Send
            </Button>
          </div>
        </div>
      </div>
    )
  }
}

ApprovalTask.propTypes = {
  task: PropTypes.object.isRequired,
  onAdd: PropTypes.func.isRequired,
}

ApprovalTask.defaultProps = {
  task: {},
  onAdd: () => {},
}

export default ApprovalTask

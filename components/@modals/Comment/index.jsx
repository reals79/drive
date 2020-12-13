import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { isNil } from 'ramda'
import { Input, Button } from '@components'
import './Comment.scss'

class Comment extends PureComponent {
  state = {
    comment: '',
  }

  render() {
    const { title, body, info, onNo, onYes } = this.props
    const { comment } = this.state
    return (
      <div className="comment-modal">
        <div className="modal-header">
          <span className="dsl-w18 bold pl-2">{title}</span>
        </div>
        <div className="modal-body">
          <p className="dsl-b14 text-400 text-center">{body}</p>
          {!isNil(info) && (
            <div className="comment-body">
              <Input
                as="textarea"
                rows={3}
                type="text"
                direction="vertical"
                title={info}
                placeholder="Type here..."
                value={comment}
                onChange={e => this.setState({ comment: e })}
              />
            </div>
          )}
        </div>
        <div className="modal-footer">
          <Button className="text-400" type="link" onClick={() => onNo()}>
            Cancel
          </Button>
          <Button className="text-400" type="medium" onClick={() => onYes(comment)}>
            YES
          </Button>
        </div>
      </div>
    )
  }
}

Comment.propTypes = {
  title: PropTypes.string,
  body: PropTypes.string,
  info: PropTypes.string,
  yes: PropTypes.string,
  no: PropTypes.string,
  onYes: PropTypes.func,
  onNo: PropTypes.func,
}

Comment.defaultProps = {
  title: '',
  body: '',
  info: '',
  yes: 'Yes',
  no: 'No',
  onYes: () => {},
  onNo: () => {},
}

export default Comment

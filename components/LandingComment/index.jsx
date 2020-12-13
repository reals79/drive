import React from 'react'
import PropTypes from 'prop-types'
import { Image } from 'react-bootstrap'
import { isNil, isEmpty } from 'ramda'
import './LandingComment.scss'

const LandingComment = props => (
  <div className="landing-comment">
    <div className="comment-detail">
      <h3 className="dsl-b16 l-height-22 text-center">
        &quot;
        {props.comment}
        &quot;
      </h3>
    </div>
    <div className="d-flex align-items-center p-3">
      <Image
        className="mr-3"
        src={
          isNil(props.avatar) || isEmpty(props.avatar)
            ? '/images/default.png'
            : '/images/comments/' + props.avatar
        }
        width={44}
        height={44}
        roundedCircle
      />
      <div className="commentor-detail">
        <p className="dsl-b16 bold mb-0">{props.name}</p>
        <p className="dsl-d12 mb-0">{props.role}</p>
        <p className="dsl-d12 mb-0">{props.company}</p>
      </div>
    </div>
  </div>
)

LandingComment.propTypes = {
  comment: PropTypes.string,
  name: PropTypes.string,
  avatar: PropTypes.string,
  company: PropTypes.string,
  role: PropTypes.string,
}

LandingComment.defaultProps = {
  comment: '',
  name: '',
  avatar: '',
  company: '',
  role: '',
}

export default LandingComment

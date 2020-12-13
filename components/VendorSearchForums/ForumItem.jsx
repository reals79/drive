import React, { memo } from 'react'
import PropTypes from 'prop-types'
import { Row, Col } from 'react-bootstrap'
import { Avatar, Icon } from '@components'
import { convertUrl } from '~/services/util'
import './VendorSearchForums.scss'

const ForumItem = ({ creator, forumType, name, avatar, stats, type }) => {
  const url = convertUrl(avatar, '/images/default.png')
  return (
    <div className="vendor-search-forums-item">
      <Row className="mx-0">
        <Col className="px-0" xs={1}>
          <Avatar url={url} type="logo" size="tiny" />
        </Col>
        <Col className="px-0" xs={8}>
          <p className={`dsl-b16 mb-1 ${type === 'detail' ? 'text-600' : ''}`}>{name}</p>
          <p className="dsl-b14 mb-1">Created by: {creator}</p>
        </Col>
        <Col className="px-0 d-flex flex-column align-items-end" xs={3}>
          <p className="dsl-m12 mb-2">{forumType}</p>
          <div className="d-h-end">
            <Icon name="far fa-eye" size={12} />
            <p className="dsl-m12 mb-0 ml-1 mr-4">{stats.views}</p>
            <Icon name="far fa-thumbs-up" size={12} />
            <p className="dsl-m12 mb-0 ml-1 mr-4">{stats.liks}</p>
            <Icon name="fal fa-comment" size={12} />
            <p className="dsl-m12 mb-0 ml-1">{stats.comments}</p>
          </div>
        </Col>
      </Row>
    </div>
  )
}

ForumItem.propTypes = {
  avatar: PropTypes.string,
  creator: PropTypes.string,
  forumType: PropTypes.string,
  name: PropTypes.string,
  stats: PropTypes.shape({
    comments: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    dislikes: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    like_avg: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    likes: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    views: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }),
  type: PropTypes.oneOf(['simple', 'detail']),
}

ForumItem.defaultProps = {
  avatar: null,
  creator: 'Alexa Rainman',
  forumType: 'Finance & Insurance',
  name: '',
  stats: {
    comments: '',
    dislikes: 0,
    like_avg: '0',
    likes: '0',
    views: 453,
  },
  type: 'simple',
}

export default memo(ForumItem)

import React, { memo } from 'react'
import PropTypes from 'prop-types'
import { Row, Col } from 'react-bootstrap'
import moment from 'moment'
import { Avatar, Button, Icon, Rating, Thumbnail } from '@components'
import { convertUrl } from '~/services/util'
import './VendorSearchBlogs.scss'

const BlogItem = ({ description, logo, name, thumb, type, stats, createAt }) => {
  const thumbURL = convertUrl(thumb)
  const url = convertUrl(logo)
  const authorTitle = 'DealerSocket'
  const author = 'Tina Bolboa'
  return (
    <div className={`vendor-search-blogs-item ${type}`}>
      {type === 'simple' ? (
        <Row className="mx-0">
          <Col className="px-0" xs={3}>
            <Thumbnail src={thumbURL} size="tiny" />
          </Col>
          <Col className="px-0" xs={9}>
            <p className="dsl-b16 mb-1">{name}</p>
            <p className="dsl-b12 mb-1">{`By: ${author}`}</p>
            <div className="d-h-start">
              <Icon name="far fa-eye" size={12} />
              <p className="dsl-m12 mb-0 ml-1 mr-4">{stats.views}</p>
              <Icon name="far fa-thumbs-up" size={12} />
              <p className="dsl-m12 mb-0 ml-1 mr-4">{stats.likes}</p>
              <Icon name="fal fa-comment" size={12} />
              <p className="dsl-m12 mb-0 ml-1">{stats.comments}</p>
            </div>
          </Col>
        </Row>
      ) : (
        <Row className="mx-0">
          <Col className="px-0" xs={3} md={2}>
            <Thumbnail src={thumbURL} size="tiny" />
          </Col>
          <Col className="px-0" xs={8} md={9}>
            <p className="dsl-b14 bold mb-2">{name}</p>
            <p className="dsl-b14 truncate-two mb-2">{description}</p>
            <div className="d-h-start">
              <Avatar
                url={url}
                type="logo"
                size="extraTiny"
                backgroundColor="white"
                borderColor="#969faa"
              />
              <div className="ml-3">
                <p className="dsl-m12 mb-1">{author}</p>
                <p className="dsl-m12 mb-0">{authorTitle}</p>
              </div>
            </div>
          </Col>
          <Col className="px-0 d-h-end flex-column" xs={1}>
            <p className="dsl-b12 my-3">{moment(createAt).format('MMM DD, YY')}</p>
          </Col>
        </Row>
      )}
    </div>
  )
}

BlogItem.propTypes = {
  createAt: PropTypes.string,
  description: PropTypes.string,
  logo: PropTypes.string,
  name: PropTypes.string,
  thumb: PropTypes.string,
  type: PropTypes.oneOf(['simple', 'detail']),
  stats: PropTypes.shape({
    comments: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    dislikes: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    like_avg: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    likes: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    views: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }),
}

BlogItem.defaultProps = {
  createAt: '',
  description: '',
  logo: null,
  name: '',
  thumb: null,
  type: 'simple',
  stats: {
    comments: '',
    dislikes: 0,
    like_avg: '',
    likes: '',
    views: '',
  },
}

export default memo(BlogItem)

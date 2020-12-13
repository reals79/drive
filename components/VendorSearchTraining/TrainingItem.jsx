import React, { memo } from 'react'
import PropTypes from 'prop-types'
import { Row, Col } from 'react-bootstrap'
import { find, propEq } from 'ramda'
import { Avatar, Icon, Rating, Thumbnail } from '@components'
import { CardType } from '~/services/config'
import { convertUrl } from '~/services/util'
import './VendorSearchTraining.scss'

const TrainingItem = ({ author, modules, rating, ratingCount, title, thumbURL, type, typeId }) => {
  const thumb_url = convertUrl(thumbURL)
  const url = convertUrl(author.author_avatar, '/images/default_company.svg')
  let subType = typeId === 1 ? 'Modules' : ''
  let cardType = find(propEq('id', typeId), CardType) || {}
  if (typeId === 0) {
    cardType = {
      label: 'Track',
      alias: 'fal fa-list-alt',
    }
    subType = 'Courses'
  }
  return (
    <div className={`vendor-search-training-item ${type}`}>
      {type === 'simple' ? (
        <Row className="mx-0">
          <Col className="px-0" xs={3}>
            <Thumbnail src={thumb_url} size="tiny" />
          </Col>
          <Col className="px-0" xs={9}>
            <p className="dsl-b16 text-400 mb-1">{title}</p>
            <p className="dsl-b14 mb-0">{`Autor: ${author.author_title || author.name}`}</p>
          </Col>
        </Row>
      ) : (
        <Row className="mx-0">
          <Col className="px-0" xs={2}>
            <Thumbnail src={thumb_url} size="tiny" />
          </Col>
          <Col className="px-0" xs={6}>
            <p className="dsl-b16 text-400 mb-2">{title}</p>
            <div className="d-h-start">
              <Avatar
                url={url}
                type="logo"
                size="extraTiny"
                borderWidth={1}
                backgroundColor="white"
                borderColor="#dee2e6"
              />
              <p className="dsl-m12 ml-1 mr-3 mb-0">{author.author_title || author.name}</p>
              <Icon name={cardType.alias || 'fal fa-envelope'} size={14} />
              <p className="dsl-m12 ml-1 mb-0">{cardType.label || 'Course'}</p>
            </div>
          </Col>
          <Col className="px-0" xs={2}>
            <p className="dsl-b12 mb-2">{`Reviews: ${ratingCount}`}</p>
            <Rating score={rating} />
          </Col>
          <Col className="px-0 d-h-between" xs={2}>
            <div className="d-h-start">
              <div className="training-item-sub">
                <p className="dsl-b14 text-right mb-1">{subType}</p>
                <p className="dsl-b14 text-right mb-0">{typeId > 1 ? '' : modules}</p>
              </div>
              <Icon name="fas fa-chart-pie-alt" size={14} />
            </div>
            <Icon name="far fa-ellipsis-h" size={16} />
          </Col>
        </Row>
      )}
    </div>
  )
}

TrainingItem.propTypes = {
  author: PropTypes.shape({
    name: PropTypes.string,
    author_title: PropTypes.string,
    author_avatar: PropTypes.string,
  }),
  modules: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  rating: PropTypes.number,
  ratingCount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  title: PropTypes.string,
  thumbURL: PropTypes.string,
  type: PropTypes.oneOf(['simple', 'detail']),
  typeId: PropTypes.number,
}

TrainingItem.defaultProps = {
  author: {
    name: '',
    author_title: '',
    author_avatar: '',
  },
  modules: 0,
  rating: 0,
  ratingCount: '',
  title: '',
  thumbURL: null,
  type: 'simple',
  typeId: 0,
}

export default memo(TrainingItem)

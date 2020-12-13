import React, { memo } from 'react'
import PropTypes from 'prop-types'
import { Row, Col } from 'react-bootstrap'
import { Avatar, Button, Rating } from '@components'
import { convertUrl, removeTags } from '~/services/util'
import './VendorSearchProducts.scss'

const ProductItem = ({
  name,
  description,
  companyName,
  recommend,
  rating,
  ratingCount,
  phone,
  type,
  url,
}) => {
  const logo = convertUrl(url, '/images/default_company.svg')
  return (
    <div className={`vendor-search-product-item ${type}`}>
      {type === 'simple' ? (
        <Row className="mx-0">
          <Col className="px-0" xs={1}>
            <Avatar
              url={logo}
              type="logo"
              size="tiny"
              backgroundColor="white"
              borderWidth={1}
              borderColor="#dee2e6"
            />
          </Col>
          <Col className="px-0" xs={8}>
            <p className="dsl-b14 mb-1">{name}</p>
            <p className="dsl-b12 mb-0">{`${recommend}% Recommended  ${ratingCount} Ratings`}</p>
          </Col>
          <Col className="px-0 d-h-end" xs={3}>
            <Rating score={rating} />
            <p className="dsl-b14 ml-2 mb-0">{rating.toFixed(1)}</p>
          </Col>
        </Row>
      ) : (
        <Row className="mx-0">
          <Col className="px-0" xs={3} md={2}>
            <Avatar url={logo} type="logo" size="extraLarge" backgroundColor="white" />
          </Col>
          <Col className="px-0" xs={7} md={8}>
            <p className="dsl-b14 mb-3">{name}</p>
            <div className="d-h-start mb-3">
              <Rating score={rating} />
              <p className="dsl-b12 mb-0">{`${recommend}% Recommended  ${ratingCount} Ratings`}</p>
            </div>
            <p className="dsl-b14 truncate-two mb-2">{removeTags(description)}</p>
          </Col>
          <Col className="px-0 d-flex flex-column justify-content-between" xs={2}>
            <div className="mb-3">
              <p className="dsl-p14 text-right mb-2">{companyName}</p>
              <p className="dsl-b14 text-right mb-2">
                {phone && phone !== '' ? phone : 'Number not provided'}
              </p>
            </div>
            <div className="d-flex flex-column align-items-end">
              <Button type="link" name="RATE IT" />
              <Button className="btn-company-contact" type="medium" name="SPECIAL QUOTE" />
            </div>
          </Col>
        </Row>
      )}
    </div>
  )
}

ProductItem.propTypes = {
  name: PropTypes.string,
  description: PropTypes.string,
  companyName: PropTypes.string,
  recommend: PropTypes.string,
  rating: PropTypes.number,
  ratingCount: PropTypes.string,
  phone: PropTypes.string,
  type: PropTypes.oneOf(['simple', 'detail']),
  url: PropTypes.string,
}

ProductItem.defaultProps = {
  name: '',
  description: '',
  companyName: '',
  recommend: '',
  rating: 0,
  ratingCount: '',
  phone: '',
  type: 'simple',
  url: null,
}

export default memo(ProductItem)

import React, { memo } from 'react'
import PropTypes from 'prop-types'
import { Row, Col } from 'react-bootstrap'
import Product from '../Products/ProductCard'
import { Thumbnail } from '@components'

const All = ({ data }) => (
  <>
    <div className="card premium-all">
      <Row>
        <Col md={6}>
          <Thumbnail src={data?.title_url} size="responsive" />
        </Col>
        <Col md={6}>
          <p className="dsl-b18 bold">{data.name}</p>
          <p className="dsl-m16">{data.data.description}</p>
        </Col>
      </Row>
    </div>
    <div className="card mt-3">
      <p className="dsl-b24 bold mb-0">All Products</p>
      <div className="d-flex flex-wrap">
        {data.products.map((item, index) => (
          <Product data={item} key={index} />
        ))}
      </div>
    </div>
  </>
)

export default memo(All)

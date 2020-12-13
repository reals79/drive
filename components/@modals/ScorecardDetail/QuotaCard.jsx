import React, { memo } from 'react'
import PropTypes from 'prop-types'
import { Row, Col } from 'react-bootstrap'
import { isNil } from 'ramda'
import { Thumbnail, Rating } from '@components'
import './ScorecardDetail.scss'

const QuotaCard = ({ name, data }) => {
  return (
    <div className="quota-list-card w-100 border-top">
      <Thumbnail src="fal fa-location" label="Quota" />
      <Row className="mx-1 w-100">
        <Col xs={5}>
          <p className="dsl-b16 mb-1">{name}</p>
          <p className="dsl-m12 mb-1 truncate-two">{data.description}</p>
        </Col>
        <Col xs={2}>
          <p className="dsl-m12 mb-1">Type</p>
          <p className="dsl-b16 mb-1">{isNil(data) ? 'N/A' : data.target_types}</p>
        </Col>
        <Col xs={2}>
          <p className="dsl-m12 mb-1">Source</p>
          <p className="dsl-b16 mb-1">{isNil(data) ? 'N/A' : data.source}</p>
        </Col>
        <Col xs={3}>
          <p className="dsl-m12 mb-1">Scale</p>
          <Rating title={`${data.star_values[5]}%`} score={5} titleWidth="20px" />
          <Rating title={`${data.star_values[4]}%`} score={4} titleWidth="20px" />
          <Rating title={`${data.star_values[2]}%`} score={2} titleWidth="20px" />
        </Col>
      </Row>
    </div>
  )
}

QuotaCard.propTypes = {
  name: PropTypes.string,
  data: PropTypes.shape({
    description: PropTypes.string,
    target_types: PropTypes.string,
    source: PropTypes.string,
  }),
}

QuotaCard.defaultProps = {
  name: '',
  data: {
    description: '',
    target_types: '',
    source: '',
  },
}

export default memo(QuotaCard)

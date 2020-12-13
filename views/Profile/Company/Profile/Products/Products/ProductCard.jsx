import React from 'react'
import PropTypes from 'prop-types'
import { Image } from 'react-bootstrap'
import { Icon, Rating } from '@components'

const ProductCard = ({ data }) => (
  <div className="product-card">
    <div className="logo">
      <Image className="w-100" src="/images/default_company.svg" />
    </div>
    <div className="d-flex-1">
      <p className="dsl-b18 bold mb-2">{data?.name}</p>
      <div className="d-flex align-items-center justify-content-between mb-2">
        <Rating score={Number(data?.stats?.popularity_score)} />
        <span className="dsl-m14 text-400 ml-2">{data?.stats?.popularity_score}</span>
      </div>
      <p className="dsl-m14 mb-2">{data?.stats?.rating_recommended_avg}% Recommended</p>
      <p className="dsl-m12 mb-2">{data?.stats?.views} Reviews</p>
      <div className="d-flex">
        <Icon name="fal fa-play mr-2" color="#343f4b" size={12} />
        <span className="dsl-b12">Video</span>
      </div>
    </div>
  </div>
)

export default ProductCard

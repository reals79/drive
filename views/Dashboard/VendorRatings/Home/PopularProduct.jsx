import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { Avatar, Rating } from '@components'

const PopularProduct = ({ className, logo, title, score, recommendation, onClick }) => (
  <div className={classNames('popular-product', className)} onClick={onClick}>
    <Avatar
      url={logo || '/images/default_company.svg'}
      size="large"
      type="logo"
      backgroundColor="#FFFFFF"
      borderColor="#e0e0e0"
      borderWidth={2}
    />
    <p className="dsl-b16 bold text-center mt-3 mb-2">{title}</p>
    <div className="d-flex justify-content-between mb-2">
      <Rating score={score} />
      <span className="dsl-b16 text-400">{score}</span>
    </div>
    <p className="dsl-m14 text-center mb-0">{recommendation}% Recommended</p>
  </div>
)

export default PopularProduct

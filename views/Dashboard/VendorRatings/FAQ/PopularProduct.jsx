import React from 'react'
import classNames from 'classnames'
import { Avatar, Button, Rating } from '@components'

const PopularProduct = ({ className, logo, title, score, recommendation, onReview }) => (
  <div className={classNames('popular-product', className)}>
    <div className="title">
      <p className="dsl-b16 bold text-center mt-3 mb-2">{title}</p>
    </div>
    <Avatar
      url={logo || '/images/default_company.svg'}
      size="large"
      type="logo"
      backgroundColor="#FFFFFF"
      borderColor="#e0e0e0"
      borderWidth={2}
    />
    <div className="d-flex justify-content-between mb-2">
      <Rating score={score} showScore={false} />
    </div>
    <p className="dsl-m14 text-center mb-0">{recommendation}% Recommended</p>
    <Button name="ADD REVIEW" type="link" onClick={onReview} />
  </div>
)

export default PopularProduct

import React from 'react'
import PropTypes from 'prop-types'
import { Button, Icon, Rating } from '@components'

const RatingCard = props => (
  <div className="d-flex mt-4">
    <div className="manager">
      <Icon name="fa fa-user-shield" color="#969faa" size={14} />
    </div>
    <div className="d-flex-1">
      <div className="d-flex justify-content-between">
        <div>
          <p className="dsl-b14 mb-2">Internet Manager</p>
          <p className="dsl-m14 mb-2">14 Contributions - 48 helpful votes</p>
          <p className="dsl-m14 mb-0">5 days ago</p>
        </div>
        <div>
          <div className="d-flex align-items-center justify-content-between mb-2">
            <Rating score={5.0} />
          </div>
          <div className="d-flex justify-content-between mb-2">
            <span className="dsl-b14">Recommended:</span>
            <span className="dsl-b14">YES</span>
          </div>
          <div className="d-flex align-items-center justify-content-between">
            <Icon name="fal fa-check-circle" color="#969faa" size={14} />
            <span className="dsl-p14 text-400 ml-2">VERIFIED RATING</span>
          </div>
        </div>
      </div>
      <p className="dsl-b18 text-400 my-4">Love the UX of this product!</p>
      <div className="pros-cons">
        <div className="head">
          <span className="dsl-b14 text-400">Pros:</span>
        </div>
        <div>
          <span className="dsl-m14 font-italic">The UX of this product is super smooth. Its easy to use.</span>
        </div>
      </div>
      <div className="pros-cons">
        <div className="head">
          <span className="dsl-b14 text-400">Cons:</span>
        </div>
        <div>
          <span className="dsl-m14 font-italic">The only thing with it that I can.</span>
        </div>
      </div>
      <div className="pros-cons mt-3">
        <div className="head" />
        <div className="d-flex align-items-center">
          <Icon name="fal fa-comment" color="#969faa" size={14} />
          <span className="dsl-m14 ml-2">0</span>
          <Icon name="fal fa-flag-alt ml-3" color="#969faa" size={14} />
          <span className="dsl-m14 ml-2">0</span>
        </div>
      </div>
    </div>
  </div>
)

export default RatingCard

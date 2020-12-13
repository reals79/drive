import React from 'react'
import PropTypes from 'prop-types'
import { path } from 'ramda'
import { Button, ProgressBar, Rating } from '@components'
import RatingCard from './RatingCard'

const Recent = ({ data }) => (
  <>
    <div className="d-flex justify-content-between border-bottom pb-4">
      <span className="dsl-b24 bold">Recent Verified Ratings</span>
      <Button name="RATE IT" />
    </div>
    <div className="d-flex justify-content-between border-bottom mt-3 pb-3">
      <div>
        <p className="dsl-b20 bold">Star Rating Distribution</p>
        <div className="d-flex">
          <Rating score={5} />
          <span className="dsl-b16 text-400 ml-2">{path(['ratings_breakdown', '5-stars', 'count'], data)}</span>
        </div>
        <div className="d-flex mt-2">
          <Rating score={4} />
          <span className="dsl-b16 text-400 ml-2">{path(['ratings_breakdown', '4-stars', 'count'], data)}</span>
        </div>
        <div className="d-flex mt-2">
          <Rating score={3} />
          <span className="dsl-b16 text-400 ml-2">{path(['ratings_breakdown', '3-stars', 'count'], data)}</span>
        </div>
        <div className="d-flex mt-2">
          <Rating score={2} />
          <span className="dsl-b16 text-400 ml-2">{path(['ratings_breakdown', '2-stars', 'count'], data)}</span>
        </div>
        <div className="d-flex mt-2">
          <Rating score={1} />
          <span className="dsl-b16 text-400 ml-2">{path(['ratings_breakdown', '1-stars', 'count'], data)}</span>
        </div>
      </div>
      <div className="rating-by">
        <p className="dsl-b20 bold">Rating by Job Title</p>
        <ProgressBar className="rating-by" title="General manager" value={82} horizontal />
        <ProgressBar className="rating-by mt-2" title="Internet manager" value={79} horizontal />
        <ProgressBar className="rating-by mt-2" title="Owner" value={79} horizontal />
        <ProgressBar className="rating-by mt-2" title="BDC Director" value={35} horizontal />
        <ProgressBar className="rating-by mt-2" title="General Sales MGT" value={21} horizontal />
      </div>
    </div>
    <RatingCard />
  </>
)

export default Recent

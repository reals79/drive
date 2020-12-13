import React from 'react'
import PropTypes from 'prop-types'
import originalMoment from 'moment'
import { extendMoment } from 'moment-range'
import classNames from 'classnames'
import { DatePicker, ProgressBar, Rating } from '@components'

const moment = extendMoment(originalMoment)

const Ratings = ({ data, date, onDateChange }) => (
  <>
    <div className="card mt-3">
      <div className="d-flex justify-content-between">
        <span className="dsl-b24 bold">Total All Products</span>
        <DatePicker
          calendar="range"
          append="caret"
          format="MMM D, YY"
          as="span"
          align="right"
          value={date}
          mountEvent
          closeAfterSelect
          onSelect={onDateChange}
        />
      </div>
      <div className="d-flex justify-content-between mt-3">
        <div className="report-card green">
          <p className="dsl-b20 bold">Ratings</p>
          <div className="d-flex">
            <Rating score={data.stats?.popularity_score} size="medium" />
            <span className="dsl-b20 text-400 ml-2">{data.stats.popularity_score}</span>
          </div>
          <p className="dsl-b18 bold mt-2">{data.stats?.rating_recommended_avg}% Recommended</p>
          <p className="dsl-b14 mt-4 mb-1">{data.stats?.rating_count} Verified Ratings</p>
          <p className="dsl-b14 my-1">By {data.stats?.rating_dealership_count} Dealerships</p>
          <p className="dsl-b14 my-1">NPS: 8</p>
        </div>
        <div className="report-card green">
          <p className="dsl-b20 bold">Star Rating Distribution</p>
          {['5', '4', '3', '2', '1'].map((key, index) => (
            <div className={classNames('d-flex', index !== 0 && 'mt-2')} key={`sr${index}`}>
              <Rating score={data.ratings_breakdown[`${key}-stars`].stars} />
              <span className="dsl-b16 ml-4">{data.ratings_breakdown[`${key}-stars`].count}%</span>
            </div>
          ))}
        </div>
        <div className="report-card green">
          <p className="dsl-b20 bold">Rating by Job Title</p>
          {data.ratings_by_job.map((item, index) => (
            <ProgressBar
              key={`pr${index}`}
              className={classNames('rating-by', index !== 0 && 'mt-11')}
              title={item.name}
              value={item.count}
              horizontal
            />
          ))}
        </div>
      </div>
    </div>

    {data.products.map((item, index) => (
      <div className="card mt-3" key={`r${index}`}>
        <div className="d-flex justify-content-between">
          <span className="dsl-b24 bold">{item.name}</span>
        </div>
        <div className="d-flex justify-content-between mt-3">
          <div className="report-card">
            <p className="dsl-b20 bold">Ratings</p>
            <div className="d-flex">
              <Rating score={data.stats.popularity_score} size="medium" />
              <span className="dsl-b20 text-400 ml-2">{data.stats.popularity_score}</span>
            </div>
            <p className="dsl-b18 bold mt-2">{data.stats?.rating_recommended_avg}% Recommended</p>
            <p className="dsl-b14 mt-4 mb-1">{data.stats?.rating_count} Verified Ratings</p>
            <p className="dsl-b14 my-1">By {data.stats?.rating_dealership_count} Dealerships</p>
            <p className="dsl-b14 my-1">NPS: 8</p>
          </div>
          <div className="report-card">
            <p className="dsl-b20 bold">Star Rating Distribution</p>
            {['5', '4', '3', '2', '1'].map((key, idx) => (
              <div className={classNames('d-flex', idx !== 0 && 'mt-2')} key={`sr${index}${idx}`}>
                <Rating score={item.ratings_breakdown[`${key}-stars`].stars} />
                <span className="dsl-b16 ml-4">{item.ratings_breakdown[`${key}-stars`].count}%</span>
              </div>
            ))}
          </div>
          <div className="report-card">
            <p className="dsl-b20 bold">Rating by Job Title</p>
            {item.ratings_by_job.map((progress, idx) => (
              <ProgressBar
                key={`pr${index}${idx}`}
                className={classNames('rating-by', index !== 0 && 'mt-11')}
                title={progress.name}
                value={progress.count}
                horizontal
              />
            ))}
          </div>
        </div>
      </div>
    ))}
  </>
)

Ratings.propTypes = {
  data: PropTypes.array,
  date: PropTypes.any,
  onDateChange: PropTypes.func,
}

Ratings.defaultProps = {
  data: [{ title: 'Total All Products' }, { title: 'HCM' }, { title: 'University' }],
  date: moment.range(
    moment()
      .startOf('month')
      .format('YYYY-MM-DD'),
    moment()
      .endOf('month')
      .format('YYYY-MM-DD')
  ),
  onDateChange: () => {},
}

export default Ratings

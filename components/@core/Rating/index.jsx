import React from 'react'
import ReactRating from 'react-rating'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import './Rating.scss'

const Rating = props => {
  const {
    className,
    readonly,
    direction,
    fractions,
    title,
    titleWidth,
    bottomRate,
    topRate,
    score,
    empty,
    full,
    size,
    feedback,
    showScore,
    onChange,
  } = props
  return (
    <div className={classNames('ds-stars', direction, className)}>
      {title && title !== '' && (
        <span className="dsl-m12 mr-2" style={{ width: titleWidth }}>
          {title}
        </span>
      )}
      <div>
        <div className={`star-list ${size} d-flex w-auto`}>
          <ReactRating
            start={bottomRate}
            stop={topRate}
            initialRating={score}
            emptySymbol={empty}
            fullSymbol={full}
            fractions={fractions}
            readonly={readonly}
            onChange={e => onChange(e)}
          />
          {showScore && (
            <span
              className={classNames(
                'd-none d-lg-block ml-2',
                size === 'small' && 'dsl-p12 lh18',
                size === 'medium' && 'dsl-p20',
                size === 'large' && 'dsl-p25'
              )}
            >
              {Number(score).toFixed(1)}
            </span>
          )}
        </div>
        {feedback && feedback.length > 0 && (
          <div className="rating-feedback">
            {feedback.map((item, idx) => (
              <p className="dsl-m12 mb-0" key={`feedback-${idx}`}>
                {item}
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

Rating.propTypes = {
  className: PropTypes.string,
  readonly: PropTypes.bool,
  direction: PropTypes.oneOf(['vertical', 'horizontal']),
  fractions: PropTypes.number,
  title: PropTypes.string,
  titleWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  bottomRate: PropTypes.number,
  topRate: PropTypes.number,
  score: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  empty: PropTypes.oneOfType([PropTypes.element, PropTypes.string, PropTypes.array]),
  full: PropTypes.oneOfType([PropTypes.element, PropTypes.string, PropTypes.array]),
  feedback: PropTypes.array,
  showScore: PropTypes.bool,
  onChange: PropTypes.func,
}

Rating.defaultProps = {
  className: '',
  readonly: true,
  direction: 'horizontal',
  fractions: 1,
  title: '',
  titleWidth: 'auto',
  bottomRate: 0,
  topRate: 5,
  score: null,
  size: 'small',
  empty: 'fal fa-star main-blue',
  full: 'fas fa-star main-blue',
  feedback: [],
  showScore: true,
  onChange: () => {},
}

export default Rating

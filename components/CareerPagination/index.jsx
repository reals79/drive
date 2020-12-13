import React, { memo } from 'react'
import PropTypes from 'prop-types'
import { equals } from 'ramda'
import { Icon } from '@components'
import { pagination } from '~/services/util'
import './CareerPagination.scss'

const CareerPagination = props => (
  <div className="career-pagination px-4 py-2 mb-4">
    <div>
      <span className="dsl-d13">Page:&nbsp;&nbsp;</span>
      <span className="dsl-b12">
        {pagination(props.currentPage, props.totalPages).map((item, index) => (
          <span key={`current-${index}`}>
            <a role="button" onClick={() => props.onPage(item)}>
              <span className={`current ${equals(props.currentPage, item) && 'active'}`}>
                {item}
              </span>
            </a>
            {equals(item, props.totalPages) ? '' : `,`}
          </span>
        ))}
      </span>
    </div>
    <div>
      <div className="right cursor-pointer">
        <span
          onClick={() => props.onNext()}
          className={`align-items-center ${
            equals(props.currentPage, props.totalPages) ? 'deactivate' : ''
          }`}
        >
          <strong className="pr-2">Next</strong>
          <Icon name="fal fa-chevron-right" color="black" size={14} />
        </span>
      </div>
      <div className="right cursor-pointer pr-5">
        <span
          onClick={() => props.onPrev()}
          className={`align-items-center ${equals(props.currentPage, 1) ? 'deactivate' : ''}`}
        >
          <Icon name="fal fa-chevron-left mr-2" color="black" size={14} />
          <strong className="pr-2">Prev</strong>
        </span>
      </div>
    </div>
  </div>
)

CareerPagination.propTypes = {
  perPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired,
  onNext: PropTypes.func.isRequired,
  onPrev: PropTypes.func.isRequired,
  onViews: PropTypes.func.isRequired,
}

CareerPagination.defaultProps = {
  perPage: 10,
  totalPages: 0,
  currentPage: 1,
  onNext: () => {},
  onPrev: () => {},
  onViews: () => {},
}

export default memo(CareerPagination)

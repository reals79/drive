import React, { memo } from 'react'
import PropTypes from 'prop-types'
import { Icon } from '@components'
import { pagination } from '~/services/util'
import './LibraryPagination.scss'

const LibraryPagination = props => {
  if (props.totalPages < 2) return null
  return (
    <div className="library-pagination px-4 py-2 mb-4">
      <span className="dsl-d13">Show:&nbsp;&nbsp;</span>
      <a
        className={`pages ${props.perPage == 10 && 'active'} dsl-b14`}
        onClick={() => props.onViews(10)}
      >
        <strong className="mx-2">10</strong>
      </a>
      <span className="dsl-b12">|</span>
      <a
        className={`pages ${props.perPage == 20 && 'active'} dsl-b14`}
        onClick={() => props.onViews(20)}
      >
        <strong className="mx-2">20</strong>
      </a>
      <span className="dsl-b12">|</span>
      <a
        className={`pages ${props.perPage == 30 && 'active'} dsl-b14`}
        onClick={() => props.onViews(30)}
      >
        <strong className="mx-2">30</strong>
      </a>
      &nbsp;&nbsp;&nbsp;
      <span className="dsl-d13">Page:&nbsp;&nbsp;</span>
      <span className="dsl-b12">
        {pagination(props.currentPage, props.totalPages).map((item, index) => (
          <span key={`current-${index}`}>
            <a role="button" onClick={() => props.onPage(item)}>
              <span className={`current ${props.currentPage == item && 'active'}`}>{item}</span>
            </a>
            {item == props.totalPages ? '' : `,`}
          </span>
        ))}
      </span>
      <div className="right cursor-pointer">
        <span
          onClick={() => props.currentPage !== props.totalPages && props.onNext()}
          className={`align-items-center ${
            props.currentPage == props.totalPages ? 'deactivate' : ''
          }`}
        >
          <strong className="pr-2">Next</strong>
          <Icon name="fal fa-chevron-right" color="black" size={14} />
        </span>
      </div>
      <div className="right cursor-pointer pr-5">
        <span
          onClick={() => props.currentPage !== 1 && props.onPrev()}
          className={`align-items-center ${props.currentPage == 1 ? 'deactivate' : ''}`}
        >
          <Icon name="fal fa-chevron-left mr-2" color="black" size={14} />
          <strong className="pr-2">Prev</strong>
        </span>
      </div>
    </div>
  )
}

LibraryPagination.propTypes = {
  perPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired,
  onNext: PropTypes.func.isRequired,
  onPrev: PropTypes.func.isRequired,
  onViews: PropTypes.func.isRequired,
}

LibraryPagination.defaultProps = {
  perPage: 10,
  totalPages: 0,
  currentPage: 1,
  onNext: () => {},
  onPrev: () => {},
  onViews: () => {},
}

export default memo(LibraryPagination)

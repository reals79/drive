import React, { memo } from 'react'
import PropTypes from 'prop-types'
import { equals } from 'ramda'
import { Icon } from '@components'
import './ViewMoreLearnPagination.scss'

const ViewMoreLearnPagination = props => (
  <div className="view-more-pagination p-4 mb-5 mb-md-4" data-cy={props.dataCy}>
    {props.pages > 1 && (
      <div className="more-container">
        <a className="pages dsl-b14" onClick={() => props.onChange(props.showing + 10)}>
          <strong className="mx-2">
            View More
            <Icon name="fas fa-chevron-down" size={10} color="#376caf" />
          </strong>
        </a>
      </div>
    )}
    {equals(props.current, props.pages) && (
      <p data-cy={props.dataCy} className="p-4 border-5 dsl-d14 text-center">
        Congratulations! <br /> This is all the courses due for this month.
      </p>
    )}
  </div>
)

ViewMoreLearnPagination.propTypes = {
  showing: PropTypes.number,
}

ViewMoreLearnPagination.defaultProps = {
  showing: 10,
}

export default memo(ViewMoreLearnPagination)

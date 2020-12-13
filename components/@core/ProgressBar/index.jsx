import React from 'react'
import PropTypes from 'prop-types'
import { ProgressBar as BootstrapProgress } from 'react-bootstrap'
import classNames from 'classnames'
import { isEmpty } from 'ramda'
import './ProgressBar.scss'

const ProgressBar = ({ className, title, value, hideLabel, horizontal }) => (
  <div className={classNames('ds-progress', !horizontal && `align-items-${!title ? 'center' : 'end'}`, className)}>
    <div className={classNames('d-flex-1 mr-3', horizontal && 'd-flex align-items-center')}>
      {horizontal
        ? !isEmpty(title) && <span className="dsl-m12 progress-title mr-3">{title}</span>
        : !isEmpty(title) && <p className="dsl-m12 progress-title mb-1">{title}</p>}
      <BootstrapProgress now={value} />
    </div>
    {!hideLabel && <div className={classNames('progress-label', title && !horizontal && 'pt-3')}>{value}%</div>}
  </div>
)

ProgressBar.propTypes = {
  title: PropTypes.string,
  value: PropTypes.number,
  hideLabel: PropTypes.bool,
}

ProgressBar.defaultProps = {
  title: '',
  value: 40,
  hideLabel: false,
  horizontal: false,
}

export default ProgressBar

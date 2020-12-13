import React, { memo, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import _ from 'lodash'
import { Icon } from '@components'
import './StepBar.scss'

const StepBar = ({ step, maxSteps, label, className }) => {
  const [steps, setSteps] = useState([])
  useEffect(() => {
    const stepArray = _.range(1, maxSteps + 1)
    setSteps(stepArray)
  }, [])

  return (
    <div className={classNames('ds-stepbar mr-1', className)}>
      <span className="dsl-b14">{label}</span>
      {steps.map(item => {
        const isPrev = item < step
        const isActive = item === step
        const isNext = step < item

        return (
          <Icon
            key={item}
            name={classNames(
              'ml-2',
              isPrev && 'fal fa-check-circle',
              isActive && 'fa fa-circle',
              isNext && 'fal fa-circle'
            )}
            color="#376caf"
            size={18}
          />
        )
      })}
    </div>
  )
}

StepBar.propTypes = {
  step: PropTypes.number,
  label: PropTypes.string,
  maxSteps: PropTypes.number,
  className: PropTypes.string,
}

StepBar.defaultProps = {
  step: 1,
  label: 'Steps: ',
  maxSteps: 1,
  className: '',
}

export default memo(StepBar)

import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { Icon, Input } from '@components'
import { noop } from '~/services/util'

const DynamicFormArray = ({ className, title, itemTitle, values, onPlusClick, onInputChange }) => {
  const handleInputChange = idx => value => {
    onInputChange(idx, value)
  }

  return (
    <div className={classNames('ds-form-array', className)}>
      <div className="d-flex align-items-center mb-2">
        <span className="dsl-b16">{title}</span>
        <Icon name="fas fa-plus-circle ml-3" color="#C5D4E6" size={16} onClick={onPlusClick} />
      </div>
      {values.map((dept, idx) => (
        <Input
          title={`${itemTitle} ${idx + 1}`}
          value={dept}
          key={idx}
          className="mb-3"
          placeholder="Type here..."
          onChange={handleInputChange(idx)}
        />
      ))}
    </div>
  )
}

DynamicFormArray.propTypes = {
  className: PropTypes.string,
  title: PropTypes.string.isRequired,
  itemTitle: PropTypes.string.isRequired,
  values: PropTypes.array,
  onInputChange: PropTypes.func,
  onPlusClick: PropTypes.func,
}

DynamicFormArray.defaultProps = {
  className: '',
  values: [''],
  onChangeInput: noop,
  onInputChange: noop,
}

export default DynamicFormArray

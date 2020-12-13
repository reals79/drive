import React, { memo } from 'react'
import PropTypes from 'prop-types'
import { isEmpty } from 'ramda'
import { Icon } from '@components'

function CustomInput(props) {
  const { value, onClick, placeholder } = props
  return (
    <button className="custom-input" onClick={onClick}>
      {isEmpty(value) ? <>{placeholder}</> : <>{value}</>}
      <Icon name="fal fa-angle-down mx-1" color="#969faa" size={15} />
    </button>
  )
}

CustomInput.propTypes = {
  onClick: PropTypes.func,
  value: PropTypes.string,
  placeholder: PropTypes.string,
}

CustomInput.defaultProps = {
  onClick: () => {},
  value: '',
  placeholder: 'Select',
}

export default memo(CustomInput)

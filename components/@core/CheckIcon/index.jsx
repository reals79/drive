import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { Icon } from '@components'

const CheckIcon = props => (
  <Icon
    size={props.size}
    name={classNames(props.className, props.checked ? 'fal fa-check-circle' : 'fal fa-circle', 'mr-2')}
    active={props.checked}
    color="#969faa"
  />
)

CheckIcon.propTypes = {
  className: PropTypes.string,
  size: PropTypes.number,
  checked: PropTypes.bool,
}

CheckIcon.defaultProps = {
  className: '',
  size: 20,
  checked: false,
}

export default CheckIcon

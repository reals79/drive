import React from 'react'
import PropTypes from 'prop-types'
import { isNil } from 'ramda'

function Icon(props) {
  let color
  if (isNil(props.color)) {
    color = props.active ? props.colors[0] : props.colors[1]
  } else {
    color = props.color
  }
  const styles = {
    ...props.style,
    color,
    fontSize: props.size,
  }

  return (
    <i
      className={props.name}
      data-cy={props.dataCy}
      style={styles}
      onClick={() => props.onClick()}
      onMouseEnter={() => props.onMouseEnter()}
      onMouseLeave={() => props.onMouseLeave()}
    />
  )
}

Icon.propTypes = {
  name: PropTypes.string,
  active: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]),
  color: PropTypes.string,
  size: PropTypes.number,
  style: PropTypes.object,
  onClick: PropTypes.func,
}

Icon.defaultProps = {
  name: 'fa fa-bell-o',
  active: false,
  color: null,
  size: 12,
  colors: ['#376caf', '#d3d3d3'],
  style: {},
  onClick: () => {},
  onMouseEnter: () => {},
  onMouseLeave: () => {},
}

export default Icon

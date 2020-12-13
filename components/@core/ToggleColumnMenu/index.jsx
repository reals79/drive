import React from 'react'
import PropTypes from 'prop-types'
import { range } from 'ramda'
import classNames from 'classnames'
import { Icon } from '@components'

const ToggleColumnMenu = props => {
  const { column, onVisible, activeTab, className, total } = props
  const stateArray = range(0, total)
  return (
    <div className={classNames('d-flex justify-content-end', activeTab, className)}>
      <span
        className={classNames('pr-4', column == 1 && 'disabled')}
        onClick={() => onVisible(column - 1)}
      >
        <Icon name="far fa-chevron-left" size={16} color="#000" />
      </span>
      {stateArray.map((item, index) => (
        <span
          className={classNames(
            'custom-round mr-2',
            column == index + 1 && 'custom-round-active',
            index >= 2 && 'd-md-none'
          )}
          onClick={() => onVisible(index + 1)}
          key={index}
        />
      ))}
      <span
        className={classNames(
          'pl-3',
          total == column ? 'disabled' : column == 2 && className == 'd-lg-none' && 'md-disabled'
        )}
        onClick={() => onVisible(column + 1)}
      >
        <Icon name="far fa-chevron-right" size={16} color="#000" />
      </span>
    </div>
  )
}

ToggleColumnMenu.propTypes = {
  column: PropTypes.number,
  onVisible: PropTypes.func,
  activeTab: PropTypes.string,
  className: PropTypes.string,
  total: PropTypes.number,
}

ToggleColumnMenu.defaultProps = {
  column: 1,
  activeTab: '',
  onVisible: () => {},
  className: '',
  total: 2,
}

export default ToggleColumnMenu

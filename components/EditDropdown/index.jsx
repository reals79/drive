import React from 'react'
import PropTypes from 'prop-types'
import { toLower } from 'ramda'
import classNames from 'classnames'
import { Dropdown } from '@components'
import './EditDropdown.scss'

function EditDropdown(props) {
  const {
    className,
    caret,
    defaultIndexes,
    options,
    disabled,
    disabledOptions,
    icon,
    iconColor,
    onChange,
    openedPopup,
    dataCy,
  } = props
  const data = options.map((option, index) => ({ id: index, value: option }))

  return (
    <Dropdown
      className={classNames('edit-dropdown', openedPopup && 'side-nav-warp', className)}
      defaultIndexes={defaultIndexes}
      data-cy={dataCy}
      id="dots-menu"
      caret={caret}
      disabled={disabled}
      disabledOptions={disabledOptions}
      iconSize={16}
      icon={icon}
      iconColor={iconColor}
      data={data}
      align="right"
      returnBy="data"
      onChange={e => onChange(toLower(e[0].value))}
    />
  )
}

EditDropdown.propTypes = {
  caret: PropTypes.string,
  defaultIndexes: PropTypes.array,
  icon: PropTypes.string,
  iconColor: PropTypes.string,
  options: PropTypes.array,
  disabled: PropTypes.bool,
  disabledOptions: PropTypes.array,
  onChange: PropTypes.func,
}

EditDropdown.defaultProps = {
  caret: 'dots-without-title',
  defaultIndexes: [],
  icon: 'far fa-ellipsis-h',
  iconColor: '#969faa',
  options: ['Assign', 'Edit', 'Delete'],
  disabled: false,
  disabledOptions: [],
  onChange: () => {},
}

export default EditDropdown

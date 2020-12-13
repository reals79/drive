import React from 'react'
import PropTypes from 'prop-types'
import Select from 'react-select'
import { isNil } from 'ramda'

const DSSelect = ({
  options,
  renderHeader = null,
  renderIcon = null,
  itemLabel = 'label',
  itemValue = 'value',
  ...props
}) => {
  let _options = []
  options.map(item =>
    _options.push({
      value: item[itemValue],
      label: item[itemLabel],
    })
  )

  return (
    <>
      {renderHeader}
      {isNil(renderIcon) ? (
        <Select {...props} options={_options} />
      ) : (
        <div className="align-items-center">
          {renderIcon}
          <Select {...props} options={_options} />
        </div>
      )}
    </>
  )
}

DSSelect.propTypes = {
  options: PropTypes.array.isRequired,
  value: PropTypes.any,
  renderHeader: PropTypes.node,
  renderIcon: PropTypes.node,
  itemValue: PropTypes.string,
  itemLabel: PropTypes.string,
}

export default DSSelect

import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import Switch from 'react-switch'
import './Toggle.scss'

function Toggle(props) {
  const { disabled, title, leftLabel, rightLabel, checked, reversed, width, height, diameter, onChange, dataCy } = props

  return (
    <div className="ds-toggle">
      {title && <p className="dsl-m12 mb-2">{title}</p>}
      <div className="d-flex align-items-center ml-2">
        <div className={classNames('ds-toggle--llabel', { inactive: checked }, { active: !checked })}>{leftLabel}</div>
        <div className={classNames('ds-toggle--button', { disabled })} data-cy={dataCy}>
          <Switch
            disabled={disabled}
            checked={checked}
            onChange={onChange}
            handleDiameter={diameter}
            uncheckedIcon={false}
            checkedIcon={false}
            onColor={reversed ? '#c3c7cc' : '#6899d7'}
            offColor={reversed ? '#6899d7' : '#c3c7cc'}
            onHandleColor={reversed ? '#969faa' : '#376caf'}
            offHandleColor={reversed ? '#376caf' : '#969faa'}
            boxShadow="0px 1px 5px rgba(0, 0, 0, 0.2)"
            activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
            className="react-switch"
            id="material-switch"
            width={width}
            height={height}
          />
        </div>
        <div className={classNames('ds-toggle--rlabel', { active: checked }, { inactive: !checked })}>{rightLabel}</div>
      </div>
    </div>
  )
}

Toggle.propTypes = {
  title: PropTypes.string,
  leftLabel: PropTypes.string,
  rightLabel: PropTypes.string,
  checked: PropTypes.bool,
  disabled: PropTypes.bool,
  reversed: PropTypes.bool,
  width: PropTypes.number,
  height: PropTypes.number,
  diameter: PropTypes.number,
  onChange: PropTypes.func,
}

Toggle.defaultProps = {
  title: '',
  leftLabel: '',
  rightLabel: '',
  checked: false,
  disabled: false,
  reversed: false,
  width: 38,
  height: 16,
  diameter: 24,
  onChange: () => {},
}

export default Toggle

import React from 'react'
import PropTypes from 'prop-types'
import { Button as BootstrapButton } from 'react-bootstrap'
import classNames from 'classnames'
import { isEmpty } from 'ramda'
import { toast } from 'react-toastify'
import './Button.scss'

function Button(props) {
  const { className, type, name, children, disabled, busy, size, ringSize, alert, onClick, dataCy } = props
  const handleClick = () => {
    if (disabled && isEmpty(alert)) {
      return
    } else if (disabled && !isEmpty(alert)) {
      toast.warn(alert, { position: toast.POSITION.TOP_RIGHT })
    } else {
      onClick()
    }
  }

  return (
    <BootstrapButton
      data-cy={dataCy}
      className={classNames('core-button', type, `size-${size}`, className, { disabled })}
      disabled={disabled && isEmpty(alert)}
      onClick={handleClick}
    >
      {busy ? (
        <div className={`lds-dual-ring ring-${ringSize}`} />
      ) : (
        children || <div className="truncate-one text-400">{name}</div>
      )}
    </BootstrapButton>
  )
}

Button.propTypes = {
  className: PropTypes.string,
  type: PropTypes.oneOf(['high', 'medium', 'low', 'link']),
  size: PropTypes.oneOf(['small', 'medium', 'big']),
  name: PropTypes.string,
  busy: PropTypes.bool,
  disabled: PropTypes.bool,
  /**
   * If button is disabled and it does have alert message, when clicking the button,
   * button will show a toast message with alert message.
   */
  alert: PropTypes.string,
  ringSize: PropTypes.number,
  onClick: PropTypes.func,
}

Button.defaultProps = {
  className: '',
  type: 'high',
  size: 'small',
  name: null,
  busy: false,
  disabled: false,
  ringSize: 18,
  alert: '',
  onClick: () => {},
}

export default Button

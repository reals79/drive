import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import Button from '@material-ui/core/Button'
import { withStyles } from '@material-ui/core'
import { isEmpty } from 'ramda'
import { toast } from 'react-toastify'
import { VARIANT_TYPE } from '~/services/constants'
import './AnimatedButton.scss'

const StyledButton = withStyles({
  root: {
    padding: '8px 16px',
    borderRadius: 4,
  },
  label: {
    textTransform: 'initial',
  },
  disabled: {
    color: '#969faa',
  },
  contained: {
    color: '#fff',
    backgroundColor: '#376caf',
    '&:hover': {
      backgroundColor: '#5381ba',
    },
    '&:focus': {
      backgroundColor: '#5381ba',
    },
    '&:active': {
      backgroundColor: '#376caf',
    },
    '&:disabled': {
      backgroundColor: '#efefef',
    },
  },
  outlined: {
    color: '#376caf',
    borderColor: '#376caf',
    '&:hover': {
      color: '#4375b4',
      borderColor: '#4375b4',
      backgroundColor: '#e6edf5',
    },
    '&:focus': {
      color: '#5381ba',
      borderColor: '#5381ba',
    },
    '&:active': {
      color: '#376caf',
      borderColor: '#376caf',
    },
    '&:disabled': {
      borderColor: '#efefef',
    },
  },
  text: {
    color: '#376caf',
    '&:hover': {
      color: '#5f89ba',
      backgroundColor: '#eff4f9',
    },
    '&:active': {
      color: '#5f89ba',
    },
  },
})(Button)

function AnimatedButton(props) {
  const { className, type, name, children, disabled, busy, size, ringSize, alert, onClick } = props

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
    <StyledButton
      className={classNames('core-animated-button', type, `size-${size}`, className, { disabled })}
      variant={VARIANT_TYPE[type] || 'contained'}
      size={size}
      color="primary"
      disabled={disabled && isEmpty(alert)}
      disableRipple={type === 'link'}
      onClick={handleClick}
    >
      {busy ? (
        <div className={`lds-dual-ring ring-${ringSize}`} />
      ) : (
        children || <div className="truncate-one text-400">{name}</div>
      )}
    </StyledButton>
  )
}

AnimatedButton.propTypes = {
  className: PropTypes.string,
  type: PropTypes.oneOf(['high', 'medium', 'low', 'link']),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
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

AnimatedButton.defaultProps = {
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

export default AnimatedButton

import React from 'react'
import PropTypes from 'prop-types'
import { Button, Icon } from '@components'
import './Success.scss'

const Success = ({ message, info, onLater, onClaim, onClose }) => (
  <div className="success-modal d-flex">
    <Icon name="fal fa-check-circle mr-2" size={22} color="#16AC10" />
    <div>
      <span className="dsl-b18 bold">Success</span>
      <p className="dsl-d14 my-3">{message}</p>
      {info && <p className="dsl-m14">{info}</p>}
      <div className="d-h-end">
        {onLater && <Button type="link" name="LATER" onClick={() => onClose() && onLater()} />}
        {onClaim && <Button type="medium" name="CLAIM" onClick={() => onClose() && onClaim()} />}
      </div>
    </div>
  </div>
)

Success.propTypes = {
  message: PropTypes.string.isRequired,
  info: PropTypes.string,
  onLater: PropTypes.func,
  onClaim: PropTypes.func,
  onClose: PropTypes.func,
}

Success.defaultProps = {
  message: '',
  info: '',
  onLater: null,
  onClaim: null,
  onClose: () => {},
}

export default Success

import React, { memo } from 'react'
import PropTypes from 'prop-types'
import { Button, Icon } from '@components'
import './Important.scss'

const Important = ({ body, onNo, onYes }) => (
  <div className="modal-content important-modal p-3">
    <div className="modal-body">
      <div className="d-flex w-100">
        <Icon name="fal fa-info-circle mr-3" color="#fd7e08" size={20} />
        <div className="flex-1">
          <p className="dsl-b16 text-600">Important!</p>
          <p className="dsl-b14 mb-0">{body}</p>
        </div>
      </div>
    </div>
    <div className="modal-footer">
      <Button className="btn-negative" type="link" onClick={onNo}>
        CANCEL
      </Button>
      <Button className="btn-positive" onClick={onYes}>
        CONTINUE
      </Button>
    </div>
  </div>
)

Important.propTypes = {
  body: PropTypes.string,
  onYes: PropTypes.func,
  onNo: PropTypes.func,
}

Important.defaultProps = {
  body: '',
  onYes: () => {},
  onNo: () => {},
}

export default memo(Important)

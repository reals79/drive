import React, { memo } from 'react'
import PropTypes from 'prop-types'
import { Icon, Button } from '@components'
import './Confirm.scss'

const Confirm = ({ title, body, info, no, yes, onNo, onYes }) => (
  <div className="confirmation-modal">
    <div className="modal-header">
      <Icon name="fal fa-info-circle" color="#FF9100" size={20} />
      <span className="dsl-b18 bold pl-2">{title}</span>
    </div>
    <div className="modal-body d-flex align-items-center px-5">
      <div className="d-flex d-flex-3 align-items-center">
        <span className="dsl-b14 text-400">{body}</span>
      </div>
      <span className="dsl-l12 text-400 mt-2">{info}</span>
    </div>
    <div className="modal-footer">
      <Button className="text-400" type="link" onClick={() => onNo()}>
        {no}
      </Button>
      <Button className="text-400" type="medium" onClick={() => onYes()}>
        {yes}
      </Button>
    </div>
  </div>
)

Confirm.propTypes = {
  title: PropTypes.string,
  body: PropTypes.string,
  info: PropTypes.string,
  yes: PropTypes.string,
  no: PropTypes.string,
  onYes: PropTypes.func,
  onNo: PropTypes.func,
}

Confirm.defaultProps = {
  title: '',
  body: '',
  info: '',
  yes: 'Yes',
  no: 'No',
  onYes: () => {},
  onNo: () => {},
}

export default memo(Confirm)

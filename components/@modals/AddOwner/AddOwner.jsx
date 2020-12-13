import React, { memo } from 'react'
import PropTypes from 'prop-types'
import { Button, Icon } from '@components'
import './AddOwner.scss'

const AddOwner = ({ onAdd, onAssign, onCancel }) => (
  <>
    <div className="modal-header">
      <Icon name="fal fa-info-circle" color="#ffffff" size={14} />
      <span className="dsl-w14 pl-2">Add Owner</span>
    </div>
    <div className="modal-body">
      <p className="dsl-b16 mt-4 text-center">There are two ways of adding a new owner for a new company: by</p>
      <p className="dsl-b16 text-center">adding a new user or assigning existing one.</p>
      <p className="dsl-b16 text-center">Please select action you want to do:</p>
      <div className="d-flex align-items-center justify-content-center mt-5">
        <Button className="text-capitalize" type="medium" size="small" name="ADD USER" onClick={() => onAdd()} />
        <span className="dsl-p14 mx-4">or</span>
        <Button className="text-capitalize" type="medium" size="small" name="ASSIGN" onClick={() => onAssign()} />
      </div>
      <div className="d-flex justify-content-center my-4">
        <Button className="text-capitalize" type="low" size="small" name="CANCEL" onClick={() => onCancel()} />
      </div>
    </div>
  </>
)

AddOwner.propTypes = {}

AddOwner.defaultProps = {}

export default memo(AddOwner)

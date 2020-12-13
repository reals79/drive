import React from 'react'
import PropTypes from 'prop-types'
import { useSelector, useDispatch } from 'react-redux'
import { Avatar, Icon } from '@components'
import AppActions from '~/actions/app'
import './DefineOwners.scss'

const DefineOwners = () => {
  const dispatch = useDispatch()
  const data = useSelector(state => state.app.modalData)
  const handleAddOwner = () => {
    const payload = { type: 'Add Owner', data, callBack: null }
    dispatch(AppActions.modalRequest(payload))
  }

  return (
    <div className="card mb-3 vdra-owners">
      <p className="dsl-b22 bold">Define Owners</p>
      <div className="d-flex py-3 border-bottom">
        <div className="d-flex-3">
          <span className="dsl-b14">Name</span>
        </div>
        <div className="d-flex-2">
          <span className="dsl-b14">Position</span>
        </div>
        <div className="d-flex-4">
          <span className="dsl-b14">Email</span>
        </div>
        <div className="d-flex-2">
          <span className="dsl-b14">Date enrolled</span>
        </div>
        <div className="d-flex-2">
          <span className="dsl-b14">Last login</span>
        </div>
      </div>
      {[1, 2, 3].map(item => (
        <div className="d-flex py-3 border-bottom" key={item}>
          <div className="d-flex d-flex-3 align-items-center">
            <Avatar />
            <span className="dsl-b14 ml-3">Ian Barkley</span>
          </div>
          <div className="d-flex-2">
            <span className="dsl-b14">Sales Manager</span>
          </div>
          <div className="d-flex-4">
            <span className="dsl-b14">ian.barkley@ .com</span>
          </div>
          <div className="d-flex-2">
            <span className="dsl-b14">Dec 12, 16</span>
          </div>
          <div className="d-flex-2">
            <span className="dsl-b14">Mar 30, 20</span>
          </div>
        </div>
      ))}
      <div className="d-flex justify-content-end cursor-pointer mt-4" onClick={handleAddOwner}>
        <Icon name="fal fa-plus" size={14} color="#376caf" />
        <span className="dsl-p14 ml-1">ADD OWNER</span>
      </div>
    </div>
  )
}

DefineOwners.propTypes = {}

DefineOwners.defaultProps = {}

export default DefineOwners

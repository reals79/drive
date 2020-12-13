import React, { Component } from 'react'
import { Button, Icon, Input } from '@components'
import './ResetPassword.scss'

class ResetPassword extends Component {
  state = {
    email: '',
  }

  handleSubmit = () => {
    const { email } = this.state
    const payload = {
      email,
    }
    this.props.onReset(payload)
    this.props.onClose()
  }

  render() {
    const { email } = this.state
    return (
      <div className="reset-password-modal">
        <div className="modal-header">
          <Icon name="fal fa-info-circle mr-2" color="white" size={16} />
          <span className="dsl-w16">Reset Password</span>
        </div>
        <div className="modal-body d-flex align-items-center px-5">
          <div className="py-2">
            <Input
              title="Email"
              placeholder="Enter Your Email"
              direction="horizontal"
              value={email}
              onChange={e => this.setState({ email: e })}
            />
          </div>
        </div>
        <div className="modal-footer mx-0 pb-2">
          <Button disabled={!email} name="RESET" onClick={this.handleSubmit} />
        </div>
      </div>
    )
  }
}

export default ResetPassword

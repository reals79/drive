import React, { PureComponent } from 'react'
import { Tabs, Tab } from 'react-bootstrap'
import SignIn from './SignIn'
import Register from './Register'
import './Authentication.scss'

class Comment extends PureComponent {
  state = { active: 'signin', data: {} }

  handleChange = key => value => {
    const { data } = this.state
    this.setState({ data: { ...data, [key]: value } })
  }

  handleSubmit = payload => {
    const { active, data } = this.state
    const { route, after } = this.props
    if (active === 'signin') {
      data.rememberMe = true
      this.props.onLogin(data, route, after)
      this.props.onClose()
    }
    if (active === 'signup') {
      this.props.onRegister(payload, route, after)
    }
  }

  handleResetPassword = () => {
    this.props.onModal({ type: 'Reset Password' })
  }

  handleTab = e => {
    this.setState({ active: e, data: {} })
  }

  render() {
    const { active, data } = this.state

    return (
      <div className="auth-modal modal-content">
        <div className="modal-header bg-primary">
          <span className="dsl-w12">{active === 'signin' ? 'Login' : 'Quick Registration'}</span>
        </div>
        <div className="modal-body">
          <Tabs defaultActiveKey="signin" activeKey={active} id="authentication" onSelect={this.handleTab}>
            <Tab key="signin" eventKey="signin" title="Sign in">
              <SignIn
                data={data}
                onChange={this.handleChange}
                onSelect={this.handleTab}
                onSubmit={this.handleSubmit}
                onReset={this.handleResetPassword}
              />
            </Tab>
            <Tab key="signup" eventKey="signup" title="Register">
              <Register
                data={data}
                onChange={this.handleChange}
                onSubmit={this.handleSubmit}
                onClose={() => this.props.onClose()}
              />
            </Tab>
          </Tabs>
        </div>
      </div>
    )
  }
}

Comment.propTypes = {}

Comment.defaultProps = {}

export default Comment

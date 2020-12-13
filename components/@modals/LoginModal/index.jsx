import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { equals, isEmpty, isNil } from 'ramda'
import { Button, Icon, Input, CheckBox } from '@components'

class LoginModal extends React.Component {
  state = {
    token: this.props.token,
    email: '',
    password: '',
    rememberMe: true,
    emailError: '',
    passwordError: '',
    passwordType: 'password',
  }

  componentWillUpdate(nextProps, nextState, nextContext) {
    const { data, token } = this.props
    if (!equals(token, nextProps.token)) {
      this.setState({ token: nextProps.token })
      if (equals(this.props.routeName, '/community/forums')) {
        this.props.onAddTopic(data)
      } else {
        this.props.onAddTopicComment(data)
      }
      this.props.onClose()
    }
  }

  handleLogin = () => {
    const { email, password, rememberMe } = this.state
    if (isEmpty(email) || isNil(email)) {
      this.setState({ emailError: 'Email field is required .' })
      return
    }
    if (isEmpty(password) || isNil(password)) {
      this.setState({ passwordError: 'Password field is required' })
      return
    }
    this.props.onLogin({ email, password, rememberMe }, this.props.routeName)
  }

  handleRegister = () => {
    this.props.history.push('/auth/register')
  }

  handleEmail = e => {
    this.setState({ email: e.trim(), emailError: '' })
  }

  handlePassword = e => {
    this.setState({ password: e, passwordError: '' })
  }

  handleCheckbox = e => {
    const checkboxVal = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    this.setState({ rememberMe: checkboxVal })
  }

  handleEnterEvent = () => {
    this.handleLogin()
  }

  render() {
    const { isBusy } = this.props
    const { email, password, rememberMe, emailError, passwordError, passwordType } = this.state

    return (
      <div className="add-forum-model">
        <div className="modal-header">
          <Icon name="fal fa-plus-circle" size={10} color="#fff" />
          <span className="dsl-w12 ml-1">Login Modal</span>
        </div>
        <div className="modal-body">
          <div className="auth-login-modal" data-cy="login-form">
            <div className="login-box">
              <div className="login-content">
                <p className="dsl-b18 text-center text-600 mb-5">Sign In</p>
                <Input
                  type="text"
                  className="login-text-field mb-3"
                  dataCy="loginEmail"
                  placeholder="Email"
                  onChange={this.handleEmail}
                  value={email}
                  error={emailError}
                />

                <div className="password-input-field">
                  <Input
                    type={passwordType}
                    className="login-text-field"
                    dataCy="loginPassword"
                    placeholder="Password"
                    value={password}
                    onChange={this.handlePassword}
                    onEnter={this.handleEnterEvent}
                    error={passwordError}
                  />
                </div>

                <div className="d-flex justify-content-between mt-5 mb-25">
                  <CheckBox
                    id="remember"
                    title="Remember me"
                    dataCy="rememberMe"
                    checked={rememberMe}
                    onChange={this.handleCheckbox}
                  />
                </div>

                <Button
                  className="mx-auto"
                  name="SIGN IN"
                  dataCy="signInBtn"
                  onClick={this.handleLogin}
                  disabled={isBusy}
                />
                <div className="d-flex justify-content-center mt-3 d-flex-column ">
                  <a
                    href="/auth/password"
                    data-cy="forgetPasswordText"
                    className="dsl-d14 text-500 text-20 cursor-pointer"
                  >
                    Forgot Password?
                  </a>
                  <span className="dsl-d14 text-400 mr-3 text-20">Don't have an account yet?</span>
                  <span
                    className="dsl-d14 text-500 cursor-pointer text-20"
                    data-cy="registerText"
                    onClick={this.handleRegister}
                  >
                    Sign Up!
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

LoginModal.propTypes = {
  onLogin: PropTypes.func,
  onClose: PropTypes.func,
}

LoginModal.defaultProps = {
  onLogin: () => {},
  onClose: () => {},
}

const mapStateToProps = state => ({
  token: state.app.token,
})

export default connect(mapStateToProps, null)(LoginModal)

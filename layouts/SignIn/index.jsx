import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { equals, isEmpty, isNil } from 'ramda'
import { Button, CheckBox, Icon, Input } from '@components'
import AppActions from '~/actions/app'
import { UserRoles } from '~/services/config'
import { loading } from '~/services/util'
import './SignIn.scss'

class SignIn extends Component {
  constructor(props) {
    super(props)
    this.state = {
      email: '',
      password: '',
      rememberMe: true,
      emailError: '',
      passwordError: '',
      passwordType: 'password',
    }
    this.handleLogin = this.handleLogin.bind(this)
    this.handleEmail = this.handleEmail.bind(this)
    this.handlePassword = this.handlePassword.bind(this)
    this.handleCheckbox = this.handleCheckbox.bind(this)
    this.handleRegister = this.handleRegister.bind(this)
    this.handleEnterEvent = this.handleEnterEvent.bind(this)
    this.handleToggleVisibility = this.handleToggleVisibility.bind(this)
  }

  componentDidMount() {
    if (!isEmpty(this.props.token)) {
      const { role } = this.props
      if (role > UserRoles.MANAGER) {
        this.props.history.push('/hcm/daily-plan')
      } else {
        if (!equals('/auth/password', this.props.location.pathname)) {
          this.props.history.push('/hcm/tasks-projects')
        }
      }
    }
  }

  handleLogin() {
    const { email, password, rememberMe } = this.state
    if (isEmpty(email) || isNil(email)) {
      this.setState({ emailError: 'Email field is required .' })
      return
    }
    if (isEmpty(password) || isNil(password)) {
      this.setState({ passwordError: 'Password field is required' })
      return
    }
    this.props.login({ email, password, rememberMe })
  }

  handleRegister() {
    this.props.history.push('/auth/register')
  }

  handleEmail(e) {
    this.setState({ email: e.trim(), emailError: '' })
  }

  handlePassword(e) {
    this.setState({ password: e, passwordError: '' })
  }

  handleCheckbox(e) {
    const checkboxVal = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    this.setState({ rememberMe: checkboxVal })
  }

  handleEnterEvent() {
    this.handleLogin()
  }

  handleToggleVisibility() {
    const passwordType = this.state.passwordType === 'password' ? 'text' : 'password'
    this.setState({ passwordType })
  }

  render() {
    const { isBusy } = this.props
    const { email, password, rememberMe, emailError, passwordError, passwordType } = this.state

    return (
      <div className="auth-login" data-cy="login-form">
        <div className="login-box">
          <div className="logo-placeholder">
            <img src="/images/logos/ds_color.png" className="login-logo" />
          </div>
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
              {!isEmpty(password) && (
                <Icon
                  name="fas fa-eye cursor-pointer"
                  dataCy="passwordVisibility"
                  color="#969faa"
                  size={16}
                  onClick={this.handleToggleVisibility}
                />
              )}
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
              <a href="/auth/password" data-cy="forgetPasswordText" className="dsl-d14 text-500 text-20 cursor-pointer">
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
    )
  }
}

const mapStateToProps = state => ({
  isBusy: loading(state.app.status),
  role: state.app.app_role_id,
  token: state.app.token,
})

const mapDispatchToProps = dispatch => ({
  login: payload => dispatch(AppActions.loginRequest(payload)),
})

export default connect(mapStateToProps, mapDispatchToProps)(SignIn)

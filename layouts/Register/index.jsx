import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { isEmpty, equals } from 'ramda'
import { Button, CheckBox, Input } from '@components'
import './Register.scss'

class Register extends Component {
  constructor(props) {
    super(props)
    this.state = {
      email: '',
      password: '',
      repeatedPassword: '',
      error: '',
      fullname: '',
      jobRole: '',
      companyURL: '',
      companyName: '',
      termsAgreed: false,
    }

    this.handleCancel = this.handleCancel.bind(this)
    this.handleEmail = this.handleEmail.bind(this)
    this.handlePassword = this.handlePassword.bind(this)
    this.handleRepeatPassword = this.handleRepeatPassword.bind(this)
    this.handleFullName = this.handleFullName.bind(this)
    this.handleCompanyName = this.handleCompanyName.bind(this)
    this.handleCompanyUrl = this.handleCompanyUrl.bind(this)
    this.handleJobRole = this.handleJobRole.bind(this)
    this.handleRegister = this.handleRegister.bind(this)
    this.handleCheckbox = this.handleCheckbox.bind(this)
  }

  handleCancel(e) {
    this.props.history.push('/hcm')
  }

  handleEmail(e) {
    this.setState({ email: e })
  }

  handlePassword(e) {
    const { repeatedPassword } = this.state
    if (equals(e, repeatedPassword)) {
      this.setState({ error: '' })
    } else {
      this.setState({ error: 'Passwords donot match!!. Please try again.' })
    }
    this.setState({ password: e })
  }

  handleRepeatPassword(e) {
    const { password } = this.state
    if (equals(e, password)) {
      this.setState({ error: '' })
    } else {
      this.setState({ error: 'Passwords donot match !!. Please try again.' })
    }
    this.setState({ repeatedPassword: e })
  }

  handleFullName(e) {
    this.setState({ fullname: e })
  }

  handleJobRole(e) {
    this.setState({ jobRole: e })
  }

  handleCompanyUrl(e) {
    this.setState({ companyURL: e })
  }

  handleCompanyName(e) {
    this.setState({ companyName: e })
  }

  handleCheckbox(e) {
    const checkboxVal = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    this.setState({ termsAgreed: checkboxVal })
  }

  handleRegister() {
    const { email, password, fullname, jobRole, companyURL, companyName, termsAgreed } = this.state
    //do stuff
  }

  render() {
    const {
      email,
      password,
      repeatedPassword,
      error,
      fullname,
      jobRole,
      companyName,
      companyURL,
      termsAgreed,
    } = this.state
    const disabled =
      isEmpty(email) ||
      isEmpty(password) ||
      isEmpty(fullname) ||
      isEmpty(jobRole) ||
      isEmpty(companyName) ||
      isEmpty(companyURL) ||
      isEmpty(termsAgreed)
    !isEmpty(error)
    return (
      <div className="login">
        <div className="register-wrapper">
          <div className="register-box">
            <div className="vertical-centered-div" data-cy="registerForm">
              <div className="logo-placeholder">
                <img src="/images/logos/ds_color.png" className="login-logo" />
              </div>
              <div className="input-box">
                <h4> Sign Up </h4>
                <div className="input-fields">
                  <Input
                    type="text"
                    className="mt-text-field my-3"
                    dataCy="fullName"
                    placeholder="Fullname"
                    value={fullname}
                    onChange={this.handleFullName}
                  />

                  <Input
                    type="text"
                    className="mt-text-field my-3"
                    dataCy="email"
                    placeholder="Email"
                    value={email}
                    onChange={this.handleEmail}
                  />

                  <Input
                    type="password"
                    className="mt-text-field my-3"
                    dataCy="password"
                    placeholder="Password"
                    value={password}
                    onChange={this.handlePassword}
                  />

                  <Input
                    type="password"
                    className="mt-text-field mar-bot-40"
                    dataCy="confirmPassword"
                    placeholder="Confirm password"
                    value={repeatedPassword}
                    onChange={this.handleRepeatPassword}
                  />

                  <Input
                    type="text"
                    className="mt-text-field my-3"
                    dataCy="companyName"
                    placeholder="Company name"
                    value={companyName}
                    onChange={this.handleCompanyName}
                  />

                  <Input
                    type="text"
                    className="mt-text-field my-3"
                    dataCy="companyUrl"
                    placeholder="Company URL"
                    value={companyURL}
                    onChange={this.handleCompanyUrl}
                  />

                  <Input
                    type="text"
                    className="mt-text-field my-3"
                    dataCy="jobRole"
                    placeholder="Job role"
                    value={jobRole}
                    onChange={this.handleJobRole}
                  />

                  <div className="register-control">
                    <div className="remember-section ml-3">
                      <div className="remember plain-txt-style round-checkbox">
                        <CheckBox
                          type="checkbox"
                          id="checkbox"
                          onChange={this.handleCheckbox}
                          checked={termsAgreed}
                          className="radio-btn"
                          dataCy="termAndCondition"
                        />
                        <label htmlFor="checkbox"> </label>
                      </div>
                      <span className="dsl-d14 ml-2"> I agree the </span>
                      <span className="dsl-d14 text-500">terms and conditions</span>
                    </div>
                  </div>

                  <div className="signup-holder">
                    <Button
                      className="signupbtn"
                      dataCy="signupBtn"
                      onClick={this.handleRegister}
                      name="SIGN UP"
                    />
                    <Button
                      className="signupcancel"
                      dataCy="signupCancel"
                      onClick={this.handleCancel}
                      name="CANCEL"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

Register.propTypes = {
  email: PropTypes.string,
  password: PropTypes.string,
}

Register.defaultProps = {
  email: '',
  password: '',
}

export default Register

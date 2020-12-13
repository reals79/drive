import React, { Component } from 'react'
import { connect } from 'react-redux'
import { equals, isEmpty } from 'ramda'
import { LoadingAnimation as Loading } from '@components'
import AppActions from '~/actions/app'
import { UserRoles } from '~/services/config'
import { loading } from '~/services/util'
import SignIn from './SignIn'

class Login extends Component {
  constructor(props) {
    super(props)
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

  render() {
    const { loginRequest, isBusy } = this.props
    return (
      <div className="login">
        <Loading loading={isBusy} />
        <SignIn onLogin={loginRequest} isBusy={isBusy} {...this.props} />
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
  loginRequest: payload => dispatch(AppActions.loginRequest(payload)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Login)

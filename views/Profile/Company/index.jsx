import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Route, Switch, Redirect } from 'react-router-dom'
import { isEmpty } from 'ramda'
import { NotFound } from '@components'
import AppActions from '~/actions/app'
import companyRoutes from '~/routes/Profile/company'

class Company extends Component {
  componentDidMount() {
    if (this.props.authenticated) {
      if (this.props.role === 1) this.props.fetchCompanies()
      this.props.getLibraryFilters()
    }
  }

  render() {
    const { authenticated } = this.props

    return (
      <Switch>
        {companyRoutes.map((prop, key) => {
          if (prop.redirect && authenticated) {
            return <Redirect exact from={prop.path} to={prop.to} key={key} />
          }
          if (prop.redirect && !authenticated) {
            return <Route exact path={prop.path} component={prop.component} key={key} />
          }
          if (!prop.redirect && prop.auth && !authenticated) {
            return <Redirect exact from={prop.path} to="/" key={key} />
          }
          return <Route exact path={prop.path} component={prop.component} key={key} />
        })}
        <Route path="*" exact component={NotFound} />
      </Switch>
    )
  }
}

Company.propTypes = {
  authenticated: PropTypes.bool.isRequired,
  history: PropTypes.any,
}

Company.defaultProps = {
  authenticated: false,
  history: () => {},
}

const mapStateToProps = state => ({
  role: state.app.app_role_id,
  authenticated: !isEmpty(state.app.token),
})

const mapDispatchToProps = dispatch => ({
  fetchCompanies: () => dispatch(AppActions.globalcompaniesRequest()),
  getLibraryFilters: () => dispatch(AppActions.libraryfiltersRequest()),
})

export default connect(mapStateToProps, mapDispatchToProps)(Company)

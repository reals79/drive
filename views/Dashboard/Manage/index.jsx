import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Route, Switch, Redirect } from 'react-router-dom'
import { equals, isEmpty } from 'ramda'
import { NotFound } from '@components'
import AppActions from '~/actions/app'
import MngActions from '~/actions/manage'
import manageRoutes from '~/routes/Dashboard/manage'

class Manage extends Component {
  componentDidMount() {
    if (this.props.authenticated) {
      if (equals(1, this.props.role)) this.props.fetchComapnies()
      this.props.getLibraryFilters()
    }
  }

  render() {
    const { authenticated } = this.props

    return (
      <Switch>
        {manageRoutes.map((prop, key) => {
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

Manage.propTypes = {
  authenticated: PropTypes.bool.isRequired,
  history: PropTypes.any,
}

Manage.defaultProps = {
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
  toggleModal: e => dispatch(AppActions.modalRequest(e)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Manage)

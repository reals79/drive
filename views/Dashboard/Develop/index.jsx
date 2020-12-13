import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Route, Switch, Redirect } from 'react-router-dom'
import { equals, isEmpty } from 'ramda'
import { NotFound } from '@components'
import AppActions from '~/actions/app'
import developRoutes from '~/routes/Dashboard/develop'

class Develop extends Component {
  componentDidMount() {
    const { authenticated, role } = this.props

    if (authenticated) {
      if (equals(1, role)) this.props.fetchComapnies()
      this.props.fetchLibraryFilters()
    }
  }

  render() {
    const { authenticated, history } = this.props

    return (
      <Switch>
        {developRoutes.map((prop, key) => {
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

Develop.propTypes = {
  authenticated: PropTypes.bool,
  history: PropTypes.any,
  fetchLibraryFilters: PropTypes.func,
  fetchProjects: PropTypes.func,
  fetchEmployees: PropTypes.func,
}

Develop.defaultProps = {
  authenticated: false,
  history: () => {},
  fetchLibraryFilters: () => {},
  fetchProjects: () => {},
}

const mapStateToProps = state => ({
  role: state.app.app_role_id,
  authenticated: !isEmpty(state.app.token),
  companyInfo: state.app.company_info,
})

const mapDispatchToProps = dispatch => ({
  fetchComapnies: () => dispatch(AppActions.globalcompaniesRequest()),
  fetchLibraryFilters: () => dispatch(AppActions.libraryfiltersRequest()),
  toggleModal: e => dispatch(AppActions.modalRequest(e)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Develop)

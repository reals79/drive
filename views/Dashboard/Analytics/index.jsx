import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Route, Switch, Redirect } from 'react-router-dom'
import { isEmpty } from 'ramda'
import { NotFound } from '@components'
import analyticsRoutes from '~/routes/Dashboard/analytics'
import './Analytics.scss'

class Analytics extends Component {
  render() {
    const { authenticated, history } = this.props

    return (
      <Switch>
        {analyticsRoutes.map((prop, key) => {
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

Analytics.propTypes = {
  authenticated: PropTypes.bool.isRequired,
  history: PropTypes.any.isRequired,
}

const mapStateToProps = state => ({
  authenticated: !isEmpty(state.app.token),
})

export default connect(mapStateToProps, null)(Analytics)

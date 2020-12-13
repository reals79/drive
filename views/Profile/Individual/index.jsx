import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Route, Switch, Redirect } from 'react-router-dom'
import { isEmpty } from 'ramda'
import { NotFound } from '@components'
import individualRoutes from '~/routes/Profile/individual'

class Individual extends Component {
  componentDidMount() {
    window.scrollTo(0, 0)
  }

  render() {
    const { authenticated } = this.props

    return (
      <Switch>
        {individualRoutes.map((prop, key) => {
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

Individual.propTypes = {
  authenticated: PropTypes.bool.isRequired,
  history: PropTypes.any,
}

Individual.defaultProps = {
  authenticated: false,
  history: () => {},
}

const mapStateToProps = state => ({
  role: state.app.app_role_id,
  authenticated: !isEmpty(state.app.token),
})

export default connect(mapStateToProps, null)(Individual)

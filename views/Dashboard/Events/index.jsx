import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Route, Switch } from 'react-router-dom'
import { isEmpty } from 'ramda'
import { NotFound } from '@components'
import eventsRoutes from '~/routes/Dashboard/events'

class Events extends PureComponent {
  render() {
    const { authenticated, history } = this.props
    return (
      <Switch>
        {eventsRoutes.map((prop, key) => {
          return <Route exact path={prop.path} component={prop.component} key={key} />
        })}
        <Route path="*" exact component={NotFound} />
      </Switch>
    )
  }
}

Events.propTypes = {
  authenticated: PropTypes.bool.isRequired,
  history: PropTypes.any.isRequired,
}

const mapStateToProps = state => ({
  authenticated: !isEmpty(state.app.token),
})

export default connect(mapStateToProps, null)(Events)

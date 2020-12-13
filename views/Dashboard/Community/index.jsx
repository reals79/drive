import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Route, Switch, Redirect } from 'react-router-dom'
import { isEmpty } from 'ramda'
import { NotFound } from '@components'
import communityRoutes from '~/routes/Dashboard/community'
import AppActions from '~/actions/app'
import CommunityActions from '~/actions/community'
import VenAction from '~/actions/vendor'

class Community extends Component {
  componentDidMount() {
    if (this.props.authenticated) {
      if (this.props.role === 1) this.props.getCategories()
    }
  }

  render() {
    const { authenticated } = this.props

    return (
      <Switch>
        {communityRoutes.map((prop, key) => {
          if (prop.redirect) {
            return <Redirect exact from={prop.path} to={prop.to} key={key} />
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

Community.propTypes = {
  authenticated: PropTypes.bool.isRequired,
  history: PropTypes.any,
}

Community.defaultProps = {
  authenticated: false,
  history: () => {},
}

const mapStateToProps = state => ({
  role: state.app.app_role_id,
  authenticated: !isEmpty(state.app.token),
})
const mapDispatchToProps = dispatch => ({
  getCategories: () => dispatch(VenAction.getcategoriesRequest()),
  toggleModal: e => dispatch(AppActions.modalRequest(e)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Community)

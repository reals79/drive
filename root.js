import React from 'react'
import { Route, Switch } from 'react-router-dom'
import { connect } from 'react-redux'
import { toast } from 'react-toastify'
import * as am4core from '@amcharts/amcharts4/core'
import * as am4charts from '@amcharts/amcharts4/charts'
import am4themes_animated from '@amcharts/amcharts4/themes/animated'
import { LoadingAnimation as Loading } from '@components'
import AppActions from '~/actions/app'
import indexRoutes from '~/routes'
import { loading, version } from '~/services/util'

am4core.useTheme(am4themes_animated)

const ROOT = props => {
  if (props.version !== '1.0.0' && props.version !== version()) {
    toast.success(
      `We've released new features.
        Login for the free upgrade!`,
      {
        position: toast.POSITION.TOP_RIGHT,
      }
    )
    props.logout()
  }

  return (
    <>
      <Switch>
        {indexRoutes.map((prop, key) => {
          if (prop.name === 'Home') {
            return <Route to={prop.path} component={prop.component} key={key} />
          } else return <Route exact path={prop.path} component={prop.component} key={key} />
        })}
      </Switch>
      <Loading loading={props.busy} onReset={() => props.logout()} />
    </>
  )
}

const mapStateToProps = state => ({
  busy:
    loading(state.app.status) ||
    loading(state.develop.status) ||
    loading(state.manage.status) ||
    loading(state.community.status) ||
    loading(state.vendor.status),
  version: state.app.version,
})

const mapDispatchToProps = dispatch => ({
  logout: () => dispatch(AppActions.logoutRequest()),
})

export default connect(mapStateToProps, mapDispatchToProps)(ROOT)

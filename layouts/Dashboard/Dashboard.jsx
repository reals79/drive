import React from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import classNames from 'classnames'
import { NotFound, SideNav } from '@components'
import dashboardRoutes from '~/routes/routes'
import './Dashboard.scss'

const Content = ({ location, history, loggedIn, visible, full, fixed }) => (
  <div id="ds-content" className={classNames('content', loggedIn && !full && 'logged')}>
    <div className="main">
      <Switch>
        {dashboardRoutes.map((route, key) => {
          if (route.redirect) return <Redirect exact from={route.path} to={route.to} key={key} />
          return <Route path={route.path} component={route.component} key={key} />
        })}
        <Route path="*" exact component={NotFound} />
      </Switch>
    </div>
    {loggedIn && visible && <SideNav location={location} history={history} fixed={fixed} />}
  </div>
)

export default Content

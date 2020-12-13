import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { equals, filter, includes, length, split } from 'ramda'
import { FABButton, Button } from '@components'
import AppActions from '~/actions/app'
import manageRoutes from '~/routes/Dashboard/manage'
import developRoutes from '~/routes/Dashboard/develop'
import vendorRoutes from '~/routes/Dashboard/vendor_ratings'
import communityRoutes from '~/routes/Dashboard/community'
import NavItem from './NavItem'
import './SideNav.scss'

const SECTIONS = ['hcm', 'library', 'analytics', 'community', 'vendor-ratings', 'events']

class SideNav extends React.Component {
  state = { section: 'hcm', path: '', expanded: true }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { location } = nextProps
    const items = split('/', location.pathname)
    let section = items[1]
    let path = location.pathname
    if (!includes(section, SECTIONS)) section = prevState.section
    return { section, path }
  }

  toggleSidebar = () => {
    const { expanded } = this.state
    this.setState({ expanded: !expanded })
  }

  render() {
    const { location, history, fixed, userRole, token } = this.props
    const { section, path, expanded } = this.state
    const loggedIn = length(filter(item => equals(item, '/'), location.pathname)) > 1
    const classes = classNames(
      'side-nav',
      loggedIn ? { expanded: true, collapsed: false } : { disabled: !loggedIn },
      expanded && 'hide-menu'
    )
    let developRoute =
      window.location.origin == 'https://hcm. .com'
        ? filter(item => item.title !== 'Documents', developRoutes)
        : developRoutes

    return (
      <div className="main-content">
        <div className={token ? 'side-nav-icon' : 'd-none'}>
          <Button onClick={this.toggleSidebar} className={classNames('pr-4', expanded ? 'open' : 'close')}>
            <img src={expanded ? '/images/icons/menu.svg' : '/images/icons/delete.svg'} />
          </Button>
          <span className={expanded ? 'd-none' : 'overlay'} />
        </div>
        <div className={classes}>
          {section == 'hcm' &&
            manageRoutes.map(
              (route, index) =>
                route.show &&
                route.permission >= userRole && (
                  <NavItem
                    key={`mng-${index}`}
                    title={route.title}
                    dataCy={route.title.replace(/[^A-Z0-9]+/gi, '')}
                    icon="fal fa-circle"
                    active={equals(path, route.path) || equals(split('/', path)[2], split('/', route.path)[2])}
                    parent={route.header}
                    collapsed={false}
                    onClick={() => {
                      this.toggleSidebar()
                      history.push(route.path)
                    }}
                  />
                )
            )}

          {section == 'library' &&
            developRoute.map(
              (route, index) =>
                route.show &&
                route.permission >= userRole && (
                  <NavItem
                    key={`dev-${index}`}
                    title={route.title}
                    dataCy={route.title.replace(/[^A-Z0-9]+/gi, '')}
                    icon="fal fa-circle"
                    active={equals(path, route.path) || equals(split('/', path)[2], split('/', route.path)[2])}
                    parent={route.header}
                    collapsed={false}
                    onClick={() => {
                      this.toggleSidebar()
                      history.push(route.path)
                    }}
                  />
                )
            )}

          {section == 'vendor-ratings' &&
            vendorRoutes.map(
              (route, index) =>
                route.show &&
                route.permission >= userRole && (
                  <NavItem
                    key={`dev-${index}`}
                    title={route.title}
                    dataCy={route.title.replace(/[^A-Z0-9]+/gi, '')}
                    icon="fal fa-circle"
                    active={equals(path, route.path) || equals(split('/', path)[2], split('/', route.path)[2])}
                    parent={route.header}
                    collapsed={false}
                    onClick={() => history.push(route.path)}
                  />
                )
            )}

          {section == 'community' &&
            communityRoutes.map(
              (route, index) =>
                route.show &&
                route.permission >= userRole && (
                  <NavItem
                    key={`dev-${index}`}
                    title={route.title}
                    icon="fal fa-circle"
                    active={equals(path, route.path) || equals(split('/', path)[2], split('/', route.path)[2])}
                    parent={route.header}
                    collapsed={false}
                    onClick={() => history.push(route.path)}
                  />
                )
            )}
          <FABButton history={history} fixed={fixed} onModal={this.props.toggleModal} />
        </div>
      </div>
    )
  }
}

SideNav.propTypes = {
  userRole: PropTypes.number,
  location: PropTypes.any.isRequired,
  fixed: PropTypes.bool.isRequired,
  token: PropTypes.string,
}

SideNav.defaultProps = {
  userRole: 1,
  location: {},
  fixed: true,
  token: '',
}

const mapStateToProps = state => ({
  userRole: state.app.primary_role_id,
  token: state.app.token,
})

const mapDispatchToProps = dispatch => ({
  toggleModal: payload => dispatch(AppActions.modalRequest(payload)),
})

export default connect(mapStateToProps, mapDispatchToProps)(SideNav)

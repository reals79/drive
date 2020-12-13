import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Button, Form, Image, Nav, Navbar } from 'react-bootstrap'
import { contains, equals, find, isEmpty, propEq, split, toLower } from 'ramda'
import OutsideClickHandler from 'react-outside-click-handler'
import classNames from 'classnames'
import { Accordion, Animations, Avatar, CheckBox, Button as DSButton, Dropdown, Icon, Search } from '@components'
import AppActions from '~/actions/app'
import CompanyActions from '~/actions/company'
import DevActions from '~/actions/develop'
import VenAction from '~/actions/vendor'
import { UserRoles, InitialNotificationSettings, SearchSections, SearchOptions } from '~/services/config'
import { avatarBackgroundColor, loading } from '~/services/util'
import Notification from './Notification'
import { navData } from './navRouters'
import './Header.scss'

class Header extends Component {
  state = {
    isPopup: false,
    openNotification: false,
    openMenuList: false,
    openSearchBox: false,
    search: '',
    searchOption: 'exact',
  }

  componentDidMount() {
    const { getNotification, loggedIn } = this.props
    loggedIn && getNotification()
  }

  handleClose = mode => () => {
    if (mode === 'notification') {
      this.setState({ openNotification: false })
    } else if (mode === 'profile') {
      this.setState({ isPopup: false })
    } else if (mode === 'search') {
      this.setState({ openSearchBox: false })
    }
  }

  handleLogin = () => {
    const route =
      contains('/community', location.pathname) || contains('/vendor-ratings', location.pathname)
        ? this.props.history.location.pathname
        : null
    this.props.toggleModal({
      type: 'Authentication',
      data: {
        before: {
          route,
          after: null,
        },
      },
      callBack: null,
    })
    this.setState({ isPopup: false })
  }

  handleLogout = () => {
    const path = split('/', this.props.history.location.pathname)[1]
    const payload = {
      route: '/' + path,
    }
    this.props.logoutRequest(payload)
    this.setState({ isPopup: false })
  }

  handlePopupState = () => {
    const { isPopup } = this.state
    this.setState({ isPopup: !isPopup })
  }

  handleChangeSearch = e => {
    const search = e.target.value
    this.setState({ search })
  }

  handleChangeSearchOption = searchOption => e => {
    e.preventDefault()
    this.setState({ searchOption })
  }

  handleSearch = () => {
    const { search, searchOption } = this.state
    if (search === '') return
    const payload = {
      data: { search, how_to_search: searchOption },
      route: {
        pathname: '/vendor-ratings/search',
        param: { search },
      },
    }
    this.props.globalSearch(payload)
    this.setState({ openSearchBox: false })
  }

  handleOpenCompanyProfile = () => {
    const { companies, companyInfo, selectedCompany } = this.props

    let companyId = selectedCompany[0]
    if (companyId < 0) companyId = companyInfo.id
    const company = find(propEq('id', companyId), companies)
    if (company) {
      const payload = { id: company.business_id }
      const route = `/company/${company.business_id}/about`
      this.props.getBusiness(payload, route)
    }
  }

  getNavLink(isActive, idx, href, imgSrc, label) {
    return (
      <Nav.Link className={classNames('item', isActive && 'active')} eventKey={idx + 1} href={href} key={idx}>
        <div className="d-flex flex-column text-center" data-cy={`navItem${label.replace(/[^A-Z0-9]+/gi, '')}`}>
          <div className="ic-wrapper">
            <img src={imgSrc} />
          </div>
          {label}
        </div>
      </Nav.Link>
    )
  }

  toggleSearchBox = () => {
    this.setState(prev => ({ openSearchBox: !prev.openSearchBox }))
  }

  toggleNotification = () => {
    const { notificationsData } = this.props
    const { openNotification } = this.state
    if (notificationsData.total > 0) {
      this.setState({ openNotification: !openNotification })
    }
  }

  toggleMenu = () => {
    const { openMenuList } = this.state
    this.setState({ openMenuList: !openMenuList })
  }

  renderPopup() {
    const { isPopup } = this.state
    return (
      <Animations.Popup enter={10} exit={0} opened={isPopup} className="profile-popup">
        <p className="item">
          <a className="dsl-b14" data-cy="userProfileText" href={`/in/${toLower(this.props.inroute)}/about`}>
            My Profile
          </a>
        </p>
        <p className="item">
          <a className="dsl-b14" data-cy="editProfileText" href={`/in/${toLower(this.props.inroute)}/account-admin`}>
            Settings
          </a>
        </p>
        <div className="item" onClick={this.handleOpenCompanyProfile}>
          <a className="dsl-b14" data-cy="companyProfileText">
            Company Profile
          </a>
        </div>
        <p className="item  dsl-b14" data-cy="logoutText" onClick={this.handleLogout}>
          Sign out
        </p>
      </Animations.Popup>
    )
  }

  renderSearchBox() {
    const { openSearchBox, searchOption } = this.state

    return (
      <Animations.Popup className="search-box-popup" enter={10} exit={0} opened={openSearchBox}>
        <div className="d-h-start p-4">
          <Search className="search-input" placeholder="Socket" hideIcon onChange={this.handleChangeSearch} />
          <DSButton className="search-button" name="SEARCH" onClick={this.handleSearch} />
        </div>
        <div className="more-filters-container">
          <Accordion className="more-filters" icon={null} expanded title="More filters">
            <Dropdown
              className="section-dropdown"
              width="fit-content"
              title="Select section to search in"
              placeholder="Select a section"
              direction="vertical"
              defaultIds={[1]}
              returnBy="data"
              data={SearchSections}
            />
            <p className="dsl-m12 mt-3 mb-2">How to search</p>
            <div className="d-h-between">
              {SearchOptions.map(option => {
                const checked = searchOption === option.value
                return (
                  <div className="d-h-start" key={option.id} onClick={this.handleChangeSearchOption(option.value)}>
                    <CheckBox id={option.id} size="tiny" checked={checked} />
                    <p className="dsl-b14 mb-0 ml-2">{option.label}</p>
                  </div>
                )
              })}
            </div>
          </Accordion>
        </div>
      </Animations.Popup>
    )
  }

  renderNotification() {
    const { openNotification } = this.state
    const {
      loading,
      notificationsData,
      notificationsSettings,
      getNotification,
      updateNotifications,
      getSettings,
      updateSettings,
    } = this.props

    return (
      <Animations.Popup className="notification-popup" enter={10} exit={0} opened={openNotification}>
        <Notification
          loading={loading}
          data={notificationsData}
          settings={notificationsSettings}
          onFetch={e => getNotification(e)}
          onFetchSettings={() => getSettings()}
          onUpdateSettings={e => updateSettings(e)}
          onUpdate={(id, event, after, route) => updateNotifications(id, event, after, route)}
        />
      </Animations.Popup>
    )
  }

  render() {
    const { loggedIn, avatar, name, firstName, notificationsData, location, userId } = this.props
    const { isPopup, openNotification, openMenuList, openSearchBox } = this.state
    const blue =
      equals('/auth/login', location.pathname) ||
      contains('/vendor-ratings', location.pathname) ||
      contains('/community', location.pathname) ||
      contains('/company', location.pathname) ||
      contains('/in/', location.pathname) ||
      loggedIn

    return (
      <Navbar className={classNames('navbar', blue && 'logged')}>
        <div className="container">
          <Navbar.Brand as="div">
            <Image src="/images/ds-logo.svg" className="p-0 ml-0 desktop-device" />
            <Image src="/images/ds-logo-small.svg" className="p-0 ml-0 mobile-device" />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="ds-navbar-nav" />
          <Navbar.Collapse id="ds-navbar-nav">
            <Nav>
              {navData.map((nav, idx) => {
                const imgSrc = `/images/icons/ic-${nav.name}.svg`
                if (idx > 3) return null
                return this.getNavLink(location.pathname.includes(nav.href), idx, nav.href, imgSrc, nav.label)
              })}
              <div className={classNames('mobile-expand-menu d-flex', !openMenuList && 'hide-bottom-menu-items')}>
                {navData.map((nav, idx) => {
                  const imgSrc = `/images/icons/ic-${nav.name}.svg`
                  const imgSrcMobile = `/images/icons/ic-${nav.name}-reverse.svg`
                  if (idx < 4) return null
                  return this.getNavLink(
                    location.pathname.includes(nav.href),
                    idx,
                    nav.href,
                    openMenuList ? imgSrcMobile : imgSrc,
                    nav.label
                  )
                })}
              </div>
              <Nav.Link onClick={this.toggleMenu} to="#" className="d-md-none">
                <Icon name={openMenuList ? 'far fa-angle-down ml-1' : 'far fa-ellipsis-h'} size={22} color="white" />
                Menu
              </Nav.Link>
            </Nav>
            <Form className="controls hidden-sm ml-auto" inline>
              {loggedIn ? (
                <div className="d-flex">
                  <OutsideClickHandler onOutsideClick={this.handleClose('search')}>
                    <div className="position-relative">
                      <div className="popup-profile">
                        <div className="d-flex mt-1">
                          <Button
                            className={classNames(
                              'bell border-0 rounded-circle d-center',
                              openSearchBox && 'search-box active'
                            )}
                            onClick={this.toggleSearchBox}
                          >
                            <Icon name="far fa-search" color="white" size={20} />
                          </Button>
                        </div>
                        {this.renderSearchBox()}
                      </div>
                    </div>
                  </OutsideClickHandler>
                  <OutsideClickHandler onOutsideClick={this.handleClose('notification')}>
                    <div className="position-relative">
                      <div className="popup-profile m-0" onClick={this.toggleNotification}>
                        <div className="d-flex mt-1">
                          <Button className={classNames('bell border-0 d-center', openNotification && 'active')}>
                            <Icon name="fas fa-bell" color="white" size={22} />
                            {notificationsData.new > 0 && (
                              <Icon name="badge-icon fas fa-circle" size={10} color="red" />
                            )}
                          </Button>
                        </div>
                        {/* {this.renderNotification()} */}
                      </div>
                    </div>
                  </OutsideClickHandler>
                  <OutsideClickHandler onOutsideClick={this.handleClose('profile')}>
                    <div className="d-flex pt-1 pt-md-0">
                      <div className="position-relative mr-2">
                        <div className="popup-profile" onClick={this.handlePopupState} data-cy="popupProfile">
                          <Avatar
                            url={`${avatar}?${Date.now()}`}
                            name={name}
                            type="logo"
                            backgroundColor={avatarBackgroundColor(userId)}
                          />
                          <div className="d-flex mt-1 user-name">
                            <span className="dsl-w12 mr-1">{firstName}</span>
                            <Icon name={`far fa-angle-${isPopup ? 'up' : 'down'}`} size={10} color="white" />
                          </div>
                          {this.renderPopup()}
                        </div>
                      </div>
                    </div>
                  </OutsideClickHandler>
                </div>
              ) : (
                <>
                  <Button className="search border-0 mr-2">
                    <Icon dataCy="landingPageSearch" name="far fa-search" color="white" size={20} />
                  </Button>
                  <div className="lock border-0 d-flex cursor-pointer" onClick={this.handleLogin}>
                    <Icon name="far fa-sign-in-alt" color="white" size={20} />
                    <span data-cy="gotToLogin" className="ml-2 dsl-w14 opacity-5">
                      Login
                    </span>
                  </div>
                </>
              )}
            </Form>
          </Navbar.Collapse>
        </div>
      </Navbar>
    )
  }
}

Header.propTypes = {
  loading: PropTypes.bool,
  userId: PropTypes.number.isRequired,
  avatar: PropTypes.string.isRequired,
  history: PropTypes.any.isRequired,
  loggedIn: PropTypes.bool.isRequired,
  notificationsData: PropTypes.shape({
    total: PropTypes.number,
    new: PropTypes.number,
    viewed: PropTypes.number,
    notifications: PropTypes.shape({
      current_page: PropTypes.number,
      data: PropTypes.array,
      first_page_url: PropTypes.string,
      from: PropTypes.number,
      last_page: PropTypes.number,
      last_page_url: PropTypes.string,
      next_page_url: PropTypes.string,
      path: PropTypes.string,
      per_page: PropTypes.number,
      prev_page_url: PropTypes.string,
      to: PropTypes.number,
      total: PropTypes.number,
    }),
  }),
  notificationsSettings: PropTypes.any,
  employees: PropTypes.array,
  companyInfo: PropTypes.shape({
    id: PropTypes.number,
  }),
  companies: PropTypes.array,
  selectedCompany: PropTypes.array,
  getNotification: PropTypes.func,
  getSettings: PropTypes.func,
  updateSettings: PropTypes.func,
  globalSearch: PropTypes.func,
  getCompanyDetail: PropTypes.func,
}

Header.defaultProps = {
  loading: false,
  notificationsData: {
    total: 0,
    new: 0,
    viewed: 0,
    status: [],
    notifications: {
      current_page: 1,
      data: [],
      first_page_url: '',
      from: 1,
      last_page: 2,
      last_page_url: '',
      next_page_url: '',
      path: '',
      per_page: 25,
      prev_page_url: null,
      to: 25,
      total: 34,
    },
  },
  userId: 1,
  notificationsSettings: InitialNotificationSettings,
  employees: [],
  companyInfo: {
    id: 0,
  },
  companies: [],
  selectedCompany: [],
  getNotification: () => {},
  updateSettings: () => {},
  getSettings: () => {},
  globalSearch: () => {},
  getCompanyDetail: () => {},
}

const mapStateToProps = state => ({
  loading: loading(state.app.status),
  userId: state.app.id,
  name: state.app.first_name + ' ' + state.app.last_name,
  inroute: state.app.first_name + '-' + state.app.last_name,
  firstName: state.app.first_name,
  avatar: state.app.avatar,
  role: state.app.app_role_id,
  loggedIn: !isEmpty(state.app.token),
  notificationsData: state.app.notificationsData,
  companyInfo: state.app.company_info,
  employees: state.app.employees,
  companies: state.app.companies,
  selectedCompany: state.app.selectedCompany,
  notificationsSettings: state.develop.notificationsSettings,
})

const mapDispatchToProps = dispatch => ({
  logoutRequest: payload => dispatch(AppActions.logoutRequest(payload)),
  getBusiness: (e, route) => dispatch(CompanyActions.getbusinessRequest(e, route)),
  getNotification: e => dispatch(AppActions.fetchnotificationsRequest(e)),
  getSettings: () => dispatch(DevActions.fetchnotificationssettingsRequest()),
  updateSettings: e => dispatch(DevActions.updatenotificationssettingsRequest(e)),
  updateNotifications: (id, event, after, route) =>
    dispatch(AppActions.updatenotificationsRequest(id, event, after, route)),
  globalSearch: e => dispatch(VenAction.globalsearchRequest(e)),
  getCompanyDetail: e => dispatch(VenAction.getvendorcompanyRequest(e)),
  toggleModal: payload => dispatch(AppActions.modalRequest(payload)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Header)

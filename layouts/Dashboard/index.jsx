import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { ToastContainer } from 'react-toastify'
import { any, includes, isEmpty } from 'ramda'
import { Header, Footer, Modals as AppModal } from '@components'
import AppActions from '~/actions/app'
import { HCMChat } from '~/services/HCMChat'
import Content from './Dashboard'
import './Dashboard.scss'

class Dashboard extends React.Component {
  constructor(props) {
    super(props)
    window.token = props.token
    this.state = {
      footerHeight: 0,
      contentHeight: 0,
      fixed: true,
      screenWidth: 0,
    }
    this.handleScroll = this.handleScroll.bind(this)
  }

  componentDidMount() {
    window.scrollTo(0, 0)
    window.token = this.props.token
    const footerHeight = document.getElementById('ds-footer').offsetHeight
    const contentHeight = document.getElementById('ds-content').offsetHeight
    this.setState({ footerHeight, contentHeight })
    window.addEventListener('scroll', this.handleScroll)
    this.props.history.listen((location, action) => {
      const payload = {
        route: location.pathname,
      }
      this.props.saveLocation(payload)
    })
    HCMChat()
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll)
  }

  handleScroll(e) {
    const { contentHeight, footerHeight } = this.state
    const offset = document.documentElement.scrollHeight - contentHeight - 64

    const fixed =
      document.documentElement.scrollHeight - (window.innerHeight + document.documentElement.scrollTop) > footerHeight

    this.setState({ fixed })
  }

  render() {
    const { history, location, token } = this.props
    const { fixed } = this.state
    const full = any(e => includes(e, location.pathname))(['/analytics', '/events'])
    const visible = !any(e => includes(e, location.pathname))(['/analytics', '/events', '/company/', '/in/'])

    return (
      <div className="dashboard">
        <Header history={history} location={location} />
        <Content
          location={location}
          history={history}
          loggedIn={
            !isEmpty(token) ||
            includes('/vendor-ratings', location.pathname) ||
            includes('/community', location.pathname) ||
            includes('/company', location.pathname) ||
            includes('/in/', location.pathname)
          }
          full={full}
          visible={visible}
          fixed={fixed}
        />
        <Footer location={location} />
        <ToastContainer autoClose={3000} />
        <AppModal />
      </div>
    )
  }
}

Dashboard.propTypes = {
  token: PropTypes.string,
  location: PropTypes.any,
}

Dashboard.defaultProps = {
  token: '',
  location: {},
}

const mapStateToProps = state => ({
  token: state.app.token,
})

const mapDispatchToProps = dispatch => ({
  saveLocation: e => dispatch(AppActions.locationsRequest(e)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)

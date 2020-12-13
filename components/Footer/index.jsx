import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Image } from 'react-bootstrap'
import { isEmpty, equals, split } from 'ramda'
import { Icon } from '@components'
import './Footer.scss'

function Footer(props) {
  const { location, loggedIn } = props
  return (
    <div id="ds-footer" className="footer">
      <div className="footer-content">
        <div className="footer-left">
          <Icon
            name={`fas fa-tasks menu-icon ${
              equals(split('/', location.pathname)[1], 'hcm') ? 'active' : ''
            }`}
            size={14}
            color="white"
          />
          <Icon
            name={`fas fa-landmark menu-icon ${
              equals(split('/', location.pathname)[1], 'library') ? 'active' : ''
            }`}
            size={14}
            color="white"
          />
          <Icon
            name={`fas fa-chart-bar menu-icon ${
              equals(split('/', location.pathname)[1], 'analytics') ? 'active' : ''
            }`}
            size={14}
            color="white"
          />
          <Icon
            name={`fas fa-users menu-icon ${
              equals(split('/', location.pathname)[1], 'community') ? 'active' : ''
            }`}
            size={14}
            color="white"
          />
          <Icon
            name={`fas fa-star menu-icon ${
              equals(split('/', location.pathname)[1], 'ratings') ? 'active' : ''
            }`}
            size={14}
            color="white"
          />
          <Icon
            name={`fas fa-calendar-check menu-icon ${
              equals(split('/', location.pathname)[1], 'events') ? 'active' : ''
            }`}
            size={14}
            color="white"
          />
          <div className="divider" />
          <Icon name="fab fa-facebook-f ml-3 social-icon" size={14} color="white" />
          <Icon name="fab fa-twitter social-icon" size={14} color="white" />
          <Icon name="fab fa-linkedin-in social-icon" size={14} color="white" />
          <Icon name="fab fa-youtube social-icon" size={14} color="white" />
        </div>
        <div className="footer-right">
          <div className="company-info"> . All Right Reserved 2019</div>
        </div>
      </div>
    </div>
  )
}

Footer.propTypes = {
  loggedIn: PropTypes.bool,
  location: PropTypes.any,
}

Footer.defaultProps = {
  loggedIn: false,
  location: {},
}

const mapStateToProps = state => ({
  loggedIn: !isEmpty(state.app.token),
})

export default connect(mapStateToProps, null)(Footer)

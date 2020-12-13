import React, { memo } from 'react'
import { Col, Row } from 'react-bootstrap'
import PropTypes from 'prop-types'
import { Icon, Button } from '@components'
import './LandingContact.scss'

const LandingContact = ({ title, subtitle, btntitle, onDemoNow }) => (
  <div className="landing-contact custom-item-align">
    <div className="container">
      <Row>
        <Col>
          <h3 className="title">{title}</h3>
          <p className="sub-title mb-5">{subtitle}</p>
          <Button className="btn-demo m-auto" onClick={() => onDemoNow()} name={btntitle} />
          <div className="phone text-center mt-5">
            <Icon name="fal fa-phone-volume mr-2" color="white" size={16} />
            <a href="tel:866.943.8371" className="clickable-phone-number">
              866.943.8371
            </a>
          </div>
        </Col>
      </Row>
    </div>
  </div>
)

LandingContact.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  btntitle: PropTypes.string,
  onDemoNow: PropTypes.func.isRequired,
}

LandingContact.defaultProps = {
  title: 'Amplify your team! Invest a few minutes to get started.',
  subtitle: 'Or contact us if you have questions',
  btntitle: 'DEMO NOW',
  onDemoNow: () => {},
}

export default memo(LandingContact)

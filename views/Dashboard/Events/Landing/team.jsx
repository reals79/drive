import React from 'react'
import { Image } from 'react-bootstrap'
import PropTypes from 'prop-types'
import { isEmpty } from 'ramda'

const Team = ({ title, type, size, className, link }) => (
  <div
    className={`team ${size} ${className} cursor-pointer`}
    style={{ backgroundImage: `url(/images/landing/events_${type}_bg.png)` }}
    onClick={() => !isEmpty(link) && window.open(link, '_self')}
  >
    <Image className="team-logo" src={`/images/landing/events_${type}_logo.png`} />
    {!isEmpty(title) && <p className="dsl-w18 bold team-title">{title}</p>}
  </div>
)

Team.propTypes = {
  className: PropTypes.string,
  title: PropTypes.string,
  type: PropTypes.oneOf(['presidents', 'dses', 'leadership', 'webinar']),
  size: PropTypes.oneOf(['large', 'medium', 'small']),
  link: PropTypes.string,
}

Team.defaultProps = {
  className: '',
  title: '',
  type: 'presidents',
  size: 'medium',
  link: '',
}

export default Team

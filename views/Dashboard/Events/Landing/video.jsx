import React from 'react'
import { Image, Button } from 'react-bootstrap'
import PropTypes from 'prop-types'
import { isEmpty } from 'ramda'
import { Icon } from '@components'

const Video = ({ title, type, url, className, onModal }) => (
  <div className={`video ${className}`}>
    <div className="video-type-view">
      <Image className="video-logo" src={`/images/landing/events_${type}_logo.png`} />
      {!isEmpty(title) && <p className="dsl-w18 bold mb-0">{title}</p>}
    </div>
    <div className="video-split" />
    <div className="video-play-view" style={{ backgroundImage: `url(/images/landing/events_${type}_video.png)` }}>
      <div className="video-overlay" />
      <Button
        className="play"
        onClick={() =>
          onModal({
            type: 'Landing modal',
            data: {
              before: {
                url,
                height: window.innerWidth <= 475 ? 200 : 360,
                width: window.innerWidth <= 475 ? 360 : 640,
              },
              after: null,
            },
            callBack: null,
          })
        }
      >
        <Icon name="fas fa-play" size={30} color="#fff" />
      </Button>
    </div>
  </div>
)

Video.propTypes = {
  className: PropTypes.string,
  title: PropTypes.string,
  type: PropTypes.oneOf(['presidents', 'dses', 'leadership', 'webinar']),
  url: PropTypes.string,
}

Video.defaultProps = {
  className: '',
  title: '',
  type: 'presidents',
  size: '',
}

export default Video

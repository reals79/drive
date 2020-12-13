import React from 'react'
import PropTypes from 'prop-types'
import { Image } from 'react-bootstrap'
import Dropzone from 'react-dropzone'
import classNames from 'classnames'
import { Icon, ImagePicker } from '@components'
import { isEmpty } from 'ramda'
import { convertUrl, checkBase64Format } from '~/services/util'
import './Avatar.scss'

class Avatar extends React.Component {
  state = {
    url: checkBase64Format(this.props.url) ? this.props.url : convertUrl(this.props.url, '/images/default.png'),
    error: false,
    open: false,
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (!nextProps.upload) {
      const imageUrl = checkBase64Format(nextProps.url)
        ? nextProps.url
        : convertUrl(nextProps.url, '/images/default.png')
      return { url: imageUrl }
    }
    return null
  }

  componentWillUnmount() {
    URL.revokeObjectURL(this.state.url)
  }

  handleApply = e => {
    this.setState({ url: e })
  }

  handleDrop = e => {
    this.props.onDrop(e[0])
    this.setState({ url: URL.createObjectURL(e[0]), open: true })
  }

  handleClick = e => {
    this.props.onToggle(e)
  }

  handleError = e => {
    this.setState({ error: true })
  }

  renderInitial = (avatarName, size, backgroundColor, fontSize) => {
    return (
      <div
        className="rounded-circle"
        style={{
          width: size,
          height: size,
          minWidth: size,
          minHeight: size,
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          backgroundColor,
          fontSize: fontSize,
        }}
      >
        {avatarName.toUpperCase()}
      </div>
    )
  }

  renderAvatar = () => {
    const { url, error } = this.state
    const { className, size, borderColor, borderWidth, name, backgroundColor, type } = this.props
    let _size = 35
    let _fontSize = '14px'
    let _margin = '6px'
    let _iconSize = 10
    const avatarName =
      name
        .split(' ')
        .slice(0, -1)
        .join(' ')
        .charAt(0) +
      name
        .split(' ')
        .slice(-1)
        .join(' ')
        .charAt(0)

    if (size === 'extraTiny') {
      _size = 26
      _fontSize = '12px'
      _margin = '6px'
      _iconSize = 10
    } else if (size === 'tiny') {
      _size = 35
      _fontSize = '14px'
      _margin = '8px'
      _iconSize = 15
    } else if (size === 'small') {
      _size = 55
      _fontSize = '18px'
      _margin = '18px'
      _iconSize = 16
    } else if (size === 'regular') {
      _size = 70
      _fontSize = '20px'
      _margin = '22px'
      _iconSize = 20
    } else if (size === 'medium') {
      _size = 83
      _fontSize = '26px'
      _margin = '24px'
      _iconSize = 30
    } else if (size === 'large') {
      _size = 105
      _fontSize = '30px'
      _margin = '28px'
      _iconSize = 40
    } else {
      _size = 125
      _fontSize = '36px'
      _margin = '30px'
      _iconSize = 50
    }

    return (
      <div
        className={classNames(className, 'avatar-image')}
        style={{
          width: _size,
          height: _size,
          minWidth: _size,
          minHeight: _size,
          borderRadius: _size * 0.5,
          borderColor,
          borderWidth,
          backgroundColor,
          borderStyle: 'solid',
          overflow: 'hidden',
        }}
      >
        {url.includes('/images/default.png') && name && type == 'initial' ? (
          this.renderInitial(avatarName, _size, backgroundColor, _fontSize)
        ) : type == 'logo' && url.includes('/images/default_company.svg') ? (
          <Icon
            style={{
              margin: _margin,
              display: 'flex',
            }}
            color="#e0e0e0"
            size={_iconSize}
            name="fal fa-car-building"
          />
        ) : error && name ? (
          this.renderInitial(avatarName, _size, backgroundColor, _fontSize)
        ) : (
          <Image src={url} width="100%" height="100%" onError={this.handleError} />
        )}
      </div>
    )
  }

  render() {
    const { upload, name, type } = this.props
    const { url, open } = this.state

    if (upload) {
      return (
        <Dropzone
          className="drag-drop"
          activeClassName="drag-drop active"
          acceptClassName="drag-drop active"
          rejectClassName="drag-drop deactivate"
          onDrop={this.handleDrop}
          accept="image/*"
          multiple={false}
        >
          {({ getRootProps, getInputProps }) => (
            <section>
              <div className="ds-avatar" {...getRootProps()}>
                <input {...getInputProps()} />
                {this.renderAvatar()}
              </div>
              {type === 'logo' && open && <ImagePicker source={url} onApply={this.handleApply} />}
            </section>
          )}
        </Dropzone>
      )
    }

    return (
      <div className="item-name">
        {this.renderAvatar()}
        {!isEmpty(name) && type === 'initial' && (
          <div className="item-name-modal">
            <div className="dsl-b12 text-400" onClick={this.handleClick}>
              {name}
            </div>
          </div>
        )}
      </div>
    )
  }
}

Avatar.propTypes = {
  className: PropTypes.string,
  url: PropTypes.string,
  name: PropTypes.string,
  size: PropTypes.oneOf(['extraTiny', 'tiny', 'small', 'regular', 'medium', 'large', 'extraLarge']),
  type: PropTypes.oneOf(['initial', 'logo']),
  upload: PropTypes.bool,
  borderColor: PropTypes.string,
  backgroundColor: PropTypes.string,
  borderWidth: PropTypes.number,
  onDrop: PropTypes.func,
  onToggle: PropTypes.func,
}

Avatar.defaultProps = {
  className: '',
  url: '/images/default.png',
  name: '',
  backgroundColor: '#4F4487',
  size: 'tiny',
  type: 'initial',
  upload: false,
  borderColor: 'transparent',
  borderWidth: 0,
  onDrop: () => {},
  onToggle: () => {},
}

export default Avatar

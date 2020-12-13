import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Dropzone from 'react-dropzone'
import { equals, isEmpty } from 'ramda'
import classNames from 'classnames'
import { Button, Icon } from '@components'
import './Upload.scss'

class Upload extends Component {
  state = { items: [] }

  handleClick = () => {}

  handleDrop = e => {
    this.props.onDrop(e)
    this.setState({ items: e })
    if (e.length > 0) {
      const reader = new FileReader()
      reader.addEventListener('load', () => {
        this.props.onRead(reader.result)
      })
      reader.readAsDataURL(e[0])
    }
  }

  render() {
    const { items } = this.state
    const { accept, title, icon, className, size, color, multiple, type, dataCy } = this.props

    return (
      <Dropzone className="drag-drop" onDrop={this.handleDrop} accept={accept} multiple={multiple} noClick noKeyboard>
        {({ getRootProps, getInputProps, open }) => (
          <div className={classNames('ds-upload', className)} data-cy={dataCy}>
            <div {...getRootProps({ className: 'dropzone' })}>
              <input {...getInputProps()} />
              {(multiple || items.length === 0) && (
                <Button className="mx-auto" type={type} onClick={open}>
                  {!isEmpty(icon) && <Icon name={`${icon} mr-2`} size={size} color={color} />}
                  <span className={`dsl-b${size}`} style={{ color }}>
                    {title}
                  </span>
                </Button>
              )}
            </div>
            {items.map((item, index) => (
              <div className="d-flex align-items-center" key={`attachment-${index}`}>
                <a className={`dsl-b${size} ml-2`} style={{ color }} href={item.preview} target="_blank">
                  {item.name}
                </a>
                <Icon
                  name="fal fa-trash-alt ml-3"
                  color="#969faa"
                  size={12}
                  onClick={() => this.setState({ items: [] })}
                />
              </div>
            ))}
          </div>
        )}
      </Dropzone>
    )
  }
}

Upload.propTypes = {
  accept: PropTypes.string,
  title: PropTypes.string.isRequired,
  icon: PropTypes.string,
  className: PropTypes.string,
  size: PropTypes.number,
  color: PropTypes.string,
  multiple: PropTypes.bool,
  type: PropTypes.oneOf(['high', 'medium', 'low', 'link']),
  onDrop: PropTypes.func,
  onRead: PropTypes.func,
}

Upload.defaultProps = {
  accept: '',
  title: 'Upload',
  icon: 'fal fa-upload',
  className: '',
  size: 16,
  color: '#969faa',
  multiple: false,
  type: 'link',
  onDrop: () => {},
  onRead: () => {},
}

export default Upload

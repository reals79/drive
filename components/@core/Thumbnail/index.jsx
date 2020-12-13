import React from 'react'
import PropTypes from 'prop-types'
import ReactPlayer from 'react-player'
import Dropzone from 'react-dropzone'
import { is, isNil, isEmpty, includes } from 'ramda'
import classNames from 'classnames'
import { Icon, ImagePicker } from '@components'
import { convertUrl } from '~/services/util'
import './Thumbnail.scss'

class Thumbnail extends React.Component {
  state = { src: null }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (isEmpty(prevState.src) && !isEmpty(nextProps.src) && !is(Object, nextProps.src)) {
      return { src: nextProps.src }
    }
    return null
  }

  handleApply = e => {
    this.setState({ src: e })
  }

  handleCropComplete = e => {
    this.props.onSubmit(e)
  }

  handleDrop = e => {
    this.props.onDrop(e[0])
    this.setState({ src: e[0] })
    if (e.length > 0) {
      const reader = new FileReader()
      reader.addEventListener('load', () => {
        this.props.onSubmit(reader.result)
        this.setState({ src: reader.result })
      })
      reader.readAsDataURL(e[0])
    }
  }

  render() {
    const { className, size, type, overlay, src, label, accept, onClick, dataCy } = this.props
    const isIcon = !isNil(src) && includes('fa-', src)

    if (type === 'upload') {
      return (
        <Dropzone
          className="drag-drop"
          data-cy="dropzone-image-selector"
          activeClassName="drag-drop active"
          acceptClassName="drag-drop active"
          rejectClassName="drag-drop deactivate"
          accept={accept}
          multiple={false}
          onDrop={this.handleDrop}
        >
          {({ getRootProps, getInputProps }) => (
            <section data-cy={dataCy}>
              <div className={classNames('ds-thumbnail', size, className)} {...getRootProps()}>
                <input {...getInputProps()} />
                <div
                  className="image"
                  style={
                    isEmpty(this.state.src)
                      ? { backgroundColor: '$light' }
                      : accept === 'image/*'
                      ? { backgroundImage: `url('${this.state.src}')` }
                      : {}
                  }
                >
                  {(isNil(this.state.src) || isEmpty(this.state.src)) && (
                    <div className="placeholder">
                      <Icon name="fal fa-file-upload" color="#376caf" />
                      {!isEmpty(label) && <span className="dsl-p16">{label}</span>}
                    </div>
                  )}
                  {includes('video', accept) && this.state.src && (
                    <ReactPlayer
                      id="ds-video"
                      className="video-player"
                      playing={true}
                      url={this.state.src}
                      controls
                      width="100%"
                      height="100%"
                      config={{
                        file: {
                          attributes: {
                            controlsList: 'nodownload',
                          },
                        },
                        youtube: {
                          playerVars: { showinfo: 1 },
                          preload: true,
                        },
                      }}
                    />
                  )}
                </div>
              </div>
              {accept === 'image/*' && (
                <ImagePicker
                  source={this.state.src}
                  type="3"
                  returnBy="DataURL"
                  onApply={this.handleApply}
                  onComplete={this.handleCropComplete}
                />
              )}
            </section>
          )}
        </Dropzone>
      )
    }

    return (
      <div className={classNames('ds-thumbnail', size, className)} onClick={onClick} data-cy={dataCy}>
        {isIcon ? (
          <div className="icon">
            <Icon name={src} color="#969faa" />
            {!isEmpty(label) && <p className="label">{label}</p>}
          </div>
        ) : (
          <div className="image" style={{ backgroundImage: `url('${convertUrl(src)}')` }} />
        )}
        {overlay}
      </div>
    )
  }
}

Thumbnail.propTypes = {
  className: PropTypes.string,
  type: PropTypes.oneOf(['default', 'upload']),
  size: PropTypes.oneOf(['tiny', 'small', 'regular', 'medium', 'large', 'responsive']),
  src: PropTypes.any,
  label: PropTypes.string,
  overlay: PropTypes.node,
  accept: PropTypes.string,
  onDrop: PropTypes.func,
  onSubmit: PropTypes.func,
  onClick: PropTypes.func,
}

Thumbnail.defaultProps = {
  className: '',
  type: 'default',
  size: 'small',
  src: '/images/no-image.jpg',
  label: '',
  accept: 'image/*',
  onDrop: () => {},
  onSubmit: () => {},
  onClick: () => {},
}

export default Thumbnail

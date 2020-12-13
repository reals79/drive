import React from 'react'
import PropTypes from 'prop-types'
import Dropzone from 'react-dropzone'
import classNames from 'classnames'
import { Icon } from '@components'
import { noop } from '~/services/util'
import './UploadForm.scss'

class UploadForm extends React.PureComponent {
  state = { src: this.props.src }

  handleDrop = e => {
    const url = URL.createObjectURL(e[0])
    this.props.onDrop(e[0])
    this.setState({ src: url })
  }

  renderPreview = () => {
    return <div className="image" style={{ backgroundImage: `url('${this.state.src}')` }} />
  }

  renderUploader = () => {
    const { size, title } = this.props
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
            <div className={classNames('ds-upload-form placeholder', size)} {...getRootProps()}>
              <input {...getInputProps()} />
              {this.state.src && this.renderPreview()}
              {!this.state.src && (
                <div className="d-flex align-items-center">
                  <Icon name="fal fa-file-upload" color="#376caf" />
                  {title && <span className="dsl-p12 ml-1">{title}</span>}
                </div>
              )}
            </div>
          </section>
        )}
      </Dropzone>
    )
  }

  render() {
    const { label, className } = this.props
    if (label) {
      return (
        <div className={`core-input horizontal ${className}`}>
          <div className="core-input-label">{label}</div>
          <div className="core-input-content">{this.renderUploader()}</div>
        </div>
      )
    }

    return this.renderUploader()
  }
}

UploadForm.propTypes = {
  className: PropTypes.string,
  size: PropTypes.oneOf(['tiny', 'small', 'regular', 'medium', 'large', 'responsive']),
  title: PropTypes.string,
  label: PropTypes.string,
  onDrop: PropTypes.func,
}

UploadForm.defaultProps = {
  className: '',
  size: 'small',
  title: '',
  label: '',
  onDrop: noop,
}

export default UploadForm

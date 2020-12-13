import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import ReactCrop from 'react-image-crop'
import { Modal } from 'react-bootstrap'
import { equals, isNil } from 'ramda'
import { Button, CheckBox } from '@components'
import './ImagePicker.scss'

const DEFAULTCROPS = {
  1: { unit: '%', width: 30, aspect: 1 },
  2: { unit: '%', width: 30, aspect: 4 / 3 },
  3: { unit: '%', width: 30, aspect: 16 / 9 },
  4: { unit: '%', width: 1145, aspect: 1145 / 229 }, // for cover image
}

class ImagePicker extends PureComponent {
  state = {
    checked: this.props.type,
    crop: DEFAULTCROPS[this.props.type],
    submitted: false,
    source: this.props.source,
  }

  componentDidUpdate(prevProps, prevState) {
    if (!equals(this.props.source, prevProps.source) && !equals(this.state.source, this.props.source)) {
      this.setState({ submitted: false })
    }
  }

  async makeClientCrop(crop) {
    if (this.imageRef && crop.width && crop.height) {
      const croppedImageUrl = await this.getCroppedImg(this.imageRef, crop, 'newFile.jpeg')
      this.setState({ croppedImageUrl })
    }
  }

  getCroppedImg(image, crop, fileName) {
    const canvas = document.createElement('canvas')
    const scaleX = image.naturalWidth / image.width
    const scaleY = image.naturalHeight / image.height
    canvas.width = crop.width
    canvas.height = crop.height
    const ctx = canvas.getContext('2d')

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    )

    return new Promise((resolve, reject) => {
      canvas.toBlob(blob => {
        if (!blob) {
          //reject(new Error('Canvas is empty'));
          console.error('Canvas is empty')
          return
        }
        blob.name = fileName
        window.URL.revokeObjectURL(this.fileUrl)
        this.fileUrl = window.URL.createObjectURL(blob)
        resolve(this.fileUrl)
      }, 'image/jpeg')
    })
  }

  getCroppedBlob(image, crop, fileName) {
    const canvas = document.createElement('canvas')
    const scaleX = image.naturalWidth / image.width
    const scaleY = image.naturalHeight / image.height
    canvas.width = crop.width
    canvas.height = crop.height
    const ctx = canvas.getContext('2d')

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    )

    return new Promise((resolve, reject) => {
      if (this.props.returnBy === 'Blob') {
        canvas.toBlob(blob => {
          if (!blob) {
            console.error('Canvas is empty')
            resolve(null)
            return
          }
          blob.name = fileName
          resolve(blob)
        }, 'image/jpeg')
      } else {
        const base64Image = canvas.toDataURL('image/jpeg')
        resolve(base64Image)
      }
    })
  }

  // If you setState the crop in here you should return false.
  handleImageLoaded = image => {
    this.imageRef = image
  }

  handleCropComplete = crop => {
    this.makeClientCrop(crop)
  }

  handleCropChange = (crop, percentCrop) => {
    // You could also use percentCrop:
    // this.setState({ crop: percentCrop });
    this.setState({ crop })
  }

  handleApply = async () => {
    this.handleCropComplete(this.state.crop)
    this.handleHide()
    this.setState({ source: this.state.croppedImageUrl })
    if (this.props.onApply) {
      this.props.onApply(this.state.croppedImageUrl)
    }
    if (this.props.onComplete) {
      const blob = await this.getCroppedBlob(this.imageRef, this.state.crop, 'newFile.jpeg')
      this.props.onComplete(blob)
    }
  }

  handleCancel = () => {
    this.handleHide()
  }

  handleHide = () => {
    this.setState({ submitted: true })
  }

  handleCheck = id => e => {
    this.setState({ checked: id, crop: DEFAULTCROPS[id] })
  }

  render() {
    const { source, disabled } = this.props
    const { checked, crop, submitted } = this.state
    const show = !isNil(source) && !submitted && source !== '/images/default.png'

    return (
      <div className="ds-imagepicker">
        <Modal className="ds-crop-modal" show={show} size="lg" centered onHide={this.handleHide}>
          <div className="crop-content">
            <ReactCrop
              src={source}
              crop={crop}
              ruleOfThirds
              onImageLoaded={this.handleImageLoaded}
              onComplete={this.handleCropComplete}
              onChange={this.handleCropChange}
            />
            <div className="d-flex justify-content-between pb-2">
              <div className="d-flex ml-3">
                {!disabled && (
                  <>
                    <CheckBox
                      id="crop1"
                      className="mr-3"
                      checked={checked === '1'}
                      size="regular"
                      title="1 : 1"
                      onChange={this.handleCheck('1')}
                    />
                    <CheckBox
                      id="crop2"
                      className="mr-3"
                      checked={checked === '2'}
                      size="regular"
                      title="4 : 3"
                      onChange={this.handleCheck('2')}
                    />
                    <CheckBox
                      id="crop3"
                      checked={checked === '3'}
                      size="regular"
                      title="16 : 9"
                      onChange={this.handleCheck('3')}
                    />
                  </>
                )}
              </div>
              <div className="d-flex">
                <Button type="medium" className="mr-2" name="Cancel" onClick={this.handleCancel} />
                <Button className="ml-2 mr-3" name="Apply" onClick={this.handleApply} />
              </div>
            </div>
          </div>
        </Modal>
      </div>
    )
  }
}

ImagePicker.propTypes = {
  source: PropTypes.any.isRequired,
  type: PropTypes.oneOf(['1', '2', '3', '4']),
  disabled: PropTypes.bool,
  returnBy: PropTypes.oneOf(['Blob', 'DataURL']),
}

ImagePicker.defaultProps = {
  source: null,
  type: '1',
  disabled: false,
  returnBy: 'Blob',
}

export default ImagePicker

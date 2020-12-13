import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import PropTypes from 'prop-types'
import { Button, ImagePicker, Upload } from '@components'
import VendorActions from '~/actions/vendor'
import { blobToBase64 } from '~/services/util'
import './UploadBackgroundImage.scss'

const UploadBackgroundImage = ({ entity, callback, onClose }) => {
  const dispatch = useDispatch()

  const [file, setFile] = useState(null)

  const handleOnRead = e => {
    setFile(e)
  }

  const handleApply = async e => {
    const croppedImg = await blobToBase64(e)
    const payload = {
      data: {
        entity_id: entity,
        image_type: 'cover',
        cropped_image: croppedImg,
      },
      callback,
    }
    dispatch(VendorActions.savevrphotoRequest(payload))
    onClose()
  }

  return (
    <div className="upload-background-image-modal">
      <div className="modal-header">
        <p className="dsl-w14 m-0">Upload Background Image</p>
      </div>
      <div className="modal-body p-4">
        <p className="dsl-m12">
          Please select the new hero image (background) file from your computer and upload it here.
        </p>
        <div className="d-flex">
          <p className="dsl-b14 mr-3 mb-0">File: </p>
          <Upload title="Select file" icon="far fa-file-import" color="#376caf" size={16} onRead={handleOnRead} />
        </div>
        <div className="d-h-end pt-4">
          <Button type="link" className="ml-2" name="CANCEL" onClick={onClose} />
          <Button type="medium" name="UPLOAD" disabled={!file} />
        </div>
      </div>
      {file && <ImagePicker disabled source={file} type="4" onComplete={handleApply} />}
    </div>
  )
}

UploadBackgroundImage.propTypes = {
  entity: PropTypes.number,
  callback: PropTypes.func,
  onClose: PropTypes.func,
}

UploadBackgroundImage.defaultProps = {
  entity: 0,
  callback: () => {},
  onClose: () => {},
}

export default UploadBackgroundImage

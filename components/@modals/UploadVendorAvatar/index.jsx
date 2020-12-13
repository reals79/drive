import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import PropTypes from 'prop-types'
import { Button, ImagePicker, Upload } from '@components'
import VendorActions from '~/actions/vendor'
import { blobToBase64 } from '~/services/util'
import './UploadVendorAvatar.scss'

const UploadVendorAvatar = ({ entity, userId, callback, onClose }) => {
  const dispatch = useDispatch()

  const [file, setFile] = useState(null)

  const handleOnRead = e => {
    setFile(e)
  }

  const handleUploadImage = async e => {
    const croppedImg = await blobToBase64(e)
    const after = userId
      ? {
          type: 'POSTUPLOADAVATAR_REQUEST',
          payload: {
            data: {
              id: userId,
              type: 'user',
              cropped_image: croppedImg,
            },
          },
        }
      : null
    const payload = {
      data: {
        entity_id: entity,
        image_type: 'avatar',
        cropped_image: croppedImg,
      },
      after,
      callback,
    }
    dispatch(VendorActions.savevrphotoRequest(payload))
    onClose()
  }

  return (
    <div className="upload-avatar-image-modal">
      <div className="modal-header">
        <p className="dsl-w14 m-0">Upload Avatar</p>
      </div>
      <div className="modal-body p-4">
        <p className="dsl-m12">Please select the new avatar file from your computer and upload it here.</p>
        <div className="d-flex">
          <p className="dsl-b14 mr-3 mb-0">File: </p>
          <Upload title="Select file" icon="far fa-file-import" color="#376caf" size={16} onRead={handleOnRead} />
        </div>
        <div className="d-h-end pt-4">
          <Button type="link" className="ml-2" name="CANCEL" onClick={onClose} />
          <Button type="medium" name="UPLOAD" disabled={!file} />
        </div>
      </div>
      {file && <ImagePicker source={file} type="1" disabled onComplete={handleUploadImage} />}
    </div>
  )
}

UploadVendorAvatar.propTypes = {
  entity: PropTypes.number,
  userId: PropTypes.number,
  callback: PropTypes.func,
  onClose: PropTypes.func,
}

UploadVendorAvatar.defaultProps = {
  entity: 0,
  userId: 0,
  callback: () => {},
  onClose: () => {},
}

export default UploadVendorAvatar

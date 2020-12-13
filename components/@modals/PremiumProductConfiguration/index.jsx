import React, { memo, useState } from 'react'
import PropTypes from 'prop-types'
import { useSelector, useDispatch } from 'react-redux'
import { Button, Icon, Input, Rating, StepBar, Thumbnail, Upload } from '@components'
import CompanyActions from '~/actions/company'
import VenActions from '~/actions/vendor'
import './PremiumProductConfiguration.scss'

const PremiumConfiguration = ({ onClose }) => {
  const md = useSelector(state => state.app.modalData)
  const data = md?.before
  const product = data?.product
  const stats = product?.stats
  const after = md?.after

  const [current, setCurrent] = useState(1)
  const [title, setTitle] = useState(product?.name || '')
  const [thumbnail, setThumbnail] = useState('')
  const [phone, setPhone] = useState(product?.data?.contact?.phone || '')
  const [website, setWebsite] = useState(product?.data?.website || '')
  const [chat, setChat] = useState('')
  const [email, setEmail] = useState('')
  const [description, setDescription] = useState(product?.data?.description || '')
  const [uploadTitle1, setUploadTitle1] = useState('')
  const [uploadFile1, setUploadFile1] = useState(null)
  const [uploadTitle2, setUploadTitle2] = useState('')
  const [uploadFile2, setUploadFile2] = useState(null)

  const dispatch = useDispatch()
  const callback = () => {
    const isVR = !!product.slug
    const payload = {
      companyId: product.id,
      businessId: product.business_id,
      type: isVR ? 'vr' : 'hcm',
    }
    dispatch(VenActions.getvendorcompanyRequest(payload))
    dispatch(CompanyActions.getbusinessRequest({ id: data.data.id }))
  }
  const handleClear = () => {
    setTitle('')
    setThumbnail('')
    setPhone('')
    setWebsite('')
    setChat('')
    setEmail('')
    setDescription('')
    setUploadTitle1('')
    setUploadFile1('')
    setUploadTitle2('')
    setUploadFile2('')
  }
  const handleSave = () => {
    const payload = {
      product: {
        ...product,
        parent_id: product?.parent_id,
        name: title,
        data: {
          ...product?.data,
          contact: { email, phone },
          description,
          website,
        },
      },
    }
    dispatch(VenActions.postsaveproductRequest(payload, callback, after))
    onClose()
  }

  return (
    <div className="premium-configuration-modal">
      <div className="modal-header">
        <span className="dsl-w16">Premium Product Configuration</span>
      </div>
      <div className="modal-body">
        <StepBar step={current} maxSteps={2} className="mb-3" />

        <div className="mt-3">
          <div className="d-flex align-items-end mb-3">
            <Input className="edit-plus-title" placeholder="Type here..." value={title} onChange={e => setTitle(e)} />
            <div className="d-flex mb-1">
              <Icon name="fa fa-check-circle ml-2" color="green" size={14} />
              <span className="dsl-m12 ml-1">Claimed</span>
            </div>
          </div>
          <div className="d-flex">
            <div className="d-flex-1 mr-1">
              <Thumbnail
                type="upload"
                src={thumbnail}
                size="responsive"
                accept="video/*"
                onDrop={e => setThumbnail(e)}
              />
            </div>
            <div className="d-flex-1 mx-1">
              <Thumbnail
                type="upload"
                src={thumbnail}
                size="responsive"
                accept="video/*"
                onDrop={e => setThumbnail(e)}
              />
            </div>
            <div className="d-flex d-flex-1 ml-1">
              <div className="d-flex-1 mr-1">
                <Thumbnail
                  className="mb-1"
                  type="upload"
                  src={thumbnail}
                  size="responsive"
                  accept="video/*"
                  onDrop={e => setThumbnail(e)}
                />
                <Thumbnail
                  className="mt-1"
                  type="upload"
                  src={thumbnail}
                  size="responsive"
                  accept="video/*"
                  onDrop={e => setThumbnail(e)}
                />
              </div>
              <div className="d-flex-1 ml-1">
                <Thumbnail
                  className="mb-1"
                  type="upload"
                  src={thumbnail}
                  size="responsive"
                  accept="video/*"
                  onDrop={e => setThumbnail(e)}
                />
                <Thumbnail
                  className="mt-1"
                  type="upload"
                  src={thumbnail}
                  size="responsive"
                  accept="video/*"
                  onDrop={e => setThumbnail(e)}
                />
              </div>
            </div>
          </div>
          <div className="d-flex">
            <div className="d-flex-1 mt-3 mr-3">
              <div className="border-bottom mr-4">
                <p className="dsl-b18 bold">Ratings</p>
                <div className="d-flex">
                  <Rating score={Number(stats?.rating_avg || 0).toFixed(2)} size="medium" />
                </div>
                <p className="dsl-b18 bold mt-2">{stats?.rating_recommended_avg.toFixed(2)}% Recommended</p>
                <p className="dsl-b14 mt-5">{stats?.rating_count} Verified Ratings</p>
                <p className="dsl-b14 mt-1">By {stats?.rating_dealership_count} Verified Dealership</p>
              </div>

              <p className="dsl-b20 bold mt-5">Contact</p>
              <div className="contact mt-4">
                <Icon name="fal fa-phone-alt head" color="dark" size={14} />
                <Input
                  className="edit-plus-title"
                  placeholder="Type here..."
                  value={phone}
                  onChange={e => setPhone(e)}
                />
              </div>
              <div className="contact mt-4">
                <Icon name="fal fa-window-maximize head" color="dark" size={14} />
                <Input
                  className="edit-plus-title"
                  placeholder="Type here..."
                  value={website}
                  onChange={e => setWebsite(e)}
                />
              </div>
              <div className="contact mt-4">
                <Icon name="fal fa-comment head" color="dark" size={14} />
                <Input className="edit-plus-title" placeholder="Type here..." value={chat} onChange={e => setChat(e)} />
              </div>
              <div className="contact mt-4">
                <Icon name="fal fa-envelope head" color="dark" size={14} />
                <Input
                  className="edit-plus-title"
                  placeholder="Type here..."
                  value={email}
                  onChange={e => setEmail(e)}
                />
              </div>
            </div>
            <div className="d-flex-2">
              <p className="dsl-b18 bold mt-3">About</p>
              <Input
                className="edit-description"
                placeholder="Type here..."
                value={description}
                as="textarea"
                rows={10}
                onChange={e => setDescription(e)}
              />
              <div className="border-top mt-4 pt-4">
                <p className="dsl-b18 bold mt-3">Offers</p>
                <div className="d-flex">
                  <div className="border border-5 mr-3 p-3">
                    <Input
                      className="edit-plus-title"
                      placeholder="Type here..."
                      value={uploadTitle1}
                      onChange={e => setUploadTitle1(e)}
                    />
                    <Upload
                      className="upload"
                      size={14}
                      icon=""
                      multiple={false}
                      color="#376caf"
                      title="UPLOAD"
                      onRead={e => setUploadFile1(e)}
                    />
                    <p className="dsl-d12 text-center">Upload PDF file</p>
                  </div>

                  <div className="border border-5 ml-3 p-3">
                    <Input
                      className="edit-plus-title"
                      placeholder="Type here..."
                      value={uploadTitle2}
                      onChange={e => setUploadTitle2(e)}
                    />
                    <Upload
                      className="upload"
                      size={14}
                      icon=""
                      multiple={false}
                      color="#376caf"
                      title="UPLOAD"
                      onRead={e => setUploadFile2(e)}
                    />
                    <p className="dsl-d12 text-center">Upload PDF file</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-footer">
        <Button type="medium" name="CLEAR" onClick={handleClear} />
        <Button name="SAVE" onClick={handleSave} />
      </div>
    </div>
  )
}

PremiumConfiguration.propTypes = {
  title: PropTypes.string,
  body: PropTypes.string,
  info: PropTypes.string,
  yes: PropTypes.string,
  no: PropTypes.string,
  onYes: PropTypes.func,
  onNo: PropTypes.func,
}

PremiumConfiguration.defaultProps = {
  title: '',
  body: '',
  info: '',
  yes: 'Yes',
  no: 'No',
  onYes: () => {},
  onNo: () => {},
}

export default memo(PremiumConfiguration)

import React, { memo, useState } from 'react'
import PropTypes from 'prop-types'
import { useSelector, useDispatch } from 'react-redux'
import { Button, Icon, Input, Rating, StepBar, Thumbnail } from '@components'
import CompanyActions from '~/actions/company'
import VenActions from '~/actions/vendor'
import './PlusProductConfiguration.scss'

const PlusConfiguration = ({ onClose }) => {
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
  const [email, setEmail] = useState(product?.data?.contact?.email || '')
  const [description, setDescription] = useState(product?.data?.description || '')

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
    <div className="plus-configuration-modal">
      <div className="modal-header">
        <span className="dsl-w16">Plus Product Configuration</span>
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
              <Thumbnail
                className="mt-3"
                type="upload"
                src={thumbnail}
                size="responsive"
                accept="video/*"
                onDrop={e => setThumbnail(e)}
              />
              <p className="dsl-b18 bold mt-3">About</p>
              <Input
                className="edit-description"
                placeholder="Type here..."
                value={description}
                as="textarea"
                rows={10}
                onChange={e => setDescription(e)}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="modal-footer">
        <Button type="medium" name="CLEAR" onClick={handleClear} />
        <Button className="ml-3" name="SAVE" onClick={handleSave} />
      </div>
    </div>
  )
}

PlusConfiguration.propTypes = {
  title: PropTypes.string,
  body: PropTypes.string,
  info: PropTypes.string,
  yes: PropTypes.string,
  no: PropTypes.string,
  onYes: PropTypes.func,
  onNo: PropTypes.func,
}

PlusConfiguration.defaultProps = {
  title: '',
  body: '',
  info: '',
  yes: 'Yes',
  no: 'No',
  onYes: () => {},
  onNo: () => {},
}

export default memo(PlusConfiguration)

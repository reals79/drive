import React, { memo, useState } from 'react'
import PropTypes from 'prop-types'
import { useSelector, useDispatch } from 'react-redux'
import { Row, Col } from 'react-bootstrap'
import { Accordion, Button, Dropdown, Icon, Input, Rating, StepBar } from '@components'
import CompanyActions from '~/actions/company'
import VenActions from '~/actions/vendor'
import { EXPOSURE_LEVELS } from '~/services/constants'
import './BasicProductConfiguration.scss'

const BasicConfiguration = ({ onClose }) => {
  const dispatch = useDispatch()

  const categories = useSelector(state => state.vendor.categories.all)
  const md = useSelector(state => state.app.modalData)
  const data = md?.before
  const company = data?.company
  const product = data?.product
  const stats = product?.stats
  const after = md?.after

  const [current, setCurrent] = useState(1)
  const [title, setTitle] = useState(product?.name || '')
  const [description, setDescription] = useState(product?.data?.description || '')
  const [category, setCategory] = useState(product?.data?.category || 0)

  const callback = () => {
    const isVR = !!product.slug
    const payload = {
      companyId: company.id,
      businessId: company.business_id,
      type: isVR ? 'vr' : 'hcm',
    }
    dispatch(VenActions.getvendorcompanyRequest(payload))
    dispatch(CompanyActions.getbusinessRequest({ id: company.business_id }))
  }

  const handleClear = () => {
    setTitle('')
    setDescription('')
    setCategory(0)
  }

  const handleSave = () => {
    const payload = {
      product: {
        ...product,
        parent_id: company?.id,
        name: title,
        data: {
          ...product?.data,
          category,
          description,
        },
      },
    }
    dispatch(VenActions.postsaveproductRequest(payload, callback, after))
    onClose()
  }

  return (
    <div className="plus-configuration-modal">
      <div className="modal-header">
        <span className="dsl-w16">Basic Product Configuration</span>
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
            </div>
            <div className="d-flex-2">
              <p className="dsl-b18 bold mt-3">About</p>
              <Input
                className="edit-description"
                placeholder="Type here..."
                value={description}
                as="textarea"
                rows={6}
                onChange={e => setDescription(e)}
              />
            </div>
          </div>
        </div>
        <div className="mt-3">
          <Accordion expanded size="small" type="primary">
            <Row className="mx-0">
              <Col xs={6} className="p-0">
                <Dropdown
                  title="Category"
                  width="fit-content"
                  direction="vertical"
                  defaultIds={[category]}
                  data={categories}
                  getValue={e => e.name}
                  onChange={e => setCategory(e[0])}
                />
              </Col>
              <Col xs={6} className="p-0">
                <Dropdown
                  disabled
                  direction="vertical"
                  data={EXPOSURE_LEVELS}
                  defaultIds={['wiki']}
                  title="Exposure Level"
                  width="fit-content"
                  getId={e => e.value}
                  getValue={e => e.label}
                />
              </Col>
            </Row>
          </Accordion>
        </div>
      </div>
      <div className="modal-footer">
        <div className="d-h-end d-flex-2">
          <Button type="medium" name="CLEAR" onClick={handleClear} />
          <Button className="ml-3" name="SAVE" onClick={handleSave} />
        </div>
      </div>
    </div>
  )
}

BasicConfiguration.propTypes = {
  title: PropTypes.string,
  body: PropTypes.string,
  info: PropTypes.string,
  yes: PropTypes.string,
  no: PropTypes.string,
  onYes: PropTypes.func,
  onNo: PropTypes.func,
}

BasicConfiguration.defaultProps = {
  title: '',
  body: '',
  info: '',
  yes: 'Yes',
  no: 'No',
  onYes: () => {},
  onNo: () => {},
}

export default memo(BasicConfiguration)

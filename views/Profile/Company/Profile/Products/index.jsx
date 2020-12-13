import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useParams } from 'react-router-dom'
import { Tabs, Tab } from 'react-bootstrap'
import queryString from 'query-string'
import { find, propEq } from 'ramda'
import { toast } from 'react-toastify'
import { EditDropdown } from '@components'
import VendorAction from '~/actions/vendor'
import { UserRoles } from '~/services/config'
import DetailAll from './Tabs/DetailAll'
import DetailPremium from './Tabs/DetailPremium'
import DetailPlus from './Tabs/DetailPlus'
import DetailBasic from './Tabs/DetailBasic'
import EditAll from './Tabs/EditAll'
import EditPremium from './Tabs/EditPremium'
import EditPlus from './Tabs/EditPlus'
import EditBasic from './Tabs/EditBasic'

const Products = ({ data }) => {
  if (!data.products || data.products.length === 0) {
    return (
      <div className="mt-5">
        <p className="dsl-m12 text-center">No products</p>
      </div>
    )
  }

  const location = useLocation()
  const { field } = useParams()

  const initialTab = field || location?.state?.product?.id || data.products[0].id
  const [active, setActive] = useState(initialTab)

  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(VendorAction.getcategoriesRequest({ isCategory: true }))
    dispatch(VendorAction.getpopularproductsRequest())
  }, [])

  const [editable, setEditable] = useState(false)
  const handleCancel = () => {
    setEditable(false)
  }
  const handleEdit = e => {
    if (e === 'edit') {
      setEditable(true)
    } else {
    }
  }

  const userRole = useSelector(state => state.app.primary_role_id)
  const userId = useSelector(state => state.app.id)
  const isProductAdmin = find(propEq('hcm_user_id', userId), data?.admins)
  const isAdmin = isProductAdmin || userRole < UserRoles.ADMIN

  const values = queryString.parse(location.search)
  const handleSaveProduct = (
    e,
    image = null,
    submitted,
    document = null,
    docName = '',
    video1 = null,
    video2 = null,
    video3 = null,
    video4 = null,
    video5 = null,
    video6 = null
  ) => {
    const product = find(propEq('id', e.product.id), data?.products)
    // if (isNil(e.product.data.category)) e.product.data.category = Number(values.category)
    const after = {
      type: 'GETBUSINESS_REQUEST',
      payload: {
        id: data?.business_id,
      },
    }
    dispatch(
      VendorAction.postsaveproductRequest(
        e,
        () => {
          setEditable(submitted)
          toast.success('Your product has been updated successfully.', {
            position: toast.POSITION.TOP_CENTER,
            pauseOnFocusLoss: false,
            hideProgressBar: true,
          })
        },
        after
      )
    )
    if (image) {
      let payload = null
      let deletePayload = null
      if (image?.type?.includes('video')) {
        payload = { product_id: e.product.id, name: data.name, type: 'video', video: image }
        deletePayload = { product_id: product.id, media_id: product.videos[0]?.id }
      } else {
        payload = { product_id: e.product.id, name: data.name, type: 'media', file: image }
        deletePayload = { product_id: product.id, media_id: product.media[0]?.id }
      }
      dispatch(VendorAction.postsaveproductmediaRequest(payload, deletePayload, after))
    }
    if (video1) {
      let payload = null
      payload = { product_id: e.product.id, name: data.name, type: 'video', video: video1 }
      const deletePayload = { product_id: product.id, media_id: product.videos[0]?.id }
      dispatch(VendorAction.postsaveproductmediaRequest(payload, deletePayload, after))
    }
    if (video2) {
      let payload = null
      payload = { product_id: e.product.id, name: data.name, type: 'video', video: video2 }
      const deletePayload = { product_id: product.id, media_id: product.videos[1]?.id }
      dispatch(VendorAction.postsaveproductmediaRequest(payload, deletePayload, after))
    }
    if (video3) {
      let payload = null
      payload = { product_id: e.product.id, name: data.name, type: 'video', video: video3 }
      const deletePayload = { product_id: product.id, media_id: product.videos[2]?.id }
      dispatch(VendorAction.postsaveproductmediaRequest(payload, deletePayload, after))
    }
    if (video4) {
      let payload = null
      payload = { product_id: e.product.id, name: data.name, type: 'video', video: video4 }
      const deletePayload = { product_id: product.id, media_id: product.videos[3]?.id }
      dispatch(VendorAction.postsaveproductmediaRequest(payload, deletePayload, after))
    }
    if (video5) {
      let payload = null
      payload = { product_id: e.product.id, name: data.name, type: 'video', video: video5 }
      const deletePayload = { product_id: product.id, media_id: product.videos[4]?.id }
      dispatch(VendorAction.postsaveproductmediaRequest(payload, deletePayload, after))
    }
    if (video6) {
      let payload = null
      payload = { product_id: e.product.id, name: data.name, type: 'video', video: video6 }
      const deletePayload = { product_id: product.id, media_id: product.videos[5]?.id }
      dispatch(VendorAction.postsaveproductmediaRequest(payload, deletePayload, after))
    }
    if (document) {
      const payload = { product_id: e.product.id, document_name: docName, type: 'document', document }
      const deletePayload = { product_id: product.id, media_id: product.documents[0]?.id }
      dispatch(VendorAction.postsaveproductmediaRequest(payload, deletePayload, after))
    }
  }

  const handleSaveCompany = (e, thumbnail = null, submitted) => {
    const image = thumbnail
      ? {
          entity_id: data.entity?.id,
          image_type: 'title',
          cropped_image: thumbnail,
        }
      : null
    const after = {
      type: 'GETBUSINESS_REQUEST',
      payload: { id: data.business_id },
    }
    dispatch(
      VendorAction.savevrcompanyRequest({ data: e, image, after }, () => {
        setEditable(submitted)
        toast.success('Your company has been updated successfully.', {
          position: toast.POSITION.TOP_CENTER,
        })
      })
    )
  }

  const handleTab = e => {
    setActive(e)
  }

  const categories = useSelector(state => state.vendor.categories.all)

  return (
    <div className="products">
      <div className="card-header d-flex position-relative">
        <span className="dsl-b22 bold">{data.name} Products</span>
        {active === 'all' && isAdmin && (
          <EditDropdown className="edit-all" options={['Edit', 'Reports']} onChange={handleEdit} />
        )}
      </div>
      <Tabs className="card-content pb-3" defaultActiveKey="recent" activeKey={active} onSelect={handleTab}>
        <Tab eventKey="all" title="All">
          {editable ? (
            <EditAll
              data={data}
              isAdmin={isAdmin}
              categories={categories}
              category={Number(values.category)}
              onSubmit={handleSaveCompany}
            />
          ) : (
            <DetailAll data={data} />
          )}
        </Tab>
        {data.products.map((item, index) => {
          if (item.data.sponsored_level === 'gold') {
            return (
              <Tab eventKey={item.id} title={item.name} key={index}>
                {editable ? (
                  <EditPremium
                    title={item.name}
                    data={item}
                    isAdmin={isAdmin}
                    onEdit={handleEdit}
                    onSubmit={handleSaveProduct}
                    onCancel={handleCancel}
                  />
                ) : (
                  <DetailPremium title={item.name} data={item} isAdmin={isAdmin} onEdit={handleEdit} />
                )}
              </Tab>
            )
          } else if (item.data.sponsored_level === 'silver') {
            return (
              <Tab eventKey={item.id} title={item.name} key={index}>
                {editable ? (
                  <EditPlus
                    title={item.name}
                    isAdmin={isAdmin}
                    data={item}
                    onEdit={handleEdit}
                    onSubmit={handleSaveProduct}
                    onCancel={handleCancel}
                  />
                ) : (
                  <DetailPlus title={item.name} data={item} isAdmin={isAdmin} onEdit={handleEdit} />
                )}
              </Tab>
            )
          } else {
            return (
              <Tab eventKey={item.id} title={item.name} key={index}>
                {editable ? (
                  <EditBasic
                    title={item.name}
                    data={item}
                    isAdmin={isAdmin}
                    onEdit={handleEdit}
                    onSubmit={handleSaveProduct}
                  />
                ) : (
                  <DetailBasic title={item.name} data={item} isAdmin={isAdmin} onEdit={handleEdit} />
                )}
              </Tab>
            )
          }
        })}
      </Tabs>
    </div>
  )
}

export default Products

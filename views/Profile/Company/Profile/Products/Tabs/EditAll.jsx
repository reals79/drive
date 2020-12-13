import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'
import { Row, Col } from 'react-bootstrap'
import { Avatar, Button, Dropdown, EditDropdown, Input, ProgressBar, Thumbnail } from '@components'
import AppActions from '~/actions/app'
import { EXPOSURE_LEVELS } from '~/services/constants'
import { find } from 'ramda'

const EditAll = props => {
  const dispatch = useDispatch()
  const [thumbnail, setThumbnail] = useState(null)
  const [title, setTitle] = useState(props.data.name)
  const [text, setText] = useState(props.data.data.description)
  const [category, setCategory] = props.category ? useState([props.category]) : useState([])
  const [name, setName] = useState('')
  const [level, setLevel] = useState(['wiki'])

  const handleSubmit = () => {
    const { data } = props
    const payload = {
      company: {
        ...data,
        name: title,
        data: {
          ...data.data,
          description: text,
        },
      },
    }
    props.onSubmit(payload, thumbnail, false)
  }

  const handleAddProduct = product => {
    const { data } = props
    const payload = {
      type: 'Basic Product Configuration',
      data: {
        before: { data: null, company: data, product },
        after: {
          type: 'GETBUSINESS_REQUEST',
          payload: { id: data?.business_id },
        },
      },
      callBack: {},
    }
    dispatch(AppActions.modalRequest(payload))
  }

  const handleSelect = product => e => {
    if (e === 'edit') {
      handleAddProduct(product)
    }
  }

  return (
    <div className="card premium-all">
      <Row>
        <Col md={6}>
          <Thumbnail
            type="upload"
            src={thumbnail}
            size="medium"
            onDrop={e => setThumbnail(e)}
            onSubmit={e => setThumbnail(e)}
          />
        </Col>
        <Col md={6}>
          <Input
            title="Title"
            placeholder="Type here..."
            direction="vertical"
            value={title}
            onChange={e => setTitle(e)}
          />
          <Input
            className="mt-3"
            title="Text"
            placeholder="Type here..."
            direction="vertical"
            as="textarea"
            rows={4}
            value={text}
            onChange={e => setText(e)}
          />
        </Col>
      </Row>

      <div className="mt-5">
        <div className="d-h-between">
          <p className="dsl-b24 bold">All Products</p>
          <Button type="link" name="+ Add Product" onClick={() => handleAddProduct()} />
        </div>
        <div className="d-flex border-bottom pb-2 mt-4">
          <div className="d-flex-3">
            <span className="dsl-m12">Name</span>
          </div>
          <div className="d-flex-3">
            <span className="dsl-m12 ml-3">Category</span>
          </div>
          <div className="d-flex-2 ml-3">
            <span className="dsl-m12">Exposure Level</span>
          </div>
          <div className="optimized">
            <span className="dsl-m12">Optimization</span>
          </div>
          <div className="d-flex-1"></div>
        </div>
        {props.data.products.map((item, index) => (
          <div className="d-flex align-items-center border-bottom pb-2 mt-3" key={index}>
            <div className="d-flex d-flex-3 align-items-center">
              <Avatar size="tiny" />
              <span className="dsl-b14 ml-3">{item.name}</span>
            </div>
            <div className="d-flex-3 ml-3">
              <span className="dsl-b14">CRM Variable OPS, CRM Fixed OPS</span>
            </div>
            <div className="d-flex-2 ml-3">
              <span className="dsl-b14">
                {find(e => e.value === props.data.data.sponsored_level, EXPOSURE_LEVELS)?.label}
              </span>
            </div>
            <div className="optimized">
              <ProgressBar className="edit-progress" value={100} />
            </div>
            <div className="d-flex-1">
              {props.isAdmin && <EditDropdown options={['Edit', 'Delete']} onChange={handleSelect(item)} />}
            </div>
          </div>
        ))}
      </div>
      <Button className="ml-auto" name="SAVE" onClick={handleSubmit} />
    </div>
  )
}

export default EditAll

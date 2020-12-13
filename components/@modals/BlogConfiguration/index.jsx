import React, { memo, useState } from 'react'
import PropTypes from 'prop-types'
import { useSelector, useDispatch } from 'react-redux'
import { clone, find, propEq } from 'ramda'
import { Button, Icon, Input, StepBar } from '@components'
import VenActions from '~/actions/vendor'
import './BlogConfiguration.scss'

const BlogConfiguration = ({ onClose }) => {
  const _md = useSelector(state => state.app.modalData)
  const _data = _md?.before?.data
  const businesses = useSelector(state => state.company.business)

  const data = find(propEq('id', _data.id), businesses)
  const blog = _md?.before?.blog
  const initCategories = blog?.data?.blog?.data?.categories || []

  const [current, setCurrent] = useState(1)
  const [name, setName] = useState(blog?.data?.title)
  const [summary, setSummary] = useState(blog?.data?.body)
  const [categories, setCategories] = useState(initCategories)

  const handleAddCategory = () => {
    const temp = clone(categories)
    temp.push('')
    setCategories(temp)
  }
  const handleCategories = (e, index) => {
    const temp = clone(categories)
    temp[index] = e
    setCategories(temp)
  }

  const dispatch = useDispatch()
  const handleSave = () => {
    const payload = {
      data: {
        blog: {
          id: blog?.id,
          entity_id: blog?.entity_id,
          meta: null,
          data: { categories },
          group_id: blog?.group_id,
        },
      },
      after: {
        type: 'GETBUSINESS_REQUEST',
        payload: { id: data.id },
      },
    }
    dispatch(VenActions.saveblogRequest(payload))
  }

  return (
    <div className="blog-configuration-modal">
      <div className="modal-header">
        <span className="dsl-w16">Blog Configuration</span>
      </div>
      <div className="modal-body">
        <StepBar step={current} maxSteps={2} className="mb-3" />
        <p className="dsl-b18 bold mt-5">Blog</p>
        <p className="dsl-d14 py-3 border-bottom">Name your blog, define the categories and departments.</p>

        <Input
          title="Blog title"
          placeholder="Type here..."
          direction="vertical"
          value={name}
          onChange={e => setName(e)}
        />
        <Input
          className="mt-3"
          title="Summary"
          placeholder="Type here..."
          direction="vertical"
          as="textarea"
          rows={2}
          value={summary}
          onChange={e => setSummary(e)}
        />
        <div className="d-flex align-items-center mt-5">
          <span className="dsl-b18 text-400">Blog categories</span>
          <Icon name="fal fa-plus-circle ml-3" color="#969faa" size={16} onClick={handleAddCategory} />
        </div>
        {categories.map((item, index) => (
          <Input
            className="mt-3"
            key={`c${index}`}
            placeholder="Type here..."
            direction="vertical"
            rows={2}
            value={item}
            onChange={e => handleCategories(e, index)}
          />
        ))}
      </div>
      <div className="modal-footer">
        <Button name="SAVE" onClick={handleSave} />
      </div>
    </div>
  )
}

BlogConfiguration.propTypes = {
  title: PropTypes.string,
  body: PropTypes.string,
  info: PropTypes.string,
  yes: PropTypes.string,
  no: PropTypes.string,
  onYes: PropTypes.func,
  onNo: PropTypes.func,
}

BlogConfiguration.defaultProps = {
  title: '',
  body: '',
  info: '',
  yes: 'Yes',
  no: 'No',
  onYes: () => {},
  onNo: () => {},
}

export default memo(BlogConfiguration)

import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col } from 'react-bootstrap'
import ReactQuill from 'react-quill'
import { equals, clone, values } from 'ramda'
import { Button, Dropdown, Icon, Input, Toggle } from '@components'
import { history } from '~/reducers'
import VenActions from '~/actions/vendor'
import './EditBlogPost.scss'

const Modules = {
  toolbar: [
    [{ header: [1, 2, false] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['link', 'image'],
    ['clean'],
  ],
}

const Formats = [
  'header',
  'font',
  'size',
  'bold',
  'italic',
  'underline',
  'strike',
  'blockquote',
  'list',
  'bullet',
  'indent',
  'link',
  'image',
  'color',
]

const VISIBILITY = [
  { id: 1, name: 'Public' },
  { id: 2, name: 'Employee' },
]

const EditBlogPost = ({ data, blog, businessId, userId, callback, type, onClose }) => {
  const dispatch = useDispatch()

  const departments = useSelector(state => state.company.blogCategories)
  const authors = blog?.admins || []
  const categories = blog?.blog_categories ? values(blog.blog_categories) : []

  const [title, setTitle] = useState(data?.name || '')
  const [composer, setComposer] = useState(data?.data?.body || '')
  const [featured, setFeatured] = useState(false)
  const [selected, setSelected] = useState({
    author: [data?.user_id || userId],
    department: data?.data?.categories || [null],
    category: data?.data?.blog_categories,
  })

  const handleSelectTags = key => tags => {
    if (!equals(selected[key], tags)) {
      const newSelected = clone(selected)
      newSelected[key] = tags
      setSelected(newSelected)
    }
  }

  const handleView = () => {
    history.push({
      pathname: '/community/profile/about',
      state: {
        recent: data,
        tab: 'blog',
      },
    })
    onClose()
  }

  const handleSubmit = status => () => {
    const payload = {
      data: {
        post: {
          id: data?.id,
          name: title,
          blog_id: blog?.blog?.id,
          user_id: selected.author[0],
          status: data?.id ? data.status : status,
          data: {
            ...data?.data,
            body: composer,
            blog_categories: selected.category,
            categories: selected.department,
          },
        },
      },
      after: businessId
        ? { type: 'GETBUSINESS_REQUEST', payload: { id: businessId } }
        : { type: 'GETCOMMUNITYUSER_REQUEST', payload: { userId } },
    }
    dispatch(VenActions.saveblogpostRequest(payload))
    onClose()
  }

  const disabled = !selected.author[0] || !selected.department[0] || title === '' || composer === ''

  return (
    <div className="edit-blog-modal">
      <div className="modal-header">
        <Icon name="fal fa-plus-circle" size={12} color="#fff" />
        <span className="dsl-w12 ml-1">{`${data?.id ? 'Edit Blog Post' : 'Add Blog Post'}`}</span>
      </div>
      <div className="modal-body">
        <div className="d-flex align-items-end">
          <Input
            className="d-flex-1"
            title="Title"
            value={title}
            placeholder="Type here..."
            direction="vertical"
            onChange={e => setTitle(e)}
          />
          {type !== 'published' && (
            <Button className="ml-5" type="link" onClick={handleView}>
              <Icon name="far fa-eye" size={12} />
              <span className="dsl-p14 text-400 ml-1">Preview</span>
            </Button>
          )}
        </div>
        <p className="dsl-m12 mt-3">Composer</p>
        <ReactQuill value={composer} modules={Modules} formats={Formats} onChange={e => setComposer(e)} />
        <Row className="mt-3">
          <Col xs={12} sm={6} className="my-3">
            <Dropdown
              title="Author"
              direction="vertical"
              width="fit-content"
              data={authors}
              defaultIds={selected.author}
              getValue={e => `${e.first_name} ${e.last_name}`}
              onChange={handleSelectTags('author')}
            />
          </Col>
          <Col xs={12} sm={6} className="my-3">
            <Dropdown
              multi
              placeholder="Select multiple"
              noOptionLabel="Undefined"
              title="Departments"
              direction="vertical"
              width="fit-content"
              data={departments}
              getValue={e => e.name}
              defaultIds={selected.department}
              onChange={handleSelectTags('department')}
            />
          </Col>
          <Col xs={12} sm={6} className="my-3">
            <Dropdown
              multi
              title="Categories"
              noOptionLabel="Undefined"
              direction="vertical"
              width="fit-content"
              data={categories}
              getId={e => e.name}
              getValue={e => e.name}
              defaultIds={selected.category}
              onChange={handleSelectTags('category')}
            />
          </Col>
          <Col xs={12} sm={6} className="my-3">
            <Dropdown
              title="Visibility"
              direction="vertical"
              width="fit-content"
              data={VISIBILITY}
              defaultIds={[]}
              getValue={e => e.name}
            />
          </Col>
        </Row>
        <Row className="mt-3">
          <Col>
            <Toggle
              checked={featured}
              title="Featured"
              leftLabel="Off"
              rightLabel="On"
              onChange={e => setFeatured(e)}
            />
          </Col>
        </Row>
        <div className="d-flex align-items-center">
          {data?.id ? (
            <>
              <Button className="ml-auto" type="link" name="DISCARD" onClick={() => onClose()} />
              <Button className="ml-2" disabled={disabled} name="SAVE" onClick={handleSubmit(null)} />
            </>
          ) : (
            <>
              <Button className="ml-auto" disabled={disabled} type="link" name="DRAFT" onClick={handleSubmit(2)} />
              <Button className="ml-2" disabled={disabled} name="POST" onClick={handleSubmit(0)} />
            </>
          )}
        </div>
      </div>
    </div>
  )
}

EditBlogPost.propTypes = {
  authors: PropTypes.array,
  departments: PropTypes.array,
  competencies: PropTypes.array,
  categories: PropTypes.array,
  data: PropTypes.any,
  businessId: PropTypes.number,
  blog: PropTypes.shape({
    id: PropTypes.number,
  }),
  userId: PropTypes.number,
  callback: PropTypes.func,
  onClose: PropTypes.func,
}

EditBlogPost.defaultProps = {
  authors: [],
  departments: [],
  competencies: [],
  categories: [],
  data: {},
  businessId: null,
  blog: {
    id: 0,
  },
  userId: null,
  callback: () => {},
  onClose: () => {},
}

export default EditBlogPost

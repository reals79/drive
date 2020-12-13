import React, { memo, useState } from 'react'
import { useDispatch } from 'react-redux'
import PropTypes from 'prop-types'
import { clone, findIndex, keys } from 'ramda'
import { Button, Icon, Input, Dropdown } from '@components'
import VenActions from '~/actions/vendor'
import './AddCategory.scss'

const PublishMenu = [
  { id: 1, name: 'Public' },
  { id: 2, name: 'Employee' },
]

const AddCategory = ({ after, data, index, blog, categoryType, onClose }) => {
  const dispatch = useDispatch()

  const [name, setName] = useState(data?.name)
  const [type, setType] = useState(categoryType)
  const categories = blog.blog_categories ? keys(blog.blog_categories) : []

  const handlePostCategory = () => {
    if (index > -1) categories[index] = name
    else categories.push(name)

    const payload = {
      data: {
        blog: {
          id: blog?.has_blog ? blog.blog?.id : null,
          entity_id: blog?.entity?.id,
          meta: null,
          data: { categories },
          group_id: blog?.entity?.group_id,
        },
      },
      after: after,
    }
    dispatch(VenActions.saveblogRequest(payload))
    onClose()
  }

  const disabled = name === '' || type === null

  return (
    <div className="add-category-modal">
      <div className="modal-header">
        {!data && <Icon name="fal fa-plus-circle" color="#FFF" size={14} />}
        <span className="dsl-w14 pl-2">{`${data ? 'Edit' : 'Add'} Category`}</span>
      </div>
      <div className="modal-body">
        <Input className="mb-3" title="Category name" direction="vertical" value={name} onChange={e => setName(e)} />
        <Dropdown
          className="mb-3"
          title="Publish as"
          direction="vertical"
          width="fit-content"
          data={PublishMenu}
          defaultIds={[type]}
          getValue={e => e.name}
          onChange={e => setType(e[0])}
        />
        <div className="d-h-end">
          <Button name="DISCARD" className="mr-3" type="low" onClick={onClose} />
          <Button name="POST" disabled={disabled} onClick={handlePostCategory} />
        </div>
      </div>
    </div>
  )
}

AddCategory.propTypes = {
  after: PropTypes.any,
  data: PropTypes.shape({
    name: PropTypes.string,
  }),
  blog: PropTypes.shape({
    entity: PropTypes.any,
    blog: PropTypes.shape({
      entity_id: PropTypes.number,
      group_id: PropTypes.number,
      id: PropTypes.number,
    }),
    posts: PropTypes.shape({
      current_page: PropTypes.number,
      data: PropTypes.array,
      last_page: PropTypes.number,
    }),
    has_blog: PropTypes.bool,
  }),
  categoryType: PropTypes.number,
  onClose: PropTypes.func,
}

AddCategory.defaultProps = {
  after: null,
  data: null,
  blog: {
    entity: {},
    blog: {
      entity_id: 0,
      group_id: 0,
      id: 0,
    },
    posts: [],
    has_blog: false,
  },
  categoryType: null,
  onClose: () => {},
}

export default memo(AddCategory)

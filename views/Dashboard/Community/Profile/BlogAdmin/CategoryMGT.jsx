import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'
import { Row, Col } from 'react-bootstrap'
import { values } from 'ramda'
import { Button, EditDropdown, Icon, Pagination } from '@components'
import AppActions from '~/actions/app'
import './BlogAdmin.scss'

const DotsMenu = ['Add Category', 'Delete', 'Edit']

const CategoryMGTHeader = () => (
  <Row className="mx-0">
    <Col xs={3} className="pl-0">
      <p className="dsl-m14 my-2">Category</p>
    </Col>
    <Col xs={1} className="d-h-end">
      <p className="dsl-m14 my-2">posts</p>
    </Col>
    <Col xs={1} className="d-h-end">
      <Icon name="far fa-eye" size={14} />
    </Col>
    <Col xs={1} className="d-h-end">
      <Icon name="far fa-thumbs-up" size={14} />
    </Col>
    <Col xs={1} className="d-h-end">
      <Icon name="far fa-comment" size={14} />
    </Col>
    <Col xs={4} className="pr-0">
      <p className="dsl-m14 my-2">Latest post</p>
    </Col>
    <Col xs={1} />
  </Row>
)

const CategoryMGTItem = ({ item, onSelect }) => {
  const { name, icon, stats } = item
  return (
    <Row className="mx-0 py-3">
      <Col xs={3} className="d-h-start pl-0">
        <div className="category-logo mr-2">
          <Icon name={`fal fa-${icon}`} size={16} />
        </div>
        <p className="dsl-b16 mb-0">{name}</p>
      </Col>
      <Col xs={1} className="d-h-end">
        <p className="dsl-b16 mb-0">{stats?.posts}</p>
      </Col>
      <Col xs={1} className="d-h-end">
        <p className="dsl-b16 mb-0">{stats?.views}</p>
      </Col>
      <Col xs={1} className="d-h-end">
        <p className="dsl-b16 mb-0">{stats?.likes}</p>
      </Col>
      <Col xs={1} className="d-h-end">
        <p className="dsl-b16 mb-0">{stats?.comments}</p>
      </Col>
      <Col xs={4} className="d-h-start">
        <p className="dsl-b14 text-500 truncate-one mb-0">{}</p>
      </Col>
      <Col xs={1} className="d-h-end pr-0">
        <EditDropdown options={DotsMenu} onChange={onSelect(item)} />
      </Col>
    </Row>
  )
}

const CategoryMGT = ({ blog, companyId, userId }) => {
  const dispatch = useDispatch()

  const [page, setPage] = useState(1)
  const categories = blog?.blog_categories ? values(blog?.blog_categories) : []
  const total = Math.ceil(categories.length / 10)

  const handleSelectMenu = (type, index) => item => e => {
    switch (e) {
      case 'add category':
        handleAddCategory(type)
        break

      case 'delete':
        break

      case 'edit':
        handleAddCategory(type, item, index)
        break

      default:
        break
    }
  }

  const handleAddCategory = (e, item, index = -1) => {
    const type = e === 'Public' ? 1 : 2
    const payload = {
      type: 'Add Category',
      data: {
        before: { type, data: item, index, blog, companyId, userId },
        after: { type: 'GETCOMMUNITYUSER_REQUEST', payload: { userId } },
      },
      callBack: {},
    }
    dispatch(AppActions.modalRequest(payload))
  }

  return (
    <div className="blog-admin-category-mgt">
      {categories.length > 0 ? (
        <>
          <p className="dsl-b20 bold my-2">Public</p>
          <CategoryMGTHeader />
          {categories.map((item, index) => (
            <CategoryMGTItem key={item.name} item={item} onSelect={handleSelectMenu('Public', index)} />
          ))}
        </>
      ) : (
        <p className="dsl-b16">{`There are no categories.`}</p>
      )}
      <div className={`${total > 0 ? 'd-h-between' : 'd-h-end'}`}>
        <Pagination total={total} current={page} pers={[]} onChange={page => setPage(page)} />
        <Button type="low" name="ADD CATEGORY" onClick={handleAddCategory} />
      </div>
    </div>
  )
}

CategoryMGT.propTypes = {
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
  companyId: PropTypes.number,
  userId: PropTypes.number,
}

CategoryMGT.defaultProps = {
  blog: {
    entity: {},
    blog: {
      entity_id: 0,
      group_id: 0,
      id: 0,
    },
    posts: {
      current_page: 0,
      data: [],
      last_page: 0,
    },
    has_blog: false,
  },
  companyId: 0,
  userId: 0,
}

export default CategoryMGT

import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col } from 'react-bootstrap'
import { filter, includes, join, find, propEq } from 'ramda'
import moment from 'moment'
import { Avatar, BlogAdvancedSearch, Button, EditDropdown, Icon, Pagination, Thumbnail } from '@components'
import CommunityActions from '~/actions/community'
import { getImageURL } from '~/services/util'
import './BlogAdmin.scss'

const Header = () => (
  <Row className="mx-0 border-bottom">
    <Col xs={1} className="px-0">
      <p className="dsl-m12 my-2">Image</p>
    </Col>
    <Col xs={3}>
      <p className="dsl-m12 my-2">Title</p>
    </Col>
    <Col xs={2} className="pl-0">
      <p className="dsl-m12 text-right my-2">Published</p>
    </Col>
    <Col xs={1} className="pr-0">
      <p className="dsl-m12 my-2">Visibility</p>
    </Col>
    <Col xs={1} className="pr-0">
      <p className="dsl-m12 my-2">Categories</p>
    </Col>
    <Col xs={1} className="pr-0 d-center dsl-m12">
      <Icon name="fas fa-eye" size={12} />
    </Col>
    <Col xs={1} className="pr-0 d-center dsl-m12">
      <Icon name="far fa-comment" size={12} />
    </Col>
    <Col xs={2} className="pr-0">
      <p className="dsl-m12 my-2">Author</p>
    </Col>
  </Row>
)

const Blog = ({ data, author, editable, onEdit }) => {
  const categories = useSelector(state => state.company.blogCategories)
  const users = useSelector(state => state.app.employees)
  const items = data?.data?.categories ? filter(x => includes(`${x.id}`, data?.data?.categories), categories) : []
  const categoryNames =
    items.length > 0
      ? join(
          ', ',
          items.map(x => x.name)
        )
      : 'Na'
  const url = getImageURL(data.data?.body)
  const comments = data?.stats?.comments
  const views = data?.stats?.views

  return (
    <Row className="mx-0 py-3 border-bottom">
      <Col xs={1} className="px-0">
        <Thumbnail className="responsive-thumbnail" size="responsive" src={url} />
      </Col>
      <Col xs={3}>
        <p className="dsl-b14 truncate-two text-400 mb-0">{data?.name}</p>
      </Col>
      <Col xs={2} className="pl-0">
        <p className="dsl-b15 text-400 text-right mb-0">{moment(data?.created_at).format('MMM DD, YY')}</p>
      </Col>
      <Col xs={1} className="pr-0">
        <p className="dsl-b15 text-400 mb-0">Na</p>
      </Col>
      <Col xs={1} className="pr-0">
        <p className="dsl-b13 text-400 truncate-two mb-0">{categoryNames}</p>
      </Col>
      <Col xs={1} className="pr-0">
        <p className="dsl-b13 text-400 text-center mb-0">{comments}</p>
      </Col>
      <Col xs={1} className="pr-0">
        <p className="dsl-b13 text-400 text-center mb-0">{views}</p>
      </Col>
      <Col xs={2} className="d-h-between pr-0">
        <div className="d-center flex-column">
          <Avatar type="logo" url={author?.avatar_cid} />
          <p className="dsl-b14 text-400 mt-1 mb-0">{author?.first_name}</p>
        </div>
        {editable && <EditDropdown options={['Add', 'Delete', 'Edit']} onChange={onEdit} />}
      </Col>
    </Row>
  )
}

const Published = ({ data, userId, blog, writers, editable, authors, categories, departments, onSelect, onSearch }) => {
  if (!data || data.data.length === 0) {
    return <p className="dsl-b16 p-3">{`There are no published posts.`}</p>
  }

  const dispatch = useDispatch()

  const handleChanagePage = e => {
    const payload = {
      userId,
      blogId: blog?.id,
      page: e,
    }
    dispatch(CommunityActions.getblogdetailsRequest(payload))
  }

  const handleEdit = data => e => {
    onSelect(e, data)
  }

  const handleAddPost = () => {
    onSelect('add')
  }

  const page = data?.current_page
  const total = data?.last_page

  return (
    <div className="blog-admin-published">
      <div className="d-h-end py-2">
        <BlogAdvancedSearch authors={authors} categories={categories} departments={departments} onSearch={onSearch} />
        <Icon name="fas fa-chart-pie-alt" size={14} />
      </div>
      {total > 0 && <Header />}
      {data?.data.map((item, index) => {
        const author = item.author || find(propEq('id', item.data?.writer_id), writers)
        return <Blog key={`draft-${index}`} data={item} author={author} editable={editable} onEdit={handleEdit(item)} />
      })}
      <div className={total > 0 ? 'd-h-between' : 'd-h-end'}>
        <Pagination total={total} current={page} pers={[]} onChange={handleChanagePage} />
        {editable && <Button type="low" name="ADD POST" onClick={handleAddPost} />}
      </div>
    </div>
  )
}

Published.propTypes = {
  data: PropTypes.shape({
    current_page: PropTypes.number,
    data: PropTypes.array,
    last_page: PropTypes.number,
  }),
  userId: PropTypes.number,
  blog: PropTypes.shape({
    id: PropTypes.number,
  }),
  writers: PropTypes.array,
  editable: PropTypes.bool,
  onSelect: PropTypes.func,
}

Published.defaultProps = {
  data: {
    current_page: 0,
    data: [],
    last_page: 0,
  },
  userId: 0,
  blog: {
    id: 0,
  },
  writers: [],
  editable: false,
  onSelect: () => {},
}

export default Published

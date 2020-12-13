import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import { Row, Col } from 'react-bootstrap'
import { filter, includes, join, find, propEq } from 'ramda'
import moment from 'moment'
import { Avatar, BlogAdvancedSearch, Button, EditDropdown, Icon, Pagination, Thumbnail } from '@components'
import { getImageURL } from '~/services/util'
import './BlogAdmin.scss'

const Header = () => (
  <Row className="mx-0 border-bottom">
    <Col xs={1} className="px-0">
      <p className="dsl-m14 my-2">Image</p>
    </Col>
    <Col xs={3}>
      <p className="dsl-m14 my-2">Title</p>
    </Col>
    <Col xs={2} className="pl-0">
      <p className="dsl-m14 text-right my-2">Created</p>
    </Col>
    <Col xs={1} className="pr-0">
      <p className="dsl-m14 my-2">Visibility</p>
    </Col>
    <Col xs={3} className="pr-0">
      <p className="dsl-m14 my-2">Categories</p>
    </Col>
    <Col xs={2} className="pr-0">
      <p className="dsl-m14 my-2">Author</p>
    </Col>
  </Row>
)

const Blog = ({ data, author, editable, onEdit }) => {
  const categories = data?.data?.blog_categories || []
  const categoryNames = categories.length > 0 ? join(', ', categories) : 'Na'
  const url = getImageURL(data.data?.body)

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
      <Col xs={3} className="pr-0">
        <p className="dsl-b13 text-400 truncate-two mb-0">{categoryNames}</p>
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

const Drafts = ({ data, writers, editable, authors, categories, departments, onSelect, onSearch }) => {
  const [page, setPage] = useState(1)

  const handleEdit = data => e => {
    onSelect(e, data)
  }

  const handleAddPost = () => {
    onSelect('add')
  }

  const total = data?.length > 0 ? Math.ceil(data?.length / 10) : 0
  const limit = (page - 1) * 10

  return (
    <div className="blog-admin-drafts">
      <div className="d-h-end py-2">
        <BlogAdvancedSearch authors={authors} categories={categories} departments={departments} onSearch={onSearch} />
        <Icon name="fas fa-chart-pie-alt" size={14} />
      </div>
      {total > 0 && <Header />}
      {data.map((item, index) => {
        if (index > 9 + limit || index < limit) return null
        const author = item.author || find(propEq('id', item.data?.writer_id), writers)
        return (
          <Blog key={`draft-${item.id}`} data={item} author={author} editable={editable} onEdit={handleEdit(item)} />
        )
      })}
      <div className={total > 0 ? 'd-h-between' : 'd-h-end'}>
        <Pagination total={total} current={page} pers={[]} onChange={e => setPage(e)} />
        {editable && <Button type="low" name="ADD POST" onClick={handleAddPost} />}
      </div>
    </div>
  )
}

Drafts.propTypes = {
  data: PropTypes.array,
  writers: PropTypes.array,
  editable: PropTypes.bool,
  onSelect: PropTypes.func,
}

Drafts.defaultProps = {
  data: [],
  writers: [],
  editable: false,
  onSelect: () => {},
}

export default Drafts

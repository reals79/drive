import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Row, Col } from 'react-bootstrap'
import { uniqBy, prop } from 'ramda'
import moment from 'moment'
import { Avatar, Button, EditDropdown, Icon, Pagination, Thumbnail } from '@components'
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
    <Col xs={1} className="px-0">
      <p className="dsl-m14 text-right my-2">Published</p>
    </Col>
    <Col xs={1} className="pr-0">
      <p className="dsl-m14 my-2">Visibility</p>
    </Col>
    <Col xs={2} className="pr-0">
      <p className="dsl-m14 my-2">Categories</p>
    </Col>
    <Col xs={1} className="d-h-end">
      <Icon name="far fa-eye" size={14} />
    </Col>
    <Col xs={1} className="d-h-end">
      <Icon name="far fa-comment" size={14} />
    </Col>
    <Col xs={2} className="pl-5 pr-0">
      <p className="dsl-m14 my-2">Author</p>
    </Col>
  </Row>
)

const Blog = ({ data, editable, onEdit }) => {
  const categoryNames = data?.data?.blog_categories ? data?.data?.blog_categories.join(', ') : 'Na'
  const url = getImageURL(data.data?.body)

  return (
    <Row className="mx-0 py-3 border-bottom">
      <Col xs={1} className="px-0">
        <Thumbnail className="responsive-thumbnail" size="responsive" src={url} />
      </Col>
      <Col xs={3}>
        <p className="dsl-b14 truncate-two text-400 mb-0">{data?.name}</p>
      </Col>
      <Col xs={1} className="px-0">
        <p className="dsl-b15 text-400 text-right mb-0">{moment(data?.created_at).format('MMM DD, YY')}</p>
      </Col>
      <Col xs={1} className="pr-0">
        <p className="dsl-b15 text-400 mb-0">Public</p>
      </Col>
      <Col xs={2} className="pr-0">
        <p className="dsl-b13 text-400 truncate-two mb-0">{categoryNames}</p>
      </Col>
      <Col xs={1} className="d-h-end">
        <p className="dsl-b14">{data?.stats?.views}</p>
      </Col>
      <Col xs={1} className="d-h-end">
        <p className="dsl-b14">{data?.stats?.comments}</p>
      </Col>
      <Col xs={2} className="d-h-between pl-5 pr-0">
        <div className="d-center flex-column">
          <Avatar type="logo" url={data.author_avatar} />
          <p className="dsl-b16 text-400 mb-0">{data.author?.first_name}</p>
        </div>
        {editable && <EditDropdown options={['Add new post', 'Delete', 'Edit']} onChange={onEdit} />}
      </Col>
    </Row>
  )
}

const Published = ({ data, editable, onSelect, onChangePage }) => {
  const { current_page, last_page } = data
  const posts = uniqBy(prop('id'), data.data)
  const handleSelectMenu = item => e => {
    if (e === 'add new post') {
      onSelect('add new post')
    } else {
      onSelect(e, item)
    }
  }
  return (
    <div className="blog-admin-published">
      <div className="d-h-end py-2">
        <p className="dsl-p16 mb-0 mr-3">Advanced Search</p>
        <Icon name="fas fa-chart-pie-alt" size={14} />
      </div>
      {posts.length > 0 ? (
        <>
          <Header />
          {posts.map(item => (
            <Blog key={item.id} data={item} editable={editable} onEdit={handleSelectMenu(item)} />
          ))}
        </>
      ) : (
        <p className="dsl-b16">There are no published posts to show.</p>
      )}
      <div className={posts.length > 0 ? 'd-h-between' : 'd-h-end'}>
        <Pagination total={last_page} current={current_page} pers={[]} onChange={onChangePage} />
        {editable && <Button type="low" name="ADD POST" onClick={() => onSelect('add new post')} />}
      </div>
    </div>
  )
}

Published.propTypes = {
  data: PropTypes.shape({
    current_page: PropTypes.number,
    data: PropTypes.array,
    last_page: PropTypes.number,
    per_page: PropTypes.number,
  }),
  editable: PropTypes.bool,
  onSelect: PropTypes.func,
  onChangePage: PropTypes.func,
}

Published.defaultProps = {
  data: {
    current_page: 0,
    data: [],
    last_page: 0,
    per_page: 0,
  },
  editable: false,
  onSelect: () => {},
  onChangePage: () => {},
}

export default Published

import React from 'react'
import PropTypes from 'prop-types'
import { Row, Col } from 'react-bootstrap'
import moment from 'moment'
import { Avatar, EditDropdown, Icon } from '@components'

const CategoryHeader = () => (
  <Row className="mx-0 py-4">
    <Col xs={4} className="d-h-start px-0">
      <p className="dsl-m12 mb-0">Category</p>
    </Col>
    <Col xs={1} className="d-center px-0">
      <p className="dsl-m12 mb-0">posts</p>
    </Col>
    <Col xs={1} className="d-center px-0">
      <Icon name="far fa-comment" size={12} />
    </Col>
    <Col xs={1} className="d-center px-0">
      <Icon name="far fa-eye" size={12} />
    </Col>
    <Col xs={4} className="d-h-start pl-4 pr-0">
      <p className="dsl-m12 mb-0">Latest post</p>
    </Col>
    <Col xs={1} className="px-0" />
  </Row>
)

const CategoryItem = ({ item, onClick }) => {
  const { name, data, posts, stats } = item
  return (
    <Row className="cursor-pointer mx-0 py-3" onClick={() => onClick && onClick(item)}>
      <Col xs={4} className="d-h-start px-0">
        <div className="department-logo mr-2">
          <Icon name={`fal fa-${data?.icon}`} size={16} />
        </div>
        <p className="dsl-b16 mb-0">{name}</p>
      </Col>
      <Col xs={1} className="d-center px-0">
        <p className="dsl-b16 mb-0">{stats?.posts}</p>
      </Col>
      <Col xs={1} className="d-center px-0">
        <p className="dsl-b16 mb-0">{stats?.comments}</p>
      </Col>
      <Col xs={1} className="d-center px-0">
        <p className="dsl-b16 mb-0">{stats?.views}</p>
      </Col>
      <Col xs={4} className="d-h-start pl-4 pr-0">
        <p className="dsl-b14 truncate-one text-500 mb-0">{posts[0]?.name}</p>
      </Col>
      <Col xs={1} className="d-h-end px-0">
        <EditDropdown options={['Edit', 'Delete']} />
      </Col>
    </Row>
  )
}

const CategoryDetailedItem = ({ post }) => {
  const { name, data, created_at } = post
  return (
    <>
      <div className="d-h-between">
        <div className="d-h-start">
          <Avatar type="logo" url={post.author_avatar} />
          <div className="ml-2">
            <p className="dsl-m14 mb-2">{`${post.author?.first_name} ${post.author?.last_name}`}</p>
            <p className="dsl-m14 mb-0">{post.profile?.company}</p>
          </div>
        </div>
        <p className="dsl-m14 mb-0">{moment(created_at).format('MMM DD, YY')}</p>
      </div>
      <p className="dsl-b18 bold my-3 truncate-two">{name}</p>
      <div className="post-body" dangerouslySetInnerHTML={{ __html: data?.body }} />
    </>
  )
}

export const CategoryFeed = ({ category }) => {
  if (!category) return null
  const { name, posts } = category
  return (
    <div className="bg-white">
      <p className="dsl-b20 bold pt-3 pl-3 mb-0 mt-3">{name}</p>
      {posts.length > 0 ? (
        posts?.map((item, index) => (
          <div className="blog-category-section mt-3" key={`item-${index}`}>
            <CategoryDetailedItem post={item} />
          </div>
        ))
      ) : (
        <p className="dsl-b16 p-3">{`There are no ${name.toLowerCase()} posts.`}</p>
      )}
    </div>
  )
}

const Categories = ({ categories, onSelect }) => {
  const handleOpenDetail = item => {
    onSelect && onSelect(item)
  }
  return (
    <div className="card blog-category-section my-3">
      {categories.length > 0 ? (
        <>
          <p className="dsl-b20 bold my-2">Public</p>
          <CategoryHeader />
          {categories.map((category, index) => (
            <CategoryItem key={`category-${index}`} item={category} onClick={handleOpenDetail} />
          ))}
        </>
      ) : (
        <p className="dsl-b16 p-3">{`There are no categories.`}</p>
      )}
    </div>
  )
}

Categories.propTypes = {
  categories: PropTypes.array,
  onSelect: PropTypes.func,
}

Categories.defaultProps = {
  categories: [],
  onSelect: () => {},
}

export default Categories

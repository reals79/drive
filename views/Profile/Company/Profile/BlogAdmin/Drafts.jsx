import React from 'react'
import PropTypes from 'prop-types'
import { Row, Col } from 'react-bootstrap'
import { find, propEq } from 'ramda'
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
    <Col xs={2} className="pl-0">
      <p className="dsl-m14 text-right my-2">Created</p>
    </Col>
    <Col xs={1} className="pr-0">
      <p className="dsl-m14 my-2">Visibility</p>
    </Col>
    <Col xs={2} className="pr-0">
      <p className="dsl-m14 my-2">Categories</p>
    </Col>
    <Col xs={3} className="pr-0">
      <p className="dsl-m14 my-2">Author</p>
    </Col>
  </Row>
)

const Blog = ({ data, author, editable, onSelect }) => {
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
      <Col xs={2} className="pl-0">
        <p className="dsl-b15 text-400 text-right mb-0">{moment(data?.created_at).format('MMM DD, YY')}</p>
      </Col>
      <Col xs={1} className="pr-0">
        <p className="dsl-b15 text-400 mb-0">Na</p>
      </Col>
      <Col xs={2} className="pr-0">
        <p className="dsl-b13 text-400 truncate-two mb-0">{categoryNames}</p>
      </Col>
      <Col xs={3} className="d-h-between pr-0">
        <div className="d-h-start">
          <Avatar type="logo" url={author?.avatar_cid} />
          <p className="dsl-b16 text-400 ml-2 mb-0">{`${author?.first_name} ${author?.last_name}`}</p>
        </div>
        {editable && <EditDropdown options={['Add new post', 'Delete', 'Edit']} onChange={onSelect} />}
      </Col>
    </Row>
  )
}

const Drafts = ({ data, authors, editable, onSelect }) => {
  const handleSelectMenu = item => e => {
    if (e === 'add new post') onSelect(e)
    else {
      onSelect(e, item)
    }
  }
  const total = data?.length > 0 ? Math.ceil(data?.length / 5) : 0
  return (
    <div className="blog-admin-drafts">
      <div className="d-h-end py-2">
        <p className="dsl-p16 mb-0 mr-3">Advanced Search</p>
        <Icon name="fas fa-chart-pie-alt" size={14} />
      </div>
      {total > 0 ? (
        <>
          <Header />
          {data.map(item => {
            const authorId = item.user_id || item.data?.writer_id
            const author = item.author || find(propEq('id', authorId), authors)
            return (
              <Blog
                key={`draft-${item.id}`}
                data={item}
                author={author}
                editable={editable}
                onSelect={handleSelectMenu(item)}
              />
            )
          })}
        </>
      ) : (
        <p className="dsl-b16">There are no drafts posts to show.</p>
      )}
      <div className={total > 0 ? 'd-h-between' : 'd-h-end'}>
        <Pagination total={total} current={1} pers={[]} />
        {editable && <Button type="low" name="ADD POST" onClick={() => onSelect('add new post')} />}
      </div>
    </div>
  )
}

Drafts.propTypes = {
  data: PropTypes.array,
  authors: PropTypes.array,
  editable: PropTypes.bool,
  onSelect: PropTypes.func,
}

Drafts.defaultProps = {
  data: [],
  authors: [],
  editable: false,
  onSelect: () => {},
}

export default Drafts

import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import { Tabs, Tab } from 'react-bootstrap'
import { keys, values } from 'ramda'
import AppActions from '~/actions/app'
import CompActions from '~/actions/company'
import CommunityActions from '~/actions/community'
import CategoryMGT from './CategoryMGT'
import Drafts from './Drafts'
import Published from './Published'
import './BlogAdmin.scss'

const BlogAdmin = ({ blog, user }) => {
  const dispatch = useDispatch()

  const [active, setActive] = useState('drafts')

  const departments = useSelector(state => state.company.blogCategories)
  const authors = blog?.admins || []
  const categories = blog?.blog_categories ? values(blog.blog_categories) : []

  const handleTab = e => {
    setActive(e)
  }

  useEffect(() => {
    handleGetCategories()
  }, [])

  const handleGetCategories = () => {
    dispatch(CompActions.getblogcategoriesRequest())
  }

  const handleSelectOption = (option, data) => {
    switch (option) {
      case 'edit':
        dispatch(
          AppActions.modalRequest({
            type: 'Edit Blog Post',
            data: { before: { post: data, userId: user.id, blog: { ...blog, id: blog?.blog?.id } } },
            callBack: null,
          })
        )
        break

      case 'add':
        dispatch(
          AppActions.modalRequest({
            type: 'Edit Blog Post',
            data: { before: { post: null, userId: user.id, blog: { ...blog, id: blog?.blog?.id } } },
            callBack: null,
          })
        )
        break

      default:
        break
    }
  }

  const handleSearch = e => {
    const payload = {
      ...e,
      userId: blog.user_id,
      blogId: blog.blog?.id,
    }
    dispatch(CommunityActions.getblogdetailsRequest(payload))
  }

  return (
    <div className="individual-blog-admin">
      <div className="blog-admin-header">
        <p className="dsl-b22 bold my-2">Blog Admin</p>
      </div>
      <Tabs className="blog-admin-content" defaultActiveKey="drafts" activeKey={active} onSelect={handleTab}>
        <Tab eventKey="drafts" title="Drafts">
          <Drafts
            data={blog?.drafts}
            editable={blog?.can_edit_blog}
            writers={blog?.admins}
            authors={authors}
            categories={categories}
            departments={departments}
            onSelect={handleSelectOption}
            onSearch={handleSearch}
          />
        </Tab>
        <Tab eventKey="published" title="Published">
          <Published
            data={blog?.posts}
            userId={blog?.user_id}
            blog={blog?.blog}
            editable={blog?.can_edit_blog}
            writers={blog?.admins}
            authors={authors}
            categories={categories}
            departments={departments}
            onSelect={handleSelectOption}
            onSearch={handleSearch}
          />
        </Tab>
        <Tab eventKey="category mgt" title="Category MGT">
          <CategoryMGT blog={blog} companyId={blog.id} userId={user.id} />
        </Tab>
      </Tabs>
    </div>
  )
}

BlogAdmin.propTypes = {
  blog: PropTypes.shape({
    user_id: PropTypes.number,
    admins: PropTypes.array,
    blog: PropTypes.shape({
      id: PropTypes.number,
    }),
    can_edit_blog: PropTypes.bool,
    drafts: PropTypes.array,
    entity: PropTypes.shape({
      id: PropTypes.number,
    }),
    has_blog: PropTypes.bool,
    posts: PropTypes.shape({
      data: PropTypes.array,
    }),
    title: PropTypes.string,
  }),
  user: PropTypes.shape({
    id: PropTypes.number,
  }),
}

BlogAdmin.defaultProps = {
  blog: {
    user_id: 0,
    admins: [],
    blog: {
      id: 0,
    },
    can_edit_blog: false,
    drafts: [],
    entity: {
      id: 0,
    },
    has_blog: false,
    posts: {
      data: [],
    },
    title: '',
  },
  user: {
    id: 0,
  },
}

export default BlogAdmin

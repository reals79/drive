import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useLocation } from 'react-router-dom'
import PropTypes from 'prop-types'
import { Tabs, Tab } from 'react-bootstrap'
import AppActions from '~/actions/app'
import CompanyActions from '~/actions/company'
import VendorActions from '~/actions/vendor'
import CategoryMGT from './CategoryMGT'
import Drafts from './Drafts'
import Published from './Published'
import './BlogAdmin.scss'

const BlogAdmin = ({ data }) => {
  const dispatch = useDispatch()

  const { state } = useLocation()
  const [active, setActive] = useState(state && state.tab ? state.tab : 'drafts')

  const blog = data?.vrs?.blog?.data

  const handleTab = e => {
    setActive(e)
  }

  const handleDeletePost = post => {
    const payload = {
      data: { post: { id: post.id, blog_id: post.data?.blog_id, user_id: post.user_id } },
      callback: handleChangePostPage,
    }
    dispatch(VendorActions.deleteblogpostRequest(payload))
  }

  const handlePostEvent = (e, post) => {
    if (e === 'delete') {
      const payload = {
        type: 'Confirm',
        data: { before: { title: 'Delete', body: 'Are you sure you want to delete this post?' } },
        callBack: { onYes: () => handleDeletePost(post) },
      }
      dispatch(AppActions.modalRequest(payload))
    } else {
      const payload = {
        type: 'Edit Blog Post',
        data: { before: { post, businessId: data.id, blog } },
        callBack: null,
      }
      dispatch(AppActions.modalRequest(payload))
    }
  }

  const handleChangePostPage = page => {
    dispatch(CompanyActions.getbusinessblogRequest({ businessId: data.id, page }))
  }

  return (
    <div className="company-profile-blog-admin">
      <div className="blog-admin-header">
        <p className="dsl-b22 bold my-2">Blog Admin</p>
      </div>
      <Tabs className="blog-admin-content" defaultActiveKey="drafts" activeKey={active} onSelect={handleTab}>
        <Tab eventKey="drafts" title="Drafts">
          <Drafts editable data={blog?.drafts} authors={blog?.admins} onSelect={handlePostEvent} />
        </Tab>
        <Tab eventKey="published" title="Published">
          <Published
            editable
            data={blog?.posts}
            authors={blog?.admins}
            onSelect={handlePostEvent}
            onChangePage={handleChangePostPage}
          />
        </Tab>
        <Tab eventKey="category mgt" title="Category MGT">
          <CategoryMGT blog={blog} userId={data?.user_id} companyId={data?.id} />
        </Tab>
      </Tabs>
    </div>
  )
}

BlogAdmin.propTypes = {
  data: PropTypes.shape({
    blog: PropTypes.shape({
      entity: PropTypes.any,
      blogs: PropTypes.array,
      posts: PropTypes.array,
      title: PropTypes.string,
      blog: PropTypes.any,
      drafts: PropTypes.array,
      has_blog: PropTypes.bool,
      can_edit_blog: PropTypes.bool,
    }),
  }),
}

BlogAdmin.defaultProps = {
  data: {
    blog: {
      entity: {},
      blogs: [],
      posts: [],
      title: '',
      blog: {},
      drafts: [],
      has_blog: true,
      can_edit_blog: false,
    },
  },
}

export default BlogAdmin

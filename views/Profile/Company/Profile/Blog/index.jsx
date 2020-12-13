import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useLocation } from 'react-router-dom'
import PropTypes from 'prop-types'
import { Tabs, Tab } from 'react-bootstrap'
import { values } from 'ramda'
import { Button, EditDropdown } from '@components'
import AppActions from '~/actions/app'
import VenActions from '~/actions/vendor'
import Recent from './Recent'
import Categories, { CategoryFeed } from './Categories'
import Departments, { DepartmentFeed } from './Departments'
import Detail from './Detail'
import './Blog.scss'

const Blog = ({ data, isAdmin }) => {
  const dispatch = useDispatch()
  const location = useLocation()
  const history = useHistory()

  const [recent, setRecent] = useState(null)
  const [active, setActive] = useState('recent')
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [selectedDepartment, setSelectedDepartment] = useState(null)
  const [allcategories, setAllCategories] = useState(false)
  const [alldepartments, setAllDepartments] = useState(false)

  const blogPosts = useSelector(state => state.vendor.blogPosts)
  const blog = data.vrs?.blog?.data
  const categories = values(blog?.blog_categories)
  const departments = values(blog?.global_categories)

  useEffect(() => {
    dispatch(VenActions.getblogpostsRequest({ company_id: data.id }))
  }, [])

  const handleTab = e => {
    setSelectedCategory(null)
    setSelectedDepartment(null)
    setActive(e)
    setRecent(null)
  }

  const handleDropdown = e => {
    if (e === 'add post') {
      const payload = {
        type: 'Edit Blog Post',
        data: { before: { post: null, businessId: data.id, blog } },
        callBack: null,
      }
      dispatch(AppActions.modalRequest(payload))
    } else if (e === 'reports') {
    } else {
      history.push({
        pathname: `${location.pathname}-admin`,
        state: { tab: e },
      })
    }
  }

  const handleSelectCategory = category => {
    handleTab('categories')
    setSelectedCategory(category)
    setSelectedDepartment(null)
    dispatch(VenActions.getblogpostsRequest({ category_id: category.id }))
  }

  const handleSelectDepartment = department => {
    handleTab('departments')
    setSelectedCategory(null)
    setSelectedDepartment(department)
    dispatch(VenActions.getblogpostsRequest({ category_id: department.id }))
  }

  const dropOptions = ['Add Post', 'Drafts', 'Category MGT', 'Published', 'Reports']

  return (
    <div className="company-profile-blog">
      <div className="d-flex-3 pr-1">
        <div className="card-header d-flex justify-content-between">
          <span className="dsl-b22 bold">{data.name} Blog</span>
          {isAdmin && <EditDropdown options={dropOptions} onChange={handleDropdown} />}
        </div>
        <Tabs className="card-content pb-3" defaultActiveKey="recent" activeKey={active} onSelect={handleTab}>
          <Tab eventKey="recent" title="Recent">
            {recent ? (
              <Detail data={recent} posts={blogPosts.posts} onSelect={e => setRecent(e)} />
            ) : (
              <Recent data={blogPosts.posts} onClick={e => setRecent(e)} />
            )}
          </Tab>
          <Tab eventKey="categories" title="Categories">
            {selectedCategory ? (
              <CategoryFeed category={selectedCategory} />
            ) : (
              <Categories categories={categories} onSelect={handleSelectCategory} />
            )}
          </Tab>
          <Tab eventKey="departments" title="Departments">
            {selectedDepartment ? (
              <DepartmentFeed department={selectedDepartment} />
            ) : (
              <Departments departments={departments} onSelect={handleSelectDepartment} />
            )}
          </Tab>
        </Tabs>
      </div>
      <div className="d-flex-1 pl-2">
        <div className="card">
          <p className="dsl-b18 bold">Categories</p>
          {categories.map((category, index) => {
            const { name } = category
            if (allcategories || index < 5) {
              return (
                <Button
                  key={name}
                  name={name}
                  type="link"
                  className="dsl-b14 d-h-start px-0"
                  onClick={() => handleSelectCategory(category)}
                />
              )
            }
            return null
          })}
          {categories.length > 5 && (
            <div className="d-h-end">
              <Button
                type="link"
                name={allcategories ? 'See less' : 'See All'}
                onClick={() => setAllCategories(!allcategories)}
              />
            </div>
          )}
        </div>
        <div className="card">
          <p className="dsl-b18 bold">Departments</p>
          {departments.map((department, index) => {
            const { id, name } = department
            if (alldepartments || index < 5) {
              return (
                <Button
                  key={id}
                  name={name}
                  type="link"
                  className="dsl-b14 d-h-start px-0"
                  onClick={() => handleSelectDepartment(department)}
                />
              )
            }
            return null
          })}
          {departments.length > 5 && (
            <div className="d-h-end">
              <Button
                type="link"
                name={alldepartments ? 'See less' : 'See All'}
                onClick={() => setAllDepartments(!alldepartments)}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

Blog.propTypes = {
  data: PropTypes.any.isRequired,
  isAdmin: PropTypes.bool,
}

Blog.defaultProps = {
  data: {},
  isAdmin: false,
}

export default Blog

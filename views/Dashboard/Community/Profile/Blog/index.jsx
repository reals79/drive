import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import PropTypes from 'prop-types'
import { Tabs, Tab } from 'react-bootstrap'
import { keys, values } from 'ramda'
import { Button, EditDropdown } from '@components'
import CommunityActions from '~/actions/community'
import Recent from './Recent'
import Detail from './Detail'
import Categories, { CategoryFeed } from './Categories'
import Departments, { DepartmentFeed } from './Departments'
import './Blog.scss'

const Blog = ({ data, recentBlog }) => {
  const dispatch = useDispatch()

  const [active, setActive] = useState('recent')
  const [recent, setRecent] = useState(recentBlog)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [selectedDepartment, setSelectedDepartment] = useState(null)
  const [allcategories, setAllCategories] = useState(false)
  const [alldepartments, setAllDepartments] = useState(false)

  useEffect(() => {
    setRecent(recentBlog)
  }, [recentBlog])

  const handleTab = e => {
    setActive(e)
    setRecent(null)
    setSelectedCategory(null)
    setSelectedDepartment(null)
  }

  const handleSelectCategory = category => () => {
    handleTab('categories')
    setSelectedCategory(category)
    setSelectedDepartment(null)
  }

  const handleGetCategoryDetail = category => {
    const payload = {
      userId: data.user_id,
      blogId: data.blog?.id,
      blogCategory: category.name,
      callback: handleSelectCategory(category),
    }
    dispatch(CommunityActions.getblogdetailsRequest(payload))
  }

  const handleSelectDepartment = department => () => {
    handleTab('departments')
    setSelectedCategory(null)
    setSelectedDepartment(department)
  }

  const handleGetDepartmentDetail = department => {
    const payload = {
      userId: data.user_id,
      blogId: data.blog?.id,
      categoryId: department.id,
      callback: handleSelectDepartment(department),
    }
    dispatch(CommunityActions.getblogdetailsRequest(payload))
  }

  const categories = data?.blog_categories ? values(data?.blog_categories) : []
  const departments = data?.global_categories
    ? keys(data?.global_categories).map(id => ({ ...data.global_categories[id], id }))
    : []

  return (
    <div className="individual-profile-blog">
      <div className="d-flex-3 mr-1">
        <div className="card-header d-h-between">
          <span className="dsl-b22 bold">My Blog</span>
          <EditDropdown options={['Edit', 'Delete']} />
        </div>
        <Tabs className="card-content pb-2" defaultActiveKey="recent" activeKey={active} onSelect={handleTab}>
          <Tab eventKey="recent" title="Recent">
            {recent ? (
              <Detail data={recent} posts={data.posts?.data} onSelect={e => setRecent(e)} />
            ) : (
              <Recent data={data} onClick={e => setRecent(e)} />
            )}
          </Tab>
          <Tab eventKey="categories" title="Categories">
            {selectedCategory ? (
              <CategoryFeed category={selectedCategory} posts={data.posts?.data} />
            ) : (
              <Categories categories={categories} onSelect={handleGetCategoryDetail} />
            )}
          </Tab>
          <Tab eventKey="departments" title="Departments">
            {selectedDepartment ? (
              <DepartmentFeed department={selectedDepartment} posts={data.posts?.data} />
            ) : (
              <Departments departments={departments} onSelect={handleGetDepartmentDetail} />
            )}
          </Tab>
        </Tabs>
      </div>
      <div className="d-flex-1 ml-2">
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
                  onClick={() => handleGetCategoryDetail(category)}
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
            const { name } = department
            if (alldepartments || index < 5) {
              return (
                <Button
                  key={`department-${index}`}
                  name={name}
                  type="link"
                  className="dsl-b14 d-h-start px-0"
                  onClick={() => handleGetDepartmentDetail(department)}
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
}

Blog.defaultProps = {
  data: {},
}

export default Blog

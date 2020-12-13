import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button, CommunityBlogs } from '@components'
import AppActions from '~/actions/app'
import CompanyActions from '~/actions/company'
import CommunityActions from '~/actions/community'
import CommunityHeader from '~/views/Dashboard/Community/Header'

const Blogs = () => {
  const dispatch = useDispatch()

  const user = useSelector(state => state.app.user?.community_user)
  const blogs = useSelector(state => state.community.recentBlogs)
  const departments = useSelector(state => state.company.blogCategories)
  const [alldepartments, setAllDepartments] = useState(false)

  useEffect(() => {
    if (user) {
      dispatch(CommunityActions.getcommunityblogRequest({ userId: user.id }))
    }
    dispatch(CommunityActions.getfeatureditemsRequest())
    dispatch(CompanyActions.getblogcategoriesRequest())
    dispatch(CommunityActions.getcomblogpostsRequest({ per_page: 30, page: 1 }))
  }, [])

  const handleToggleModal = e => {
    const blog = e ? e : user.blogs[0]?.blog
    dispatch(
      AppActions.modalRequest({
        type: 'Edit Blog Post',
        data: { before: { post: null, userId: user.id, blog } },
        callBack: null,
      })
    )
  }

  return (
    <div className="community-blogs">
      <CommunityHeader activeRoute="Blogs" searchTitle="Post" onModal={handleToggleModal} />
      <div className="d-flex">
        <div className="d-flex-3 pr-1">
          <CommunityBlogs data={blogs} title="Recent" />
        </div>
        <div className="d-flex-1 pl-2">
          <div className="card">
            <p className="dsl-b18 bold">Departments</p>
            {departments.map((department, index) => {
              const { id, name } = department
              if (alldepartments || index < 5) {
                return <Button key={id} name={name} type="link" className="dsl-b14 d-h-start px-0" />
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
    </div>
  )
}

export default Blogs

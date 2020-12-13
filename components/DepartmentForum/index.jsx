import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { history } from '~/reducers'
import { useDispatch } from 'react-redux'
import CommunityActions from '~/actions/community'
import VendorActions from '~/actions/vendor'

const DepartmentForum = ({ title, departments }) => {
  const dispatch = useDispatch()
  useEffect(() => {
    departments.forEach(item => {
      const payload = { category_id: item.id }
      dispatch(CommunityActions.gettopicsRequest(payload))
      dispatch(VendorActions.getcategorypopularproductsRequest(payload))
    })
  }, [])

  return (
    <div className="card department-forum-card">
      <div className="dsl-b18 bold department-title">{title}</div>
      <div className="list-item mt-2 pb-2">
        <div className="d-flex-6" />
        <div className="d-flex-1 text-right">
          <span className="dsl-m12 text-400">Topics</span>
        </div>
        <div className="d-flex-3 text-right">
          <span className="dsl-m12 text-400">Comments</span>
        </div>
        <div className="d-flex-2 text-right">
          <span className="dsl-m12 text-400">Views</span>
        </div>
      </div>
      {departments?.length > 0 ? (
        departments.map((item, index) => (
          <div className="dept-hover cursor-pointer" key={index}>
            <div className="list-item mt-2 pb-2">
              <div className="d-flex-5" onClick={() => history.push(`/community/forum-department-feed/${item.id}`)}>
                <span className="dsl-b14">{item.name}</span>
              </div>
              <div className="d-flex-3 text-right">
                <span className="dsl-b14">{item.data.stats.forum_discussions_abbr}</span>
              </div>
              <div className="d-flex-3 text-right">
                <span className="dsl-b14">{item.data.stats.forum__comments_abbr}</span>
              </div>
              <div className="d-flex-3 text-right">
                <span className="dsl-b14">{item.data.stats.forum__views_abbr}</span>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="dsl-m14 text-center">No department available</div>
      )}
    </div>
  )
}

DepartmentForum.propTypes = {
  title: PropTypes.string,
  departments: PropTypes.array,
}

DepartmentForum.defaultProps = {
  title: '',
  departments: [],
}

export default DepartmentForum

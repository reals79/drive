import React from 'react'
import { Button, Icon } from '@components'
import { ForumDepartmentIcons } from '~/services/config'
import './Forums.scss'

const Department = ({ departments, history, onAdd }) => (
  <>
    <div className="list-item mt-2 px-3">
      <div className="d-flex-3">
        <span className="dsl-m12 text-400">Department</span>
      </div>
      <div className="d-flex-1 text-center">
        <span className="dsl-m12 text-400"># posts</span>
      </div>
      <div className="d-flex-1 text-right">
        <Icon name="far fa-comment text-400" size={12} color="#969faa" />
      </div>
      <div className="d-flex-2 text-center">
        <Icon name="far fa-eye text-400" size={12} color="#969faa" />
      </div>
      <div className="d-flex-3 text-left">
        <span className="dsl-m12 text-400">Latest Post</span>
      </div>
    </div>
    {departments?.length > 0 ? (
      departments.map((item, index) => (
        <div className="back-hover cursor-pointer" key={index}>
          <div className="list-item mt-2 back-hover-space">
            <div
              className="d-flex-3 d-flex align-items-center"
              onClick={() => history.push(`/community/forum-department-feed/${item.id}`)}
            >
              <Icon name={ForumDepartmentIcons[item.id]} color="#969faa" size={13} />
              <span className="dsl-b16 ml-3">{item.name}</span>
            </div>
            <div className="d-flex-1 text-right">
              <span className="dsl-b16 mr-4">{item.data.stats.blog_posts_abbr}</span>
            </div>
            <div className="d-flex-1 text-right">
              <span className="dsl-b16">{item.data.stats.forum__comments_abbr}</span>
            </div>
            <div className="d-flex-2 text-center">
              <span className="dsl-b16 ml-3">{item.data.stats.forum__views_abbr}</span>
            </div>
            <div
              className="d-flex-3 truncate-one text-left"
              onClick={() => history.push(`/community/forum-topic/${item.latest[1]?.id}/${item.id}`)}
            >
              <span className="dsl-b16">{item.latest[1]?.name}</span>
            </div>
          </div>
        </div>
      ))
    ) : (
      <div className="dsl-b16 text-center mt-5">No department available</div>
    )}
    <div className="d-h-end p-2">
      <Button name="ADD TOPIC" onClick={() => onAdd()} />
    </div>
  </>
)

export default Department

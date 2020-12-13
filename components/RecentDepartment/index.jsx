import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Avatar, Button, Icon } from '@components'
import { toDuration } from '~/services/util'

const RecentDepartment = ({ department }) => {
  const history = useHistory()
  const _topics = useSelector(state => state.community.topics)
  const topics = _topics[department.id]?.topics?.data
  const [visible, setVisible] = useState(false)

  return (
    <div className="card recent-department-card">
      <p className="dsl-b18 bold title">{department.name}</p>
      {topics?.length > 0 ? (
        <>
          {topics.map(
            (item, idx) =>
              (visible ? true : idx < 5) && (
                <div
                  className="d-flex list-item cursor-pointer"
                  key={idx}
                  onClick={() => history.push(`/community/forum-department-feed/${department.id}`)}
                >
                  <div className="d-flex-1">
                    <Avatar url={item.comments[0]?.author_url} size="tiny" />
                  </div>
                  <div className="d-flex-5">
                    <p className="dsl-b14 bold truncate-one mb-0">{item?.name}</p>
                    <span className="mr-1 dsl-m12 text-400">
                      Created by: {item.comments[0]?.user?.first_name + ' ' + item.comments[0]?.user?.last_name}
                    </span>
                    <div className="d-flex">
                      <Icon name="far fa-eye mr-2 text-500" size={12} color="#969faa" />
                      <span className="dsl-d12 mr-4">{item?.stats?.views || 0}</span>
                      <Icon name="fal fa-thumbs-up mr-2 text-500" size={12} color="#969faa" />
                      <span className="dsl-d12 mr-4">{item?.stats?.likes || 0}</span>
                      <Icon name="far fa-comment mr-2 text-500" size={12} color="#969faa" />
                      <span className="dsl-d12 mr-4">{item?.stats?.comments || 0}</span>
                    </div>
                  </div>
                  <div className="d-flex-1 mb-auto">
                    <p className="dsl-b12 text-right">{toDuration(item?.updated_at)}</p>
                  </div>
                </div>
              )
          )}
          <Button
            className="ml-auto mr-3"
            name={visible ? 'Show Less' : 'See More'}
            type="link"
            onClick={() => setVisible(!visible)}
          />
        </>
      ) : (
        <div className="dsl-m14 text-center">No recent {department.name} available</div>
      )}
    </div>
  )
}

export default RecentDepartment

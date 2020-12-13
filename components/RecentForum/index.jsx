import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Avatar, Button, Icon } from '@components'
import { history } from '~/reducers'
import { toDuration } from '~/services/util'
import './RecentForum.scss'

const RecentForum = ({ displayMenu, recentTopic, title }) => {
  const [visible, setVisible] = useState(false)

  return (
    <div className="recent-forum card">
      <div className="dsl-b18 bold ml20 mb-4">{title}</div>
      {recentTopic?.length > 0 ? (
        <>
          {recentTopic.map(
            (item, index) =>
              (visible ? true : index < 5) && (
                <div
                  className="d-flex forum-item py-1"
                  key={index}
                  onClick={() =>
                    displayMenu &&
                    history.push(`/community/forums/${item.id}/${item.categories && item.categories[0].id}`)
                  }
                >
                  <div className="d-flex d-flex-1 align-items-center">
                    <Avatar url={item.comments[0]?.author_url} name={item.author} />
                  </div>
                  <div className="d-flex-5">
                    <p className="dsl-b14 bold truncate-one mb-0">{item.name}</p>
                    <span className="mr-1 dsl-m12 text-400">
                      Created by: {item.comments[0]?.user?.first_name + ' ' + item.comments[0]?.user?.last_name}
                    </span>
                    {displayMenu && !title && (
                      <span className="mr-1 dsl-m12 text-400">In: {item.categories && item.categories[0].name}</span>
                    )}
                    <div className="d-flex">
                      <Icon name="far fa-eye mr-2 text-500" size={12} color="#969faa" />
                      <span className="dsl-d12 mr-4">{item.stats?.views || 0}</span>
                      <Icon name="fal fa-thumbs-up mr-2 text-500" size={12} color="#969faa" />
                      <span className="dsl-d12 mr-4">{item.stats?.likes || 0}</span>
                      <Icon name="far fa-comment mr-2 text-500" size={12} color="#969faa" />
                      <span className="dsl-d12 mr-4">{item.stats?.comments || 0}</span>
                    </div>
                  </div>
                  <div className="d-flex d-flex-1 justify-content-end">
                    <span className="dsl-b12 text-right">{toDuration(item.updated_at)}</span>
                  </div>
                </div>
              )
          )}
          <Button
            className="ml-auto mr-3"
            name={visible ? 'See Less' : 'See More'}
            type="link"
            onClick={() => setVisible(!visible)}
          />
        </>
      ) : (
        <div className="dsl-m14 text-center">No recent topic available</div>
      )}
    </div>
  )
}

RecentForum.propTypes = {
  title: PropTypes.string,
  RecentTopic: PropTypes.array,
  displayMenu: PropTypes.bool,
  departmentName: PropTypes.string,
  history: PropTypes.any,
  userRole: PropTypes.number,
  userName: PropTypes.string,
}

RecentForum.defaultProps = {
  title: null,
  RecentTopic: [],
  displayMenu: false,
  departmentName: null,
  history: {},
  userRole: null,
  userName: null,
}

export default RecentForum

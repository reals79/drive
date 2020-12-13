import React from 'react'
import PropTypes from 'prop-types'
import { Avatar, EditDropdown, Icon } from '@components'
import { history } from '~/reducers'
import { ForumManageMenu } from '~/services/config'
import './Forums.scss'

const TopicList = ({ data, displayMenu, departmentName, departmentId, userRole, userName, page, perPage, onMenu }) => {
  if (!data) return null

  return (
    <>
      {data.map(item => {
        const { id, name, categories, comments, stats } = item
        const authorName = `${comments[0]?.user?.first_name} ${comments[0]?.user?.last_name}`
        return (
          <div
            className="back-hover"
            key={id}
            onClick={() => history.push(`/community/forum-topic/${id}/${departmentId}`)}
          >
            <div className="d-flex back-hover-space my-4 align-center">
              <Avatar type="initial" url={comments[0]?.author_avatar} name={authorName} />
              <div className="d-flex ml-4 w-100">
                <div className="d-flex flex-column d-flex-7">
                  <span className="dsl-b16 bold mr-3">{name}</span>
                  <div className="d-flex mt-1">
                    <div className={(displayMenu ? 'd-flex mr-3' : 'd-flex-2 d-flex mr-3', 'align-items-center')}>
                      {displayMenu ? (
                        <span className="mr-1 dsl-m12 text-400">By:</span>
                      ) : (
                        <span className="mr-1 dsl-m12 text-400">Created by:</span>
                      )}
                      <span className="dsl-b14">{authorName}</span>
                    </div>
                    {displayMenu && (
                      <div className="d-flex d-flex-4 align-items-center ml-1">
                        <span className="mr-1 ml-3 dsl-m12 text-400">In: </span>
                        <span className="dsl-b14">{categories[0]?.name}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="mr-0">
                  <div className="dsl-m12 text-400 mr-2 mb-1">{displayMenu ? 'New' : departmentName}</div>
                  <div className="d-flex align-items-center">
                    <Icon name="far fa-eye mr-2 text-500" size={12} color="#969faa" />
                    <span className="dsl-d14 text-400 mr-4 w40">{stats?.views || 0}</span>
                    <Icon name="fal fa-thumbs-up mr-2 text-500" size={12} color="#969faa" />
                    <span className="dsl-d14 text-400 w40">{stats?.likes || 0}</span>
                    <Icon name="far fa-comment mr-2 text-500" size={12} color="#969faa" />
                    <span className="dsl-d14 text-400 w40">{stats?.comments || 0}</span>
                  </div>
                </div>
              </div>
              {displayMenu && (userName === authorName || userRole === 1) && (
                <EditDropdown options={ForumManageMenu} onChange={e => onMenu(e, userName, item, page, perPage)} />
              )}
            </div>
          </div>
        )
      })}
      {data.length === 0 && <div className="dsl-b16 text-center pb-3">No recent topic available</div>}
    </>
  )
}

TopicList.propTypes = {
  RecentTopic: PropTypes.array,
  displayMenu: PropTypes.bool,
  departmentName: PropTypes.string,
  history: PropTypes.any,
  userRole: PropTypes.number,
  userName: PropTypes.string,
  onMenu: PropTypes.func,
}

TopicList.defaultProps = {
  RecentTopic: [],
  displayMenu: false,
  departmentName: null,
  history: {},
  userRole: null,
  userName: null,
  onMenu: () => {},
}

export default TopicList

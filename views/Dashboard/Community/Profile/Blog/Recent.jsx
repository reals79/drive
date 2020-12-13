import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import PropTypes from 'prop-types'
import moment from 'moment'
import { Avatar, Button, Pagination } from '@components'
import { convertUrl } from '~/services/util'
import CommunityActions from '~/actions/community'

const Card = ({ avatar, user, date, title, description, special = null, onClick }) => (
  <div className="card cursor-pointer mt-3" onClick={onClick}>
    {special && <p className="dsl-b22 bold">{special}</p>}
    <div className="d-flex align-items-center justify-content-between">
      <div className="d-flex align-items-center">
        <Avatar url={avatar} className="mr-2" size="tiny" />
        <div>
          <p className="dsl-m12 mb-1">{`${user?.first_name} ${user?.last_name}`}</p>
          <p className="dsl-b12 mb-0">{user?.profile?.company}</p>
        </div>
      </div>
      <span className="dsl-m12">{date}</span>
    </div>
    <p className="dsl-b18 text-400 mt-4">{title}</p>
    <div className="truncate-three blog-detail w-100" dangerouslySetInnerHTML={{ __html: description }} />
    <div className="d-h-end">
      <Button type="link" className="p-0" name="Read more" />
    </div>
  </div>
)

const Recent = ({ data, onClick }) => {
  if (!data.posts || data.posts.data.length === 0) {
    return <p className="dsl-m12 mt-4 text-center">No posts to display.</p>
  }

  const dispatch = useDispatch()

  const handlePagination = e => {
    const payload = {
      userId: data.user_id,
      blogId: data.blog?.id,
      page: e,
    }
    dispatch(CommunityActions.getblogdetailsRequest(payload))
  }

  const page = data.posts.current_page
  const total = data.posts.last_page

  return (
    <>
      {data.posts.data.map((item, index) => (
        <Card
          key={`posts-${item.id}-${index}`}
          special={index === 0 ? 'Recent' : ''}
          user={item?.author}
          avatar={convertUrl(item?.author_avatar)}
          date={moment(item.updated_at).format('MMM DD, YY')}
          title={item.name}
          description={item.data.body}
          onClick={() => onClick(item)}
        />
      ))}
      <Pagination current={page} pers={[]} total={total} onChange={handlePagination} />
    </>
  )
}

Recent.propTypes = {
  data: PropTypes.shape({
    user_id: PropTypes.number,
    blog: PropTypes.shape({
      id: PropTypes.number,
    }),
    posts: PropTypes.shape({
      current_page: PropTypes.number,
      data: PropTypes.array,
      last_page: PropTypes.number,
    }),
  }),
}

Recent.defaultProps = {
  data: {
    user_id: 0,
    blog: {
      id: 0,
    },
    posts: {
      current_page: 0,
      data: [],
      last_page: 0,
    },
  },
}

export default Recent

import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import moment from 'moment'
import { contains } from 'ramda'
import { Avatar, Button, Icon, Input, Thumbnail } from '@components'
import AppActions from '~/actions/app'
import CommunityAction from '~/actions/community'
import { getImageURL } from '~/services/util'

const Comment = ({ className, data = {}, date = null, children = null }) => (
  <div className={classNames('d-flex', className)}>
    <Avatar url={data?.author_avatar} />
    <div className="d-flex-1 ml-2">
      <div className="d-flex justify-content-between mb-3">
        <div>
          <p className="dsl-m12 mb-2">{`${data.user?.first_name} ${data.user?.last_name}`}</p>
          <p className="dsl-b12 mb-0">{data.user?.profile?.company}</p>
        </div>
        {date && (
          <div className="d-flex align-items-center">
            <span className="dsl-m12">{date}</span>
          </div>
        )}
      </div>
      <p className="dsl-b14">{data.data?.body}</p>
      <div className={classNames('d-flex pb-3', children && 'border-bottom')}>
        <Icon name="fas fa-reply" color="#676767" size={14} />
        <span className="dsl-m14 ml-2">Reply</span>
        <Icon name="fal fa-thumbs-up ml-3" color="#676767" size={14} />
        <span className="dsl-m14 ml-2">{data.stats?.likes || 0}</span>
        <Icon name="fal fa-comment ml-4" color="#676767" size={14} />
        <span className="dsl-m14 ml-2">3</span>
      </div>
      {children}
    </div>
  </div>
)

const Detail = ({ data, posts, onSelect }) => {
  const [comment, setComment] = useState('')
  const authenticated = useSelector(state => state.app.token)

  const dispatch = useDispatch()
  const handleComment = () => {
    if (authenticated) {
      const payload = {
        comment: {
          parent_id: data.content_id,
          data: {
            body: comment,
          },
        },
      }
      dispatch(CommunityAction.postsavecommentRequest(payload, data.user_id))
      setComment('')
    } else {
      const route =
        contains('/community', location.pathname) || contains('/vendor-ratings', location.pathname)
          ? this.props.history.location.pathname
          : null
      const payload = {
        type: 'Authentication',
        data: {
          before: {
            route,
            after: null,
          },
        },
        callBack: null,
      }
      dispatch(AppActions.modalRequest(payload))
    }
  }

  return (
    <>
      <div className="card mt-3">
        <div className="d-h-between">
          <div className="d-flex align-items-center">
            <Avatar url={data.author_avatar} className="mr-2" />
            <div>
              <p className="dsl-m12 mb-1">{`${data.author?.first_name} ${data.author?.last_name}`}</p>
              <p className="dsl-b12 mb-0">{data.author?.profile?.company}</p>
            </div>
          </div>
          <span className="dsl-m12">{moment(data.updated_at).format('MMM DD, YY')}</span>
        </div>
        <p className="dsl-b18 text-400 mt-4">{data.name}</p>
        <div className="blog-detail w-100" dangerouslySetInnerHTML={{ __html: data.data?.body }} />
        <div className="d-flex border border-5 mt-4 p-3">
          <Avatar url={data.author_avatar} className="mr-2" size="medium" />
          <div className="ml-3">
            <p className="dsl-b14 text-400 mb-2">{`${data.author?.first_name} ${data.author?.last_name}`}</p>
            <p className="dsl-b12 text-400 mb-1">{data.author?.profile?.company}</p>
            <h6 className="dsl-m12">{data.author?.profile?.job_title}</h6>
          </div>
          <div className="d-flex-1 ml-4">
            <p className="dsl-m14 font-italic">{data.data.seo_description}</p>
            <Button className="ml-auto" type="link" name="CONTACT ME" />
          </div>
        </div>
        <div className="d-flex align-items-center mt-4">
          <Icon name="fal fa-eye" color="#676767" size={14} />
          <span className="dsl-m14 ml-2">{data.stats?.views || 0}</span>
          <Icon name="fal fa-thumbs-up ml-3" color="#676767" size={14} />
          <span className="dsl-m14 ml-2">{data.stats?.likes || 0}</span>
          <Icon name="fal fa-comment ml-4" color="#676767" size={14} />
          <span className="dsl-m14 ml-2">{data.stats?.comments || 0}</span>
          <Icon name="fal fa-share-square ml-auto" color="#676767" size={14} />
          <span className="dsl-m16 text-400 ml-2">Share</span>
        </div>
      </div>
      <div className="card mt-3">
        <p className="dsl-b20 bold">Comments</p>
        {data?.comments?.map((item, index) => (
          <Comment data={item} date={moment(item.updated_at).format('MMM DD, YY')} key={`c${index}`} />
        ))}
        <div className="d-flex mt-3">
          <Avatar url={data.avatar} />
          <Input
            className="d-flex-1 ml-2"
            placeholder="Type a comment..."
            direction="vertical"
            as="textarea"
            rows={3}
            value={comment}
            onChange={e => setComment(e)}
          />
          <Button className="ml-3" type="medium" name="COMMENT" onClick={handleComment} />
        </div>
      </div>
      <div className="card mt-3">
        <div className="d-flex justify-content-between">
          <Button type="link">
            <Icon name="fal fa-chevron-left" color="#376caf" size={14} />
            <span className="dsl-p14 ml-2">PREV POST</span>
          </Button>
          <Button type="link">
            <span className="dsl-p14 mr-2">NEXT POST</span>
            <Icon name="fal fa-chevron-right" color="#376caf" size={14} />
          </Button>
        </div>
      </div>
      <div className="card mt-3">
        <p className="dsl-b22 bold mb-0">Recommended Posts</p>
        {posts.map((item, index) => {
          if (item.id === data.id) return null
          const thumbnail = getImageURL(item.data?.body)
          return (
            <div className="d-flex cursor-pointer mt-3" key={`p${index}`} onClick={() => onSelect(item)}>
              <Thumbnail src={thumbnail} size="regular" />
              <div className="ml-3">
                <p className="dsl-b16 bold mb-2">{item.name}</p>
                <p className="dsl-b16 truncate-two mb-3">{item.data?.body?.replace(/(<([^>]+)>)/gi, '')}</p>
                <div className="d-flex">
                  <Avatar url={item.author_avatar} />
                  <div className="ml-2">
                    <p className="dsl-m12 mb-1">{`${item.author?.first_name} ${item.author?.last_name}`}</p>
                    <p className="dsl-b12 mb-0">{item.author?.profile?.company}</p>
                  </div>
                  <span className="dsl-m12 ml-auto">{moment(item.updated_at).format('MMM DD, YY')}</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}

Detail.propTypes = {
  data: PropTypes.any.isRequired,
  posts: PropTypes.array,
  onSelect: PropTypes.func,
}

Detail.defaultProps = {
  data: {},
  posts: [],
  onSelect: () => {},
}

export default Detail

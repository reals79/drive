import React from 'react'
import ReadMoreAndLess from 'react-read-more-less'
import { Avatar, Button, Icon } from '@components'

const Card = ({ avatar, date, images, index, stats, text, title, user, onClick, onOpen }) =>
  index < 5 ? (
    <div className="card cursor-pointer back-hover" onClick={onClick}>
      <div className="d-flex align-items-center justify-content-between">
        <div className="d-flex align-items-center">
          <Avatar
            url={avatar}
            name={`${user?.first_name} ${user?.last_name}`}
            className="mr-2"
            size="tiny"
            onToggle={onOpen}
          />
          <div>
            <p className="dsl-b14 text-400 mb-1">{`${user?.first_name} ${user?.last_name}`}</p>
            <p className="dsl-b12 mb-0">{user?.profile?.company || 'Unknown'}</p>
          </div>
        </div>
        <span className="dsl-b12">{date}</span>
      </div>
      <p className="dsl-b18 bold mt-4">{title}</p>
      {images[0] ? (
        <div className="post-body img" dangerouslySetInnerHTML={{ __html: images[0] }} />
      ) : (
        <div className="d-flex justify-content-center my-4">
          <span className="dsl-m14">No Image Avaliable.</span>
        </div>
      )}
      <div className="dsl-b16 text-400">
        <ReadMoreAndLess
          className="read-more-content"
          charLimit={190}
          readMoreText="Read more"
          readLessText="Read less"
        >
          {text.trim()}
        </ReadMoreAndLess>
      </div>
      <div className="d-flex py-3">
        <Icon name="far fa-eye mr-2 text-500" size={12} color="#969faa" />
        <span className="dsl-d12">{stats?.views || 0}</span>
        <Icon name="fal fa-thumbs-up ml-4 mr-2 text-500" size={12} color="#969faa" />
        <span className="dsl-d12">{stats?.likes || 0}</span>
        <Icon name="far fa-comment ml-auto mr-2 text-500" size={12} color="#969faa" />
        <span className="dsl-d12">{stats?.comments || 0}</span>
      </div>
      {/*<Button className="ml-auto my-2" name="SEE ALL" type="link" onClick={onClick} />*/}
    </div>
  ) : (
    <div className="d-flex cursor-pointer small-card back-hover" onClick={onClick}>
      <div className="d-flex d-flex-2 align-items-center justify-content-center overflow-hidden mr-3">
        {images[0] ? (
          <div className="post-body img" dangerouslySetInnerHTML={{ __html: images[0] }} />
        ) : (
          <span className="dsl-m14">No Image Avaliable.</span>
        )}
      </div>
      <div className="d-flex-3">
        <div className="overflow-hidden h75">
          <p className="dsl-b14 bold mb-2">{title}</p>
          <p className="dsl-b14 text-400">{text}</p>
        </div>
        <div className="d-flex align-items-center h25">
          <Icon name="far fa-eye mr-2 text-500" size={12} color="#969faa" />
          <span className="dsl-d12">{stats?.views || 0}</span>
          <Icon name="fal fa-thumbs-up ml-4 mr-2 text-500" size={12} color="#969faa" />
          <span className="dsl-d12">{stats?.likes || 0}</span>
          <Icon name="far fa-comment ml-4 mr-2 text-500" size={12} color="#969faa" />
          <span className="dsl-d12">{stats?.comments || 0}</span>
        </div>
      </div>
    </div>
  )
export default Card

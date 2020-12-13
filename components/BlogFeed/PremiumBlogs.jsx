import React from 'react'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import moment from 'moment'
import { toLower } from 'ramda'
import CommunityActions from '~/actions/community'
import { convertUrl } from '~/services/util'
import Card from './Card.jsx'
import './BlogFeed.scss'

const PremiumBlogs = ({ data, title }) => {
  const history = useHistory()
  const dispatch = useDispatch()

  const handleClick = e => {
    dispatch(CommunityActions.getcommunityuserRequest({ userId: e.author.id, type: 'others' }))
    history.push(
      `/in/${toLower(e.author.first_name + '-' + e.author.last_name)}/blog?user_id=${e.author.id}&blog_id=${e.id}`
    )
  }

  const handleOpenProfile = e => () => {
    dispatch(CommunityActions.getcommunityuserRequest({ userId: e.author.id, type: 'others' }))
    history.push(`/in/${toLower(e.author.first_name + '-' + e.author.last_name)}/about?user_id=${e.author.id}`)
  }
  return (
    <div className="recent-blogs-feed card">
      <p className="dsl-b18 bold blogs-title">{title}</p>
      {data.length > 0 ? (
        <>
          {data.map((item, index) => (
            <Card
              avatar={convertUrl(item.author_avatar)}
              date={moment(item.updated_at).format('MMM DD, YY')}
              key={item.id}
              images={item.body_images}
              index={index}
              stats={item.stats}
              text={item.body_text}
              title={item.name}
              user={item.author}
              onClick={() => handleClick(item)}
              onOpen={handleOpenProfile(item)}
            />
          ))}
        </>
      ) : (
        <p className="dsl-m14 mt-4 text-center">No posts to display.</p>
      )}
    </div>
  )
}

PremiumBlogs.propTypes = {
  data: PropTypes.array,
  title: PropTypes.string,
}

PremiumBlogs.defaultProps = {
  data: [],
  title: '',
}

export default PremiumBlogs

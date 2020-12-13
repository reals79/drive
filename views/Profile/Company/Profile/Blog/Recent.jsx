import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { uniqBy, prop } from 'ramda'
import { Avatar, Thumbnail } from '@components'
import { convertUrl } from '~/services/util'

const Card = ({ avatar, user, date, title, thumbnail, description, special = '', onClick }) => (
  <div className="card mt-3" onClick={onClick}>
    <p className="dsl-b22 bold">{special}</p>
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
    <Thumbnail src={thumbnail} size="responsive" />
    <p className="dsl-b14 mt-3 mb-0 blog-detail">{description}</p>
  </div>
)

const Recent = ({ data, onClick }) => {
  if (!data.data || data.data.length === 0) return <p className="dsl-m12 mt-4 text-center">No blogs</p>
  const posts = uniqBy(prop('id'), data.data)

  return posts.map((item, index) => (
    <Card
      key={index}
      user={item?.author}
      avatar={convertUrl(item?.author_avatar)}
      date={moment(item.updated_at).format('MMM DD, YY')}
      title={item.name}
      description={item.data.body}
      thumbnail={item.data.thumbnail}
      onClick={() => onClick(item)}
    />
  ))
}

Recent.propTypes = {
  data: PropTypes.shape({
    current_page: PropTypes.number,
    data: PropTypes.array,
    from: PropTypes.number,
    per_page: PropTypes.number,
  }),
}

Recent.defaultProps = {
  data: {
    current_page: 0,
    data: [],
    from: 0,
    per_page: 0,
  },
}

export default Recent

import React, { memo } from 'react'
import PropTypes from 'prop-types'
import { equals, isEmpty, slice } from 'ramda'
import { Button } from '@components'
import EmptyBlog from './EmptyBlog'
import BlogItem from './BlogItem'
import './VendorSearchBlogs.scss'

const VendorSearchBlogs = ({ data, type, onSeeAll }) => {
  const subs = data.length > 3 ? slice(0, 3, data) : data
  return (
    <div className="vendor-search-blogs">
      <div className="d-h-between">
        <div className="d-h-start">
          <p className="dsl-b18 bold mr-2">Blogs</p>
          <p className="dsl-p12">{`(${data.length})`}</p>
        </div>
      </div>
      {isEmpty(data) ? (
        <EmptyBlog />
      ) : (
        <>
          {equals(type, 'sub') ? (
            <div className="border-bottom pb-3 mb-5">
              {subs.map(blog => {
                const { id, name, data, stats, updated_at } = blog
                const imgURL = data.body ? data.body.match(/<img\s.*?\bsrc="(.*?)".*?>/) : null
                const thumbURL = imgURL && imgURL[1] ? imgURL[1] : null
                return (
                  <BlogItem
                    key={`blog-${id}`}
                    name={name}
                    description={data.description}
                    thumb={thumbURL}
                    stats={stats}
                    createAt={updated_at}
                  />
                )
              })}
              <div className="d-h-end">
                <Button type="link" name="SEE ALL" onClick={onSeeAll} />
              </div>
            </div>
          ) : (
            <>
              {data.map(blog => {
                const { id, name, data, stats, updated_at } = blog
                const imgURL = data.body ? data.body.match(/<img\s.*?\bsrc="(.*?)".*?>/) : null
                const thumbURL = imgURL && imgURL[1] ? imgURL[1] : null
                return (
                  <BlogItem
                    key={`blog-${id}`}
                    name={name}
                    description={data.description}
                    thumb={thumbURL}
                    stats={stats}
                    createAt={updated_at}
                    type="detail"
                  />
                )
              })}
            </>
          )}
        </>
      )}
    </div>
  )
}

VendorSearchBlogs.propTypes = {
  data: PropTypes.array,
  type: PropTypes.oneOf(['sub', 'full']),
  onSeeAll: PropTypes.func,
}

VendorSearchBlogs.defaultProps = {
  data: [],
  type: 'sub',
  onSeeAll: () => {},
}

export default memo(VendorSearchBlogs)

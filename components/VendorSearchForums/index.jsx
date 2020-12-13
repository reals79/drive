import React, { memo } from 'react'
import PropTypes from 'prop-types'
import { equals, isEmpty, slice } from 'ramda'
import { Button } from '@components'
import EmptyForum from './EmptyForum'
import ForumItem from './ForumItem'
import './VendorSearchForums.scss'

const VendorSearchForums = ({ data, type, onSeeAll }) => {
  const subs = data.length > 2 ? slice(0, 2, data) : data
  return (
    <div className="vendor-search-forums">
      <div className="d-h-between">
        <div className="d-h-start">
          <p className="dsl-b18 bold mr-2">Forums</p>
          <p className="dsl-p12">{`(${data.length})`}</p>
        </div>
      </div>
      {isEmpty(data) ? (
        <EmptyForum />
      ) : (
        <>
          {equals(type, 'sub') ? (
            <>
              {subs.map(forum => {
                const { id, name, stats } = forum
                return <ForumItem key={`forum-${id}`} name={name} stats={stats} />
              })}
              <div className="d-h-end">
                <Button type="link" name="SEE ALL" onClick={onSeeAll} />
              </div>
            </>
          ) : (
            <>
              {data.map(forum => {
                const { id, name, stats } = forum
                return <ForumItem key={`forum-${id}`} name={name} stats={stats} type="detail" />
              })}
            </>
          )}
        </>
      )}
    </div>
  )
}

VendorSearchForums.propTypes = {
  data: PropTypes.array,
  type: PropTypes.oneOf(['sub', 'full']),
  onSeeAll: PropTypes.func,
}

VendorSearchForums.defaultProps = {
  data: [],
  type: 'sub',
  onSeeAll: () => {},
}

export default memo(VendorSearchForums)

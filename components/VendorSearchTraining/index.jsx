import React, { memo } from 'react'
import PropTypes from 'prop-types'
import { equals, isEmpty, slice, find, propEq } from 'ramda'
import { Button } from '@components'
import EmptyTraining from './EmptyTraining'
import TrainingItem from './TrainingItem'
import './VendorSearchTraining.scss'

const VendorSearchTraining = ({ authors, data, type, onSeeAll }) => {
  const subs = data.length > 3 ? slice(0, 3, data) : data
  return (
    <div className="vendor-search-training">
      <div className="d-h-between">
        <div className="d-h-start">
          <p className="dsl-b18 bold mr-2">Training</p>
          <p className="dsl-p12">{`(${data.length})`}</p>
        </div>
        {type === 'full' && <Button type="link" name="Advanced Search" />}
      </div>
      {isEmpty(data) ? (
        <EmptyTraining />
      ) : (
        <>
          {equals(type, 'sub') ? (
            <div className="border-bottom pb-3 mb-5">
              {subs.map((training, index) => {
                const {
                  id,
                  author_id,
                  card_type_id,
                  data,
                  name,
                  rating,
                  recommended,
                  title,
                  thumbnail,
                } = training
                const { author_title, author_avatar, course_count, module_count } = data
                let author = find(propEq('id', author_id), authors) || {}
                author = {
                  ...author,
                  author_title,
                  author_avatar,
                }
                return (
                  <TrainingItem
                    key={`training-${id}-${index}`}
                    author={author}
                    modules={course_count || module_count}
                    typeId={card_type_id}
                    rating={rating || 0}
                    ratingCount={recommended || 0}
                    title={name || title}
                    thumbURL={thumbnail || data.thumb_url}
                  />
                )
              })}
              <div className="d-h-end">
                <Button type="link" name="SEE ALL" onClick={onSeeAll} />
              </div>
            </div>
          ) : (
            <>
              {data.map((training, index) => {
                const {
                  id,
                  author_id,
                  card_type_id,
                  data,
                  name,
                  rating,
                  recommended,
                  title,
                  thumbnail,
                } = training
                const { author_title, author_avatar, course_count, module_count } = data
                let author = find(propEq('id', author_id), authors) || {}
                author = {
                  ...author,
                  author_title,
                  author_avatar,
                }
                return (
                  <TrainingItem
                    key={`training-${id}-${index}`}
                    author={author}
                    modules={course_count || module_count}
                    typeId={card_type_id}
                    rating={rating || 0}
                    ratingCount={recommended || 0}
                    title={name || title}
                    thumbURL={thumbnail || data.thumb_url}
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

VendorSearchTraining.propTypes = {
  authors: PropTypes.array,
  data: PropTypes.array,
  type: PropTypes.oneOf(['sub', 'full']),
  onSeeAll: PropTypes.func,
}

VendorSearchTraining.defaultProps = {
  authors: [],
  data: [],
  type: 'sub',
  onSeeAll: () => {},
}

export default memo(VendorSearchTraining)

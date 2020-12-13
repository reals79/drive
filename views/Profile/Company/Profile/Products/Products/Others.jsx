import React from 'react'
import PropTypes from 'prop-types'
import { Avatar } from '@components'

const Others = ({ data }) => (
  <>
    <p className="dsl-b24 bold">Other Products</p>
    {data?.popular?.data?.map(item => (
      <div className="d-flex align-items-center mt-3" key={`p${item.id}`}>
        <Avatar url={item.logo} type="logo" />
        <div className="ml-3">
          <p className="dsl-b14 mb-1">{item.name}</p>
          <p className="dsl-m12 mb-0">
            {Math.round(item.stats?.rating_recommended_avg * 100) / 100}% Recommended {item.stats?.rating_count} Ratings
          </p>
        </div>
      </div>
    ))}
  </>
)

export default Others

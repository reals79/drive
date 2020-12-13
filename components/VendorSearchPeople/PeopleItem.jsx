import React, { memo } from 'react'
import PropTypes from 'prop-types'
import { Avatar, Button } from '@components'
import { convertUrl } from '~/services/util'
import './VendorSearchPeople.scss'

const PeopleItem = ({ connects, job, name, url, onConnect }) => {
  const avatarURL = convertUrl(url, '/images/default.png')
  return (
    <div className="vendor-search-people-item">
      <Avatar className="mb-3" url={avatarURL} type="logo" size="medium" />
      <p className="dsl-b14 bold">{name}</p>
      <p className="dsl-b14 text-center">{job}</p>
      <p className="dsl-m12">{`${connects} mutual connections`}</p>
      <Button type="medium" name="CONNECT" onClick={onConnect} />
    </div>
  )
}

PeopleItem.propTypes = {
  connects: PropTypes.number,
  job: PropTypes.string,
  name: PropTypes.string,
  url: PropTypes.string,
  onConnect: PropTypes.func,
}

PeopleItem.defaultProps = {
  connects: 0,
  job: '',
  name: '',
  url: null,
  onConnect: () => {},
}

export default memo(PeopleItem)

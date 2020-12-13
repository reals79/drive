import React from 'react'
import PropTypes from 'prop-types'
import { Avatar, Button } from '@components'
import './ConnectionCard.scss'

const ConnectionCard = ({ data, type, tab, onOpen, onClick, onReject }) => {
  const { avatar, connector, first_name, last_name, profile, status, stats } = data
  let btnText = 'MESSAGE'
  if (tab === 'received' || tab === 'recommended') {
    btnText = 'CONNECT'
  } else if (tab === 'sent') {
    btnText = 'DISMISS'
  } else if (tab === 'companies') {
    btnText = 'UNFOLLOW'
  }

  if (type === 'company') {
    return (
      <div className="connection-card">
        <div className={`card-status ${status === 'active' ? 'online' : ''}`} />
        <Avatar
          className="mb-3"
          url={connector?.avatar}
          name={connector?.content?.name}
          size="small"
          onToggle={onOpen}
        />
        <p className="dsl-b16 bold text-center truncate-two mb-2">{connector?.content?.name}</p>
        <p className="dsl-b14 text-400 truncate-two text-center">{connector?.slug}</p>
        <p className="dsl-m12 text-400">{`Followed by: ${connector?.content?.stats?.product_count}`}</p>
        {tab === 'sent' && <p className="dsl-m12 text-400">Connection request sent...</p>}
        <Button type="medium" name={btnText} onClick={onClick} />
        {tab === 'received' && <Button type="link" name="REJECT" onClick={onReject} />}
      </div>
    )
  }

  return (
    <div className={`connection-card ${tab === 'recommended' ? 'light-blue' : ''}`}>
      {tab !== 'recommended' && <div className={`card-status ${status === 'active' ? 'online' : ''}`} />}
      <Avatar className="mb-3" url={avatar} name={`${first_name} ${last_name}`} size="small" onToggle={onOpen} />
      <p className="dsl-b16 bold truncate-two text-center mb-2">{`${first_name} ${last_name}`}</p>
      <p className="dsl-b14 text-400 truncate-two text-center">{profile?.job_title}</p>
      <p className="dsl-m12 text-400">{stats ? `${stats.connections} mutual connections` : 'Based on your profile'}</p>
      {tab === 'sent' && <p className="dsl-m12 text-400">Connection request sent...</p>}
      <Button type="medium" name={btnText} onClick={onClick} />
      {tab === 'received' && <Button type="link" name="REJECT" onClick={onReject} />}
    </div>
  )
}

ConnectionCard.propTypes = {
  data: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
  }),
  type: PropTypes.oneOf(['company', 'people']),
  tab: PropTypes.string,
  onClick: PropTypes.func,
  onOpen: PropTypes.func,
  onReject: PropTypes.func,
}

ConnectionCard.defaultProps = {
  data: {
    id: 0,
    name: '',
  },
  type: 'people',
  tab: '',
  onClick: () => {},
  onOpen: () => {},
  onReject: () => {},
}

export default ConnectionCard

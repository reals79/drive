import React, { memo, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import OutsideClickHandler from 'react-outside-click-handler'
import { Link, useParams } from 'react-router-dom'
import classNames from 'classnames'
import { findIndex, includes, propEq } from 'ramda'
import { Animations, Button, EditDropdown, Icon } from '@components'
import AppActions from '~/actions/app'
import { convertUrl } from '~/services/util'
import './ProfileHeader.scss'

const ProfileHeader = props => {
  const dispatch = useDispatch()

  const {
    user,
    company,
    avatar,
    banner,
    routes,
    editable,
    rootPath,
    type,
    title,
    facebook,
    twitter,
    linkedin,
    youtube,
    description,
    onLogin,
    onChange,
    onSelect,
    onConnect,
  } = props

  const token = useSelector(state => state.app.token)
  const loginUser = useSelector(state => state.app.user?.community_user)
  const authenticated = token && token !== ''
  const isSelf = loginUser?.id === user?.id

  const [opened, setOpened] = useState(false)
  const params = useParams()

  useEffect(() => {
    if (authenticated && !isSelf) {
      dispatch(AppActions.getuserconnectionsRequest())
    }
  }, [])

  const getClass = (base, index) => {
    const current = findIndex(e => e.name === params.tab, routes.tabs)
    return classNames('section', base === params.tab && 'active', current - 1 === index && 'before')
  }

  const handleCog = e => () => {
    setOpened(false)
  }

  const handleClickSocialLink = url => () => {
    window.open(url, '_blank')
  }

  const getPendingState = () => {
    const pendingConnections = loginUser.connections
      ? [...loginUser.connections?.pending_connections_received, ...loginUser.connections?.pending_connections_sent]
      : []
    if (type === 'employee') {
      const idx = findIndex(x => x.connector?.user_id === user?.id, pendingConnections)
      return idx > -1
    }
    const idx = findIndex(x => x.connector?.id === company?.id, pendingConnections)
    return idx > -1
  }

  const getConnectedState = () => {
    const activeConnections = loginUser.connections?.active_user_connections || []
    const followCompanies = loginUser.connections?.following_companies || []
    if (type === 'employee') {
      const idx = findIndex(x => x.connector?.user_id === user?.id, activeConnections)
      return idx > -1
    }
    const idx = findIndex(x => x.connector?.id === company?.id, followCompanies)
    return idx > -1
  }

  const avatarURL = convertUrl(avatar, type === 'company' ? '/images/default_company.svg' : '/images/default.png')
  const bannerURL = convertUrl(
    banner,
    type === 'company' ? '/images/bg-company-cover.png' : '/images/employee-banner.png'
  )
  const connected = authenticated ? (!isSelf ? getConnectedState() : true) : false
  const pending = authenticated && !isSelf ? getPendingState() : false

  return (
    <div className="profile-header">
      <div className="top-section" style={{ backgroundImage: `url(${bannerURL})` }}>
        <div className="info-bar">
          <div className="avatar" style={{ backgroundImage: `url(${avatarURL})` }} />
          <div className="main-info">
            <p className="dsl-w28 mb-2 text-400">{title}</p>
            <p className="dsl-w14">{description}</p>
          </div>
          <div className="social-info">
            <div>
              {!authenticated ? (
                <div className="d-flex align-items-center login-info">
                  <Button name="Login to Connect" className="login-button mr-2" onClick={() => onLogin()} />
                </div>
              ) : (
                <>
                  {pending ? (
                    <p className="dsl-w16">Connection request has been sent...</p>
                  ) : (
                    <>
                      {!connected && (
                        <Button type="medium" className="btn-connect" name="CONNECT" onClick={onConnect} />
                      )}
                    </>
                  )}
                </>
              )}
            </div>
            <div className="d-h-end">
              {facebook && (
                <Button type="link" className="social-link-button" onClick={handleClickSocialLink(facebook)}>
                  <Icon name="fab fa-facebook-f" size={14} color="white" />
                </Button>
              )}
              {twitter && (
                <Button type="link" className="social-link-button" onClick={handleClickSocialLink(twitter)}>
                  <Icon name="fab fa-twitter ml-3" size={14} color="white" />
                </Button>
              )}
              {linkedin && (
                <Button type="link" className="social-link-button" onClick={handleClickSocialLink(linkedin)}>
                  <Icon name="fab fa-linkedin-in ml-3" size={14} color="white" />
                </Button>
              )}
              {youtube && (
                <Button type="link" className="social-link-button" onClick={handleClickSocialLink(youtube)}>
                  <Icon name="fab fa-youtube ml-3" size={14} color="white" />
                </Button>
              )}
            </div>
          </div>
        </div>
        <div className="dots-menu">
          <EditDropdown options={['Edit']} onChange={onSelect} />
        </div>
      </div>
      <div className="header-nav">
        {routes.tabs.map((item, index) => (
          <div className={getClass(item.name, index)} key={`route${index}`}>
            <Link
              to={`${rootPath}/${item.name}${isSelf ? '' : `?user_id=${user?.id}`}`}
              className="section-item dsl-d14"
            >
              {item.label}
            </Link>
            <div className="section-divider" />
          </div>
        ))}
        {routes.options?.length > 0 && (
          <div
            className={classNames(
              'section',
              includes(params.tab, ['account-admin', 'blog-admin', 'reports']) && 'active'
            )}
          >
            <OutsideClickHandler onOutsideClick={() => setOpened(false)}>
              <div className="section-item border-0 p-0 position-relative">
                <div className="px-3 cursor-pointer h-100 d-center" onClick={() => setOpened(!opened)}>
                  <Icon name="fal fa-cog" color="white" size={14} />
                </div>
                <Animations.Popup className="popup box-shadow" enter={10} exit={0} opened={opened}>
                  {routes.options.map((item, index) => (
                    <Link
                      key={`option${index}`}
                      to={`${rootPath}/${item.name}`}
                      className="dsl-d14"
                      onClick={handleCog(item.name)}
                    >
                      {item.label}
                    </Link>
                  ))}
                </Animations.Popup>
              </div>
            </OutsideClickHandler>
          </div>
        )}
      </div>
    </div>
  )
}

ProfileHeader.propTypes = {
  avatar: PropTypes.string,
  user: PropTypes.shape({ id: PropTypes.number }),
  company: PropTypes.shape({ id: PropTypes.number }),
  banner: PropTypes.string,
  routes: PropTypes.any,
  editable: PropTypes.bool,
  type: PropTypes.oneOf(['company', 'employee']),
  title: PropTypes.string,
  description: PropTypes.string,
  facebook: PropTypes.string,
  twitter: PropTypes.string,
  linkedin: PropTypes.string,
  youtube: PropTypes.string,
  onChange: PropTypes.func,
  onDropdown: PropTypes.func,
  onSelect: PropTypes.func,
  onConnect: PropTypes.func,
}

ProfileHeader.defaultProps = {
  avatar: null,
  user: { id: 0 },
  company: { id: 0 },
  banner: null,
  routes: { tabs: [], options: [] },
  editable: false,
  type: 'company',
  title: ' ',
  description: 'Followed by: 104',
  facebook: null,
  twitter: null,
  linkedin: null,
  youtube: null,
  onChange: () => {},
  onDropdown: () => {},
  onSelect: () => {},
  onConnect: () => {},
}

export default memo(ProfileHeader)

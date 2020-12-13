import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Route, Switch, useHistory, useLocation } from 'react-router-dom'
import { toast } from 'react-toastify'
import { dropLast, equals, filter, find, isEmpty, join, propEq, split } from 'ramda'
import queryString from 'query-string'
import { NotFound, ProfileHeader } from '@components'
import AppActions from '~/actions/app'
import CommunityActions from '~/actions/community'
import About from '~/views/Dashboard/Community/Profile/About'
import Blog from '~/views/Dashboard/Community/Profile/Blog'
import BlogAdmin from '~/views/Dashboard/Community/Profile/BlogAdmin'
import AccountAdmin from '~/views/Dashboard/Community/Profile/AccountAdmin'
import Connections from '~/views/Dashboard/Community/Profile/Connections'

const TABS = [
  { name: 'activity', label: 'Activity' },
  { name: 'about', label: 'About' },
  { name: 'blog', label: 'Blog' },
  { name: 'connections', label: 'Connections' },
  { name: 'recommendations', label: 'Recommendations' },
]
const OPTIONS = [
  { name: 'account-admin', label: 'Account Admin' },
  { name: 'blog-admin', label: 'Blog Admin' },
  { name: 'reports', label: 'Reports' },
]

const Profile = () => {
  const dispatch = useDispatch()
  const history = useHistory()
  const location = useLocation()
  const values = queryString.parse(location.search)

  const loginUser = useSelector(state => state.app.user)
  const user = values.user_id ? { community_user: { id: Number(values.user_id) } } : loginUser
  const type = values.user_id ? 'others' : 'me'
  const blogs = useSelector(state => state.community.communityBlogs)
  const authenticated = !isEmpty(useSelector(state => state.app.token))

  const [editable, setEditable] = useState(false)
  const [prevUser, setPrevUser] = useState(null)
  const [avatar, setAvatar] = useState(null)
  const [cover, setCover] = useState(null)
  const [recentBlog, setRecentBlog] = useState(null)

  const communityBlog = find(propEq('user_id', user.community_user?.id), blogs)
  const communityUser = communityBlog?.entity?.user
  const facebook = communityUser?.profile?.facebook
  const twitter = communityUser?.profile?.twitter
  const linkedin = communityUser?.profile?.linked_in
  const youtube = communityUser?.profile?.youtube

  let _path = '/community/profile'

  if (!equals(communityUser, prevUser)) {
    setAvatar(communityUser?.avatar)
    setCover(communityUser?.cover_url)
    setPrevUser(communityUser)
  }

  const getCommunityUserDetail = () => {
    if (user.community_user?.id) {
      dispatch(CommunityActions.getcommunityuserRequest({ userId: user.community_user?.id, type }))
    } else {
      dispatch(
        AppActions.modalRequest({
          type: 'Authentication',
          data: { before: { route: '/community/profile' } },
        })
      )
    }
  }

  useEffect(() => {
    getCommunityUserDetail()
  }, [])

  useEffect(() => {
    if (history.location.state) {
      setRecentBlog(history.location.state?.recent)
    }
    if (values?.blog_id) {
      const rb = communityBlog?.posts?.data
        ? find(propEq('id', Number(values.blog_id)), communityBlog?.posts?.data)
        : null
      setRecentBlog(rb)
    }
  })

  const handleSelectOption = e => {
    if (e === 'edit') {
      setEditable(true)
    }
  }

  const handleCancelEdit = () => {
    setEditable(false)
    getCommunityUserDetail()
  }

  const handleSetCover = e => {
    setCover(e)
  }

  const handleSetAvatar = e => {
    setAvatar(e)
  }

  const handleConnectCallBack = () => {
    toast.success('Connection Request has been sent', {
      position: toast.POSITION.TOP_RIGHT,
      pauseOnFocusLoss: false,
      hideProgressBar: true,
    })
    dispatch(AppActions.fetchnotificationsRequest())
  }

  const handleConnect = () => {
    if (type === 'others') {
      const payload = {
        data: { user_id: loginUser.community_user?.id, connect_user_id: communityUser.id },
        after: { type: 'GETUSERCONNECTIONS_REQUEST' },
        callback: handleConnectCallBack,
      }
      dispatch(CommunityActions.postcommunityconnectRequest(payload))
    }
  }

  const handleLogin = () => {
    const route = history.location.pathname
    dispatch(
      AppActions.modalRequest({
        type: 'Authentication',
        data: {
          before: {
            route,
            after: null,
          },
        },
        callBack: null,
      })
    )
  }

  const handleChangeProfile = e => () => {
    switch (e) {
      case 'avatar':
        dispatch(
          AppActions.modalRequest({
            type: 'Upload Vendor Avatar',
            data: { before: { entity: communityUser?.entity?.id, userId: communityUser?.hcm_user_id } },
            callBack: handleSetAvatar,
          })
        )
        break

      case 'cover':
        dispatch(
          AppActions.modalRequest({
            type: 'Upload Background Image',
            data: { before: { entity: communityUser?.entity?.id } },
            callBack: handleSetCover,
          })
        )
        break

      case 'social':
        dispatch(
          AppActions.modalRequest({
            type: 'Link Social Networks',
            data: { before: { user: communityUser } },
            callBack: getCommunityUserDetail,
          })
        )
        break

      default:
        break
    }
  }

  if (!communityUser) return null
  let _TABS = TABS
  if (!communityBlog?.has_blog) {
    _TABS = filter(x => x.name !== 'blog', TABS)
  }

  const paths = dropLast(
    1,
    filter(e => e !== '', split('/', location.pathname))
  )
  _path = '/' + join('/', paths)

  return (
    <div className="community-profile">
      <ProfileHeader
        type="employee"
        editable={editable}
        avatar={avatar}
        banner={cover}
        user={communityUser}
        title={`${communityUser?.first_name} ${communityUser?.last_name}`}
        description={`Company: ${communityUser?.profile?.company}`}
        initialTab={1}
        rootPath={_path}
        routes={{
          tabs: _TABS,
          options: communityBlog?.can_edit_blog ? OPTIONS : [{ name: 'account-admin', label: 'Account Admin' }],
        }}
        authenticated={authenticated}
        facebook={facebook}
        twitter={twitter}
        linkedin={linkedin}
        youtube={youtube}
        onLogin={handleLogin}
        onChange={handleChangeProfile}
        onDropdown={e => setIndex(e)}
        onSelect={handleSelectOption}
        onConnect={handleConnect}
      />
      <Switch>
        <Route exact path={`${_path}/activity`}>
          <div />
        </Route>
        <Route exact path={`${_path}/about`}>
          <About
            user={communityUser}
            authenticated={authenticated}
            editable={editable}
            avatar={avatar}
            cover={cover}
            onLogin={handleLogin}
            onCancel={handleCancelEdit}
          />
        </Route>
        <Route exact path={`${_path}/blog`}>
          <Blog data={communityBlog} recentBlog={recentBlog} />
        </Route>
        <Route exact path={`${_path}/connections`}>
          <Connections
            user={communityUser}
            connections={communityBlog?.connections}
            authenticated={authenticated}
            onLogin={handleLogin}
          />
        </Route>
        <Route exact path={`${_path}/recommendations`}>
          <p className="dsl-b20">My Recommendations</p>
        </Route>
        <Route exact path={`${_path}/account-admin`}>
          <AccountAdmin user={communityUser} />
        </Route>
        <Route exact path={`${_path}/blog-admin`}>
          <BlogAdmin blog={communityBlog} user={communityUser} />
        </Route>
        <Route path="*" exact component={NotFound} />
      </Switch>
    </div>
  )
}

export default Profile

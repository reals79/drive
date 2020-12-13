import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, Route, Switch, useParams } from 'react-router-dom'
import OutsideClickHandler from 'react-outside-click-handler'
import classNames from 'classnames'
import { find, includes, isNil, propEq, filter, findIndex } from 'ramda'
import { Animations, Button, Dropdown, EditDropdown, Icon, NotFound } from '@components'
import { history } from '~/reducers'
import AppActions from '~/actions/app'
import CompanyActions from '~/actions/company'
import { UserRoles } from '~/services/config'
import { avatarBackgroundColor, convertUrl, getInitials } from '~/services/util'
import About from './About'
import Products from './Products'
import Library from './Library'
import Jobs from './Jobs'
import Blog from './Blog'
import Connections from './Connections'
import HumanCapital from './HumanCapital'
import AccountAdmin from './AccountAdmin'
import BlogAdmin from './BlogAdmin'
import Reports from './Reports'
import VendorRatingsReports from './Reports/VendorRatings'
import './Profile.scss'

const ROUTES = [
  { id: 0, name: 'about', label: 'About' },
  { id: 1, name: 'products', label: 'Products', icon: 'fal fa-star' },
  { id: 2, name: 'library', label: 'Library', icon: 'fal fa-university' },
  { id: 3, name: 'jobs', label: 'Jobs', icon: 'fal fa-user-tie' },
  { id: 4, name: 'blog', label: 'Blog', icon: 'fal fa-comment-alt-edit' },
  { id: 5, name: 'connections', label: 'Connections', icon: 'fal fa-users' },
  { id: 6, name: 'human-capital', label: 'Human Capital', icon: 'fal fa-tasks' },
]
const OPTIONS = [
  { name: 'account-admin', label: 'Account Admin' },
  { name: 'blog-admin', label: 'Blog Admin' },
  { name: 'reports', label: 'Reports' },
]

const Profile = () => {
  const param = useParams()

  const user = useSelector(state => state.app.user)
  const communityUserId = useSelector(state => state.app.user.community_user?.id)
  const businesies = useSelector(state => state.company.business)
  const isHCMSuperAdmin = user?.primary_role_id === 1
  const isCommunitySuperAdmin = user?.community_user?.super_admin
  const business = find(propEq('id', Number(param.id)), businesies)
  const profile = { ...business?.data?.profile, ...business?.hcms?.data?.profile }
  const blogAdmins = business?.vrs?.blog?.admins || []
  const isBlogAdmin = findIndex(propEq('id', communityUserId), blogAdmins) > -1
  const isVRCompany = !!business?.vrs?.id

  const [active, setActive] = useState(param.tab)
  const [editable, setEditable] = useState(false)
  const token = useSelector(state => state.app.token)
  const isAuth = token && token !== ''
  const userRole = useSelector(state => state.app.app_role_id)

  const [avatar, setAvatar] = useState(profile?.avatar || '')
  const [cover, setCover] = useState(profile?.cover || '')
  const facebook = profile?.facebook
  const twitter = profile?.twitter
  const linkedin = profile?.linkedin
  const youtube = profile?.youtube

  const appCompanies = useSelector(state => state.app.companies)
  const myCompanies = filter(x => x.name !== '' && x.business_id, appCompanies)
  const appCompany = find(propEq('business_id', Number(param.id)), myCompanies)
  const hasEdit = isNil(appCompany)
    ? userRole < UserRoles.MANAGER
    : appCompany.primary_role_id == 1 || appCompany.app_role_id <= 2

  let _ROUTES = ROUTES
  let _OPTIONS = OPTIONS
  if (!isVRCompany && !isCommunitySuperAdmin) {
    _ROUTES = filter(x => x.id !== 1, _ROUTES)
  }
  if (!business?.hcms && !isHCMSuperAdmin) {
    _ROUTES = filter(x => x.id !== 2 && x.id !== 3 && x.id !== 6, _ROUTES)
  }
  if (!business?.vrs?.blog?.id && !isCommunitySuperAdmin) {
    _ROUTES = filter(x => x.id !== 4, _ROUTES)
  }
  if (!isVRCompany && !isCommunitySuperAdmin) {
    _ROUTES = filter(x => x.id !== 5, _ROUTES)
    _OPTIONS = filter(x => x.name !== 'account-admin', _OPTIONS)
  }
  if (!isBlogAdmin && isCommunitySuperAdmin) {
    _OPTIONS = filter(x => x.name !== 'blog-admin', _OPTIONS)
    _OPTIONS = filter(x => x.name !== 'reports', _OPTIONS)
  }

  const _path = `/company/${param.id}`

  const [opened, setOpened] = useState(false)

  const getClass = (base, index) => {
    return classNames(
      'section',
      base === active && 'active',
      index < _ROUTES.length - 1 && _ROUTES[index + 1].name === active && 'last',
      base === _ROUTES[_ROUTES.length - 1].name &&
        includes(
          active,
          OPTIONS.map(item => item.name)
        ) &&
        'last'
    )
  }

  const handleCog = e => () => {
    setOpened(false)
    setActive(e)
  }

  const handleTabs = name => {
    history.push(`${_path}/${name}`)
    setActive(name)
  }

  const handleDropdown = e => {
    switch (e) {
      case 'edit':
        setEditable(true)
        break
      case 'account':
        break
      default:
        break
    }
  }

  const dispatch = useDispatch()
  const handleClickEditButtons = type => e => {
    switch (type) {
      case 'featured':
        dispatch(
          AppActions.modalRequest({
            type: 'Upload Background Image',
            data: { before: { entity: business?.vrs?.entity?.id } },
            callBack: e => setCover(e),
          })
        )
        break

      case 'avatar':
        dispatch(
          AppActions.modalRequest({
            type: 'Upload Vendor Avatar',
            data: { before: { entity: business?.vrs?.entity?.id } },
            callBack: e => setAvatar(e),
          })
        )
        break

      case 'social':
        dispatch(
          AppActions.modalRequest({
            type: 'Link Social Networks',
            data: { before: { company: business } },
            callBack: () => {},
          })
        )
        break

      default:
        break
    }
  }

  const handleChangeCompany = e => {
    if (e[0].business_id) {
      const payload = { id: e[0].business_id }
      const route = `/company/${e[0].business_id}/about`
      dispatch(CompanyActions.getbusinessRequest(payload, route))
    }
  }

  return (
    <div className="company-detail">
      {isAuth && (
        <Dropdown
          className="min-150"
          align="left"
          defaultIds={[appCompany?.id]}
          data={myCompanies}
          getValue={item => item['name']}
          returnBy="data"
          onChange={handleChangeCompany}
        />
      )}
      <div
        className="company-detail-header position-relative"
        style={{ backgroundImage: `url(${convertUrl(cover) || '/images/bg-company-cover.png'})` }}
      >
        <div className="header-nav">
          {_ROUTES.map((item, index) => (
            <div className={getClass(item.name, index)} key={`route${index}`}>
              <Link to={`${_path}/${item.name}`} className="section-item dsl-d14" onClick={() => setActive(item.name)}>
                {item.label}
              </Link>
            </div>
          ))}
          {_OPTIONS.length > 0 && (
            <div
              className={classNames(
                'section',
                includes(active, ['account-admin', 'blog-admin', 'reports']) && 'active'
              )}
            >
              <OutsideClickHandler onOutsideClick={() => setOpened(false)}>
                <div className="section-item border-0 p-0 position-relative">
                  <div className="px-3 cursor-pointer" onClick={() => setOpened(!opened)}>
                    <Icon name="fal fa-cog" color="white" size={14} />
                  </div>
                  <Animations.Popup className="popup box-shadow" enter={10} exit={0} opened={opened}>
                    {_OPTIONS.map((item, index) => (
                      <Link
                        key={`option${index}`}
                        to={`${_path}/${item.name}`}
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
        {hasEdit && (
          <div className="company-edit">
            <EditDropdown options={['Edit', 'Account']} onChange={handleDropdown} />
          </div>
        )}
        <div className="company-info">
          <div className="d-flex company-sub-header">
            <div
              className="company-info-avatar d-center"
              style={{
                backgroundImage: `url(${avatar})`,
                backgroundColor: avatar ? '#fff' : avatarBackgroundColor(business?.id),
              }}
            >
              {!avatar && <p className="dsl-b28 bold mb-0">{getInitials(business?.name)}</p>}
            </div>
            <div className="company-info-title">
              <h3 className="dsl-b28">{business?.name}</h3>
              {business?.stats?.follow && <h6 className="dsl-b14">{`Followed by: ${business?.stats?.follow}`}</h6>}
            </div>
          </div>
          <div className="company-info-social">
            {facebook && (
              <Button type="link" className="social-link-button" onClick={() => window.open(facebook, '_blank')}>
                <Icon name="fab fa-facebook-f" size={14} color="white" />
              </Button>
            )}
            {twitter && (
              <Button type="link" className="social-link-button" onClick={() => window.open(twitter, '_blank')}>
                <Icon name="fab fa-twitter ml-3" size={14} color="white" />
              </Button>
            )}
            {linkedin && (
              <Button type="link" className="social-link-button" onClick={() => window.open(linkedin, '_blank')}>
                <Icon name="fab fa-linkedin-in ml-3" size={14} color="white" />
              </Button>
            )}
            {youtube && (
              <Button type="link" className="social-link-button" onClick={() => window.open(youtube, '_blank')}>
                <Icon name="fab fa-youtube ml-3" size={14} color="white" />
              </Button>
            )}
          </div>
        </div>
        {editable && (
          <div className="edit-company-detail-header">
            <Button className="edit-featured-image" type="link" onClick={handleClickEditButtons('featured')}>
              <Icon name="fal fa-pen" size={14} color="#343f4b" />
            </Button>
            <div className="company-info">
              <div className="company-info-avatar position-relative" style={{ backgroundImage: `url(${avatar})` }}>
                <Button className="edit-company-avatar" type="link" onClick={handleClickEditButtons('avatar')}>
                  <Icon name="fal fa-pen" size={14} color="#343f4b" />
                </Button>
              </div>
              <div className="company-info-social">
                <Button className="edit-social-links" type="link" onClick={handleClickEditButtons('social')}>
                  <Icon name="fal fa-pen" size={14} color="#343f4b" />
                </Button>
                {facebook && (
                  <Button type="link" className="social-link-button">
                    <Icon name="fab fa-facebook-f" size={14} color="#343f4b" />
                  </Button>
                )}
                {twitter && (
                  <Button type="link" className="social-link-button">
                    <Icon name="fab fa-twitter ml-3" size={14} color="#343f4b" />
                  </Button>
                )}
                {linkedin && (
                  <Button type="link" className="social-link-button">
                    <Icon name="fab fa-linkedin-in ml-3" size={14} color="#343f4b" />
                  </Button>
                )}
                {youtube && (
                  <Button type="link" className="social-link-button">
                    <Icon name="fab fa-youtube ml-3" size={14} color="#343f4b" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="custom-dropdown-mobile mb-4">
        <Dropdown
          className="mobile-screen"
          data={_ROUTES}
          defaultIds={[0]}
          returnBy="data"
          getValue={e => e.label}
          onChange={e => handleTabs(e[0].name)}
        />
      </div>
      <Switch>
        <Route exact path={`${_path}/about`}>
          <About
            business={business}
            editable={editable}
            avatar={avatar}
            cover={cover}
            onCancel={() => setEditable(false)}
          />
        </Route>
        <Route exact path={`${_path}/blog`}>
          <Blog data={business} isAdmin={isBlogAdmin} />
        </Route>
        <Route exact path={`${_path}/reports/vendor-ratings`}>
          <VendorRatingsReports data={business} />
        </Route>
        <Route exact path={[`${_path}/products`, `${_path}/products/:field`]}>
          <Products data={business?.vrs} />
        </Route>
        <Route exact path={`${_path}/library`}>
          <Library />
        </Route>
        <Route exact path={`${_path}/jobs`}>
          <Jobs />
        </Route>
        <Route exact path={`${_path}/human-capital`}>
          <HumanCapital data={business?.hcms} />
        </Route>
        <Route exact path={`${_path}/connections`}>
          <Connections business={business} />
        </Route>

        {isVRCompany && (
          <Route exact path={`${_path}/account-admin`}>
            <AccountAdmin data={business} />
          </Route>
        )}
        {isBlogAdmin && (
          <Route exact path={`${_path}/blog-admin`}>
            <BlogAdmin data={business} />
          </Route>
        )}
        {isBlogAdmin && (
          <Route exact path={`${_path}/reports`}>
            <Reports id={param.id} routesList={_ROUTES} />
          </Route>
        )}
        <Route path="*" exact component={NotFound} />
      </Switch>
    </div>
  )
}

export default Profile

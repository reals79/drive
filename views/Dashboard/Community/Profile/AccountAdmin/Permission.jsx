import React from 'react'
import PropTypes from 'prop-types'
import { Avatar } from '@components'
import './AccountAdmin.scss'

const Header = () => (
  <div className="d-flex mt-3 pb-2">
    <div className="d-flex-5">
      <span className="dsl-m12 text-400">Profile upgrade</span>
    </div>
    <div className="d-flex-4">
      <span className="dsl-m12 text-400">Company Status</span>
    </div>
    <div className="d-flex-4">
      <span className="dsl-m12 text-400">My Permission</span>
    </div>
    <div className="d-flex-3 text-right">
      <span className="dsl-m12 text-400">Since</span>
    </div>
    <div className="d-flex-2" />
  </div>
)

const Profile = ({ profile, status, permission, since }) => (
  <div className="d-flex align-items-center border-top py-4">
    <div className="d-flex-5">
      <span className="dsl-b14 text-400">{profile}</span>
    </div>
    <div className="d-flex-4">
      <span className="dsl-b14 text-400">{status ? 'Subscribed' : 'Not Subscribed'}</span>
    </div>
    <div className="d-flex-4">
      <span className="dsl-b14 text-400">{permission === 'none' ? 'Na' : permission}</span>
    </div>
    <div className="d-flex-3 text-right">
      <span className="dsl-b14 text-400">{since}</span>
    </div>
    <div className="d-flex-2" />
  </div>
)

const Permission = ({ permission }) => {
  const { businesses } = permission

  return (
    <div className="card-bottom">
      <p className="dsl-b18 bold">My Permissions by company</p>
      {businesses.map((item, index) => {
        const { blogs, business, jobs, library, products } = item
        return (
          <div key={`permission-${index}-${business?.id}`}>
            <div className="default py-3">
              <div className="default-content">
                <div className="d-h-start">
                  <Avatar
                    url={business?.data?.profile?.avatar}
                    name={business?.name}
                    type="logo"
                    backgroundColor="white"
                    borderColor="white"
                    size="regular"
                  />
                  <span className="dsl-b18 bold ml-3">{business?.name}</span>
                </div>
              </div>
            </div>
            <Header />
            <Profile
              profile="Products"
              status={products?.subscribed}
              permission={products?.permission}
              since="May 28, 20"
            />
            <Profile
              profile="Library"
              status={library?.subscribed}
              permission={library?.permission}
              since="May 28, 20"
            />
            {jobs?.permission && (
              <Profile profile="Jobs" status={jobs?.subscribed} permission={jobs?.permission} since="May 28, 20" />
            )}
            <Profile profile="Blogs" status={blogs?.subscribed} permission={blogs?.permission} since="May 28, 20" />
          </div>
        )
      })}
    </div>
  )
}

Permission.propTypes = {
  permission: PropTypes.shape({
    user_id: PropTypes.number,
    blogs: PropTypes.array,
    businesses: PropTypes.array,
    hcms: PropTypes.array,
    vrs: PropTypes.array,
  }),
}

Permission.defaultProps = {
  permission: {
    user_id: 0,
    blogs: [],
    businesses: [],
    hcms: [],
    vrs: [],
  },
}

export default Permission

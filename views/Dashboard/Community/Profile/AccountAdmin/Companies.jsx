import React from 'react'
import moment from 'moment'
import PropTypes from 'prop-types'
import { Avatar } from '@components'
import './AccountAdmin.scss'

const Header = () => (
  <div className="d-flex border-bottom">
    <div className="d-flex-5">
      <span className="dsl-m12">Company</span>
    </div>
    <div className="d-flex-5">
      <span className="dsl-m12">Status</span>
    </div>
    <div className="d-flex-4">
      <span className="dsl-m12">Action</span>
    </div>
  </div>
)

const Companies = ({ permission }) => {
  const { businesses } = permission
  return (
    <div className="card-bottom">
      <p className="dsl-d12">Here is The list of companies you are associated with.</p>
      <p className="dsl-b18 bold">Companies I'm active in</p>
      <Header />
      {businesses.map(item => {
        const { business, permission } = item
        return (
          <div className="d-flex py-3" key={`hcm-${business.id}`}>
            <div className="d-flex-5 d-h-start">
              <Avatar
                url={business.data?.profile?.avatar}
                name={business.name}
                type="logo"
                backgroundColor="white"
                borderColor="white"
                size="tiny"
              />
              <span className="dsl-b14 text-400 ml-3">{business.name}</span>
            </div>
            <div className="d-flex-5">
              <span className="dsl-b12 text-400">{permission === 'none' ? 'Na' : permission}</span>
            </div>
            <div className="d-flex-4">
              <span className="dsl-b14 text-400 ml-2">{moment(business.updated_at).format('MMM DD, YY')}</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}

Companies.propTypes = {
  permission: PropTypes.shape({
    user_id: PropTypes.number,
    blogs: PropTypes.array,
    businesses: PropTypes.array,
    hcms: PropTypes.array,
    vrs: PropTypes.array,
  }),
}

Companies.defaultProps = {
  permission: {
    user_id: 0,
    blogs: [],
    businesses: [],
    hcms: [],
    vrs: [],
  },
}

export default Companies

import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col } from 'react-bootstrap'
import { filter, includes, prop, propEq, uniqBy } from 'ramda'
import moment from 'moment'
import { Avatar, EditDropdown } from '@components'
import AppActions from '~/actions/app'
import VenActions from '~/actions/vendor'
import { COMPANY_FEATURES } from '~/services/constants'
import { UserRoles } from '~/services/config'

const Header = () => (
  <div className="d-flex mt-3 pb-2">
    <div className="d-flex-3">
      <span className="dsl-m12 text-400">Name</span>
    </div>
    <div className="d-flex-2">
      <span className="dsl-m12 text-400">Position</span>
    </div>
    <div className="d-flex-5">
      <span className="dsl-m12 text-400">Email</span>
    </div>
    <div className="d-flex-2">
      <span className="dsl-m12 text-400">Date enrolled</span>
    </div>
    <div className="d-flex-2">
      <span className="dsl-m12 text-400">Last login</span>
    </div>
  </div>
)

const Person = ({ data, option = 'dots', options = ['Edit', 'Delete'], onOption }) => (
  <div className="d-flex align-items-center border-top py-3">
    <div className="d-flex align-items-center d-flex-3">
      <Avatar
        className="mr-2"
        size="tiny"
        url={data?.avatar}
        name={data?.name || `${data?.first_name} ${data?.last_name}`}
      />
      <span className="dsl-b14 text-400">{data?.name || `${data?.first_name} ${data?.last_name}`}</span>
    </div>
    <div className="d-flex-2">
      <span className="dsl-b14 text-400">{data?.profile?.job_title}</span>
    </div>
    <div className="d-flex-5">
      <span className="dsl-b14 text-400">{data?.email}</span>
    </div>
    <div className="d-flex-2">
      <span className="dsl-b14 text-400">{data?.hired_at ? moment(data?.hired_at).format('MMM DD, YY') : ''}</span>
    </div>
    <div className="d-flex align-items-center justify-content-between d-flex-2">
      <span className="dsl-b14 text-400">
        {data.last_active ? moment.unix(data.last_active).format('MMM DD, YY') : ''}
      </span>
      {options && option === 'dots' && <EditDropdown options={options} onChange={onOption} />}
      {options && option === 'question' && (
        <EditDropdown icon="fal fa-question-square" options={options} onChange={onOption} />
      )}
    </div>
  </div>
)

const Permissions = ({ data }) => {
  const dispatch = useDispatch()

  const user = useSelector(state => state.app.user)

  const handleRemoveAdmin = (type, item) => {
    if (type === 'vr') {
      const payload = {
        mode: 'remove',
        data: {
          user_id: item.id,
          company_id: data?.vrs?.id,
        },
        after: {
          type: 'GETBUSINESS_REQUEST',
          payload: { id: data.id },
        },
      }
      dispatch(VenActions.postvrcompanyadminRequest(payload))
    }
    if (type === 'blog') {
      const payload = {
        mode: 'remove',
        data: {
          user_id: item.id,
          blog_id: data?.vrs?.blog?.id,
        },
        after: {
          type: 'GETBUSINESS_REQUEST',
          payload: { id: data.id },
        },
      }
      dispatch(VenActions.postblogadminRequest(payload))
    }
    if (type === 'hcm') {
      let user = {}
      user[item.id] = { app_role_id: 4 }
      const payload = { user }
      const companyId = data?.hcms?.id
      const after = { type: 'GETBUSINESS_REQUEST', payload: { id: data.id } }
      dispatch(AppActions.postcompanyusersRequest(payload, companyId, after))
    }
  }

  const handleEdit = (type, item) => e => {
    if (e === 'add admin') {
      const payload = {
        type: 'Add Admin',
        data: { before: { company: data, type }, after: null },
        callBack: null,
      }
      dispatch(AppActions.modalRequest(payload))
    } else if (e === 'remove admin') {
      handleRemoveAdmin(type, item)
    }
  }

  const licences = data.business?.data?.length > 0 ? data.business?.data[0]?.data?.licences : {}
  const hcmadmins = filter(propEq('app_role_id', 2), data?.hcms?.users || [])
  const blogadmins = data?.vrs?.blog?.admins || []
  const vradmins = uniqBy(prop('id'), data?.vrs?.admins || [])
  const blogId = data?.vrs?.blog?.id || 0
  const userBlogs = (user?.community_user?.blogs || []).map(blog => blog.id)
  const isHcmAdmin = user?.app_role_id < UserRoles.USER
  const isBlogAdmin = includes(blogId, userBlogs)
  const isVRAdmin = includes(
    user?.community_user?.id,
    vradmins.map(admin => admin.id)
  )

  return (
    <>
      <div className="card-bottom">
        <p className="dsl-b18 bold my-3">Products</p>
        <Row className="mx-0">
          {COMPANY_FEATURES.map(item => {
            const label = licences ? (licences[item.id] === 'enable' ? 'Premium' : 'Basic') : 'Basic'
            return (
              <Col xs={3} sm={2} key={item.id} className="p-0">
                <div className="mb-2">
                  <span className="dsl-b12">{item.label}</span>
                  <img src="/images/icons/ic-circle-info.svg" className="ml-1 mb-1" />
                </div>
                <p className="dsl-b16 text-400">{label}</p>
              </Col>
            )
          })}
        </Row>
      </div>

      {hcmadmins.length > 0 && (
        <div className="card">
          <div className="d-h-between">
            <span className="dsl-b22 bold">HCM Admin</span>
            {isHcmAdmin && <EditDropdown options={['Add Admin']} onChange={handleEdit('hcm')} />}
          </div>
          <Header />
          {hcmadmins.map(admin => (
            <Person
              key={admin.id}
              data={admin}
              options={isHcmAdmin ? ['Remove Admin'] : null}
              onOption={handleEdit('hcm', admin)}
            />
          ))}
        </div>
      )}

      {blogadmins.length > 0 && (
        <div className="card">
          <div className="d-h-between">
            <span className="dsl-b22 bold">Blog Admin</span>
            {isBlogAdmin && <EditDropdown options={['Add Admin']} onChange={handleEdit('blog')} />}
          </div>
          <Header />
          {blogadmins.map(admin => (
            <Person
              key={admin.id}
              data={admin}
              options={isBlogAdmin ? ['Remove Admin'] : null}
              onOption={handleEdit('blog', admin)}
            />
          ))}
        </div>
      )}

      {vradmins.length > 0 && (
        <div className="card">
          <div className="d-h-between">
            <span className="dsl-b22 bold">Vendor Ratings Admin</span>
            {isVRAdmin && <EditDropdown options={['Add Admin']} onChange={handleEdit('vr')} />}
          </div>
          <Header />
          {vradmins.map(admin => (
            <Person
              key={admin.id}
              data={admin}
              options={isVRAdmin ? ['Remove Admin'] : null}
              onOption={handleEdit('vr', admin)}
            />
          ))}
        </div>
      )}
    </>
  )
}

export default Permissions

import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { clone, isNil, keys } from 'ramda'
import { toast } from 'react-toastify'
import classNames from 'classnames'
import { CheckBox, Dropdown } from '@components'
import AppActions from '~/actions/app'
import CompanyActions from '~/actions/company'
import CommunityActions from '~/actions/community'
import { UserRoles } from '~/services/config'
import { COMPANY_FEATURES, FEATURE_OPTIONS } from '~/services/constants'

const HCM = ['licences', 'org chart', 'library', 'employees']

const Account = ({ data, role }) => {
  const [licences, setLicences] = useState(data.data?.licences)
  const products = data.vrs?.products || []
  const author = data.global_authors || []
  const blog = data.vrs?.blog
  const connections = data.vrs?.connections || {}

  const dispatch = useDispatch()
  const handleProducts = e => {
    const payload = {
      type: 'HCM Configuration',
      data: { before: { data, product: e }, after: {} },
      callBack: {},
    }
    if (!isNil(e)) {
      switch (e.data.sponsored_level) {
        case 'gold':
          payload.type = 'Premium Product Configuration'
          break
        case 'silver':
          payload.type = 'Plus Product Configuration'
          break
        default:
          payload.type = 'Basic Product Configuration'
          break
      }
    }
    dispatch(AppActions.modalRequest(payload))
  }

  const handleChange = key => e => {
    if (role === UserRoles.ADMIN && (key === 'global_author' || key === 'hcm')) {
      toast.warn('Please contact your Success Manager to change these premium features.', {
        position: toast.POSITION.TOP_RIGHT,
      })
    } else {
      const liss = clone(licences)
      liss[key] = e[0]
      setLicences(liss)
      const payload = { business: { ...data, data: { ...data.data, licences: liss } } }
      dispatch(CompanyActions.postbusinessRequest(payload))
      if (key === 'blog' && e[0] === 'enable') {
        const cpayload = { company_id: data.vrs.id, user_id: data.vrs.user_id }
        dispatch(CommunityActions.postcreateblogRequest(cpayload))
      }
    }
  }

  const handleAuthor = e => {}
  const handleBlog = e => {
    if (blog && !blog?.data?.can_edit_blog) return
    const payload = {
      type: 'Blog Configuration',
      data: {
        before: { data, blog: e },
        after: {},
      },
      callBack: {},
    }
    dispatch(AppActions.modalRequest(payload))
  }
  const handleHCM = (e, level) => {
    const payload = {
      type: 'HCM Licences',
      data: { before: { data, level }, after: {} },
      callBack: {},
    }
    switch (e) {
      case 'org chart':
        payload.type = 'HCM Licences'
        break
      default:
        break
    }
    dispatch(AppActions.modalRequest(payload))
  }
  const handleConnections = e => {}

  return (
    <>
      <div className="card-bottom">
        <p className="dsl-b18 bold mb-3">Features</p>
        {role === UserRoles.SUPER_ADMIN || role == UserRoles.ADMIN ? (
          <div className="d-flex">
            {COMPANY_FEATURES.map(item => {
              const defaultIndex = licences[item.id] === 'enable' ? 0 : 1
              return (
                <div className="d-flex-1" key={item.id}>
                  <div className="mb-3">
                    <span className="dsl-b12">{item.label}</span>
                    <img src="/images/icons/ic-circle-info.svg" className="ml-1 mb-1" />
                    <Dropdown
                      width="fit-content"
                      placeholder="Select"
                      defaultIndexes={[defaultIndex]}
                      data={FEATURE_OPTIONS}
                      getId={e => e.value}
                      getValue={e => e.label}
                      onChange={handleChange(item.id)}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          COMPANY_FEATURES.map((item, index) => (
            <div
              className={classNames('d-flex', COMPANY_FEATURES.length !== index + 1 && 'mb-3')}
              key={`product-${index}`}
            >
              <span className="dsl-b16 w200">{item.name}</span>
              <span className="dsl-b16 text-capitalize">{licences[item.id] || 'Disable'}</span>
            </div>
          ))
        )}
      </div>

      <div className="card">
        <p className="dsl-b22 bold">Profile Optimization</p>
        <div className="d-flex mt-4">
          <div className="d-flex-1 px-2">
            <p className={`dsl-${!licences || licences?.vendor_ratings === 'disable' ? 'd' : 'b'}13 bold text-center`}>
              Products
            </p>
            {!licences || licences?.vendor_ratings === 'disable' ? (
              <p className="dsl-d14 text-center">Disabled</p>
            ) : (
              <>
                <CheckBox
                  className="mb-3 cursor-pointer"
                  id="all"
                  size="tiny"
                  title="All Products"
                  onClick={() => handleProducts(null)}
                />
                {products?.map(option => (
                  <CheckBox
                    className="mb-3 cursor-pointer"
                    key={option.id}
                    id={option.id}
                    checked={option.status === 2}
                    size="tiny"
                    title={option.name}
                    onClick={() => handleProducts(option)}
                  />
                ))}
              </>
            )}
          </div>

          <div className="d-flex-1 px-2">
            <p className={`dsl-${!licences || licences?.global_author === 'disable' ? 'd' : 'b'}13 bold text-center`}>
              Global Author
            </p>
            {!licences || licences?.global_author === 'disable' ? (
              <p className="dsl-d14 text-center">Disabled</p>
            ) : (
              <>
                {author?.map(option => (
                  <CheckBox
                    className="mb-3 cursor-pointer"
                    key={option.id}
                    id={option.id}
                    size="tiny"
                    title={option.name}
                    onClick={() => handleAuthor(option)}
                  />
                ))}
              </>
            )}
          </div>

          <div className="d-flex-1 px-2">
            <p className="dsl-d13 bold text-center">Jobs</p>
            <p className="dsl-d14 text-center">Disabled</p>
          </div>

          <div className="d-flex-1 px-2">
            <p className={`dsl-${!licences || licences?.blog === 'disable' ? 'd' : 'b'}13 bold text-center`}>Blog</p>
            {!licences || licences?.blog === 'disable' ? (
              <p className="dsl-d14 text-center">Disabled</p>
            ) : (
              <>
                {blog && (
                  <CheckBox
                    className="mb-3 cursor-pointer"
                    key={blog.id}
                    id={blog.id}
                    size="tiny"
                    title={blog?.data?.title}
                    onClick={() => handleBlog(blog)}
                  />
                )}
              </>
            )}
          </div>

          <div className="d-flex-1 px-2">
            <p className={`dsl-${!licences ? 'd' : 'b'}13 bold text-center`}>Connections</p>
            {!licences ? (
              <p className="dsl-d14 text-center">Disabled</p>
            ) : (
              keys(connections).map(option => (
                <CheckBox
                  className="mb-3 cursor-pointer"
                  key={option}
                  id={option}
                  size="tiny"
                  title={option.replace('_', ' ')}
                  onClick={() => handleConnections(option)}
                />
              ))
            )}
          </div>

          <div className="d-flex-1 px-2">
            <p className={`dsl-${!licences ? 'd' : 'b'}13 bold text-center`}>HCM</p>
            {!licences ? (
              <p className="dsl-d14 text-center">Disabled</p>
            ) : (
              HCM.map((option, index) => (
                <CheckBox
                  className="mb-3 cursor-pointer"
                  key={option}
                  id={option}
                  size="tiny"
                  title={option}
                  onClick={() => handleHCM(option, index + 1)}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default Account

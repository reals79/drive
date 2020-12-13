import React, { memo } from 'react'
import { useDispatch } from 'react-redux'
import classNames from 'classnames'
import { CheckBox, ProgressBar } from '@components'
import AppActions from '~/actions/app'
import './OptimizedProfile.scss'

const OptimizedProfile = memo(({ progress = 0, enableStatus }) => {
  const dispatch = useDispatch()
  const handleHCMConfig = () => {
    const payload = { type: 'Business HCM Config' }
    dispatch(AppActions.modalRequest(payload))
  }

  const handleBlogConfig = () => {
    const payload = { type: 'Business Blog Config' }
    dispatch(AppActions.modalRequest(payload))
  }

  const handleProductConfig = () => {
    const payload = { type: 'Business Product Config'}
    dispatch(AppActions.modalRequest(payload))
  }

  return (
    <div className="card company-optimized-profile">
      <h4 className="dsl-b22 bold">Optimized Profile</h4>
      <div className="mt-3 mb-5 progress-wrapper">
        <h6 className="dsl-b12 mb-3">Profile progress:</h6>
        <ProgressBar value={progress} hideLabel={!progress} />
      </div>
      <div className="container-fluid">
        <div className="row">
          <div className="col-sm-2">
            <h5 className={`dsl-${enableStatus.hcm ? 'b14' : 'l14'} bold text-center mb-4`}>HCM</h5>
            <div
              className={classNames(
                `d-flex flex-column dsl-${enableStatus.hcm ? 'b14' : 'l14'}`,
                !enableStatus.hcm && 'disabled'
              )}
              onClick={handleHCMConfig}
            >
              <CheckBox id="hcm-licences" className="mb-3" size="tiny" title="Licenses" />
              <CheckBox id="org-chart" className="mb-3" size="tiny" title="Org Chart" />
              <CheckBox id="hcm-library" className="mb-3" size="tiny" title="Library" />
              <CheckBox id="hcm-employees" className="mb-3" size="tiny" title="Employees" />
            </div>
          </div>
          <div className="col-sm-2">
            <h5 className={`dsl-${enableStatus.blogs ? 'b14' : 'l14'} bold text-center mb-4`}>Blog</h5>
            <div
              className={classNames(
                `d-flex flex-column dsl-${enableStatus.blogs ? 'b14' : 'l14'}`,
                !enableStatus.blogs && 'disabled'
              )}
              onClick={handleBlogConfig}
            >
              <CheckBox className="mb-3" id="blog-categories" size="tiny" title="Categories" />
            </div>
          </div>
          <div className="col-sm-2">
            <h5 className={`dsl-${enableStatus.community ? 'b14' : 'l14'} bold text-center mb-4`}>Community</h5>
            <div
              className={classNames(
                `d-flex flex-column dsl-${enableStatus.community ? 'b14' : 'l14'}`,
                !enableStatus.community && 'disabled'
              )}
            >
              <CheckBox size="tiny" title="Followers" className="mb-3" />
              <CheckBox size="tiny" title="Employees" className="mb-3" />
            </div>
          </div>
          <div className="col-sm-2">
            <h5 className={`dsl-${enableStatus.vendor_rating ? 'b14' : 'l14'} bold text-center mb-4`}>
              Vendor Ratings
            </h5>
            <div
              className={classNames(
                `d-flex flex-column dsl-${enableStatus.vendor_rating ? 'b14' : 'l14'}`,
                !enableStatus.vendor_rating && 'disabled'
              )}
            >
              <CheckBox className="mb-3" id="all-products" size="tiny" title="All Products" onClick={handleProductConfig} />
            </div>
          </div>
          <div className="col-sm-2">
            <h5 className={`dsl-${enableStatus.global_author ? 'b14' : 'l14'} bold text-center mb-4`}>Global Author</h5>
            <div
              className={classNames(
                `d-flex flex-column dsl-${enableStatus.global_author ? 'b14' : 'l14'}`,
                !enableStatus.global_author && 'disabled'
              )}
            >
              <CheckBox size="tiny" title="Training" className="mb-3" />
              <CheckBox size="tiny" title="Programs" className="mb-3" />
              <CheckBox size="tiny" title="ToDo" className="mb-3" />
              <CheckBox size="tiny" title="Documents" className="mb-3" />
              <CheckBox size="tiny" title="Questionaires" className="mb-3" />
            </div>
          </div>
          <div className="col-sm-2">
            <h5 className={`dsl-${enableStatus.jobs ? 'b14' : 'l14'} bold text-center mb-4`}>Jobs</h5>
            <div
              className={classNames(
                `d-flex flex-column dsl-${enableStatus.jobs ? 'b14' : 'l14'}`,
                !enableStatus.jobs && 'disabled'
              )}
            >
              <CheckBox id="work-with-us" className="mb-3" size="tiny" title="Work With Us" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
})

export default OptimizedProfile

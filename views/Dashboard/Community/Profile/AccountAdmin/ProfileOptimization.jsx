import React from 'react'
import { Button, ProgressBar } from '~/components'
import './AccountAdmin.scss'

const Optimization = ({ feature, recommendation, progress }) => (
  <div className="d-flex align-items-center border-top py-4">
    <div className="d-flex-3">
      <span className="dsl-b14 text-400">{feature}</span>
    </div>
    <div className="d-flex-4">
      <span className="dsl-l12 text-400">{recommendation}</span>
    </div>
    <div className="d-flex-6">
      {progress === 'Disabled' ? (
        <span className="dsl-b14 text-400">Disabled</span>
      ) : (
        <ProgressBar className="feature-progress" value={progress} />
      )}
    </div>
    <div className="d-flex-2">{progress !== 100 && <Button name="GO" type="medium" />}</div>
  </div>
)

const ProfileOptimization = props => (
  <div className="profile-optimization">
    <div className="card-bottom">
      <p className="dsl-b18 bold">Features</p>
      <div className="feature">
        <div className="d-h-between my-4">
          <span className="dsl-b16">Blogs</span>
          <span className="dsl-b16">Enable</span>
        </div>
        <div className="d-h-between my-4">
          <span className="dsl-b16">Connections</span>
          <span className="dsl-b16">Enable</span>
        </div>
        <div className="d-h-between my-4">
          <span className="dsl-b16">Recommendations</span>
          <span className="dsl-b16">Enable</span>
        </div>
      </div>
    </div>
    <div className="card">
      <p className="dsl-b18 bold">Profile Optimization</p>
      <div className="d-flex mt-3 pb-2">
        <div className="d-flex-3">
          <span className="dsl-m12 text-400">Feature</span>
        </div>
        <div className="d-flex-4">
          <span className="dsl-m12 text-400">Recommendations</span>
        </div>
        <div className="d-flex-6">
          <span className="dsl-m12 text-400">Progression</span>
        </div>
        <div className="d-flex-2" />
      </div>
      <Optimization feature="Activity" recommendation="You'r all set" progress={100} />
      <Optimization feature="Blog" recommendation="You'r all set" progress={100} />
      <Optimization feature="Connections" recommendation="You'r all set" progress={100} />
      <Optimization
        feature="Recommendations"
        recommendation="We recommend to get few recommendations from other people"
        progress={'Disabled'}
      />
    </div>
  </div>
)

export default ProfileOptimization

import React, { memo } from 'react'
import { CheckBox, Thumbnail } from '@components'
import './TrainingCompetency.scss'

const ReportItem = ({ data, per }) => {
  return (
    <div className="training-competency-report-item">
      <div className="report-item">
        <div className="d-flex-7 text-left text-400 mb-2">
          <p className="dsl-m12 text-400">Course</p>
        </div>
        <div className="d-flex-1 text-right mb-2">
          <p className="dsl-m12 text-400">Modules</p>
        </div>
        <div className="d-flex-2 text-right mb-2">
          <p className="dsl-m12 text-400">Completed</p>
        </div>
        <div className="d-flex-2 text-right mb-2">
          <p className="dsl-m12 text-400">Past Due</p>
        </div>
        <div className="d-flex-1" />
        <div className="d-flex-1">
          <p className="dsl-m12 text-400">Employees:</p>
        </div>
        <div className="d-flex-2 text-right">
          <p className="dsl-m12 text-400">Assigned</p>
        </div>
        <div className="d-flex-2 text-right mb-2">
          <p className="dsl-m12 text-400">In progress</p>
        </div>
        <div className="d-flex-2 text-right mb-2">
          <p className="dsl-m12 text-400">Completed</p>
        </div>
      </div>
      {data.map((training, index) => {
        const { data, children_complete, children_past_due } = training
        const { child_count, thumb_url, name, assigned } = data
        if (index < per) {
          return (
            <div className="report-item py-2" key={training.id}>
              <div className="d-flex d-flex-7 text-left text-400 mb-2">
                <CheckBox className="my-auto mr-2" size="regular" checked={false} disabled />
                <Thumbnail src={thumb_url} size="tiny" />
                <div className="d-flex-1 ml-2 align-self-center">
                  <p className={'dsl-b12 truncate-two mt-1 mb-0'}>{name}</p>
                </div>
              </div>
              <div className="d-flex-1 text-right align-self-center">
                <p className="dsl-b14 text-500 mt-1 mb-0 mr-2">{child_count || 0}</p>
              </div>
              <div className="d-flex-2 text-right align-self-center">
                <p className="dsl-b14 text-500 mt-1 mb-0 mr-2">{children_complete}</p>
              </div>
              <div className="d-flex-2 text-right align-self-center">
                <p className="dsl-b14 past-due text-500 mt-1 mb-0 mr-2">{children_past_due}</p>
              </div>
              <div className="d-flex-1" />
              <div className="d-flex-1" />
              <div className="d-flex-2 text-right align-self-center">
                <p className="dsl-b14 text-500 mt-1 mb-0">{assigned || 0}</p>
              </div>
              <div className="d-flex-2 text-right align-self-center">
                <p className="dsl-b14 text-500 mt-1 mb-0">0</p>
              </div>
              <div className="d-flex-2 text-right align-self-center">
                <p className="dsl-b14 text-500 mt-1 mb-0">0</p>
              </div>
            </div>
          )
        }
      })}
    </div>
  )
}

export default memo(ReportItem)

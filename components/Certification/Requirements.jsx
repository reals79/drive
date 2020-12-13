import React, { memo } from 'react'
import PropTypes from 'prop-types'
import Slider from 'react-slick'
import { isEmpty, isNil, length, type, values } from 'ramda'
import { Icon, LibraryProgramsList as ProgramsList, CareerRequiredInstances as Instances } from '@components'
import './Certification.scss'

const CustomArrow = ({ className, style, onClick, name }) => (
  <div className={className} style={{ ...style, display: 'block' }} onClick={onClick}>
    <Icon name={`fal fa-angle-${name}`} color="#c3c7cc" size={35} />
  </div>
)

const CertificationRequirements = ({ className, data }) => {
  const levels = isEmpty(data) ? [] : values(data)
  return (
    <div className={`cert-requirements ${className}`}>
      <p className="dsl-b22 bold">Requirements</p>
      <Slider infinite adaptiveHeight prevArrow={<CustomArrow name="left" />} nextArrow={<CustomArrow name="right" />}>
        {levels.map((e, index) => {
          const { habits, quotas, trainings, documents } = e
          const habitsLength =
            type(habits) === 'Object' ? length(habits.day) + length(habits.week) + length(habits.month) : length(habits)
          return (
            <div key={`level-${index}`}>
              <div className="required-field pt-4">
                <p className="dsl-b18 text-500">Required Quotas</p>
                {length(quotas) > 0 ? (
                  <Instances.QuotasDetail data={quotas} type="template" />
                ) : (
                  <ProgramsList.EmptyList />
                )}
              </div>
              <div className="required-field pt-4">
                <p className="dsl-b18 text-500">Required Habits</p>
                {habitsLength > 0 ? <ProgramsList.HabitList modules={habits} /> : <ProgramsList.EmptyList />}
              </div>
              <div className="required-field pt-4">
                <p className="dsl-b18 text-500">Required Training</p>
                {!isNil(trainings) && length(trainings.items) > 0 ? (
                  <ProgramsList.TrainingList modules={trainings.items} />
                ) : (
                  <ProgramsList.EmptyList />
                )}
              </div>
              <div className="required-field pt-4 mt-4 border-top">
                <p className="dsl-b18 text-500">Documents:</p>
                {length(documents) > 0 ? (
                  <ProgramsList.DocumentList modules={documents} />
                ) : (
                  <p className="dsl-m12 mb-0">No documents uploaded yet...</p>
                )}
              </div>
            </div>
          )
        })}
      </Slider>
    </div>
  )
}

CertificationRequirements.propTypes = {
  className: PropTypes.string,
  data: PropTypes.any,
}

CertificationRequirements.defaultProps = {
  className: '',
  data: {},
}

export default memo(CertificationRequirements)

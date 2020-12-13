import React from 'react'
import PropTypes from 'prop-types'
import { concat, isNil, append, isEmpty, equals } from 'ramda'
import moment from 'moment'
import { Icon, EditDropdown } from '@components'

const EmployeeCertifications = ({ admin, data, onClick }) => {
  const { profile, stats } = data
  const certifications = concat(stats.open_certifications, stats.completed_certifications)
  const menu = ['View']
  const dotsMenu = admin ? append('Edit', menu) : menu

  return (
    <div className="employee-certifications-list">
      <p className="dsl-b20 text-500 mt-3">{`${profile.first_name} ${profile.last_name}`}</p>
      <div className="d-flex border-bottom py-3">
        <div className="d-flex-7 dsl-m12">Certifications</div>
        <div className="d-flex-2 dsl-m12 px-3 text-right">Courses</div>
        <div className="d-flex-2 dsl-m12 px-3 text-right">Habits</div>
        <div className="d-flex-2 dsl-m12 px-3 text-right">Quotas</div>
        <div className="d-flex-3 dsl-m12 px-3">Assigned</div>
        <div className="d-flex-3 dsl-m12 px-3">Est completion</div>
        <div className="d-flex-3 dsl-m12 px-3">Completed</div>
        <div className="d-flex-1"></div>
      </div>
      {isEmpty(certifications) ? (
        <div className="d-center pt-4">
          <span className="dsl-m16">No certifications Assigned</span>
        </div>
      ) : (
        certifications.map(cert => {
          const { title, stats } = cert
          const { courses, habits, quotas } = stats
          const habitsComplete = isNil(habits) ? 0 : habits.day.complete + habits.week.complete + habits.month.complete
          const habitsTotal = isNil(habits) ? 0 : habits.day.total + habits.week.total + habits.month.total
          const habitsCompletion =
            isNil(habits) || equals(habitsTotal, 0) ? 0 : Math.ceil((habitsComplete * 100) / habitsTotal)

          return (
            <div className="d-flex align-items-center border-bottom py-3" key={cert.id}>
              <div className="d-flex align-items-center d-flex-7 cursor-pointer" onClick={() => onClick('view', cert)}>
                <Icon name="fal fa-file-certificate" size={22} />
                <span className="dsl-b14 ml-2">{title}</span>
              </div>
              <div className="d-flex-2 px-3">
                <p className="dsl-b14 mb-0 text-right">
                  {isNil(courses) ? '0/0' : `${courses.complete}/${courses.total}`}
                </p>
                <p className="dsl-b12 mb-0 text-right">{isNil(courses) ? '0%' : `${courses.completion}%`}</p>
              </div>
              <div className="d-flex-2 px-3">
                <p className="dsl-b14 mb-0 text-right">
                  {habitsComplete}/{habitsTotal}
                </p>
                <p className="dsl-b12 mb-0 text-right">{habitsCompletion}%</p>
              </div>
              <div className="d-flex-2 px-3">
                <p className="dsl-b14 mb-0 text-right">
                  {isNil(quotas) ? '0/0' : `${quotas.complete}/${quotas.total}`}
                </p>
                <p className="dsl-b12 mb-0 text-right">{isNil(quotas) ? '0%' : `${quotas.completion}%`}</p>
              </div>
              <div className="d-flex-3 dsl-b14 px-3">
                {isNil(cert.created_at)
                  ? 'N/A'
                  : moment
                      .utc(cert.created_at)
                      .local()
                      .format('MMM DD, YY')}
              </div>
              <div className="d-flex-3 dsl-b14 px-3">
                {isNil(cert.est_complete)
                  ? 'N/A'
                  : moment
                      .utc(cert.est_complete)
                      .local()
                      .format('MMM DD, YY')}
              </div>
              <div className="d-flex-3 dsl-b14 px-3">
                {isNil(cert.completed_at)
                  ? 'N/A'
                  : moment
                      .utc(cert.completed_at)
                      .local()
                      .format('MMM DD, YY')}
              </div>
              <div className="d-flex-1">
                <EditDropdown options={dotsMenu} onChange={e => onClick(e, cert)} />
              </div>
            </div>
          )
        })
      )}
    </div>
  )
}

EmployeeCertifications.propTypes = {
  admin: PropTypes.bool,
  data: PropTypes.shape({
    id: PropTypes.number,
    email: PropTypes.string,
    data: PropTypes.any,
    profile: PropTypes.shape({
      avatar: PropTypes.string,
      first_name: PropTypes.string,
      last_name: PropTypes.string,
      job_title: PropTypes.string,
    }),
    stats: PropTypes.shape({
      open: PropTypes.number,
      completed: PropTypes.number,
      open_certifications: PropTypes.array,
      completed_certifications: PropTypes.array,
    }),
  }),
  onClick: PropTypes.func,
}

EmployeeCertifications.defaultProps = {
  admin: false,
  data: {
    id: 0,
    email: '',
    data: {},
    profile: {
      avatar: '',
      first_name: '',
      last_name: '',
      job_title: '',
    },
    stats: {
      open: 0,
      completed: 0,
      open_certifications: [],
      completed_certifications: [],
    },
  },
  onClick: () => {},
}

export default EmployeeCertifications

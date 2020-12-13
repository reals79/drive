import React from 'react'
import PropTypes from 'prop-types'
import { equals, length, values, type as RamdaType, isNil } from 'ramda'
import { Accordion, CheckIcon } from '@components'
import './CareerRequiredInstances.scss'

function Status(target, actual) {
  return (
    <div className="d-flex align-items-center ml-auto">
      <span className="dsl-m12">Target</span>
      <span className="dsl-b14 ml-3">{target}</span>
      <span className="dsl-m12 ml-4">Actual</span>
      <span className="dsl-b14 ml-3">{actual}</span>
    </div>
  )
}

class HabitsDetail extends React.PureComponent {
  state = {
    habits: [],
    daily: [],
    weekly: [],
    monthly: [],
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (!equals(nextProps.data, prevState.habits)) {
      let daily = [],
        weekly = [],
        monthly = []
      if (equals(RamdaType(nextProps.data), 'Array')) {
        nextProps.data.map(item => {
          if (equals(item.data.schedule_interval, 'day')) {
            daily.push(item)
          } else if (equals(item.data.schedule_interval, 'week')) {
            weekly.push(item)
          } else {
            monthly.push(item)
          }
        })
      } else if (equals(RamdaType(nextProps.data), 'Object')) {
        daily = nextProps.data.day || []
        weekly = nextProps.data.week || []
        monthly = nextProps.data.month || []
      }
      return {
        habits: nextProps.data,
        daily,
        weekly,
        monthly,
      }
    }

    return null
  }

  render() {
    const { daily, weekly, monthly } = this.state
    const { type, stats } = this.props

    const dailyItems = isNil(stats.day.items) ? daily : values(stats.day.items)
    const weeklyItems = isNil(stats.week.items) ? weekly : values(stats.week.items)
    const monthlyItems = isNil(stats.month.items) ? monthly : values(stats.month.items)

    return (
      <div className="career-required-instances">
        <div className="habits">
          <Accordion
            size="regular"
            type="secondary"
            icon="fal fa-circle"
            className="habit-accordion"
            title={`Daily Habit Completion (${length(dailyItems)})`}
            subTitle={equals('instance', type) ? Status('60%', `${stats.day.completion}%`) : null}
          >
            {dailyItems.map((item, index) => (
              <div className="d-flex justify-content-between py-2" key={`dailyitem${index}`}>
                <div className="d-flex">
                  <CheckIcon size={26} checked={equals(item.completion, 100)} />
                  <div>
                    <p className="dsl-b16 mb-1">{item.name || item.data.name}</p>
                    <p className="dsl-m12 mb-0">{`Completeness: ${item.completion || 0}%`}</p>
                  </div>
                </div>
                <div className="edit" />
              </div>
            ))}
          </Accordion>
          <Accordion
            size="regular"
            type="secondary"
            icon="fal fa-circle"
            className="habit-accordion"
            title={`Weekly Habit Completion (${length(weeklyItems)})`}
            subTitle={equals('instance', type) ? Status('60%', `${stats.week.completion}%`) : null}
          >
            {weeklyItems.map((item, index) => (
              <div className="d-flex justify-content-between py-2" key={`weeklyitem${index}`}>
                <div className="d-flex">
                  <CheckIcon size={26} checked={equals(item.completion, 100)} />
                  <div>
                    <p className="dsl-b16 mb-1">{item.name || item.data.name}</p>
                    <p className="dsl-m12 mb-0">{`Completeness: ${item.completion || 0}%`}</p>
                  </div>
                </div>
                <div className="edit" />
              </div>
            ))}
          </Accordion>
          <Accordion
            size="regular"
            type="secondary"
            icon="fal fa-circle"
            className="habit-accordion"
            title={`Monthly Habit Completion (${length(monthlyItems)})`}
            subTitle={equals('instance', type) ? Status('60%', `${stats.month.completion}%`) : null}
          >
            {monthlyItems.map((item, index) => (
              <div className="d-flex justify-content-between py-2" key={`monthlyitem${index}`}>
                <div className="d-flex">
                  <CheckIcon size={26} checked={equals(item.completion, 100)} />
                  <div>
                    <p className="dsl-b16 mb-1">{item.name || item.data.name}</p>
                    <p className="dsl-m12 mb-0">{`Completeness: ${item.completion || 0}%`}</p>
                  </div>
                </div>
                <div className="edit" />
              </div>
            ))}
          </Accordion>
        </div>
      </div>
    )
  }
}

HabitsDetail.propTypes = {
  data: PropTypes.oneOfType([PropTypes.array, PropTypes.any]),
  stats: PropTypes.shape({
    day: PropTypes.any,
    week: PropTypes.any,
    month: PropTypes.any,
  }),
  type: PropTypes.oneOf(['instance', 'template']),
}

HabitsDetail.defaultProps = {
  data: [],
  stats: {
    day: {},
    week: {},
    month: {},
  },
  type: 'instance',
}

export default HabitsDetail

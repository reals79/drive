import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import {
  equals,
  length,
  isNil,
  filter,
  findIndex,
  propEq,
  move,
  remove,
  clone,
  type as RamdaType,
} from 'ramda'
import { CheckIcon, Accordion, EditDropdown } from '@components'
import './LibraryProgramsList.scss'

class HabitList extends PureComponent {
  constructor(props) {
    super(props)

    this.state = {
      habits: [],
      daily: [],
      weekly: [],
      monthly: [],
    }

    this.handleSelectMenu = this.handleSelectMenu.bind(this)
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (!equals(nextProps.modules, prevState.habits)) {
      let daily = [],
        weekly = [],
        monthly = []
      if (equals(RamdaType(nextProps.modules), 'Array')) {
        nextProps.modules.map(item => {
          if (equals(item.data.schedule_interval, 'day')) {
            daily.push(item)
          } else if (equals(item.data.schedule_interval, 'week')) {
            weekly.push(item)
          } else {
            monthly.push(item)
          }
        })
      } else if (equals(RamdaType(nextProps.modules), 'Object')) {
        daily = nextProps.modules.day
        weekly = nextProps.modules.week
        monthly = nextProps.modules.month
      }
      return {
        habits: nextProps.modules,
        daily,
        weekly,
        monthly,
      }
    }
    return null
  }

  handleSelectMenu(mode, item, e) {
    const { habits, daily, weekly, monthly } = this.state
    let dailyModules = clone(daily)
    let weeklyModules = clone(weekly)
    let monthlyModules = clone(monthly)
    if (equals(mode, 'daily')) {
      const index = findIndex(propEq('id', item.id), dailyModules)
      switch (e) {
        case 'move up':
          dailyModules = move(index, index - 1, dailyModules)
          break
        case 'move down':
          dailyModules = move(index, index + 1, dailyModules)
          break
        case 'remove':
          dailyModules = remove(index, 1, dailyModules)
          break
        default:
          break
      }
    }
    if (equals(mode, 'weekly')) {
      const index = findIndex(propEq('id', item.id), weeklyModules)
      switch (e) {
        case 'move up':
          weeklyModules = move(index, index - 1, weeklyModules)
          break
        case 'move down':
          weeklyModules = move(index, index + 1, weeklyModules)
          break
        case 'remove':
          weeklyModules = remove(index, 1, weeklyModules)
          break
        default:
          break
      }
    }
    if (equals(mode, 'monthly')) {
      const index = findIndex(propEq('id', item.id), monthlyModules)
      switch (e) {
        case 'move up':
          monthlyModules = move(index, index - 1, monthlyModules)
          break
        case 'move down':
          monthlyModules = move(index, index + 1, monthlyModules)
          break
        case 'remove':
          monthlyModules = remove(index, 1, monthlyModules)
          break
        default:
          break
      }
    }

    if (equals(RamdaType(habits), 'Array')) {
      const modules = [...dailyModules, ...weeklyModules, ...monthlyModules]
      this.props.onChange(modules)
    } else if (equals(RamdaType(habits), 'Object')) {
      const modules = {
        day: dailyModules,
        week: weeklyModules,
        month: monthlyModules,
      }
      this.props.onChange(modules)
    }
  }

  render() {
    const { daily, weekly, monthly } = this.state
    return (
      <div className="library-programs-list px-0">
        <div className="programs-module-list">
          <Accordion
            size="regular"
            type="secondary"
            icon="fal fa-circle"
            className="habit-accordion"
            title={`Daily Habit Completion (${length(daily)})`}
            expanded={length(daily) > 0}
          >
            {daily.map((item, index) => {
              if (isNil(item.id)) return null
              let dotsMenu = ['Move Down', 'Move Up', 'Remove']
              if (equals(index, 0)) {
                dotsMenu = filter(x => !equals(x, 'Move Up'), dotsMenu)
              }
              if (equals(index + 1, length(daily))) {
                dotsMenu = filter(x => !equals(x, 'Move Down'), dotsMenu)
              }
              return (
                <div className="d-flex justify-content-between py-2" key={item.id}>
                  <div className="d-flex">
                    <CheckIcon size={26} checked={!isNil(item.completed_at)} />
                    <div>
                      <p className="dsl-b16 mb-1">{item.name || item.data.name}</p>
                      <p className="dsl-m12 mb-0">Completeness: none</p>
                    </div>
                  </div>
                  <div className="edit">
                    <EditDropdown
                      options={dotsMenu}
                      onChange={this.handleSelectMenu.bind(this, 'daily', item)}
                    />
                  </div>
                </div>
              )
            })}
          </Accordion>
          <Accordion
            size="regular"
            type="secondary"
            icon="fal fa-circle"
            className="habit-accordion"
            title={`Weekly Habit Completion (${length(weekly)})`}
            expanded={length(weekly) > 0}
          >
            {weekly.map((item, index) => {
              if (isNil(item.id)) return null
              let dotsMenu = ['Move Down', 'Move Up', 'Remove']
              if (equals(index, 0)) {
                dotsMenu = filter(x => !equals(x, 'Move Up'), dotsMenu)
              }
              if (equals(index + 1, length(weekly))) {
                dotsMenu = filter(x => !equals(x, 'Move Down'), dotsMenu)
              }
              return (
                <div className="d-flex justify-content-between py-2" key={item.id}>
                  <div className="d-flex">
                    <CheckIcon size={26} checked={!isNil(item.completed_at)} />
                    <div>
                      <p className="dsl-b16 mb-1">{item.name || item.data.name}</p>
                      <p className="dsl-m12 mb-0">Completeness: none</p>
                    </div>
                  </div>
                  <div className="edit">
                    <EditDropdown
                      options={dotsMenu}
                      onChange={this.handleSelectMenu.bind(this, 'weekly', item)}
                    />
                  </div>
                </div>
              )
            })}
          </Accordion>
          <Accordion
            size="regular"
            type="secondary"
            icon="fal fa-circle"
            className="habit-accordion"
            title={`Monthly Habit Completion (${length(monthly)})`}
            expanded={length(monthly) > 0}
          >
            {monthly.map((item, index) => {
              if (isNil(item.id)) return null
              let dotsMenu = ['Move Down', 'Move Up', 'Remove']
              if (equals(index, 0)) {
                dotsMenu = filter(x => !equals(x, 'Move Up'), dotsMenu)
              }
              if (equals(index + 1, length(monthly))) {
                dotsMenu = filter(x => !equals(x, 'Move Down'), dotsMenu)
              }
              return (
                <div className="d-flex justify-content-between py-2" key={item.id}>
                  <div className="d-flex">
                    <CheckIcon size={26} checked={!isNil(item.completed_at)} />
                    <div>
                      <p className="dsl-b16 mb-1">{item.name || item.data.name}</p>
                      <p className="dsl-m12 mb-0">Completeness: none</p>
                    </div>
                  </div>
                  <div className="edit">
                    <EditDropdown
                      options={dotsMenu}
                      onChange={this.handleSelectMenu.bind(this, 'monthly', item)}
                    />
                  </div>
                </div>
              )
            })}
          </Accordion>
        </div>
      </div>
    )
  }
}

HabitList.propTypes = {
  modules: PropTypes.oneOfType([PropTypes.array, PropTypes.any]),
  onChange: PropTypes.func,
}

HabitList.defaultProps = {
  modules: [],
  onChange: () => {},
}

export default HabitList

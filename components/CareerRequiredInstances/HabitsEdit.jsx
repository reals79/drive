import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { clone, equals, filter, findIndex, isNil, length, move, propEq, remove } from 'ramda'
import { Accordion, CheckIcon, EditDropdown, Input } from '@components'
import './CareerRequiredInstances.scss'

function Status(target) {
  return (
    <div className="d-flex align-items-center ml-auto">
      <span className="dsl-m12">Target</span>
      <span className="dsl-b14 ml-3">{target}</span>
    </div>
  )
}

class HabitsEdit extends PureComponent {
  handleSelectMenu = (mode, item) => e => {
    let data = clone(this.props.data)
    const index = findIndex(propEq('id', item.id), data[mode])
    switch (e) {
      case 'move up':
        data[mode] = move(index, index - 1, data[mode])
        break
      case 'move down':
        data[mode] = move(index, index + 1, data[mode])
        break
      case 'remove':
        data[mode] = remove(index, 1, data[mode])
        break
      default:
        break
    }

    this.props.onChange(data)
  }

  handleTarget = (item, type) => e => {
    const data = clone(this.props.data)
    const habit_target = Number(e)
    data[type].forEach((m, index) => {
      if (m.id === item.id) {
        data[type][index].quota = habit_target
      }
    })
    this.props.onChange(data)
  }

  render() {
    const { data, type } = this.props
    const daily = data.day
    const weekly = data.week
    const monthly = data.month

    return (
      <div className="career-required-instances">
        <div className="habits">
          <Accordion
            size="regular"
            type="secondary"
            icon="fal fa-circle"
            className="habit-accordion"
            title={`Daily Habit Completion (${length(daily)})`}
            subTitle={equals('instance', type) ? Status('72%', '20%') : null}
          >
            {daily.map((item, index) => {
              if (isNil(item.id)) return null
              let dotsMenu = ['Move Down', 'Move Up', 'Remove']
              if (equals(index, 0)) {
                dotsMenu = filter(x => !equals(x, 'Move Up'), dotsMenu)
              }
              if (equals(index + 1, length(monthly))) {
                dotsMenu = filter(x => !equals(x, 'Move Down'), dotsMenu)
              }
              return (
                <div className="list" key={item.id}>
                  <div className="d-flex d-flex-1">
                    <CheckIcon className="my-auto" size={26} checked={!isNil(item.completed_at)} />
                    <div>
                      <p className="dsl-b16 mb-1">{item.name || item.data.name}</p>
                      <p className="dsl-m12 mb-0">{item.description || item.data.description}</p>
                    </div>
                  </div>
                  {equals('instance', type) && (
                    <div className="target">
                      <Input
                        type="number"
                        placeholder="Type required number here..."
                        value={item.quota || 0}
                        onChange={this.handleTarget(item, 'day')}
                      />
                    </div>
                  )}
                  <div className="edit">
                    <EditDropdown
                      options={dotsMenu}
                      onChange={this.handleSelectMenu('day', item)}
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
            subTitle={equals('instance', type) ? Status('72%', '20%') : null}
          >
            {weekly.map((item, index) => {
              if (isNil(item.id)) return null
              let dotsMenu = ['Move Down', 'Move Up', 'Remove']
              if (equals(index, 0)) {
                dotsMenu = filter(x => !equals(x, 'Move Up'), dotsMenu)
              }
              if (equals(index + 1, length(monthly))) {
                dotsMenu = filter(x => !equals(x, 'Move Down'), dotsMenu)
              }
              return (
                <div className="list" key={item.id}>
                  <div className="d-flex d-flex-1">
                    <CheckIcon className="my-auto" size={26} checked={!isNil(item.completed_at)} />
                    <div>
                      <p className="dsl-b16 mb-1">{item.name || item.data.name}</p>
                      <p className="dsl-m12 mb-0">{item.description || item.data.description}</p>
                    </div>
                  </div>
                  {equals('instance', type) && (
                    <div className="target">
                      <Input
                        type="number"
                        placeholder="Type required number here..."
                        value={item.quota || 0}
                        onChange={this.handleTarget.bind(this, item, 'week')}
                      />
                    </div>
                  )}
                  <div className="edit">
                    <EditDropdown
                      options={dotsMenu}
                      onChange={this.handleSelectMenu('week', item)}
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
            subTitle={equals('instance', type) ? Status('72%', '20%') : null}
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
                <div className="list" key={item.id}>
                  <div className="d-flex d-flex-1">
                    <CheckIcon className="my-auto" size={26} checked={!isNil(item.completed_at)} />
                    <div>
                      <p className="dsl-b16 mb-1">{item.name || item.data.name}</p>
                      <p className="dsl-m12 mb-0">{item.description || item.data.description}</p>
                    </div>
                  </div>
                  {equals('instance', type) && (
                    <div className="target">
                      <Input
                        type="number"
                        placeholder="Type required number here..."
                        value={item.quota || 0}
                        onChange={this.handleTarget(item, 'month')}
                      />
                    </div>
                  )}
                  <div className="edit">
                    <EditDropdown
                      options={dotsMenu}
                      onChange={this.handleSelectMenu('month', item)}
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

HabitsEdit.propTypes = {
  data: PropTypes.oneOfType([PropTypes.array, PropTypes.any]),
  type: PropTypes.oneOf(['instance', 'template']),
}

HabitsEdit.defaultProps = {
  data: [],
  type: 'instance',
}

export default HabitsEdit

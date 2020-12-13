import React from 'react'
import PropTypes from 'prop-types'
import { clone, equals, isNil, keys, length, values } from 'ramda'
import moment from 'moment'
import classNames from 'classnames'
import { Button, Icon } from '@components'
import './CareerMap.scss'

class Edit extends React.PureComponent {
  state = {}

  handleAddLevel = () => {
    let program = clone(this.props.program)
    const levels = values(program.data.levels)
    const key = length(levels) + 1
    program.data.levels[key] = {
      title: '',
      chronology_lock: false,
      time_lock: false,
      habits: {
        day: [],
        week: [],
        month: [],
      },
      quotas: [],
      trainings: {
        days_to_complete: '',
        items: [],
      },
      started_at: null,
    }
    this.props.onChange(program)
  }

  handleDeleteLevel = level => {
    let program = clone(this.props.program)
    let levels = clone(program.data.levels)
    let _levels = {}
    keys(levels).forEach(key => {
      if (!equals(Number(key), level)) {
        _levels[key] = levels[key]
      }
    })
    program.data.levels = _levels
    this.props.onChange(program)
  }

  render() {
    const { className, current, program } = this.props
    const levels = values(program.data.levels)

    return (
      <div className={classNames('career-map', className)}>
        <div className="header">
          <span className="dsl-b22 bold">Career Map</span>
        </div>
        <div className="map-header">
          <span className="d-flex-5 dsl-m12">Level</span>
          <span className="d-flex-2 dsl-m12 text-right">Started</span>
          <span className="d-flex-3 dsl-m12 text-right">Completed</span>
          <span className="d-flex-1" />
        </div>
        {equals(0, levels.length) ? (
          <div className="map-item">
            <p className="dsl-m14">No Career program level assigned.</p>
          </div>
        ) : (
          levels.map(({ title, started_at, completed_at }, index) => {
            const isCompleted = !isNil(completed_at)
            const isCurrent = equals(index + 1, current)
            return (
              <div className="map-item" key={`level-${index}`}>
                <div className="d-flex d-flex-5 career-name">
                  {isCompleted ? (
                    <Icon name="check fal fa-check" color="#c3c7cc" size={14} />
                  ) : (
                    <div className="check" />
                  )}
                  <span
                    className={`dsl-${isCurrent ? 'b16 text-400' : 'l16'} ${
                      isCompleted ? 'line-through' : ''
                    } truncate-one`}
                  >
                    {title}
                  </span>
                  <div className="career-name-modal dsl-b16 text-400">{title}</div>
                </div>
                <span className={`d-flex-2 text-right dsl-${isCurrent ? 'b16 text-400' : 'l16'}`}>
                  {!isNil(started_at)
                    ? moment
                        .utc(started_at)
                        .local()
                        .format('MMM D, YY')
                    : ''}
                </span>
                <span className={`d-flex-3 text-right dsl-${isCurrent ? 'b16 text-400' : 'l16'}`}>
                  {isCompleted &&
                    moment
                      .utc(completed_at)
                      .local()
                      .format('MMM D, YY')}
                  {isNil(started_at) && 'Not started'}
                  {!isNil(started_at) && isCurrent && 'In Progress'}
                </span>
                <div
                  className="d-flex d-flex-1 justify-content-end"
                  onClick={this.handleDeleteLevel(index + 1)}
                >
                  <Icon name="fal fa-trash-alt cursor-pointer" color="#969faa" size={12} />
                </div>
              </div>
            )
          })
        )}
        <div className="d-flex justify-content-end">
          <Button className="mt-2" type="link" onClick={this.handleAddLevel}>
            <Icon name="far fa-plus" size={14} color="#376caf" />
            <span className="dsl-p14 text-400 ml-1 no-wrap">ADD LEVEL</span>
          </Button>
        </div>
      </div>
    )
  }
}

Edit.propTypes = {
  program: PropTypes.any,
  current: PropTypes.number,
}

Edit.defaultProps = {
  program: {},
  current: 1,
}

export default Edit

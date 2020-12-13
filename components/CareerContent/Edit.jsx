import React from 'react'
import PropTypes from 'prop-types'
import { concat, equals, filter, isNil, values, type, length } from 'ramda'
import { Button, Icon, CareerRequiredInstances as Instances } from '@components'
import { QuotaCalcTypes } from '~/services/config'
import './CareerContent.scss'

class Edit extends React.Component {
  constructor(props) {
    super(props)
    this.handleAttachQuota = this.handleAttachQuota.bind(this)
    this.handleAttachHabit = this.handleAttachHabit.bind(this)
    this.handleAttachTraining = this.handleAttachTraining.bind(this)
    this.handleChangeQuotas = this.handleChangeQuotas.bind(this)
    this.handleChangeHabits = this.handleChangeHabits.bind(this)
    this.handleChangeTrainings = this.handleChangeTrainings.bind(this)
  }

  handleAttachQuota() {
    let { current, program } = this.props

    this.props.onModal({
      type: 'Attach Library',
      data: {
        before: { show: ['quotas'], modules: [] },
        after: {},
      },
      callBack: {
        onAttach: e => {
          program.data.levels[current]['quotas'] = concat(
            program.data.levels[current]['quotas'],
            e.templates
          )
          this.props.onChange(program)
        },
      },
    })
  }

  handleAttachHabit() {
    let { current, program } = this.props

    this.props.onModal({
      type: 'Attach Library',
      data: {
        before: { show: ['habits'], modules: [] },
        after: {},
      },
      callBack: {
        onAttach: e => {
          const dayHabits = filter(e => equals('day', e.data.schedule_interval), e.templates)
          const weekHabits = filter(e => equals('week', e.data.schedule_interval), e.templates)
          const monthHabits = filter(e => equals('month', e.data.schedule_interval), e.templates)
          program.data.levels[current]['habits'].day = concat(
            program.data.levels[current]['habits'].day,
            dayHabits
          )
          program.data.levels[current]['habits'].week = concat(
            program.data.levels[current]['habits'].week,
            weekHabits
          )
          program.data.levels[current]['habits'].month = concat(
            program.data.levels[current]['habits'].month,
            monthHabits
          )
          this.props.onChange(program)
        },
      },
    })
  }

  handleAttachTraining() {
    let { current, program } = this.props

    this.props.onModal({
      type: 'Attach Library',
      data: {
        before: { show: ['tracks', 'courses', 'modules'], modules: [] },
        after: {},
      },
      callBack: {
        onAttach: e => {
          program.data.levels[current]['trainings'].items = concat(
            program.data.levels[current]['trainings'].items,
            e.templates
          )
          this.props.onChange(program)
        },
      },
    })
  }

  handleChangeQuotas(quotas) {
    let { current, program } = this.props
    program.data.levels[current]['quotas'] = quotas
    this.props.onChange(program)
  }

  handleChangeHabits(habits) {
    let { current, program } = this.props
    program.data.levels[current]['habits'] = habits
    this.props.onChange(program)
  }

  handleChangeTrainings(trainings) {
    let { current, program } = this.props
    program.data.levels[current]['trainings'].items = trainings
    this.props.onChange(program)
  }

  render() {
    let { current, program } = this.props
    let levels = values(program.data.levels)

    if (isNil(levels[current - 1])) {
      return (
        <div className="lib-programs-career">
          <div className="career-content mt-3">
            <p className="dsl-m14 mb-0">No career contents.</p>
          </div>
        </div>
      )
    }
    const { habits, quotas, trainings, documents } = levels[current - 1]
    const habitsLength = equals(type(habits), 'Object')
      ? length(habits.day) + length(habits.week) + length(habits.month)
      : length(habits)

    return (
      <div className="lib-programs-career">
        <div className="career-content mt-3">
          <div className="py-4">
            <p className="dsl-b18 text-500">Required Quotas</p>
            {length(quotas) > 0 ? (
              <Instances.QuotasEdit
                data={quotas}
                options={values(QuotaCalcTypes)}
                onChange={this.handleChangeQuotas}
              />
            ) : (
              <Instances.Empty />
            )}
          </div>
          <Button className="ml-auto" type="link" onClick={this.handleAttachQuota}>
            <Icon name="far fa-plus" size={14} color="#376caf" />
            <span className="dsl-p14 text-400 ml-1">ATTACH QUOTA</span>
          </Button>
          <div className="py-4">
            <p className="dsl-b18 text-500">Required Habits</p>
            {habitsLength > 0 ? (
              <Instances.HabitsEdit data={habits} onChange={this.handleChangeHabits} />
            ) : (
              <Instances.Empty />
            )}
          </div>
          <Button className="ml-auto" type="link" onClick={this.handleAttachHabit}>
            <Icon name="far fa-plus" size={14} color="#376caf" />
            <span className="dsl-p14 text-400 ml-1">ATTACH HABIT</span>
          </Button>
          <div className="py-4">
            <p className="dsl-b18 text-500">Required Training</p>
            {length(trainings.items) > 0 ? (
              <Instances.TrainingsEdit
                data={trainings.items}
                onChange={this.handleChangeTrainings}
              />
            ) : (
              <Instances.Empty />
            )}
          </div>
          <Button className="ml-auto my-3" type="link" onClick={this.handleAttachTraining}>
            <Icon name="far fa-plus" size={14} color="#376caf" />
            <span className="dsl-p14 text-400 ml-1">ATTACH TRAINING</span>
          </Button>
          <div className="py-4 mb-4">
            <p className="dsl-b18 text-500">Documents:</p>
            {length(documents) > 0 ? (
              <Instances.DocumentsEdit data={documents} />
            ) : (
              <p className="dsl-m12 mb-0">No documents uploaded yet...</p>
            )}
          </div>
        </div>
      </div>
    )
  }
}

Edit.propTypes = {
  program: PropTypes.any,
  current: PropTypes.number,
  onChange: PropTypes.func,
}

Edit.defaultProps = {
  program: {},
  current: 1,
  onChange: () => {},
}

export default Edit

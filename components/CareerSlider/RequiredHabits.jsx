import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Row, Col } from 'react-bootstrap'
import { equals, isNil } from 'ramda'
import { CheckIcon, Icon } from '@components'
import './CareerSlider.scss'

const HabitsRow = ({ data }) => {
  if (isNil(data.tasks)) {
    return null
  }

  return (
    <>
      {data.tasks.map((task, index) => (
        <Row key={index} className="row-item pl-3 py-1">
          <Col xs={6}>
            <div className="align-items-center pl-70">
              <CheckIcon checked={equals(task.completion, 100)} />
              <div className="l-content text-left">
                <span
                  className={`${
                    equals(task.completion, 100) ? 'dsl-d14 text-line-through' : 'dsl-b14'
                  }`}
                >
                  {task.task_name}
                </span>
                <br />
                {equals(task.completion, 100) && task.completed_at && (
                  <span className="dsl-d12">
                    Completed:{' '}
                    {moment
                      .utc(task.completed_at)
                      .local()
                      .format('M/D/YYYY')}
                  </span>
                )}
              </div>
            </div>
          </Col>
          <Col className="text-center" xs={3}>
            <span>70%</span>
          </Col>
          <Col className="text-center blue-text" xs={3}>
            <span>{task.completion}%</span>
          </Col>
        </Row>
      ))}
    </>
  )
}

class RequiredHabits extends React.PureComponent {
  state = {
    dailyOpened: false,
    weeklyOpened: false,
    monthlyOpened: false,
  }

  getCompletion(data) {
    let completion = 0
    if (isNil(data.tasks)) {
      return completion
    }
    data.tasks.map(task => {
      completion += task.completion
    })

    return completion
  }

  handleToggle(target) {
    if (equals(target, 'daily')) {
      this.setState({ dailyOpened: !this.state.dailyOpened })
    } else if (equals(target, 'weekly')) {
      this.setState({ weeklyOpened: !this.state.weeklyOpened })
    } else {
      this.setState({ monthlyOpened: !this.state.monthlyOpened })
    }
  }

  render() {
    const { dailyOpened, weeklyOpened, monthlyOpened } = this.state
    const { data } = this.props
    const { day, week, month } = data

    return (
      <>
        {!isNil(day) && (
          <Row className="line habits-line" onClick={() => this.handleToggle('daily')}>
            <Col xs={6}>
              <div className="align-items-center">
                <CheckIcon checked={!isNil(day.stats) && equals(day.stats.completion, 100)} />
                <span className="dsl-b14">
                  Daily Habit Completion ({!isNil(day.tasks) ? day.tasks.length : '0'})
                </span>
                &nbsp;&nbsp;
                <Icon
                  name={`fa fa-chevron-${dailyOpened ? 'down' : 'right'}`}
                  color="#343f4b"
                  size={8}
                />
              </div>
            </Col>
            <Col className="text-center" xs={3}>
              <span>70%</span>
            </Col>
            <Col className="text-center" xs={3}>
              <span>{`${isNil(day.stats) ? '0%' : `${day.stats.completion}%`}`}</span>
            </Col>
          </Row>
        )}

        {dailyOpened && !isNil(day) && <HabitsRow data={day} />}
        {!isNil(week) && (
          <Row className="line habits-line" onClick={() => this.handleToggle('weekly')}>
            <Col xs={6}>
              <div className="align-items-center">
                <CheckIcon checked={!isNil(week.stats) && equals(week.stats.completion, 100)} />
                <span className="dsl-b14">
                  Weekly Habit Completion ({!isNil(week.tasks) ? week.tasks.length : '0'})
                </span>
                &nbsp;&nbsp;
                <Icon
                  name={`fa fa-chevron-${weeklyOpened ? 'down' : 'right'}`}
                  color="#343f4b"
                  size={8}
                />
              </div>
            </Col>
            <Col className="text-center" xs={3}>
              <span>70%</span>
            </Col>
            <Col className="text-center" xs={3}>
              <span>{`${isNil(week.stats) ? '0%' : `${week.stats.completion}%`}`}</span>
            </Col>
          </Row>
        )}

        {weeklyOpened && !isNil(week) && <HabitsRow data={week} />}

        {!isNil(month) && (
          <Row className="line habits-line" onClick={() => this.handleToggle('monthly')}>
            <Col xs={6}>
              <div className="align-items-center">
                <CheckIcon checked={!isNil(month.stats) && equals(month.stats.completion, 100)} />
                <span className="dsl-b14">
                  Monthly Habit Completion ({!isNil(month.tasks) ? month.tasks.length : '0'})
                </span>
                &nbsp;&nbsp;
                <Icon
                  name={`fa fa-chevron-${monthlyOpened ? 'down' : 'right'}`}
                  color="#343f4b"
                  size={8}
                />
              </div>
            </Col>
            <Col className="text-center" xs={3}>
              <span>70%</span>
            </Col>
            <Col className="text-center" xs={3}>
              <span>{`${isNil(month.stats) ? '0%' : `${month.stats.completion}%`}`}</span>
            </Col>
          </Row>
        )}
        {monthlyOpened && !isNil(month) && <HabitsRow data={month} />}
      </>
    )
  }
}

RequiredHabits.propTypes = {
  data: PropTypes.any,
}

const mapStateToProps = state => ({})

const mapDispatchToProps = dispatch => ({})

export default connect(mapStateToProps, mapDispatchToProps)(RequiredHabits)

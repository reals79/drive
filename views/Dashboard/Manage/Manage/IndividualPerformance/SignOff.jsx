import React from 'react'
import PropTypes from 'prop-types'
import { Modal } from 'react-bootstrap'
import moment from 'moment'
import { find, isEmpty, isNil, path, propEq } from 'ramda'
import { Button, CoreTaskItem as TaskItem, Input } from '@components'
import * as Quota from './Quota'
import Accepted from './Accepted'
import './IndividualPerformance.scss'

class SignOff extends React.Component {
  state = { email1: this.props.user?.email, pass1: '', email2: this.props.manager?.email, pass2: '' }

  handleSign = type => () => {
    const { performance, user, manager } = this.props
    const { email1, email2, pass1, pass2 } = this.state
    let sign = { performance_id: performance.id }

    if (type == 'employee') {
      sign = { ...sign, user_id: user.id, email: email1, password: pass1 }
    } else {
      sign = { ...sign, user_id: manager.id, email: email2, password: pass2 }
    }

    this.props.onSign(sign)
  }

  render() {
    const { email1, pass1, email2, pass2 } = this.state
    const { user, performance, scorecards, show, selectedMonth, projects, reviews, users, onHide, onReset } = this.props
    const { data, tasks, trainings } = performance

    return (
      <Modal className="app-modal large pr-individual-modal" show={!isEmpty(show)} onHide={onHide}>
        <div className="modal-header">
          <span className="dsl-w14 text-200">{`${user.name}  -  ${moment(selectedMonth.start).format(
            'MMM YYYY'
          )}`}</span>
        </div>
        <div className="modal-body">
          {scorecards.map(item => (
            <div key={`ee${item.id}`}>
              <p className="dsl-b18 bold mb-0">Final Scorecard</p>
              <Quota.Header title="Results Quotas" />
              <Quota.List quotas={item.quotas} now={selectedMonth} onModal={e => this.handleActualModal(item, e)} />
              <Quota.Total quotas={item.quotas} now={selectedMonth} />
            </div>
          ))}

          <p className="dsl-b18 bold mt-5">Coaching Worksheet</p>

          {scorecards.map(item => (
            <div key={`sf${item.id}`}>
              <p className="dsl-m12 mt-4">Quotas Below Minimum</p>
              <Quota.Header title="Quotas" />
              <Quota.List
                quotas={item.quotas}
                now={selectedMonth}
                limit={2}
                onModal={e => this.handleActualModal(item, e)}
              />
            </div>
          ))}

          {path(['data', 'coaching', 'comments'], performance) && (
            <>
              <p className="dsl-m12 mt-4">Coaching Notes</p>
              <p className="dsl-b16 mb-0">{path(['data', 'coaching', 'comments'], performance)}</p>
            </>
          )}

          <p className="dsl-b18 bold mt-5">Plan: Tasks & Training</p>

          <div className="list-item pb-2 mt-2">
            <span className="dsl-m12">Tasks</span>
          </div>
          {reviews.tasks && tasks && !reviews.tasks.length && !tasks.length ? (
            <p className="dsl-b14 text-center mt-3">No Tasks</p>
          ) : (
            <div className="performance-tasks">
              {reviews.tasks &&
                reviews.tasks.map(task => (
                  <TaskItem
                    key={`sa${task.id}`}
                    task={task}
                    project={find(propEq('id', task.project_id || 166), projects) || {}}
                    onUpdate={() => {}}
                  />
                ))}
              {tasks &&
                tasks.map(task => (
                  <TaskItem
                    key={`sa${task.id}`}
                    task={task}
                    project={find(propEq('id', task.project_id || 166), projects) || {}}
                    onUpdate={() => {}}
                  />
                ))}
            </div>
          )}

          <div className="list-item pb-2 mt-3">
            <span className="dsl-m12">Training</span>
          </div>
          {reviews.trainings && trainings && !reviews.trainings.length && !trainings.length ? (
            <p className="dsl-b14 text-center mt-3">No Training</p>
          ) : (
            <div className="performance-training">
              {reviews.trainings &&
                reviews.trainings.map(training => (
                  <TaskItem
                    key={`st${training.id}`}
                    task={training}
                    users={users}
                    project={find(propEq('id', training.project_id || 166), projects) || {}}
                    onUpdate={() => {}}
                  />
                ))}
              {trainings &&
                trainings.map(training => (
                  <TaskItem
                    key={`st${training.id}`}
                    task={training}
                    users={users}
                    project={find(propEq('id', training.project_id || 166), projects) || {}}
                    onUpdate={() => {}}
                  />
                ))}
            </div>
          )}
        </div>

        {show == 'Save&Next' && (
          <div className="modal-footer mt-3">
            <p className="dsl-b18 bold">Signatures</p>
            <div className="d-flex flex-column flex-md-row mt-3">
              {!isEmpty(this.props.manager) && (
                <div className="d-flex-1 mr-2">
                  <p className="dsl-m12">Manager Signature</p>
                  {isNil(data.agreed) || isNil(data.agreed.supervisor) ? (
                    <>
                      <Input
                        title="Login/Email"
                        placeholder="Your email here..."
                        direction="vertical"
                        type="email"
                        value={email2}
                        onChange={e => this.setState({ email2: e })}
                      />
                      <Input
                        title="Password"
                        placeholder="Confirm your password here..."
                        direction="vertical"
                        type="password"
                        value={pass2}
                        onChange={e => this.setState({ pass2: e })}
                      />
                      <div className="d-flex align-items-center mt-2">
                        <Button className="text-400" name="RESET PASSWORD" type="link" onClick={onReset} />
                        <Button
                          className="mr-3"
                          disabled={!email2 || !pass2}
                          name="SUBMIT"
                          onClick={this.handleSign('manager')}
                        />
                      </div>
                    </>
                  ) : (
                    <Accepted data={data.agreed.supervisor} />
                  )}
                </div>
              )}

              <div className="d-flex-1 ml-2">
                <p className="dsl-m12">Employees Signature</p>
                {isNil(data.agreed) || isNil(data.agreed.employee) ? (
                  <>
                    <Input
                      title="Login/Email"
                      placeholder="Your email here..."
                      direction="vertical"
                      type="email"
                      value={email1}
                      onChange={e => this.setState({ email1: e })}
                    />
                    <Input
                      title="Password"
                      placeholder="Confirm your password here..."
                      direction="vertical"
                      type="password"
                      value={pass1}
                      onChange={e => this.setState({ pass1: e })}
                    />
                    <div className="d-flex align-items-center mt-2">
                      <Button className="text-400" name="RESET PASSWORD" type="link" onClick={onReset} />
                      <Button
                        className="mr-3"
                        disabled={!email1 || !pass1}
                        name="SUBMIT"
                        onClick={this.handleSign('employee')}
                      />
                    </div>
                  </>
                ) : (
                  <Accepted data={data.agreed.employee} />
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>
    )
  }
}

SignOff.propTypes = {
  user: PropTypes.any,
  performance: PropTypes.any,
  scorecards: PropTypes.array,
  selectedMonth: PropTypes.any,
  users: PropTypes.array,
  show: PropTypes.string,
  onHide: PropTypes.func,
  onSign: PropTypes.func.isRequired,
  onReset: PropTypes.func,
}

SignOff.defaultProps = {
  user: {},
  performance: {},
  scorecards: [],
  selectedMonth: {},
  users: [],
  show: '',
  onHide: () => {},
  onSign: e => {},
  onReset: () => {},
}

export default SignOff

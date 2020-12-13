import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Row, Col, Tabs, Tab } from 'react-bootstrap'
import originalMoment from 'moment'
import { extendMoment } from 'moment-range'
import { isEmpty, isNil, equals, length, filter, concat, uniq, find, propEq, includes } from 'ramda'
import {
  Avatar,
  Button,
  CheckBox,
  DatePicker,
  Dropdown,
  EditDropdown,
  Input,
  ProgressBar,
  Thumbnail,
  TrainingScheduleCourses,
} from '@components'
import { UserRoles } from '~/services/config'
import { avatarBackgroundColor } from '~/services/util'
import './IndividualTrainingSchedule.scss'

const moment = extendMoment(originalMoment)

class EditSchedule extends Component {
  state = {
    title: '',
    startDate: moment()
      .startOf('month')
      .format('YYYY-MM-DD'),
    endDate: moment().format('YYYY-MM-DD'),
    weeks: null,
    schedule: null,
    scheduleUsers: [],
    assignedCards: [],
    editable: this.props.editable,
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (!isNil(nextProps.data) && !equals(nextProps.data, prevState.schedule)) {
      const { data } = nextProps
      const startDate = moment(data.start_at).format('YYYY-MM-DD')
      const endDate = moment(data.end_at).format('YYYY-MM-DD')
      const weeks = Math.ceil(moment(data.end_at).diff(moment(data.start_at), 'weeks', true))
      let users = []

      data.data?.cards.map(card => {
        users = concat(users, card.users)
      })
      users = uniq(users)

      return {
        title: data.title,
        startDate,
        endDate,
        weeks,
        schedule: data,
        scheduleUsers: users,
        assignedCards: data.data?.cards || [],
      }
    }

    return null
  }

  handleChangeDateRange = e => {
    const startDate = moment(e.start).format('YYYY-MM-DD')
    const endDate = moment(e.end).format('YYYY-MM-DD')
    const weeks = Math.ceil(moment(e.end).diff(moment(e.start), 'weeks', true))
    this.setState({ startDate, endDate, weeks })
  }

  handleSelectEmployees = e => {
    const { assignedCards } = this.state
    const newCards = assignedCards.map(card => {
      return {
        ...card,
        users: e,
      }
    })
    this.setState({ scheduleUsers: e, assignedCards: newCards })
  }

  handleChangeCardUsers = (cardId, users) => {
    const { assignedCards } = this.state
    const newCards = assignedCards.map(card => {
      if (equals(card.id, cardId)) {
        return {
          ...card,
          users,
        }
      }
      return card
    })
    this.setState({ assignedCards: newCards })
  }

  handleChangeCardDate = (cardId, dueDate) => {
    const { assignedCards } = this.state
    const newCards = assignedCards.map(card => {
      if (equals(card.id, cardId)) {
        return {
          ...card,
          due_date: dueDate,
        }
      }
      return card
    })
    this.setState({ assignedCards: newCards })
  }

  handleRemoveCard = cardId => {
    const { assignedCards } = this.state
    const newCards = filter(x => !equals(x.id, cardId), assignedCards)
    this.setState({ assignedCards: newCards })
  }

  handleAssign = e => {
    const { scheduleUsers } = this.state
    const assignedCards = e.templates.map(card => ({ users: scheduleUsers, ...card }))
    this.setState({ assignedCards })
  }

  handleAddTraining = () => {
    const { assignedCards } = this.state
    this.props.onModal({
      type: 'Attach Library',
      data: { before: { selected: assignedCards }, after: {} },
      callBack: { onAttach: e => this.handleAssign(e) },
    })
  }

  handleSaveSchedule = () => {
    const { schedule, title, startDate, endDate, assignedCards } = this.state
    const { userId, authors } = this.props

    const cards = assignedCards.map(card => ({
      users: card.users,
      due_date: card.due_date || card.end_at,
      card_type: card.card_type || 'course',
      blocked_by: card.blocked_by || null,
      alert_manager: card.alert_manager || 0,
      complete_track: card.complete_track || 0,
      card_template_id: card.id,
      stats: card.stats || {
        assigned: length(card.users),
        completed: 0,
        past_due: 0,
      },
    }))

    const track = {
      id: schedule.id,
      user_id: schedule.user_id || userId,
      type: 3,
      author_id: schedule.author_id || authors[0].id,
      title,
      status: schedule.status || 0,
      data: { cards },
      result: schedule.result,
      deleted_at: schedule.deleted_at,
      completed_at: schedule.completed_at,
      designation: schedule.designation || 1,
      program_id: schedule.program_id,
      archived: schedule.archived || 0,
      description: schedule.description || '',
      start_at: startDate,
      end_at: endDate,
      thumbnail: schedule.thumbnail || '',
    }

    const payload = {
      type: 'track',
      data: { track },
    }
    this.props.onSave(payload)
  }

  handleToggleViewMode = () => {
    this.setState({ editable: !this.state.editable })
  }

  handleDeleteSchedule = () => {
    this.props.onModal({
      type: 'Confirm',
      data: {
        before: {
          title: 'Delete',
          body:
            'This will delete all assignments and records associated with this schedule.  Do you wish to delete it?',
          noButtonText: 'No, Keep it',
          yesButtonText: 'Yes, Delete',
        },
      },
      callBack: {
        onYes: () => {
          const { schedule } = this.state
          this.props.onDelete({
            libType: 'track',
            event: 'delete',
            templateId: schedule.id,
            card: schedule,
          })
          this.props.onBack()
        },
      },
    })
  }

  render() {
    const { title, editable, weeks, startDate, endDate, schedule, scheduleUsers, assignedCards } = this.state
    const { employees, userRole, competencies } = this.props

    if (isNil(schedule)) return null

    const noDueDateCards = filter(x => isNil(x.due_date), assignedCards)
    const disabledTraining = equals(weeks, 0)
    const disabledSave = isEmpty(assignedCards) || !isEmpty(noDueDateCards) || isEmpty(title)
    const dateValue = moment.range(startDate, endDate)

    let dotsMenu = []
    if (userRole < UserRoles.USER) {
      dotsMenu = editable ? ['Detail View'] : ['Edit']
    }

    return (
      <div className="add-training-schedule" data-cy="trainingScheduleEditForm">
        <div className="training-schedule-info">
          <div className="d-flex justify-content-between">
            <p className="dsl-b22 bold" data-cy="editTrainingScheduleTitle">
              {editable ? 'Edit Training Schedule' : title}
            </p>
            {!isEmpty(dotsMenu) && (
              <EditDropdown
                options={dotsMenu}
                onChange={this.handleToggleViewMode}
                dataCy="editTrainingScheduleTopThreeDot"
              />
            )}
          </div>
          {editable && (
            <Input
              className="input-field"
              title="Title"
              dataCy="title"
              type="text"
              direction="vertical"
              value={title}
              placeholder="Type here..."
              onChange={title => this.setState({ title })}
            />
          )}
          <Row>
            <Col xs={12} sm={6}>
              <p className="dsl-m12">Dates</p>
              <DatePicker
                value={dateValue}
                dataCy="dateRange"
                disabled={!editable}
                calendar="range"
                append="caret"
                as="span"
                format="MMM DD, YY"
                onSelect={this.handleChangeDateRange}
              />
            </Col>
            <Col xs={12} sm={6}>
              <p className="dsl-m12">Weeks to accomplish</p>
              {isNil(weeks) ? (
                <p className="dsl-l16 text-400"># weeks</p>
              ) : (
                <p className="dsl-b16 text-400 px-2">{weeks} weeks</p>
              )}
            </Col>
          </Row>
          {editable ? (
            <Dropdown
              multi
              title="Employees"
              dataCy="employees"
              direction="vertical"
              width="fit-content"
              data={employees}
              defaultIds={isEmpty(scheduleUsers) ? null : scheduleUsers}
              getValue={e => e.name}
              onChange={this.handleSelectEmployees}
            />
          ) : (
            <>
              <p className="dsl-m14">Employees</p>
              <Row className="mx-0" data-cy="scheduleUsers">
                {scheduleUsers?.map(id => {
                  const user = find(propEq('id', id), employees)
                  const userCards = filter(x => includes(id, x.users), assignedCards)
                  if (user) {
                    return (
                      <Col xs={6} sm={3} className="px-2 pb-2" key={user.id}>
                        <div className="d-flex d-flex-4">
                          <Avatar
                            className="d-flex-1"
                            url={user.profile.avatar}
                            size="extraTiny"
                            type="initial"
                            name={user.name}
                            backgroundColor={avatarBackgroundColor(user.id)}
                          />
                          <div className="d-flex-3 dsl-b16 align-self-center ml-2">{`${user.name} (${length(
                            userCards
                          )})`}</div>
                        </div>
                      </Col>
                    )
                  }
                })}
              </Row>
            </>
          )}
          {!isEmpty(noDueDateCards) && (
            <>
              <TrainingScheduleCourses.Header length={length(noDueDateCards)} className="mt-5" />
              {noDueDateCards.map(card => (
                <TrainingScheduleCourses.Item
                  key={card.id}
                  course={card}
                  editable={editable}
                  scheduleUsers={scheduleUsers}
                  employees={employees}
                  minDate={startDate}
                  maxDate={endDate}
                  onChangeDate={e => this.handleChangeCardDate(card.id, e)}
                  onChangeUsers={e => this.handleChangeCardUsers(card.id, e)}
                  onRemove={e => this.handleRemoveCard(card.id, e)}
                />
              ))}
            </>
          )}
        </div>
        {editable ? (
          <>
            {!isEmpty(assignedCards) && (
              <TrainingScheduleCourses.List
                admin={editable}
                weeks={weeks}
                startDate={startDate}
                endDate={endDate}
                courses={assignedCards}
                scheduleUsers={scheduleUsers}
                employees={employees}
                onChangeDate={this.handleChangeCardDate}
                onChangeUsers={this.handleChangeCardUsers}
                onRemove={this.handleRemoveCard}
              />
            )}
            <div className="buttons">
              <Button
                className="mt-3"
                name="+ ADD TRAINING"
                dataCy="addTrainingBtn"
                type={isEmpty(assignedCards) ? 'high' : 'medium'}
                disabled={disabledTraining}
                onClick={this.handleAddTraining}
              />
              <div className="w-100 d-flex justify-content-between mt-3">
                <Button dataCy="deleteBtn" name="DELETE" type="link" onClick={this.handleDeleteSchedule} />
                <Button dataCy="saveBtn" name="SAVE" disabled={disabledSave} onClick={this.handleSaveSchedule} />
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="bg-white px-3 pt-4 pb-2">
              <span className="dsl-b22 bold p-1">Courses</span>
            </div>
            <Tabs className="bg-white px-4" defaultActiveKey="date">
              <Tab eventKey="date" title="By Date">
                {!isEmpty(assignedCards) && (
                  <TrainingScheduleCourses.List
                    admin={editable}
                    weeks={weeks}
                    startDate={startDate}
                    endDate={endDate}
                    courses={assignedCards}
                    employees={employees}
                    onChangeDate={this.handleChangeCardDate}
                    onChangeUsers={this.handleChangeCardUsers}
                    onRemove={this.handleRemoveCard}
                  />
                )}
              </Tab>
              <Tab eventKey="competency" title="By Competency">
                <Row className="bg-white mx-0">
                  {competencies.map(({ id, name }) => {
                    const competencyCards = filter(
                      x =>
                        !isNil(x.data.competency) &&
                        (includes(id, x.data.competency) || includes(id + '', x.data.competency)),
                      assignedCards
                    )
                    if (!isEmpty(competencyCards)) {
                      return (
                        <Col xs={12} sm={6} className="px-4 pb-4" key={id}>
                          <div className="py-3 border-bottom">
                            <span className="dsl-b22 bold">{name}</span>
                            <span className="dsl-b16 ml-2">{length(competencyCards)}</span>
                          </div>
                          {competencyCards.map(({ id, name, stats, data }) => {
                            const isCompleted = equals(stats.assigned, stats.completed) && !equals(stats.completed, 0)
                            return (
                              <div className="d-flex border-bottom py-3" key={id}>
                                <div className="d-flex-5 d-flex align-items-center">
                                  <CheckBox className="pr-3" checked={isCompleted} size="regular" />
                                  <Thumbnail className="pr-3" src={data.thumb_url} size="tiny" />
                                  <div className="pr-3">
                                    <p
                                      className={`dsl-m14 text-400 mb-1 truncate-two ${
                                        isCompleted ? 'text-line-through' : ''
                                      }`}
                                    >
                                      {name}
                                    </p>
                                  </div>
                                </div>
                                <div className="d-flex-1 d-flex align-items-end justify-content-center flex-column">
                                  <p className="dsl-m12 mb-1">Modules</p>
                                  <p className="dsl-m12 mb-0">{stats.assigned}</p>
                                </div>
                                <div className="d-flex-1 d-flex align-items-end justify-content-center flex-column">
                                  <p className="dsl-m12 mb-1">Compl</p>
                                  <p className="dsl-m12 mb-0">{stats.completed}</p>
                                </div>
                                <div className="d-flex-1 d-flex align-items-end justify-content-center flex-column">
                                  <p className="dsl-m12 mb-1">Past Due</p>
                                  <p className="dsl-m12 mb-0">{stats.past_due}</p>
                                </div>
                              </div>
                            )
                          })}
                        </Col>
                      )
                    }
                  })}
                </Row>
              </Tab>
            </Tabs>
          </>
        )}
      </div>
    )
  }
}

EditSchedule.propTypes = {
  data: PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string,
  }),
  editable: PropTypes.bool,
  userId: PropTypes.number,
  userRole: PropTypes.number,
  authors: PropTypes.array,
  employees: PropTypes.array,
  competencies: PropTypes.array,
  onModal: PropTypes.func,
  onSave: PropTypes.func,
  onBack: PropTypes.func,
  onDelete: PropTypes.func,
}

EditSchedule.defaultProps = {
  data: {
    id: 0,
    title: '',
  },
  editable: false,
  userId: 0,
  userRole: 1,
  authors: [],
  employees: [],
  competencies: [],
  onModal: () => {},
  onSave: () => {},
  onBack: () => {},
  onDelete: () => {},
}

export default EditSchedule

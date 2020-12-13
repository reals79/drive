import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Row, Col } from 'react-bootstrap'
import originalMoment from 'moment'
import { extendMoment } from 'moment-range'
import { isEmpty, isNil, equals, length, filter, findIndex, propEq } from 'ramda'
import { Input, Button, TrainingScheduleCourses, Dropdown, DatePicker } from '@components'
import './IndividualTrainingSchedule.scss'

const moment = extendMoment(originalMoment)

class AddSchedule extends Component {
  state = {
    title: '',
    startDate: moment().format('YYYY-MM-DD'),
    endDate: moment()
      .endOf('month')
      .format('YYYY-MM-DD'),
    weeks: Math.ceil(
      (moment()
        .endOf('month')
        .diff(moment(), 'days') +
        1) /
        7
    ),
    companyIds: [this.props.companyId],
    scheduleUsers: [],
    assignedCards: [],
  }

  handleAssign = e => {
    const { scheduleUsers } = this.state
    const assignedCards = e.templates.map(card => ({ users: scheduleUsers, ...card }))
    this.setState({ assignedCards })
  }

  handleDate = e => {
    const startDate = moment(e.start).format('YYYY-MM-DD')
    const endDate = moment(e.end).format('YYYY-MM-DD')
    const weeks = Math.ceil((moment(endDate).diff(moment(startDate), 'days') + 1) / 7)
    this.setState({ startDate, endDate, weeks })
  }

  handleSelectEmployees = e => {
    this.setState({ scheduleUsers: e })
  }

  handleSelectCompanies = e => {
    const { companyIds } = this.state
    if (!isEmpty(e) && !equals(e, companyIds)) {
      this.setState({ companyIds: e })
      this.props.onSelectCompany({ company_id: e })
    }
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
          end_at: dueDate,
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

  handleAddTraining = () => {
    const { assignedCards } = this.state
    this.props.onModal({
      type: 'Attach Library',
      data: { before: { selected: assignedCards }, after: {} },
      callBack: { onAttach: e => this.handleAssign(e) },
    })
  }

  handleSaveSchedule = () => {
    const { title, startDate, endDate, assignedCards, companyIds } = this.state
    const { userId, authors } = this.props

    let trackCards = []
    assignedCards.map(track => {
      if (equals(track.card_type_id, 1)) {
        const template_id = track.id + ''
        if (findIndex(propEq('card_template_id', template_id), trackCards) < 0) {
          trackCards.push({
            card_type: 'course',
            users: track.users,
            due_date: track.end_at,
            blocked_by: track.blocked_by,
            alert_manager: 0,
            complete_track: 0,
            card_template_id: template_id,
          })
        }
      } else if (!isNil(track.data.cards)) {
        track.data.cards.map(card => {
          if (findIndex(propEq('card_template_id', card.card_template_id), trackCards) < 0) {
            trackCards.push({ ...card, users: track.users, due_date: track.end_at })
          }
        })
      }
    })

    const track = {
      user_id: userId,
      type: 3,
      author_id: authors[0].id,
      company_id: companyIds[0],
      title,
      status: 0,
      data: { cards: trackCards },
      result: null,
      deleted_at: null,
      completed_at: null,
      designation: 1,
      program_id: null,
      archived: 0,
      description: '',
      start_at: startDate,
      end_at: endDate,
    }

    const payload = {
      type: 'track',
      data: { track },
    }
    this.props.onSave(payload)
  }

  render() {
    const { title, weeks, startDate, endDate, scheduleUsers, assignedCards, companyIds } = this.state

    const { admin, companies, employees } = this.props
    const noDueDateCards = filter(x => isNil(x.end_at), assignedCards)
    const dueDateCards = filter(x => !isNil(x.end_at), assignedCards)
    const disabledTraining = equals(weeks, 0)
    const disabledSave = isEmpty(assignedCards) || !isEmpty(noDueDateCards) || isEmpty(title)
    const date = moment.range(startDate, endDate)

    return (
      <div className="add-training-schedule">
        <div className="training-schedule-info">
          <p className="dsl-b22 bold">Add Training Schedule</p>
          <Input
            className="input-field"
            title="Title"
            dataCy="hcm-add-training-schedule-inputTitle"
            type="text"
            direction="vertical"
            value={title}
            placeholder="Type here..."
            onChange={title => this.setState({ title })}
          />
          <Row>
            <Col xs={12} sm={6}>
              <p className="dsl-m12">Start date - End date</p>
              <DatePicker
                calendar="range"
                append="caret"
                format="MMM D"
                dataCy="hcm-add-training-schedule-startEndDate"
                as="span"
                align="right"
                value={date}
                minDate={new Date()}
                mountEvent
                closeAfterSelect
                onSelect={this.handleDate}
              />
            </Col>
            <Col xs={12} sm={6}>
              <p className="dsl-m12">Weeks to accomplish</p>
              {isNil(weeks) ? (
                <p className="dsl-l16 text-400"># weeks</p>
              ) : (
                <p className="dsl-b16 text-400 px-2" data-cy="hcm-add-training-schedule-weeksToAccomplish">
                  {weeks} weeks
                </p>
              )}
            </Col>
            <Col xs={12} sm={6}>
              <Dropdown
                multi
                title="Companies"
                dataCy="hcm-add-training-schedule-companyDropdown"
                direction="vertical"
                width="fit-content"
                defaultIds={companyIds}
                data={companies}
                getValue={e => e.name}
                onChange={this.handleSelectCompanies}
              />
            </Col>
            <Col xs={12} sm={6}>
              <Dropdown
                multi
                title="Employees"
                dataCy="hcm-add-training-schedule-employeeDropdown"
                direction="vertical"
                width="fit-content"
                data={employees}
                getValue={e => e.name}
                onChange={this.handleSelectEmployees}
              />
            </Col>
          </Row>
          {!isEmpty(noDueDateCards) && (
            <>
              <TrainingScheduleCourses.Header length={length(noDueDateCards)} className="mt-5" />
              {noDueDateCards.map(card => (
                <TrainingScheduleCourses.Item
                  key={card.id}
                  course={card}
                  editable={admin}
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
        <TrainingScheduleCourses.List
          admin={admin}
          weeks={weeks}
          startDate={startDate}
          endDate={endDate}
          scheduleUsers={scheduleUsers}
          courses={dueDateCards}
          employees={employees}
          onChangeDate={this.handleChangeCardDate}
          onChangeUsers={this.handleChangeCardUsers}
          onRemove={this.handleRemoveCard}
        />
        <div className="buttons">
          <Button
            className="mt-3"
            name="+ ADD TRAINING"
            dataCy="hcm-add-training-schedule-addTrainingBtn"
            type={isEmpty(assignedCards) ? 'high' : 'medium'}
            disabled={disabledTraining}
            onClick={this.handleAddTraining}
          />
          <Button
            className="mt-3"
            name="SAVE"
            dataCy="hcm-add-training-schedule-saveBtn"
            disabled={disabledSave}
            onClick={this.handleSaveSchedule}
          />
        </div>
      </div>
    )
  }
}

AddSchedule.propTypes = {
  admin: PropTypes.bool,
  userId: PropTypes.number,
  authors: PropTypes.array,
  companyId: PropTypes.number,
  companies: PropTypes.array,
  employees: PropTypes.array,
  onModal: PropTypes.func,
  onSave: PropTypes.func,
  onSelectCompany: PropTypes.func,
}

AddSchedule.defaultProps = {
  admin: false,
  userId: 0,
  authors: [],
  companyId: 0,
  companies: [],
  employees: [],
  onModal: () => {},
  onSave: () => {},
  onSelectCompany: () => {},
}

export default AddSchedule

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { clone, equals, find, isEmpty, isNil, keys, length, propEq, values } from 'ramda'
import {
  Button,
  ErrorBoundary,
  Filter,
  CareerUser,
  CareerMap,
  CareerContent,
  CareerRequest,
  Pagination,
} from '@components'
import AppActions from '~/actions/app'
import DevActions from '~/actions/develop'
import MngActions from '~/actions/manage'
import { initialize, isValid } from '~/services/util'
import './CareerEdit.scss'

class CareerEdit extends Component {
  constructor(props) {
    super(props)

    const companyId = props.companyId
    const type = props.match.params.type
    const id = Number(props.match.params.id)

    let program = {}
    let user = {}

    if (equals('employee', type)) {
      const employee = find(propEq('id', id), props.careerReports.users)
      program = clone(employee.stats.open_careers[0])
      user = find(propEq('id', id), props.employees)
    } else if (equals('career', type)) {
      const programs = props.careerReports.programs
      program = find(propEq('id', id), programs)
    }

    program = initialize(program)

    this.state = { companyId, user, program, requestLevel: 1, contentLevel: 1 }

    this.handleAssign = this.handleAssign.bind(this)
    this.handleChangeProgram = this.handleChangeProgram.bind(this)
    this.handleCompleteRequest = this.handleCompleteRequest.bind(this)
    this.handleContentPagination = this.handleContentPagination.bind(this)
    this.handleFilter = this.handleFilter.bind(this)
    this.handleRequestNavigation = this.handleRequestNavigation.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleDiscard = this.handleDiscard.bind(this)
  }

  handleFilter(type, data) {
    const { companyId, user } = this.state
    if (equals(type, 'company')) {
      if (!equals(companyId, data[0].id)) {
        this.setState({ companyId: data[0].id })
      }
    } else if (!equals(user, data[0])) {
      this.setState({ userId: data[0].id })
    }
  }

  handleChangeProgram(e) {
    this.setState({ program: e })
  }

  handleAssign() {
    const { user, companyId } = this.state
    const payload = {
      type: 'Assign Program',
      data: { before: { modules: [], assignees: [user.id], companyId }, after: null },
      callBack: null,
    }
    this.props.toggleModal(payload)
  }

  handleContentPagination(e) {
    this.setState({ contentLevel: e })
  }

  handleRequestNavigation(e) {
    const levels = length(values(this.state.program.data.levels))
    const { requestLevel } = this.state
    if (requestLevel + e >= 1 && requestLevel + e <= levels) {
      this.setState({ requestLevel: requestLevel + e })
    }
  }

  handleCompleteRequest() {
    const { program, userId } = this.props
    if (isNil(program)) return
    this.props.completeRequest({
      event: 'nextlevel',
      data: {
        user_id: [userId],
        program_id: program.id,
      },
    })
  }

  handleSubmit() {
    const program = clone(this.state.program)
    keys(program.data.levels).forEach(key => {
      let level = program.data.levels[key]

      level.habits.day = level.habits.day.map(item => item.id)
      level.habits.week = level.habits.week.map(item => item.id)
      level.habits.month = level.habits.month.map(item => item.id)
      level.quotas = level.quotas.map(item => item.id)
      level.trainings.items = level.trainings.items.map(item => {
        let _item = {
          item_id: item.id,
        }
        return _item
      })

      program.data.levels[key] = level
    })
    const payload = { program }
    this.props.saveProgram(payload)
  }

  handleDiscard() {
    const userId = Number(this.props.match.params.userId)
    const career = find(propEq('id', userId), this.props.companyCareers.users)
    let program = clone(career.program)
    program = initialize(program)
    this.setState({ program })
  }

  render() {
    const { companyId, user, program, requestLevel, contentLevel } = this.state
    const { userId } = this.props
    const title = program.title
    const level = program.level
    const data = program.data
    const levels = values(data.levels)

    return (
      <ErrorBoundary className="mng-career-edit">
        <Filter
          backTitle="all careers"
          mountEvent
          onChange={this.handleFilter}
          onBack={() => this.props.history.goBack()}
        />
        <div className="d-flex">
          {isValid(user) && (
            <CareerUser.Edit user={user} title={title} description={data.description} history={this.props.history} />
          )}
          <CareerMap.Edit
            className={isEmpty(user) ? 'ml-0' : ''}
            program={program}
            current={level}
            onChange={this.handleChangeProgram}
          />
        </div>
        {isValid(data.levels[requestLevel]) && (
          <CareerRequest.Edit
            program={program}
            current={requestLevel}
            requestable={equals(user.id, userId)}
            onLeft={() => this.handleRequestNavigation(-1)}
            onRight={() => this.handleRequestNavigation(1)}
            onChange={this.handleChangeProgram}
            onComplete={this.handleCompleteRequest}
          />
        )}
        {isValid(data.levels[contentLevel]) && (
          <CareerContent.Edit
            program={program}
            current={contentLevel}
            onChange={this.handleChangeProgram}
            onModal={e => this.props.toggleModal(e)}
          />
        )}
        {!isValid(data.levels[requestLevel]) && !isValid(data.levels[contentLevel]) && (
          <div className="no-levels">
            <p className="dsl-m12">No Levels. Please add a level.</p>
          </div>
        )}
        <div className="submit">
          <Button type="low" name="DISCARD" onClick={this.handleDiscard} />
          <Button className="ml-3" name="SAVE" onClick={this.handleSubmit} />
        </div>
        <Pagination
          suffix="LEVEL"
          pers={[]}
          current={contentLevel}
          total={length(levels)}
          onChange={this.handleContentPagination}
        />
      </ErrorBoundary>
    )
  }
}

const mapStateToProps = state => ({
  userId: state.app.id,
  companyId: state.app.company_info.id,
  employees: state.app.employees,
  companyCareers: state.manage.companyCareers,
  careerReports: state.manage.careerReport,
})

const mapDispatchToProps = dispatch => ({
  completeRequest: e => dispatch(DevActions.programeventRequest(e)),
  saveProgram: e => dispatch(MngActions.postcareerprogramRequest(e)),
  toggleModal: payload => dispatch(AppActions.modalRequest(payload)),
})

export default connect(mapStateToProps, mapDispatchToProps)(CareerEdit)

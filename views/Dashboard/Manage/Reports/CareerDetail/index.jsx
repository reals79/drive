import React, { Component } from 'react'
import { connect } from 'react-redux'
import { clone, equals, find, isEmpty, isNil, length, propEq, values } from 'ramda'
import originalMoment from 'moment'
import { extendMoment } from 'moment-range'
import { ErrorBoundary, Filter, CareerUser, CareerMap, CareerContent, CareerRequest, Pagination } from '@components'
import AppActions from '~/actions/app'
import DevActions from '~/actions/develop'
import { initialize } from '~/services/util'
import CareerDetailPdf from './CareerDetailPdf'

const moment = extendMoment(originalMoment)

class CareerDetail extends Component {
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

    this.state = {
      companyId,
      user,
      program,
      contentLevel: program.level,
    }

    this.handleFilter = this.handleFilter.bind(this)
    this.handleAssign = this.handleAssign.bind(this)
    this.handleContentPagination = this.handleContentPagination.bind(this)
    this.handleCompleteRequest = this.handleCompleteRequest.bind(this)
  }

  handleFilter(type, data) {
    const { companyId, user } = this.state
    if (equals(type, 'company')) {
      if (!equals(companyId, data[0].id)) {
        this.setState({ companyId: data[0].id })
      }
    } else if (!equals(user, data[0])) {
    }
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

  handleCompleteRequest() {
    const { program } = this.state
    if (isNil(program)) return
    this.props.programPromote({ programId: program.id, route: '/hcm/report-careers' })
  }

  handlePdf = async () => {
    const { program, contentLevel, user } = this.state
    const level = program.level
    const stats = program.stats
    const data = program.data
    const levels = values(data.levels)
    const pdfData = {
      program: program,
      current: level,
      contentLevel: contentLevel,
      levels: levels,
      stats: stats,
      userName: user.name,
    }
    const blob = await CareerDetailPdf(pdfData)
    const url = URL.createObjectURL(blob)
    window.open(url, '__blank')
  }

  render() {
    const { companyId, user, program, contentLevel } = this.state
    const { userId, history } = this.props
    const title = program.title
    const level = program.level
    const stats = program.stats
    const data = program.data
    const levels = values(data.levels)

    return (
      <ErrorBoundary className="mng-career">
        <Filter backTitle="all careers" mountEvent onChange={this.handleFilter} onBack={() => history.goBack()} />
        <div className="d-flex">
          {!isEmpty(user) && (
            <CareerUser.Detail user={user} title={title} description={data.description} history={this.props.history} />
          )}
          <CareerMap.Detail className={isEmpty(user) ? 'ml-0' : ''} levels={levels} current={level} />
        </div>
        <CareerRequest.Detail
          program={program}
          current={level}
          contentLevel={contentLevel}
          requestable={equals(user.id, userId)}
          onComplete={this.handleCompleteRequest}
          handlePdf={this.handlePdf}
        />
        <CareerContent.Detail levels={levels} stats={stats} current={contentLevel} />
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
  employees: state.app.employees,
  companyId: state.app.company_info.id,
  companyCareers: state.manage.companyCareers,
  careerReports: state.manage.careerReport,
})

const mapDispatchToProps = dispatch => ({
  programPromote: e => dispatch(DevActions.programpromotionRequest(e)),
  toggleModal: payload => dispatch(AppActions.modalRequest(payload)),
})

export default connect(mapStateToProps, mapDispatchToProps)(CareerDetail)

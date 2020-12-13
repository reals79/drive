import React, { Component } from 'react'
import { connect } from 'react-redux'
import { filter, find, propEq, values } from 'ramda'
import moment from 'moment'
import { Avatar, DatePicker, ErrorBoundary, Filter, Icon, Pagination, Rating, Text } from '@components'
import ManageActions from '~/actions/manage'
import { avatarBackgroundColor } from '~/services/util'
import IndividualPerformancePdf from './IndividualPerformancePdf'
import './IndividualPerformance.scss'

class IndividualPerformance extends Component {
  constructor(props) {
    super(props)

    const company = find(propEq('id', props.companyId), props.companies) || { id: props.companyId }
    const managers = company.managers || []
    const roles = company.job_roles || []

    const id = Number(props.match.params.id)
    let user = find(propEq('id', id), props.employees) || { profile: {} }
    const job = find(propEq('id', user.job_role_id), roles) || {}
    user = { ...user, job }
    const manager = props.role < 4 ? props.user : find(item => item.id == user.manager_id, managers)

    this.state = {
      page: 1,
      per: 25,
      user,
      manager,
      company,
      managers,
      roles,
      startDate: moment()
        .subtract(12, 'month')
        .startOf('month')
        .format('YYYY-MM-DD'),
      endDate: moment()
        .subtract(1, 'month')
        .endOf('month')
        .format('YYYY-MM-DD'),
    }
  }

  componentDidMount() {
    const { user, startDate, endDate } = this.state
    this.props.fetchIndividualPerformanceReview(user.id, user.company_id, null, startDate, endDate)
  }

  handleBack = () => {
    this.props.history.goBack()
  }

  handleDateChange = e => {
    const { user, per, page } = this.state
    const startDate = moment(e.start).format('YYYY-MM-DD')
    const endDate = moment(e.end).format('YYYY-MM-DD')
    this.props.fetchPersonalReviews(user.id, user.company_id, page, per, startDate, endDate)
    this.props.fetchIndividualPerformanceReview(user.id, user.company_id, null, startDate, endDate)
    this.setState({ startDate, endDate })
  }

  handleDetail(e) {
    const { user } = this.state
    const userId = e.user_id
    const companyId = e.company_id
    if (moment(e.date_start).isBefore(user.feed.created_at)) return null
    this.props.gotoPersonalReviews(
      userId,
      companyId,
      `/hcm/performance-reviews/${userId}?date_start=${e.date_start}&editable=${false}`,
      e.date_start,
      e.date_end
    )
  }

  handleFilter = (type, e) => {
    const { managers, roles, per, startDate, endDate } = this.state
    const { employees } = this.props
    if (type == 'employee') {
      if (e[0].id < 0) return
      const user = find(propEq('id', e[0].id), employees) || { profile: {} }
      const job = find(propEq('id', user.job_role_id), roles) || {}
      const manager = find(item => item.id == user.manager_id, managers)
      this.setState({ user: { ...user, job }, manager, page: 1 })
      this.props.fetchPersonalReviews(user.id, user.company_id, 1, per, startDate, endDate)
      this.props.fetchIndividualPerformanceReview(user.id, user.company_id, null, startDate, endDate)
    } else if (type == 'company') {
      this.setState({ company: e[0] })
    }
  }

  handlePagination = page => {
    const { user, per, startDate, endDate } = this.state
    this.props.fetchPersonalReviews(user.id, user.company_id, page, per, startDate, endDate)
    this.setState({ page })
  }

  handlePer(per) {
    const { user, page, startDate, endDate } = this.state
    this.props.fetchPersonalReviews(user.id, user.company_id, page, per, startDate, endDate)
    this.setState({ per })
  }

  handlePdf = async () => {
    const { user, company, startDate, endDate } = this.state
    const { data, individualPerformanceReview } = this.props
    const lastReviewState = this.props.history.location.state.lastReview
    const pdfData = { user, company, startDate, endDate, data, lastReviewState, individualPerformanceReview }
    const pdf = await IndividualPerformancePdf(pdfData)
    const pdfUrl = URL.createObjectURL(pdf)
    window.open(pdfUrl, '__blank')
  }

  render() {
    const { user, company, startDate, endDate } = this.state
    const { data, individualPerformanceReview } = this.props
    const { totals } = individualPerformanceReview
    const { current_page, last_page } = data
    const date = moment.range(startDate, endDate)
    const reviews = filter(item => moment(item.date_start).isBetween(startDate, endDate, null, '[]'), data.data)
    const priorReview = values(reviews[0]?.data?.scorecards)[0] || {}
    const lastReview = this.props.history.location.state.lastReview
      ? moment(this.props.history.location.state?.lastReview).isBefore(user?.feed?.created_at)
        ? 'NA'
        : moment(this.props.history.location.state?.lastReview).format('MMM D,YYYY')
      : 'NA'

    return (
      <ErrorBoundary className="ind-performance-reports">
        <Filter backTitle="all reviews" onBack={this.handleBack} onChange={this.handleFilter} />
        <div className="card">
          <div className="d-flex justify-content-between pt-4 pt-lg-0">
            <span className="dsl-b22 bold">Performance History Report</span>
            <Icon name="far fa-print" size={18} color="#343f4b" onClick={this.handlePdf} />
          </div>
          <div className="mt-4 d-flex">
            <div className="d-flex">
              <Avatar
                size="large"
                url={user.profile.avatar}
                name={user.name}
                type="initial"
                backgroundColor={avatarBackgroundColor(user.id)}
              />
              <div className="ml-3">
                <p className="dsl-b24 bold mb-2">{user.name}</p>
                <Text title="Company:" value={company.name} titleWidth={120} disabled />
                <Text title="Scorecard:" value={priorReview ? priorReview.title : 'Na'} titleWidth={120} disabled />
                <Text title="Recent review:" value={lastReview} titleWidth={120} disabled />
              </div>
            </div>
            <div className="d-flex align-items-end justify-content-between d-flex-1">
              <div>
                {reviews.length &&
                !moment(reviews[0]?.date_start).isBefore(user?.feed?.created_at) &&
                lastReview !== 'NA' ? (
                  <>
                    <Rating
                      className="mb-2"
                      title="Recent Review:"
                      titleWidth={100}
                      score={
                        reviews[0]?.status === 2
                          ? reviews[0]?.data?.completed_average_star_rating
                          : reviews[0]?.prior_score
                      }
                    />
                    <Rating title="Average Review:" titleWidth={100} score={totals?.average_star_rating} />
                  </>
                ) : (
                  <>
                    <Text title="Recent Review:" value="Na" titleWidth={122} disabled />
                    <Text title="Average Review:" value="Na" titleWidth={122} disabled />
                  </>
                )}
              </div>
              <div />
            </div>
          </div>
        </div>
        <div className="card mt-3">
          <div className="d-flex justify-content-between pt-4 pt-lg-0">
            <span className="dsl-b22 bold">Prior Reviews</span>
            <DatePicker
              calendar="range"
              append="caret"
              format="MMM YYYY"
              as="span"
              align="right"
              value={date}
              mountEvent
              onSelect={this.handleDateChange}
            />
          </div>
          <div className="list-item mt-2 pb-2">
            <div className="d-flex-2">
              <span className="dsl-m12">Date</span>
            </div>
            <div className="d-flex-4">
              <span className="dsl-m12">Scorecard</span>
            </div>
            <div className="d-flex-1" />
            <div className="d-flex-3">
              <span className="dsl-m12">Score</span>
            </div>
            <div className="d-flex-2">
              <span className="dsl-m12">Commitments</span>
            </div>
            <div className="d-flex-1" />
            <div className="d-flex-2">
              <span className="dsl-m12">Status</span>
            </div>
          </div>

          {reviews.length ? (
            reviews.map(item => {
              const scorecard = item.data?.scorecards ? values(item.data.scorecards)[0] : null
              return (
                <div className="list-item list cursor-pointer" key={item.id} onClick={() => this.handleDetail(item)}>
                  <div className="d-flex-2 d-flex align-items-center">
                    <span className="dsl-b14 ml-2 cursor-pointer">{moment(item.date_start).format('MMMM YYYY')}</span>
                  </div>
                  <div className="d-flex-4 truncate-one">
                    <span className="dsl-b14">{scorecard ? scorecard.title : 'No Scorecard'}</span>
                  </div>
                  <div className="d-flex-1" />
                  <div className="d-flex-3">
                    {item.status == 2 ? (
                      <>
                        {item?.data?.completed_average_star_rating !== 'N/A' ? (
                          <Rating score={item?.data?.completed_average_star_rating} />
                        ) : (
                          <span className="dsl-b14">Na (Per Manager)</span>
                        )}
                        {item?.data?.average_star_rating === undefined && <span className="dsl-b14">Incomplete</span>}
                      </>
                    ) : (
                      <span className="dsl-b14">Incomplete</span>
                    )}
                  </div>
                  <div className="d-flex-2">
                    {item.status == 2 ? (
                      <>
                        <Icon name="fal fa-graduation-cap" color="#343f4b" size={14} />
                        <span className="dsl-b14 ml-1">{item.trainings ? item.trainings.length : 'Na'}</span>
                        <Icon name="fal fa-check-circle ml-2" color="#343f4b" size={14} />
                        <span className="dsl-b14 ml-1">{item.tasks ? item.tasks.length : 'Na'}</span>
                      </>
                    ) : (
                      <span className="dsl-b14">Incomplete</span>
                    )}
                  </div>
                  <div className="d-flex-1" />
                  <div className="d-flex-2">
                    {item.status == 2 ? (
                      <>
                        {item.data && item.data.scorecards ? (
                          <span className="dsl-m12">
                            Completed{`\n`}
                            {moment(item.completed_at).format('MMM DD,YY')}
                          </span>
                        ) : (
                          <span className="dsl-b14">No Scorecard</span>
                        )}
                      </>
                    ) : (
                      <span className="dsl-b14">Incomplete</span>
                    )}
                  </div>
                </div>
              )
            })
          ) : (
            <p className="dsl-b14 text-center text-400 my-4">No Prior Reviews</p>
          )}

          <Pagination
            current={current_page}
            total={last_page}
            onChange={this.handlePagination}
            onPer={this.handlePer}
          />
        </div>
      </ErrorBoundary>
    )
  }
}

const mapStateToProps = state => ({
  isManager: state.app.app_role_id < 4,
  userId: state.app.id,
  companyId: state.app.company_info.id,
  companies: state.app.companies,
  employees: state.app.employees,
  data: state.manage.performanceReviews,
  individualPerformanceReview: state.manage.individualPerformanceReview,
})

const mapDispatchToProps = dispatch => ({
  fetchPersonalReviews: (userId, companyId, current, per, startDate, endDate) =>
    dispatch(ManageActions.getperformancereviewsRequest(userId, companyId, current, per, startDate, endDate)),
  fetchIndividualPerformanceReview: (userId, companyId, route, dateStart, dateEnd) =>
    dispatch(ManageActions.individualperformancereviewRequest(userId, companyId, route, dateStart, dateEnd)),
  gotoPersonalReviews: (userId, companyId, route, dateStart, dateEnd) =>
    dispatch(ManageActions.individualperformancereviewRequest(userId, companyId, route, dateStart, dateEnd)),
})

export default connect(mapStateToProps, mapDispatchToProps)(IndividualPerformance)

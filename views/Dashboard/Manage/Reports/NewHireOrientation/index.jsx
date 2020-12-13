import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import originalMoment from 'moment'
import { extendMoment } from 'moment-range'
import classNames from 'classnames'
import { isNil, values } from 'ramda'
import { Avatar, DatePicker, EditDropdown, Filter, Icon, ToggleColumnMenu } from '@components'
import { avatarBackgroundColor } from '~/services/util'
import AppActions from '~/actions/app'
import MngActions from '~/actions/manage'
import DevActions from '~/actions/develop'
import { NewHireReportMenu } from '~/services/config'
import { exportCsv } from '~/services/util'
import NewHirePdf from './NewHirePdf'
import './NewHireOrientation.scss'

const moment = extendMoment(originalMoment)

class NewHireOrientation extends Component {
  constructor(props) {
    super(props)

    const startDate = moment()
      .startOf('month')
      .format('YYYY-MM-DD')
    const endDate = moment()
      .endOf('month')
      .format('YYYY-MM-DD')

    this.state = {
      userId: props.userId,
      company: props.company,
      startDate,
      endDate,
      column: 1,
    }

    this.handleFilter = this.handleFilter.bind(this)
    this.handleChangeDate = this.handleChangeDate.bind(this)
    this.handleSelectMenu = this.handleSelectMenu.bind(this)
    this.handleDeleteProgram = this.handleDeleteProgram.bind(this)
    this.handlePdf = this.handlePdf.bind(this)
    this.handleVisible = this.handleVisible.bind(this)
    this.handleExcel = this.handleExcel.bind(this)
    this.handleExcelReport = this.handleExcelReport.bind(this)
    props.getOrientations({
      company_id: [props.company.id],
      date_start: startDate,
      date_end: endDate,
    })
  }

  handleFilter(type, e) {
    const { company, startDate, endDate } = this.state

    if (isNil(e)) return
    if ('company' === type) {
      if (e[0].id !== company.id) {
        this.props.getOrientations({
          company_id: [e[0].id],
          date_start: startDate,
          date_end: endDate,
        })
        this.setState({ company: e[0] })
      }
    } else if ('employee' === type) {
    }
  }

  handleChangeDate(e) {
    const { company } = this.state
    const startDate = moment(e.start).format('YYYY-MM-DD')
    const endDate = moment(e.end).format('YYYY-MM-DD')
    this.props.getOrientations({
      company_id: company.id,
      date_start: startDate,
      date_end: endDate,
    })
    this.setState({ startDate, endDate })
  }

  async handlePdf() {
    const { startDate, endDate } = this.state
    const { newHireReport } = this.props
    const date = moment.range(startDate, endDate)
    const pdfData = {
      date: date,
      newHireReport: newHireReport,
    }
    const bolb = await NewHirePdf(pdfData)
    const url = URL.createObjectURL(bolb)
    window.open(url, '__blank')
  }

  handleSelectMenu(item, e) {
    const { company, startDate, endDate } = this.state
    const { certification_object } = item.report
    switch (e) {
      case 'detail view':
        const route = `/hcm/report-certifications/${certification_object.user_id}/${certification_object.id}/view`
        this.props.getCertificationDetail(certification_object, route)
        break
      case 'edit assignement':
        this.props.toggleModal({
          type: 'Quick Edit',
          data: {
            before: {
              template: certification_object,
              type: 'certifications',
              from: 'instance',
              deleteTitle: 'UNASSIGNED',
              after: {
                card: certification_object,
                mode: 'reassign',
                type: 'FETCHHIREORIENTATIONREPORT_REQUEST',
                payload: {
                  company_id: company.id,
                  date_start: startDate,
                  date_end: endDate,
                },
              },
            },
          },
          callBack: {
            onDelete: () => this.handleDeleteProgram(certification_object),
          },
        })
        break
      case 'unassign':
        this.handleDeleteProgram(certification_object)
        break
      case 'assign':
        this.props.toggleModal({
          type: 'Assign Program',
          data: {
            before: {
              modules: [],
              disabled: ['careers', 'badges'],
              assignees: [item.id],
              companyId: company.id,
              after: {
                type: 'FETCHHIREORIENTATIONREPORT_REQUEST',
                payload: {
                  company_id: company.id,
                  date_start: startDate,
                  date_end: endDate,
                },
              },
            },
            after: [],
          },
          callBack: null,
        })
        break
      default:
        break
    }
  }

  handleDeleteProgram(program) {
    const { company, startDate, endDate } = this.state
    this.props.deleteCertification({
      event: 'delete',
      data: {
        program: { id: program.id },
      },
      after: {
        type: 'FETCHHIREORIENTATIONREPORT_REQUEST',
        payload: {
          company_id: company.id,
          date_start: startDate,
          date_end: endDate,
        },
      },
    })
  }

  handleVisible(column) {
    this.setState({ column })
  }

  handleExcelReport() {
    this.props.toggleModal({
      type: 'Confirm',
      data: {
        before: {
          title: 'Confirm',
          body: 'Would you like to download this reports data to excel?',
        },
      },
      callBack: {
        onYes: () => {
          this.handleExcel()
        },
      },
    })
  }

  handleExcel() {
    const { newHireReport } = this.props
    let excelData = []
    values(newHireReport.individuals).map(item => {
      const { name, report } = item

      const { certification_object } = report
      const courses = isNil(certification_object) ? null : certification_object.stats.courses
      const habits = isNil(certification_object) ? null : certification_object.stats.habits
      const quotas = isNil(certification_object) ? null : certification_object.stats.quotas
      const created_at = isNil(certification_object) ? null : certification_object.created_at
      const est_completion = isNil(certification_object) ? null : certification_object.estimated_completion
      const completed_at = isNil(certification_object) ? null : certification_object.completed_at
      const habitsComplete = isNil(habits) ? 0 : habits.day.complete + habits.week.complete + habits.month.complete
      const habitsTotal = isNil(habits) ? 0 : habits.day.total + habits.week.total + habits.month.total
      const habitsCompletion = isNil(habits) || habitsTotal === 0 ? 0 : Math.ceil((habitsComplete * 100) / habitsTotal)
      const scheduleData = {
        Employees: name,
        Courses: `${isNil(courses) ? `0/0` : `${courses.complete}/${courses.total}`} \n${
          isNil(courses) ? `0%` : `${courses.completion}%`
        }`,
        Habits: `${isNil(habits) ? `0/0` : `${habitsComplete}/${habitsTotal}`} \n${
          isNil(habits) ? `0%` : `${habitsCompletion}%`
        }`,
        Quotas: `${isNil(quotas) ? `0/0` : `${quotas.complete}/${quotas.total}`} \n${
          isNil(quotas) ? `0%` : `${quotas.completion}%`
        }`,
        Assigned: isNil(created_at) ? 'NA' : moment(created_at).format('MMM DD, YY'),
        'Est. Completion': isNil(est_completion) ? 'NA' : moment(est_completion).format('MMM DD, YY'),
        Completed: isNil(completed_at) ? 'NA' : moment(completed_at).format('MMM DD, YY'),
      }
      excelData.push(scheduleData)
    })

    const key = ['Employees', 'Courses', 'Habits', 'Quotas', 'Assigned', 'Est. Completion', 'Completed']
    exportCsv(excelData, key, 'Reports-New-Hire Orientation', true)
    this.handlePer(25)
  }

  render() {
    const { newHireReport, role } = this.props
    const { startDate, endDate, company, column } = this.state
    const date = moment.range(startDate, endDate)

    return (
      <div className="mng-new-hire-orientation">
        <Filter onChange={this.handleFilter} />
        <div className="list">
          <div className="d-flex align-items-center mb-0 mb-md-2">
            <p className="dsl-b22 text-500 d-flex-1">New Hire Orientation</p>
            <div className="mb-2 d-flex">
              <DatePicker
                calendar="range"
                append="caret"
                format="MMM D"
                align="right"
                as="span"
                value={date}
                closeAfterSelect
                onSelect={this.handleChangeDate}
              />
              <div className="d-flex justify-content-end cursor-pointer ml-3" onClick={this.handlePdf}>
                <Icon name="fal fa-print" color="#343f4b" size={16} />
              </div>
              <div className="d-flex justify-content-end cursor-pointer ml-3" onClick={this.handleExcelReport}>
                <Icon name="fal fa-file-excel" size={16} color="#343f4b" />
              </div>
            </div>
          </div>
          <ToggleColumnMenu
            column={column}
            onVisible={this.handleVisible}
            activeTab="newHire"
            className="d-md-none mb-2"
            total={2}
          />
          <div className="list-item pb-3">
            <div className="d-flex-5 dsl-m12 text-400">Employees</div>
            <div className={classNames('d-flex-2 dsl-m12 text-400 text-right', column == 2 && 'd-none d-md-block')}>
              Courses
            </div>
            <div className={classNames('d-flex-2 dsl-m12 text-400 text-right', column == 2 && 'd-none d-md-block')}>
              Habits
            </div>
            <div className={classNames('d-flex-2 dsl-m12 text-400 text-right', column == 2 && 'd-none d-md-block')}>
              Quotas
            </div>
            <div className={classNames('d-flex-1 dsl-m12 d-none d-md-block', column == 2 && 'd-block')} />
            <div
              className={classNames(
                'd-flex-3 dsl-m12 text-400 ml-0 text-right text-lg-center d-none d-md-block',
                column == 2 && 'd-block'
              )}
            >
              Assigned
            </div>
            <div
              className={classNames(
                'd-flex-3 dsl-m12 text-400 ml-0 text-right text-lg-center d-none d-md-block',
                column == 2 && 'd-block'
              )}
            >
              Est completion
            </div>
            <div
              className={classNames(
                'd-flex-3 dsl-m12 text-400 ml-0 text-right text-lg-center d-none d-md-block',
                column == 2 && 'd-block'
              )}
            >
              Completed
            </div>
            <div className={classNames('d-flex-1 dsl-m12 d-none d-md-block', column == 2 && 'd-block')} />
          </div>

          {values(newHireReport.individuals).length === 0 ? (
            <div className="d-flex-7 py-3">
              <p className="dsl-b16 mb-0 text-center">You have no new hires in progress for orientation</p>
            </div>
          ) : (
            values(newHireReport.individuals).map(item => {
              const { id, name, avatar, report } = item
              const { certification_object } = report
              const courses = isNil(certification_object) ? null : certification_object.stats.courses
              const habits = isNil(certification_object) ? null : certification_object.stats.habits
              const quotas = isNil(certification_object) ? null : certification_object.stats.quotas
              const created_at = isNil(certification_object) ? null : certification_object.created_at
              const est_completion = isNil(certification_object) ? null : certification_object.estimated_completion
              const completed_at = isNil(certification_object) ? null : certification_object.completed_at
              const habitsComplete = isNil(habits)
                ? 0
                : habits.day.complete + habits.week.complete + habits.month.complete
              const habitsTotal = isNil(habits) ? 0 : habits.day.total + habits.week.total + habits.month.total
              const habitsCompletion =
                isNil(habits) || habitsTotal === 0 ? 0 : Math.ceil((habitsComplete * 100) / habitsTotal)

              return (
                <div className="list-item align-items-center py-0 py-md-4" key={id}>
                  <div className="d-flex-5 d-flex align-items-center text-400 custom-br-ssm mr-2 mr-md-0">
                    <Avatar
                      size="tiny"
                      type="initial"
                      url={`${avatar}${Date.now()}`}
                      name={name}
                      backgroundColor={avatarBackgroundColor(id)}
                    />
                    <div
                      className={classNames(
                        'dsl-b14 ml-3 cursor-pointer text-400 font-weight-normal custom-br-ssm pt-4 pt-md-0 truncate',
                        column == 2 && isNil(certification_object) && 'd-flex-ssm-2 name-wrap',
                        column == 1 && isNil(certification_object) && 'd-flex-ssm-4 name-wrap'
                      )}
                    >
                      {name}
                    </div>
                  </div>
                  {isNil(certification_object) ? (
                    <>
                      <div className="d-flex-7">
                        <p className="dsl-b14 mb-0 text-center">No New Hire program assigned</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div
                        className={classNames(
                          'd-flex-2 custom-br-ssm pt-3 pt-md-0',
                          column == 2 && 'd-none d-md-block'
                        )}
                      >
                        <p className="dsl-b14 mb-1 font-weight-normal text-right">
                          {isNil(courses) ? `0/0` : `${courses.complete}/${courses.total}`}
                        </p>
                        <p className="dsl-b13 mb-0 text-right">{isNil(courses) ? `0%` : `${courses.completion}%`}</p>
                      </div>
                      <div
                        className={classNames(
                          'd-flex-2 custom-br-ssm pt-3 pt-md-0',
                          column == 2 && 'd-none d-md-block'
                        )}
                      >
                        <p className="dsl-b14 mb-1 font-weight-normal text-right">
                          {habitsComplete}/{habitsTotal}
                        </p>
                        <p className="dsl-b13 mb-0 text-right">{habitsCompletion}%</p>
                      </div>
                      <div className={classNames('d-flex-2', column == 2 && 'd-none d-md-block')}>
                        <p className="dsl-b14 mb-1 font-weight-normal text-right">
                          {isNil(quotas) ? `0/0` : `${quotas.complete}/${quotas.total}`}
                        </p>
                        <p className="dsl-b13 mb-0 text-right">{isNil(quotas) ? `0%` : `${quotas.completion}%`}</p>
                      </div>
                      <div className={classNames('d-flex-1 dsl-m12 d-none d-md-block', column == 2 && 'd-block')} />
                      <div
                        className={classNames(
                          'd-flex-3 dsl-b14 font-weight-normal ml-0 text-right text-lg-center custom-br-ssm pt-4 pt-md-0 d-none d-md-block',
                          column == 2 && 'd-block'
                        )}
                      >
                        {isNil(created_at) ? 'NA' : moment(created_at).format('MMM DD, YY')}
                      </div>
                      <div
                        className={classNames(
                          'd-flex-3 dsl-b14 font-weight-normal ml-0 text-right text-lg-center custom-br-ssm pt-4 pt-md-0 d-none d-md-block',
                          column == 2 && 'd-block'
                        )}
                      >
                        {isNil(est_completion) ? 'NA' : moment(est_completion).format('MMM DD, YY')}
                      </div>
                      <div
                        className={classNames(
                          'd-flex-3 dsl-b14 font-weight-normal ml-0 custom-br-ssm pt-4 pt-md-0 text-right text-lg-center d-none d-md-block',
                          column == 2 && 'd-block'
                        )}
                      >
                        {isNil(completed_at) ? 'Incomplete' : moment(completed_at).format('MMM DD, YY')}
                      </div>
                    </>
                  )}
                  <div className={classNames('d-flex-1 d-none d-md-block', column == 2 && 'd-block')}>
                    {isNil(certification_object) ? (
                      <>
                        {role < 3 && (
                          <EditDropdown options={['Assign']} onChange={this.handleSelectMenu.bind(this, item)} />
                        )}
                      </>
                    ) : (
                      <EditDropdown
                        options={NewHireReportMenu[role]}
                        onChange={this.handleSelectMenu.bind(this, item)}
                      />
                    )}
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    )
  }
}

NewHireOrientation.propTypes = {
  userId: PropTypes.number,
  role: PropTypes.number,
  company: PropTypes.shape({
    id: PropTypes.number,
  }),
  newHireReport: PropTypes.shape({
    companies: PropTypes.any,
    individuals: PropTypes.any,
    totals: PropTypes.shape({
      certifications_assigned: PropTypes.number,
      certifications_authored: PropTypes.number,
      certifications_completed: PropTypes.number,
      new_hires: PropTypes.number,
    }),
  }),
  getOrientations: PropTypes.func,
  getCertificationDetail: PropTypes.func,
  deleteCertification: PropTypes.func,
}

NewHireOrientation.defaultProps = {
  userId: 0,
  role: 1,
  company: {
    id: 0,
  },
  newHireReport: {
    companies: {},
    individuals: {},
    totals: {
      certifications_assigned: 0,
      certifications_authored: 0,
      certifications_completed: 0,
      new_hires: 0,
    },
  },
  getOrientations: () => {},
  getCertificationDetail: () => {},
  deleteCertification: () => {},
}

const mapStateToProps = state => ({
  userId: state.app.id,
  company: state.app.company_info,
  newHireReport: state.manage.newHireReport,
})

const mapDispatchToProps = dispatch => ({
  getOrientations: e => dispatch(MngActions.fetchhireorientationreportRequest(e)),
  getCertificationDetail: (e, route) => dispatch(DevActions.libraryprogramdetailRequest(e, 'certifications', route)),
  deleteCertification: e => dispatch(DevActions.programeventRequest(e)),
  toggleModal: payload => dispatch(AppActions.modalRequest(payload)),
})

export default connect(mapStateToProps, mapDispatchToProps)(NewHireOrientation)

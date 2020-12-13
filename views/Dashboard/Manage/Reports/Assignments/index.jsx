import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Tabs, Tab } from 'react-bootstrap'
import { toast } from 'react-toastify'
import { clone, concat, filter, find, includes, isNil, propEq, uniq } from 'ramda'
import originalMoment from 'moment'
import { extendMoment } from 'moment-range'
import {
  AssignmentCourseCard,
  AssignmentQuotaCard,
  AssignmentHabitCard,
  AssignmentsProgramCard as Programs,
  DatePicker,
  Dropdown,
  ErrorBoundary,
  Filter,
  Icon,
} from '@components'
import AppActions from '~/actions/app'
import DevActions from '~/actions/develop'
import MngActions from '~/actions/manage'
import { ProgramTypes, SPECIALOPTIONS, AssignmentTabs } from '~/services/config'
import AssignmentsTrainingPdf from './AssignmentsTrainingPdf'
import AssignmentsToDoPdf from './AssignmentsToDoPdf'
import AssignmentsProgramsPdf from './AssignmentsProgramsPdf'
import './Assignments.scss'

const moment = extendMoment(originalMoment)

const defaultInstance = {
  current_page: 1,
  data: [],
  last_page: 1,
  per_page: 10,
  total: 10,
}

class Assignments extends Component {
  state = {
    startDate: moment().startOf('month'),
    endDate: moment().endOf('month'),
    userId: this.props.userId,
    companyId: -1,
    activeTab: 'courses',
    curPage: 1,
    perPage: 25,
    user: find(item => item.id === this.props.userId, this.props.employees),
    bulkSelect: false,
    bulks: [],
    selectAll: true,
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { habits, quotas } = nextProps

    const habitsData = isNil(habits) ? [] : habits.data
    const quotasData = isNil(quotas) ? [] : quotas.data

    const dailyHabits = isNil(habitsData) ? [] : filter(x => x.data.schedule_interval === 'day', habitsData)
    const weeklyHabits = isNil(habitsData) ? [] : filter(x => x.data.schedule_interval === 'week', habitsData)
    const monthlyHabits = isNil(habitsData) ? [] : filter(x => x.data.schedule_interval === 'month', habitsData)

    const scorecardQuotas = isNil(quotasData) ? [] : filter(x => !isNil(x.scorecard_id), quotasData)
    const programQuotas = isNil(quotasData) ? [] : filter(x => !isNil(x.program_id), quotasData)

    return { dailyHabits, weeklyHabits, monthlyHabits, scorecardQuotas, programQuotas }
  }

  componentDidMount() {
    const { activeTab, userId, curPage, perPage, startDate, endDate } = this.state
    this.handleFetchSections(activeTab, userId, startDate, endDate)
    this.handleFetchLists(activeTab, userId, curPage, perPage, startDate, endDate)
  }

  handleFetchLists = (selectedTab, userId, page, perPage, startDate, endDate) => {
    if (userId < 0) return
    const order = includes(selectedTab, ['programs', 'quotas']) ? 'id' : 'due_at'
    const sort = includes(selectedTab, ['programs', 'quotas']) ? 'DESC' : 'ASC'
    this.props.getFeeds({
      userId,
      page,
      perPage,
      startDate,
      endDate,
      order,
      type: selectedTab,
      title: 'assignments',
      sort,
    })
    if (selectedTab === 'habits') {
      this.props.getFeeds({ userId, page, perPage, startDate, endDate, order: 'id', type: 'quotas' })
    }
  }

  handleFetchSections = (selectedTab, userId, startDate, endDate) => {
    if (selectedTab === 'courses') {
      this.props.getFeeds({
        userId,
        startDate,
        endDate,
        order: 'type',
        sort: 'DESC',
        type: 'tracks',
        other: 'status[]=1&status[]=2',
      })
    } else if (selectedTab === 'habits') {
      this.props.getFeeds({ userId, startDate, endDate, order: 'id', type: 'scorecards' })
      this.props.getFeeds({ userId, startDate, endDate, order: 'id', type: 'programs' })
      this.props.getFeeds({ userId, startDate, endDate, order: 'id', type: 'habitslist' })
    }
  }

  handleFilter = (type, data) => {
    const { startDate, endDate, activeTab, perPage } = this.state
    if (data.length == 0) return
    if (type === 'employee') {
      const userId = data[0].id < 0 ? this.state.userId : data[0].id
      if (this.state.userId !== userId) {
        this.handleFetchSections(activeTab, userId, startDate, endDate)
        this.handleFetchLists(activeTab, userId, 1, perPage, startDate, endDate)
        this.setState({ user: data[0], userId, curPage: 1 })
      }
    } else {
      const companyId = data[0].id
      this.setState({ company: data[0], companyId })
    }
  }

  handleSelectTab = activeTab => {
    const { userId, curPage, perPage, startDate, endDate } = this.state
    this.handleFetchSections(activeTab, userId, startDate, endDate)
    this.handleFetchLists(activeTab, userId, curPage, perPage, startDate, endDate)
    this.setState({ activeTab, bulkSelect: false, bulks: [], selectAll: true })
  }

  handleDate = e => {
    const { activeTab, userId, curPage, perPage } = this.state
    const startDate = e.start
    const endDate = e.end
    this.handleFetchSections(activeTab, userId, startDate, endDate)
    this.handleFetchLists(activeTab, userId, curPage, perPage, startDate, endDate)
    this.setState({ startDate, endDate })
  }

  handlePage = curPage => {
    const { userId, startDate, endDate, activeTab, perPage } = this.state
    this.handleFetchLists(activeTab, userId, curPage, perPage, startDate, endDate)
    this.setState({ curPage })
  }

  handlePer = perPage => {
    const { userId, startDate, endDate, activeTab } = this.state
    let curPage = this.state.curPage
    if (perPage > 50) curPage = 1
    this.handleFetchLists(activeTab, userId, curPage, perPage, startDate, endDate)
    this.setState({ perPage })
  }

  handleModal = card => {
    const modalData = clone(this.props.modalData)
    const index = 0
    if (isNil(modalData.before)) modalData.before = {}

    this.props.resetAttactedURL()
    if (isNil(card)) {
      modalData.before.module = modalData.before.course.children[index]
      modalData.before.index = index
    } else {
      modalData.before.course = card
      modalData.before.module = card.children[index]
      modalData.before.index = index
    }
    if (!isNil(modalData.before.module)) {
      this.props.toggleModal({ type: 'Preview', data: modalData, callBack: null })
    }
  }

  handleSelectMenu = type => (event, card) => {
    const { userId, user, page, perPage, startDate, endDate } = this.state
    switch (event) {
      case 'delete':
        if (type === 'courses') {
          this.props.toggleModal({
            type: 'Confirm',
            data: {
              before: {
                title: 'Delete',
                body: 'This will permanently delete the course from your assignments.  Are you sure?',
              },
            },
            callBack: {
              onYes: () => {
                this.handleDeleteCourse(card)
              },
            },
          })
        }
        break

      case 'edit':
        if (type === 'courses') {
          this.props.toggleModal({
            type: 'Quick Edit',
            data: {
              before: {
                template: card,
                type,
                from: 'instance',
                after: {
                  type: 'FETCHFEEDS_REQUEST',
                  payload: {
                    userId,
                    perPage,
                    page,
                    startDate: startDate.format('YYYY-MM-DD'),
                    endDate: endDate.format('YYYY-MM-DD'),
                    type,
                    title: 'assignments',
                  },
                },
              },
            },
            callBack: {
              onDelete: () => this.handleDeleteCourse(card),
            },
          })
        } else if (type === 'programs') {
          this.props.toggleModal({
            type: 'Quick Edit',
            data: {
              before: {
                template: card,
                type,
                from: 'instance',
                after: {
                  type: 'FETCHFEEDS_REQUEST',
                  payload: {
                    userId,
                    perPage,
                    page,
                    startDate: startDate.format('YYYY-MM-DD'),
                    endDate: endDate.format('YYYY-MM-DD'),
                    type: 'quotas',
                    order: 'id',
                  },
                },
              },
            },
            callBack: {
              onDelete: e => this.handleDeleteProgram(e),
            },
          })
        }
        break

      case 'assign':
        {
          let payload = {}
          if (type === 'courses') {
            payload = {
              type: 'Assign Training',
              data: {
                before: { assignees: [userId], modules: [card], disabled: ['tracks'], companyId: user.company_id },
                after: null,
              },
              callBack: {},
            }
          } else if (type === 'habits') {
            payload = {
              type: 'Assign ToDo',
              data: {
                before: { disabled: ['habitslist', 'scorecards', 'quotas'], companyId: user.company_id },
                after: {},
              },
              callBack: null,
            }
          } else if (type === 'quotas') {
            payload = {
              type: 'Assign ToDo',
              data: {
                before: { disabled: ['habits', 'habitslist', 'scorecards'], companyId: user.company_id },
                after: {},
              },
              callBack: null,
            }
          } else if (type === 'programs') {
            payload = {
              type: 'Assign Program',
              data: { before: { disabled: [], companyId: user.company_id }, after: [card] },
              callBack: null,
            }
          } else if (type === 'scorecards') {
            payload = {
              type: 'Assign ToDo',
              data: {
                before: {
                  assignees: [userId],
                  disabled: ['habitslist', 'habits', 'quotas'],
                  companyId: user.company_id,
                },
                after: {},
              },
              callBack: null,
            }
          } else if (type === 'habitslists') {
            payload = {
              type: 'Assign ToDo',
              data: { before: { disabled: ['scorecards', 'habits', 'quotas'], companyId: user.company_id }, after: {} },
              callBack: null,
            }
          }

          this.props.toggleModal(payload)
        }
        break

      case 'detail view':
        if (type === 'courses') {
          this.props.history.push({
            pathname: `/library/training/courses/${card.card_template_id}/view`,
            state: { card },
          })
        } else if (type === 'habits') {
          this.props.toggleModal({
            type: 'Task Detail',
            data: { before: { card } },
            callBack: null,
          })
        } else if (type === 'quotas') {
          this.props.history.push(`/library/to-do/quotas/${card.quota_template_id}/view`)
        } else if (type === 'programs') {
          this.handleOpenProgramDetail(card)
        }
        break

      case 'quick assign':
        this.props.toggleModal({
          type: 'Quick Assign',
          data: { before: { template: card, type: 'Module', companyId: user.company_id }, after: null },
          callBack: null,
        })
        break

      case 'edit assignment':
        {
          const { scorecards, programs, habitslist } = this.props
          if (type === 'scorecards') {
            this.props.toggleModal({
              type: 'Quick Edit',
              data: {
                before: {
                  template: scorecards.data,
                  type,
                  from: 'instance',
                  after: {
                    type: 'FETCHFEEDS_REQUEST',
                    payload: {
                      userId,
                      perPage,
                      page,
                      startDate: startDate.format('YYYY-MM-DD'),
                      endDate: endDate.format('YYYY-MM-DD'),
                      type,
                      order: 'id',
                    },
                  },
                },
              },
              callBack: {
                onDelete: e => this.handleDeleteScorecard(e),
              },
            })
          } else if (type === 'programs') {
            this.props.toggleModal({
              type: 'Quick Edit',
              data: {
                before: {
                  template: programs.data,
                  type,
                  from: 'instance',
                  after: {
                    type: 'FETCHFEEDS_REQUEST',
                    payload: {
                      userId,
                      perPage,
                      page,
                      startDate: startDate.format('YYYY-MM-DD'),
                      endDate: endDate.format('YYYY-MM-DD'),
                      type: 'quotas',
                      order: 'id',
                    },
                  },
                },
              },
              callBack: {
                onDelete: e => this.handleDeleteProgram(e),
              },
            })
          } else if (type === 'habitslists') {
            this.props.toggleModal({
              type: 'Quick Edit',
              data: {
                before: {
                  template: habitslist.data,
                  type,
                  from: 'instance',
                  after: {
                    type: 'FETCHFEEDS_REQUEST',
                    payload: {
                      userId,
                      perPage,
                      page,
                      startDate: startDate.format('YYYY-MM-DD'),
                      endDate: endDate.format('YYYY-MM-DD'),
                      type,
                      order: 'id',
                    },
                  },
                },
              },
              callBack: {
                onDelete: e => this.hanldeDeleteHabitschedule(e),
              },
            })
          }
        }
        break

      case 'edit actuals':
        {
          if (type === 'scorecards') {
            const { scorecards } = this.props
            this.props.toggleModal({
              type: 'Save Actuals',
              data: {
                before: {
                  user,
                  userId,
                  type,
                  scorecards: scorecards.data,
                  after: {
                    type: 'FETCHFEEDS_REQUEST',
                    payload: {
                      userId,
                      perPage,
                      page,
                      startDate: startDate.format('YYYY-MM-DD'),
                      endDate: endDate.format('YYYY-MM-DD'),
                      type,
                      order: 'id',
                    },
                  },
                },
                after: {},
              },
              callBack: {
                onRefresh: () => {
                  const { activeTab, userId, curPage, perPage, startDate, endDate } = this.state
                  this.handleFetchSections(activeTab, userId, startDate, endDate)
                  this.handleFetchLists(activeTab, userId, curPage, perPage, startDate, endDate)
                },
              },
            })
          } else if (type === 'programs') {
            if (card.quotas.length === 0) {
              toast.warn(`This program doesn't have any QUOTAs that you can update!`, {
                position: toast.POSITION.TOP_RIGHT,
              })
            } else {
              this.props.toggleModal({
                type: 'Save Actuals',
                data: {
                  before: {
                    user,
                    userId,
                    type,
                    scorecards: [card],
                    after: {
                      type: 'FETCHFEEDS_REQUEST',
                      payload: {
                        userId,
                        perPage,
                        page,
                        startDate: startDate.format('YYYY-MM-DD'),
                        endDate: endDate.format('YYYY-MM-DD'),
                        type: 'quotas',
                        order: 'id',
                      },
                    },
                  },
                  after: {},
                },
                callBack: {
                  onRefresh: () => {
                    const { activeTab, userId, curPage, perPage, startDate, endDate } = this.state
                    this.handleFetchSections(activeTab, userId, startDate, endDate)
                    this.handleFetchLists(activeTab, userId, curPage, perPage, startDate, endDate)
                  },
                },
              })
            }
          }
        }
        break

      case 'preview view':
        this.handleModal(card)
        break

      case 'bulk unassign':
        this.setState({ bulkSelect: true })
        break

      default:
        break
    }
  }

  hanldeDeleteHabitschedule = habitslist => {
    const { userId, perPage, page, startDate, endDate, activeTab } = this.state
    this.props.deleteCard({
      event: 'delete',
      cardId: habitslist.id,
      card: habitslist,
      after: {
        type: 'FETCHFEEDS_REQUEST',
        payload: {
          userId,
          perPage,
          page,
          startDate: startDate.format('YYYY-MM-DD'),
          endDate: endDate.format('YYYY-MM-DD'),
          type: activeTab,
          order: 'id',
          type: 'habitslist',
        },
      },
    })
  }

  handleDeleteCourse = course => {
    const { userId, perPage, page, startDate, endDate, activeTab } = this.state
    this.props.deleteCard({
      event: 'delete',
      cardId: course.id,
      card: course,
      after: {
        type: 'FETCHFEEDS_REQUEST',
        payload: {
          userId,
          perPage,
          page,
          startDate: startDate.format('YYYY-MM-DD'),
          endDate: endDate.format('YYYY-MM-DD'),
          type: activeTab,
          title: 'assignments',
        },
      },
    })
  }

  handleDeleteScorecard = card => {
    const { userId, page, perPage, startDate, endDate } = this.state
    const payload = {
      scorecard: { id: card.id },
      after: {
        type: 'FETCHFEEDS_REQUEST',
        payload: {
          userId,
          perPage,
          page,
          startDate: startDate.format('YYYY-MM-DD'),
          endDate: endDate.format('YYYY-MM-DD'),
          type: 'scorecards',
          order: 'id',
        },
      },
    }
    this.props.deleteScorecard(payload)
  }

  handleDeleteProgram = card => {
    const { userId, page, perPage, startDate, endDate } = this.state
    const payload = {
      event: 'stop',
      data: { user_id: [userId], program_id: card.id },
      after: {
        type: 'FETCHFEEDS_REQUEST',
        payload: {
          userId,
          perPage,
          page,
          startDate: startDate.format('YYYY-MM-DD'),
          endDate: endDate.format('YYYY-MM-DD'),
          type: 'programs',
          order: 'id',
        },
      },
    }
    this.props.deleteProgram(payload)
  }

  handleOpenScheduleDetail = card => {
    const { type } = card
    if (type === 3) {
      this.props.history.push({
        pathname: `/hcm/report-training-schedule/${card.id}`,
        state: { editable: false, schedule: card },
      })
    }
  }

  handleOpenScorecardDetail = scorecard => {
    const { startDate, endDate } = this.state
    const date = moment.range(startDate, endDate)

    this.props.toggleModal({
      type: 'Scorecard Detail',
      data: { before: { scorecard, date } },
      callBack: null,
    })
  }

  handleOpenProgramDetail = card => {
    const { id, type, user_id } = card
    if (ProgramTypes[type - 1] === 'careers') {
      this.props.getCareerProgram(id, `/hcm/report-${ProgramTypes[type - 1]}/employee/${user_id}/view`)
    } else if (ProgramTypes[type - 1] === 'certifications') {
      this.props.getCertificationDetail(
        card,
        'certifications',
        `/hcm/report-${ProgramTypes[type - 1]}/${user_id}/${id}/view`
      )
    }
  }

  handleOpenHabitScheduleDetail = card => {
    const { card_template_id } = card
    this.props.history.push({
      pathname: `/library/to-do/habitslist/${card_template_id}/view`,
      state: { editable: false, schedule: card },
    })
  }

  handleSelectSectionMenu = (event, schedules, tracks) => {
    const { userId, user, page, perPage, startDate, endDate } = this.state

    switch (event) {
      case 'assign':
        this.props.toggleModal({
          type: 'Assign Training',
          data: {
            before: { assignees: [this.state.userId], modules: [], companyId: user.company_id },
            after: null,
          },
          callBack: {
            onAssign: this.handleAssignTraining,
          },
        })
        break

      case 'edit':
        this.props.toggleModal({
          type: 'Advanced Edit',
          data: {
            before: {
              userId,
              tracks,
              schedules,
              after: {
                type: 'FETCHFEEDS_REQUEST',
                payload: {
                  userId,
                  startDate: startDate.format('YYYY-MM-DD'),
                  endDate: endDate.format('YYYY-MM-DD'),
                  order: 'type',
                  sort: 'DESC',
                  type: 'tracks',
                  other: 'status[]=1&status[]=2',
                },
              },
            },
            callBack: null,
          },
        })
        break

      default:
        break
    }
  }

  handleAssignTraining = e => {
    const { userId, page, perPage, startDate, endDate, user } = this.state
    const { templates, due_date, type } = e
    const payload = { user_id: [userId], card_type: type, due_date, company_id: user.company_id }
    const after = {
      type: 'FETCHFEEDS_REQUEST',
      payload: {
        userId,
        perPage,
        page,
        startDate: startDate.format('YYYY-MM-DD'),
        endDate: endDate.format('YYYY-MM-DD'),
        order: 'type',
        sort: 'DESC',
        type: 'tracks',
        other: 'status[]=1&status[]=2',
      },
    }
    this.props.assignTraining(
      type === 'tracks' ? { ...payload, track_id: templates } : { ...payload, card_template_id: templates },
      after
    )
  }

  handleUnassign = e => {
    const { userId, page, perPage, startDate, endDate, activeTab } = this.state

    if (activeTab === 'courses') {
      if (isNil(e.card_type_id) && isNil(e.program_id)) {
        const payload = {
          data: {
            unassign: [{ user_id: 2, track_id: [e.id] }],
          },
          after: {
            type: 'FETCHFEEDS_REQUEST',
            payload: {
              userId,
              perPage,
              page,
              startDate: startDate.format('YYYY-MM-DD'),
              endDate: endDate.format('YYYY-MM-DD'),
              order: 'type',
              sort: 'DESC',
              type: 'tracks',
              other: 'status[]=1&status[]=2',
            },
          },
        }
        this.props.unassign(payload)
      }
    }
  }

  handleBulkCheck = (course, checked) => {
    let bulks = clone(this.state.bulks)
    if (checked) bulks.push(course.id)
    else bulks = filter(x => x !== course.id, bulks)
    bulks = uniq(bulks)
    this.setState({ bulks })
  }

  handleCancelBulk = () => {
    this.setState({ bulkSelect: false, bulks: [] })
  }

  handleUnassignBulks = () => {
    const { userId, bulks, page, perPage, startDate, endDate, activeTab } = this.state

    const unassignPayload = {
      unassign: [
        {
          user_id: userId < 0 ? this.props.userId : userId,
          card_instance_id: bulks,
          track_id: [],
          schedule_id: [],
          program_id: [],
        },
      ],
    }

    const after = {
      type: 'FETCHFEEDS_REQUEST',
      payload: {
        userId,
        page,
        perPage,
        startDate: startDate.format('YYYY-MM-DD'),
        endDate: endDate.format('YYYY-MM-DD'),
        order: 'due_at',
        type: activeTab,
        title: 'assignments',
      },
    }

    this.props.unassign({ data: unassignPayload, after })

    this.handleCancelBulk()
  }

  handleSelectAll = type => () => {
    const { courses, carryOvers, habits } = this.props
    const { selectAll } = this.state
    if (type === 'courses') {
      if (selectAll) {
        let bulks = concat(courses.data, carryOvers.data)
        bulks = filter(x => isNil(x.program_id), bulks)
        bulks = bulks.map(e => e.id)
        this.setState({ bulks, selectAll: !selectAll })
      } else {
        this.setState({ bulks: [], selectAll: !selectAll })
      }
    } else if (type === 'habits') {
      if (selectAll) {
        let bulks = habits.data
        bulks = filter(x => isNil(x.program_id), bulks)
        bulks = bulks.map(e => e.id)
        this.setState({ bulks, selectAll: !selectAll })
      } else {
        this.setState({ bulks: [], selectAll: !selectAll })
      }
    }
  }

  handlePdf = async () => {
    const {
      activeTab,
      startDate,
      endDate,
      dailyHabits,
      weeklyHabits,
      monthlyHabits,
      programQuotas,
      userId,
    } = this.state
    const { courses, carryOvers, programs, tracks, scorecards, habitslist } = this.props
    const date = moment.range(startDate, endDate)
    switch (activeTab) {
      case 'courses':
        {
          const trackData = filter(propEq('type', 1), tracks.data)
          const scheduleData = filter(propEq('type', 3), tracks.data)
          let pdfData = {
            date,
            userId,
            tracks: trackData,
            schedules: scheduleData,
            assignments: carryOvers.data,
            trainings: courses.data,
          }

          let blob = await AssignmentsTrainingPdf(pdfData)
          let url = URL.createObjectURL(blob)
          window.open(url, '__blank')
        }
        break

      case 'habits':
        {
          let pdfData = {
            date,
            userId,
            scorecards: scorecards.data,
            programs: programs.data,
            quotas: programQuotas,
            habitSchedules: habitslist.data,
            dailyHabits,
            weeklyHabits,
            monthlyHabits,
          }

          let blob = await AssignmentsToDoPdf(pdfData)
          let url = URL.createObjectURL(blob)
          window.open(url, '__blank')
        }
        break

      case 'programs':
        {
          let pdfData = { date, data: programs.data }
          let blob = await AssignmentsProgramsPdf(pdfData)
          let url = URL.createObjectURL(blob)
          window.open(url, '__blank')
        }
        break

      default:
        break
    }
  }

  render() {
    const { role, habits, quotas, courses, carryOvers, programs, tracks, scorecards, habitslist } = this.props
    const {
      userId,
      companyId,
      startDate,
      endDate,
      dailyHabits,
      weeklyHabits,
      monthlyHabits,
      scorecardQuotas,
      programQuotas,
      bulkSelect,
      bulks,
      activeTab,
    } = this.state
    const date = moment.range(startDate, endDate)
    const trackData = filter(propEq('type', 1), tracks.data)
    const scheduleData = filter(propEq('type', 3), tracks.data)

    return (
      <ErrorBoundary className="dev-assignment-list" dataCy="assignmentShowcase">
        <Filter
          type="individual"
          dataCy="assignmentFilter"
          mountEvent
          removed={[[], [SPECIALOPTIONS.LIST]]}
          onChange={this.handleFilter}
        />
        <div className="assignment-header">
          <span className="dsl-b22 bold d-flex-1">Assignments</span>
          <DatePicker
            calendar="range"
            dataCy="assignmentFilterByDate"
            append="caret"
            format="MMM D"
            as="span"
            align="right"
            value={date}
            closeAfterSelect
            onSelect={this.handleDate}
          />
          <div
            className="d-flex justify-content-end cursor-pointer ml-3"
            data-cy="assignmentPrintIcon"
            onClick={this.handlePdf}
          >
            <Icon name="fal fa-print" dataCy="printIcon" color="#343f4b" size={16} />
          </div>
        </div>
        <div className="custom-dropdown-mobile">
          <Dropdown
            className="mobile-screen"
            dataCy="assignmentFilterByDate"
            data={AssignmentTabs}
            defaultIds={[0]}
            returnBy="data"
            getValue={e => e.label}
            onChange={e => this.handleSelectTab(e[0].name)}
          />
        </div>
        <Tabs
          className="bg-white pb-4 pt-2 d-none d-md-flex"
          data-cy="assignmentTabItem"
          defaultActiveKey="courses"
          id="assignments"
          activeKey={activeTab}
          onSelect={this.handleSelectTab}
        >
          <Tab eventKey="courses" title="Training" data-cy="trainingTabContent">
            <AssignmentCourseCard.Section
              dataCy="scheduleAndTrack"
              userRole={role}
              tracks={trackData}
              schedules={scheduleData}
              onDetail={this.handleOpenScheduleDetail}
              onSelect={this.handleSelectSectionMenu}
            />
            <AssignmentCourseCard.List
              bulkSelect={bulkSelect}
              bulkList={bulks}
              assignments={carryOvers.data}
              trainings={courses.data}
              current={courses.current_page}
              perPage={courses.per_page}
              total={courses.last_page}
              userId={userId}
              userRole={role}
              onSelect={this.handleSelectMenu('courses')}
              onBulkSelect={this.handleBulkCheck}
              onCancelBulk={this.handleCancelBulk}
              onSelectAllBulks={this.handleSelectAll('courses')}
              onUnassignBulks={this.handleUnassignBulks}
              onPage={this.handlePage}
              onPer={this.handlePer}
              onModal={this.handleModal}
            />
          </Tab>
          <Tab eventKey="habits" title="To Do" data-cy="todoTabContent">
            <AssignmentQuotaCard.ScorecardsSection
              userRole={role}
              company={companyId}
              scorecards={scorecards.data}
              onDetail={this.handleOpenScorecardDetail}
              onSelect={this.handleSelectMenu('quotas')}
              onSelectMenu={this.handleSelectMenu('scorecards')}
            />
            <AssignmentQuotaCard.ProgramsSection
              userRole={role}
              quotas={programQuotas}
              programs={programs.data}
              onDetail={this.handleOpenProgramDetail}
              onSelect={this.handleSelectMenu('quotas')}
              onSelectMenu={this.handleSelectMenu('programs')}
            />
            <AssignmentHabitCard.Section
              userRole={role}
              habitschedules={habitslist.data}
              onDetail={this.handleOpenHabitScheduleDetail}
              onSelect={this.handleSelectMenu('habitslists')}
            />
            <AssignmentHabitCard.List
              userRole={role}
              bulkSelect={bulkSelect}
              bulkList={bulks}
              dailyHabits={dailyHabits}
              weeklyHabits={weeklyHabits}
              monthlyHabits={monthlyHabits}
              current={habits.current_page}
              perPage={habits.per_page}
              total={habits.last_page}
              onPage={this.handlePage}
              onPer={this.handlePer}
              onSelect={this.handleSelectMenu('habits')}
              onBulkSelect={this.handleBulkCheck}
              onCancelBulk={this.handleCancelBulk}
              onSelectAllBulks={this.handleSelectAll('habits')}
              onUnassignBulks={this.handleUnassignBulks}
            />
          </Tab>
          <Tab eventKey="programs" title="Programs" data-cy="programTabContent">
            <Programs.List
              userRole={role}
              data={programs.data}
              current={programs.current_page}
              perPage={programs.per_page}
              total={programs.last_page}
              onChange={this.handleChangePage}
              onSelect={this.handleSelectMenu('programs')}
            />
          </Tab>
        </Tabs>
      </ErrorBoundary>
    )
  }
}

Assignments.propTypes = {
  role: PropTypes.number,
  userId: PropTypes.number,
  employees: PropTypes.array,
  trainings: PropTypes.any,
  assignments: PropTypes.any,
  courses: PropTypes.shape({
    current_page: PropTypes.number,
    data: PropTypes.array,
    last_page: PropTypes.number,
    per_page: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    total: PropTypes.number,
  }),
  carryOvers: PropTypes.shape({
    current_page: PropTypes.number,
    data: PropTypes.array,
    last_page: PropTypes.number,
    per_page: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    total: PropTypes.number,
  }),
  programs: PropTypes.shape({
    current_page: PropTypes.number,
    data: PropTypes.array,
    last_page: PropTypes.number,
    per_page: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    total: PropTypes.number,
  }),
  tracks: PropTypes.shape({
    current_page: PropTypes.number,
    data: PropTypes.array,
    last_page: PropTypes.number,
    per_page: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    total: PropTypes.number,
  }),
  scorecards: PropTypes.shape({
    current_page: PropTypes.number,
    data: PropTypes.array,
    last_page: PropTypes.number,
    per_page: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    total: PropTypes.number,
  }),
  habitslist: PropTypes.shape({
    current_page: PropTypes.number,
    data: PropTypes.array,
    last_page: PropTypes.number,
    per_page: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    total: PropTypes.number,
  }),
  modalData: PropTypes.any,
  deleteCard: PropTypes.func,
  getFeeds: PropTypes.func,
  toggleModal: PropTypes.func,
  resetAttactedURL: PropTypes.func,
  getCertificationDetail: PropTypes.func,
  assignTraining: PropTypes.func,
  unassign: PropTypes.func,
}

Assignments.defaultProps = {
  role: 1,
  userId: 1,
  employees: [],
  trainings: {},
  assignments: {},
  courses: defaultInstance,
  carryOvers: defaultInstance,
  programs: defaultInstance,
  tracks: defaultInstance,
  scorecards: defaultInstance,
  habitslist: defaultInstance,
  modalData: {},
  toggleModal: () => {},
  getFeeds: () => {},
  deleteCard: () => {},
  getCertificationDetail: () => {},
  assignTraining: () => {},
  unassign: () => {},
}

const mapStateToProps = state => ({
  userId: state.app.selectedEmployee['team'][0],
  employees: state.app.employees,
  role: state.app.app_role_id,
  trainings: state.develop.templates.trainings,
  assignments: state.develop.templates.assignments,
  carryOvers: state.develop.instances.carryOvers,
  courses: state.develop.instances.courses,
  habits: state.develop.instances.habits,
  quotas: state.develop.instances.quotas,
  programs: state.develop.instances.programs,
  tracks: state.develop.instances.tracks,
  scorecards: state.develop.instances.scorecards,
  habitslist: state.develop.instances.habitslist,
  modalData: state.app.modalData,
})

const mapDispatchToProps = dispatch => ({
  getFeeds: e => dispatch(DevActions.fetchfeedsRequest(e)),
  deleteCard: e => dispatch(DevActions.updatecardinstanceRequest(e)),
  deleteScorecard: e => dispatch(DevActions.postdeletescorecardRequest(e)),
  deleteProgram: e => dispatch(DevActions.programeventRequest(e)),
  resetAttactedURL: () => dispatch(AppActions.uploadSuccess('')),
  toggleModal: payload => dispatch(AppActions.modalRequest(payload)),
  getCertificationDetail: (e, mode, route) => dispatch(DevActions.libraryprogramdetailRequest(e, mode, route)),
  getCareerProgram: (id, route) => dispatch(MngActions.getcareerprogramRequest(id, route)),
  assignTraining: (payload, after) => dispatch(MngActions.assigntrainingRequest(payload, after)),
  unassign: payload => dispatch(MngActions.unassigncontentRequest(payload)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Assignments)

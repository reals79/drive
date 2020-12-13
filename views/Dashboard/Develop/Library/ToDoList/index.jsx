import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Tabs, Tab } from 'react-bootstrap'
import { toast } from 'react-toastify'
import { clone } from 'ramda'
import {
  Dropdown,
  Filter,
  ErrorBoundary,
  LibraryStatus as Status,
  LibraryToDoHabit as HabitCard,
  LibraryToDoHabitSchedule as HabitScheduleCard,
  LibraryToDoQuota as QuotaCard,
  LibraryToDoScoreCard as ScoreCard,
  Pagination,
  Search,
} from '@components'
import AppActions from '~/actions/app'
import DevActions from '~/actions/develop'
import { ToDoTypes, LibraryTodoTabs } from '~/services/config'
import './ToDo.scss'

class ToDo extends Component {
  constructor(props) {
    super(props)

    const regExp = /^\/library\/to-do\/\w+\/((\w+)|(\d+)\/\w+)$/g
    const str = props.locations[0]
    const activeTab = regExp.test(str) ? str.split('/')[3] : 'habits'

    this.state = { activeTab, filter: '', page: 1, per: 25 }
    this.handleModal = this.handleModal.bind(this)
    this.handlePagination = this.handlePagination.bind(this)
    this.handlePer = this.handlePer.bind(this)
    this.handleSearch = this.handleSearch.bind(this)
    this.handleTab = this.handleTab.bind(this)
    this.handleSelectMenu = this.handleSelectMenu.bind(this)
    this.handleDeleteTemplate = this.handleDeleteTemplate.bind(this)
    this.handleScorecardQuota = this.handleScorecardQuota.bind(this)
    this.handleProgramQuota = this.handleProgramQuota.bind(this)
  }

  componentDidMount() {
    if (this.props.history.action !== 'POP') {
      const { filter, activeTab, page, per } = this.state
      this.props.getTemplates(filter, activeTab, page, per)
    }
  }

  handleModal(e) {
    this.props.toggleModal(e)
  }

  handlePagination(page) {
    const { activeTab, filter, per } = this.state
    this.props.getTemplates(filter, activeTab, page, per)
    this.setState({ page })
  }

  handlePer(per) {
    const { activeTab, filter, page } = this.state
    this.props.getTemplates(filter, activeTab, page, per)
    this.setState({ per })
  }

  handleSearch(e) {
    const { activeTab, per } = this.state
    this.props.getTemplates(e.target.value, activeTab, 1, per)
    this.setState({ filter: e.target.value, page: 1 })
  }

  handleTab(tab) {
    const { per } = this.state
    this.props.getTemplates('', tab, 1, per)
    this.setState({ activeTab: tab, filter: '', page: 1 })
  }

  handleDeleteTemplate(template) {
    const { filter, activeTab, page, per } = this.state

    let libType = 'template'
    if (activeTab == 'tracks') {
      libType = 'track'
    } else if (activeTab == 'quotas') {
      libType = 'quota_template'
    } else if (activeTab == 'scorecards') {
      libType = 'scorecard'
    }

    this.props.deleteTemplate({
      libType,
      event: 'delete',
      templateId: template.id,
      after: {
        type: 'LIBRARYTEMPLATES_REQUEST',
        payload: { filter, mode: activeTab, current: page, per },
      },
    })
  }

  handleSelectMenu(event, card) {
    const { activeTab, filter, page } = this.state
    const { companyId } = this.props
    const disabled = ToDoTypes.filter(x => x !== activeTab)

    switch (event) {
      case 'assign': {
        const payload = {
          type: 'Assign ToDo',
          data: { before: { modules: [card], disabled }, after: [] },
          callBack: null,
        }
        this.props.toggleModal(payload)
        break
      }
      case 'detail view': {
        this.props.history.push({
          pathname: `/library/to-do/${activeTab}/${card.id}/view`,
          state: { filter, page },
        })
        break
      }
      case 'edit': {
        this.props.history.push({
          pathname: `/library/to-do/${activeTab}/${card.id}/edit`,
          state: { editable: true },
        })
        break
      }
      case 'quick assign': {
        this.props.toggleModal({
          type: 'Quick Edit',
          data: { before: { template: card, type: activeTab, from: 'template', after: null, companyId } },
          callBack: { onDelete: () => this.handleDeleteTemplate(card) },
        })
        break
      }
      case 'delete':
        this.props.toggleModal({
          type: 'Confirm',
          data: { before: { title: 'Delete', body: 'Are you sure you want to delete this item?' } },
          callBack: { onYes: () => this.handleDeleteTemplate(card) },
        })
        break
      case 'duplicate':
        this.props.toggleModal({
          type: 'Duplicate Module',
          data: {
            before: {
              type: activeTab,
              object: card,
            },
          },
          callBack: null,
        })
        break
      case 'attach to scorecard':
        this.props.toggleModal({
          type: 'Attach Library',
          data: { before: { show: 'scorecards' } },
          callBack: { onAttach: e => this.handleScorecardQuota(e.templates[0], card) },
        })
        break
      case 'attach to program':
        this.props.toggleModal({
          type: 'Attach Library',
          data: { before: { show: ['careers', 'certifications'], isProgram: true } },
          callBack: { onAttach: e => this.handleProgramQuota(e, card) },
        })
        break
      default:
        break
    }
  }

  handleScorecardQuota(e, card) {
    let quotas = clone(e.data.quotas)
    let duplicate = false
    quotas &&
      quotas.forEach(item => {
        if (item.quota_template_id === card.id) duplicate = true
      })

    if (duplicate) {
      toast.error('The selected Quota is already in the Scorecard', {
        position: toast.POSITION.TOP_CENTER,
        pauseOnFocusLoss: false,
        hideProgressBar: true,
      })
    } else {
      this.props.history.push({
        pathname: `/library/to-do/scorecards/${e.id}/edit`,
        state: { card },
      })
    }
  }

  handleProgramQuota(e, card) {
    let program = e.templates[0]
    let duplicate = false
    let quotas = clone(program.data.levels[e.level].quotas)
    quotas &&
      quotas.forEach(item => {
        if (item.quota_template_id === card.id) duplicate = true
      })
    if (duplicate) {
      toast.error('The selected Quota is already in the Scorecard', {
        position: toast.POSITION.TOP_CENTER,
        pauseOnFocusLoss: false,
        hideProgressBar: true,
      })
    } else {
      this.props.getProgramDetail(program, e.type, {
        pathname: `/library/programs/${e.type}/${program.id}/edit`,
        state: { card, level: e.level },
      })
    }
  }

  render() {
    const { activeTab, filter, page } = this.state
    const { userRole, templates } = this.props
    let addTitle = 'Habit'
    if (activeTab == 'habitslist') addTitle = 'Habit Schedule'
    if (activeTab == 'quotas') addTitle = 'Quota'
    if (activeTab == 'scorecards') addTitle = 'Scorecard'

    return (
      <ErrorBoundary className="dev-library-todo" dataCy="libraryTodos">
        <Filter
          aligns={['left', 'right']}
          addTitle={addTitle}
          onAdd={() => this.props.history.push(`/library/to-do/${activeTab}/new`)}
          dataCy={`libraryTodoFilter${activeTab.replace(/[^A-Z0-9]+/gi, '')}`}
        />
        <div className="bg-white pt-4">
          <p className="dsl-b22 bold mb-0">To Dos</p>
          <div className="d-flex justify-content-end">
            <Search onChange={this.handleSearch} dataCy="libraryTodoSearch" />
          </div>
        </div>
        <div className="custom-dropdown-mobile">
          <Dropdown
            className="px-1 pb-2 mobile-screen"
            data={LibraryTodoTabs}
            defaultIds={[0]}
            returnBy="data"
            getValue={e => e.label}
            onChange={e => this.handleTab(e[0].name)}
            dataCy="libraryTodoTabsMobile"
          />
        </div>
        <Tabs
          className="bg-white pt-0 d-none d-md-flex"
          data-cy="libraryTabItems"
          defaultActiveKey="habits"
          activeKey={activeTab}
          id="lib-todos"
          onSelect={this.handleTab}
        >
          <Tab eventKey="habits" title="Habits" data-cy="todoHabitContent">
            <Status type="Habits" showToggle counts={templates[activeTab].total} dataCy="todoHabitToggle" />
            <HabitCard.List
              role={userRole}
              dataCy="todoHabitList"
              data={templates.habits.data}
              onModal={this.handleModal}
              onSelect={this.handleSelectMenu}
              onToggle={id =>
                this.props.history.push({
                  pathname: `/library/to-do/habits/${id}/view`,
                  state: { filter, page },
                })
              }
            />
          </Tab>
          <Tab eventKey="habitslist" title="Habits Schedules" data-cy="todoHabitScheduleContent">
            <Status
              type="Habits Schedules"
              showToggle
              counts={templates[activeTab].total}
              dataCy="todoHabitScheduleToggle"
            />
            <HabitScheduleCard.List
              role={userRole}
              data={templates.habitslist.data}
              dataCy="todoScorecardList"
              onModal={this.handleModal}
              onSelect={this.handleSelectMenu}
              onToggle={id =>
                this.props.history.push({
                  pathname: `/library/to-do/habitslist/${id}/view`,
                  state: { filter, page },
                })
              }
            />
          </Tab>
          <Tab eventKey="quotas" title="Quotas" data-cy="todoQuotaCardContent">
            <Status type="Quotas" showToggle counts={templates[activeTab].total} dataCy="todoQuotaToggle" />
            <QuotaCard.List
              role={userRole}
              data={templates.quotas.data}
              dataCy="todoQuotaCardList"
              onModal={this.handleModal}
              onSelect={this.handleSelectMenu}
              onToggle={id =>
                this.props.history.push({
                  pathname: `/library/to-do/quotas/${id}/view`,
                  state: { filter, page },
                })
              }
            />
          </Tab>
          <Tab eventKey="scorecards" title="Scorecards" data-cy="todoScorecardContent">
            <Status type="Scorecards" showToggle counts={templates[activeTab].total} data-cy="todoScorecardToggle" />
            <ScoreCard.List
              role={userRole}
              data={templates.scorecards.data}
              dataCy="todoScorecardList"
              onModal={this.handleModal}
              onSelect={this.handleSelectMenu}
              onToggle={id =>
                this.props.history.push({
                  pathname: `/library/to-do/scorecards/${id}/view`,
                  state: { filter, page },
                })
              }
            />
          </Tab>
        </Tabs>
        <Pagination
          dataCy={`todoPagination${activeTab.replace(/[^A-Z0-9]+/gi, '')}`}
          perPage={templates[`${activeTab}`].per_page}
          current={templates[`${activeTab}`].current_page}
          total={templates[`${activeTab}`].last_page}
          onChange={this.handlePagination}
          onPer={this.handlePer}
        />
      </ErrorBoundary>
    )
  }
}

ToDo.propTypes = {
  userRole: PropTypes.number,
  templates: PropTypes.any,
  getTemplates: PropTypes.func,
  deleteTemplate: PropTypes.func,
  toggleModal: PropTypes.func,
}

ToDo.defaultProps = {
  userRole: 1,
  templates: {},
  getTemplates: () => {},
  getProgramDetail: () => {},
  deleteTemplate: () => {},
  toggleModal: () => {},
}

const mapStateToProps = state => ({
  userRole: state.app.app_role_id,
  templates: state.develop.templates,
  locations: state.app.locations,
  companyId: state.app.company_info.id,
})

const mapDispatchToProps = dispatch => ({
  getProgramDetail: (payload, type, route) => dispatch(DevActions.libraryprogramdetailRequest(payload, type, route)),
  getTemplates: (filter, mode, current = 1, per = 10) =>
    dispatch(DevActions.librarytemplatesRequest({ filter, mode, current, per })),
  deleteTemplate: e => dispatch(DevActions.libraryeventRequest(e)),
  toggleModal: e => dispatch(AppActions.modalRequest(e)),
})

export default connect(mapStateToProps, mapDispatchToProps)(ToDo)

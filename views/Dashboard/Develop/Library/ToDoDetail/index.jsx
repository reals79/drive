import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { equals, find, propEq, filter } from 'ramda'
import {
  ErrorBoundary,
  LibraryToDoHabit as HabitCard,
  LibraryToDoHabitSchedule as HabitScheduleCard,
  LibraryToDoQuota as QuotaCard,
  LibraryToDoScoreCard as Scorecard,
} from '@components'
import AppActions from '~/actions/app'
import DevActions from '~/actions/develop'
import { ToDoTypes } from '~/services/config'

class ToDoDetail extends React.Component {
  constructor(props) {
    super(props)

    const type = props.match.params.activeTab
    const id = Number(props.match.params.id)

    this.state = { id, type }

    if (equals(type, 'scorecards')) {
      const detail = find(propEq('id', id), props.templates[type].data)
      const templateIds = detail.data.quotas.map(quota => quota.quota_template_id)
      props.getQuotas(id, type, templateIds)
    }

    this.handleSelectMenu = this.handleSelectMenu.bind(this)
    this.handleDeleteTemplate = this.handleDeleteTemplate.bind(this)
  }

  handleSelectMenu(event) {
    const { type, id } = this.state
    const { templates } = this.props
    const disabled = filter(x => !equals(x, type), ToDoTypes)
    const card = find(propEq('id', id), templates[`${type}`].data)

    switch (event) {
      case 'edit':
        this.props.history.push(`/library/to-do/${type}/${id}/edit`)
        break
      case 'delete':
        this.props.toggleModal({
          type: 'Confirm',
          data: {
            before: {
              title: 'Delete',
              body: 'Are you sure you want to delete this item?',
            },
          },
          callBack: {
            onYes: () => this.handleDeleteTemplate(id),
          },
        })
        break
      case 'assign':
        this.props.toggleModal({
          type: 'Assign ToDo',
          data: { before: { modules: [card], disabled }, after: [] },
          callBack: null,
        })
        break
      default:
        break
    }
  }

  handleDeleteTemplate(id) {
    const { type } = this.state

    let libType = 'template'
    if (equals(type, 'tracks')) {
      libType = 'track'
    } else if (equals(type, 'quotas')) {
      libType = 'quota_template'
    } else if (equals(type, 'scorecards')) {
      libType = 'scorecard'
    }

    this.props.deleteTemplate({
      libType,
      event: 'delete',
      templateId: id,
      after: {
        type: 'LIBRARYTEMPLATES_REQUEST',
        payload: { filter: '', mode: type, current: 1, per: 25 },
      },
    })
  }

  render() {
    const { templates, userId, currentCompanyInfo, authors, departments, categories, competencies, role } = this.props
    const { id, type } = this.state
    const detail = find(propEq('id', id), templates[`${type}`].data)

    return (
      <ErrorBoundary>
        {equals(type, 'habits') && (
          <HabitCard.Detail
            userRole={role}
            authors={authors}
            departments={departments}
            competencies={competencies}
            categories={categories}
            data={detail}
            history={this.props.history}
            userId={userId}
            companyId={currentCompanyInfo.id}
            onSave={e => this.props.saveTemplate(e)}
            onSelect={this.handleSelectMenu}
          />
        )}
        {equals(type, 'habitslist') && (
          <HabitScheduleCard.Detail
            userRole={role}
            data={detail}
            authors={authors}
            departments={departments}
            competencies={competencies}
            categories={categories}
            history={this.props.history}
            userId={userId}
            companyId={currentCompanyInfo.id}
            onSelect={this.handleSelectMenu}
          />
        )}
        {equals(type, 'quotas') && (
          <QuotaCard.Detail
            userRole={role}
            authors={authors}
            departments={departments}
            competencies={competencies}
            categories={categories}
            data={detail}
            history={this.props.history}
            userId={userId}
            companyId={currentCompanyInfo.id}
            onSelect={this.handleSelectMenu}
          />
        )}
        {equals(type, 'scorecards') && (
          <Scorecard.Detail
            userRole={role}
            authors={authors}
            departments={departments}
            competencies={competencies}
            categories={categories}
            data={detail}
            history={this.props.history}
            userId={userId}
            onSelect={this.handleSelectMenu}
            companyId={currentCompanyInfo.id}
          />
        )}
      </ErrorBoundary>
    )
  }
}

ToDoDetail.propTypes = {
  role: PropTypes.number,
  templates: PropTypes.any,
  companyId: PropTypes.number,
  authors: PropTypes.array,
  departments: PropTypes.array,
  competencies: PropTypes.array,
  categories: PropTypes.array,
  getQuotas: PropTypes.func,
  toggleModal: PropTypes.func,
  saveTemplate: PropTypes.func,
  deleteTemplate: PropTypes.func,
}

ToDoDetail.defaultProps = {
  role: 1,
  companyId: 0,
  authors: [],
  departments: [],
  competencies: [],
  categories: [],
  scorecardsTags: [],
  templates: {},
  getQuotas: () => {},
  saveTemplate: () => {},
  toggleModal: () => {},
  deleteTemplate: () => {},
}

const mapStateToProps = state => ({
  role: state.app.app_role_id,
  userId: state.app.id,
  currentCompanyInfo: state.app.company_info,
  templates: state.develop.templates,
  companyId: state.app.company_info.id,
  authors: state.app.authors,
  departments: state.app.departments,
  competencies: state.app.competencies,
  categories: state.app.categories,
})

const mapDispatchToProps = dispatch => ({
  getQuotas: (id, type, templateIds) => dispatch(DevActions.quotatemplatesRequest(id, type, templateIds)),
  toggleModal: e => dispatch(AppActions.modalRequest(e)),
  saveTemplate: e => dispatch(DevActions.librarysaveRequest(e)),
  deleteTemplate: e => dispatch(DevActions.libraryeventRequest(e)),
})

export default connect(mapStateToProps, mapDispatchToProps)(ToDoDetail)

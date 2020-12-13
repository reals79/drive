import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { find, propEq, filter } from 'ramda'
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

class ToDoEdit extends React.Component {
  constructor(props) {
    super(props)
    const type = props.match.params.activeTab
    const id = Number(props.match.params.id)
    this.state = { id, type }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleSelectMenu = this.handleSelectMenu.bind(this)

    if (type === 'scorecards') {
      const detail = find(propEq('id', id), props.templates[type].data)
      const templateIds = detail.data.quotas.map(quota => quota.quota_template_id)
      templateIds.length > 0 && props.getQuotas(id, type, templateIds)
    }
  }

  handleSelectMenu(event) {
    const { type, id } = this.state
    const { templates } = this.props
    const disabled = filter(x => x !== type, ToDoTypes)
    const card = find(propEq('id', id), templates[`${type}`].data)

    switch (event) {
      case 'detail view':
        this.props.history.push(`/library/to-do/${type}/${id}/view`)
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

  handleSubmit(e) {
    this.props.saveScorecard(e)
  }

  render() {
    const {
      role,
      templates,
      userId,
      currentCompanyInfo,
      authors,
      departments,
      categories,
      competencies,
      modalData,
    } = this.props
    const { id, type } = this.state
    const detail = find(propEq('id', id), templates[type].data)

    return (
      <ErrorBoundary>
        {type === 'habits' && (
          <HabitCard.Edit
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
            onUpdate={e => this.props.saveTemplate(e)}
          />
        )}
        {type === 'habitslist' && (
          <HabitScheduleCard.Edit
            userRole={role}
            authors={authors}
            departments={departments}
            competencies={competencies}
            categories={categories}
            data={detail}
            history={this.props.history}
            userId={userId}
            companyId={currentCompanyInfo.id}
            onUpdate={e => this.props.saveTemplate(e)}
            onSelect={this.handleSelectMenu}
            onModal={e => this.props.toggleModal(e)}
          />
        )}
        {type === 'quotas' && (
          <QuotaCard.Edit
            authors={authors}
            departments={departments}
            competencies={competencies}
            categories={categories}
            data={detail}
            history={this.props.history}
            userId={userId}
            companyId={currentCompanyInfo.id}
            onUpdate={e => this.props.saveTemplate(e)}
          />
        )}
        {type === 'scorecards' && (
          <Scorecard.Edit
            userRole={role}
            authors={authors}
            departments={departments}
            competencies={competencies}
            categories={categories}
            data={detail}
            history={this.props.history}
            userId={userId}
            companyId={currentCompanyInfo.id}
            modalData={modalData}
            onSubmit={this.handleSubmit}
            onSelect={this.handleSelectMenu}
            onModal={e => this.props.toggleModal(e)}
          />
        )}
      </ErrorBoundary>
    )
  }
}

ToDoEdit.propTypes = {
  role: PropTypes.number,
  admin: PropTypes.bool,
  templates: PropTypes.any,
  companyId: PropTypes.number,
  authors: PropTypes.array,
  departments: PropTypes.array,
  competencies: PropTypes.array,
  categories: PropTypes.array,
  toggleModal: PropTypes.func,
  saveTemplate: PropTypes.func,
  getQuotas: PropTypes.func,
}

ToDoEdit.defaultProps = {
  role: 1,
  admin: false,
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
}

const mapStateToProps = state => ({
  role: state.app.app_role_id,
  userId: state.app.id,
  currentCompanyInfo: state.app.company_info,
  admin: state.app.app_role_id < 3,
  templates: state.develop.templates,
  companyId: state.app.company_info.id,
  authors: state.app.authors,
  departments: state.app.departments,
  competencies: state.app.competencies,
  categories: state.app.categories,
  modalData: state.app.modalData,
})

const mapDispatchToProps = dispatch => ({
  getQuotas: (id, type, templateIds) => dispatch(DevActions.quotatemplatesRequest(id, type, templateIds)),
  toggleModal: e => dispatch(AppActions.modalRequest(e)),
  saveScorecard: e => dispatch(DevActions.postscorecardsaveRequest(e)),
  saveTemplate: e => dispatch(DevActions.librarysaveRequest(e)),
})

export default connect(mapStateToProps, mapDispatchToProps)(ToDoEdit)

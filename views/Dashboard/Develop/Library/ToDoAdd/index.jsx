import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {
  ErrorBoundary,
  LibraryToDoHabit as HabitCard,
  LibraryToDoHabitSchedule as HabitScheduleCard,
  LibraryToDoQuota as QuotaCard,
  LibraryToDoScoreCard as Scorecard,
} from '@components'
import AppActions from '~/actions/app'
import DevActions from '~/actions/develop'

class ToDoAdd extends React.Component {
  state = { type: this.props.match.params.activeTab }

  render() {
    const { companyId, authors, departments, categories, competencies, history, modalData } = this.props
    const { type } = this.state

    return (
      <ErrorBoundary>
        {type == 'habits' && (
          <HabitCard.Add
            authors={authors}
            departments={departments}
            competencies={competencies}
            categories={categories}
            history={history}
            onCreate={e => this.props.saveTemplate(e)}
          />
        )}
        {type == 'habitslist' && (
          <HabitScheduleCard.Add
            authors={authors}
            departments={departments}
            competencies={competencies}
            categories={categories}
            history={history}
            onCreate={e => this.props.saveTemplate(e)}
            onModal={e => this.props.toggleModal(e)}
          />
        )}
        {type == 'quotas' && (
          <QuotaCard.Add
            authors={authors}
            departments={departments}
            competencies={competencies}
            categories={categories}
            history={history}
            onCreate={e => this.props.saveTemplate(e)}
          />
        )}
        {type == 'scorecards' && (
          <Scorecard.Add
            authors={authors}
            departments={departments}
            competencies={competencies}
            categories={categories}
            companyId={companyId}
            modalData={modalData}
            history={history}
            onModal={e => this.props.toggleModal(e)}
            onCreate={e => this.props.saveTemplate(e)}
          />
        )}
      </ErrorBoundary>
    )
  }
}

ToDoAdd.propTypes = {
  templates: PropTypes.any,
  companyId: PropTypes.number,
  authors: PropTypes.array,
  departments: PropTypes.array,
  competencies: PropTypes.array,
  categories: PropTypes.array,
  toggleModal: PropTypes.func,
  saveTemplate: PropTypes.func,
}

ToDoAdd.defaultProps = {
  companyId: 0,
  authors: [],
  departments: [],
  competencies: [],
  categories: [],
  templates: {},
  saveTemplate: () => {},
  toggleModal: () => {},
}

const mapStateToProps = state => ({
  companyId: state.app.company_info.id,
  authors: state.app.authors,
  departments: state.app.departments,
  competencies: state.app.competencies,
  templates: state.develop.templates,
  categories: state.app.categories,
  modalData: state.app.modalData,
})

const mapDispatchToProps = dispatch => ({
  saveTemplate: e => dispatch(DevActions.librarysaveRequest(e)),
  toggleModal: e => dispatch(AppActions.modalRequest(e)),
})

export default connect(mapStateToProps, mapDispatchToProps)(ToDoAdd)

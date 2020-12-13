import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { equals } from 'ramda'
import {
  ErrorBoundary,
  LibraryTrackCard as TrackCard,
  LibraryCourseCard as CourseCard,
  LibraryModuleCard as ModuleCard,
} from '@components'
import AppActions from '~/actions/app'
import DevActions from '~/actions/develop'

class TrainingAdd extends Component {
  state = { type: this.props.match.params.activeTab }

  handleChildMenu = () => {}

  handleUpdate = mode => (payload, image, video, pdf, file) => {
    const { type } = this.state
    const after = {
      type: 'LIBRARYTEMPLATES_REQUEST',
      payload: {
        mode,
        current: 1,
        per: 25,
        publish: 1,
      },
    }
    const route = `/library/training?active=${type}`
    this.props.saveTemplate(payload, image, video, pdf, file, mode, after, route)
  }

  render() {
    const { companyId, userRole, authors, departments, competencies, categories, history, modalData } = this.props
    const { type } = this.state

    return (
      <ErrorBoundary>
        {type === 'tracks' && (
          <TrackCard.Add
            role={userRole}
            authors={authors}
            departments={departments}
            competencies={competencies}
            categories={categories}
            history={history}
            onUpdate={this.handleUpdate('tracks')}
            onModal={e => this.props.toggleModal(e)}
            onChildMenu={this.handleChildMenu}
          />
        )}
        {type === 'courses' && (
          <CourseCard.Add
            role={userRole}
            authors={authors}
            departments={departments}
            competencies={competencies}
            categories={categories}
            modalData={modalData}
            history={this.props.history}
            onUpdate={this.handleUpdate('courses')}
            onModal={e => this.props.toggleModal(e)}
            onChildMenu={this.handleChildMenu}
          />
        )}
        {type === 'modules' && (
          <ModuleCard.Add
            companyId={companyId}
            authors={authors}
            departments={departments}
            competencies={competencies}
            categories={categories}
            history={this.props.history}
            onUpdate={this.handleUpdate('modules')}
            onModal={e => this.props.toggleModal(e)}
          />
        )}
      </ErrorBoundary>
    )
  }
}

TrainingAdd.propTypes = {
  userRole: PropTypes.number,
  libTracks: PropTypes.shape({
    data: PropTypes.array,
  }),
  libCourses: PropTypes.shape({
    data: PropTypes.array,
  }),
  libModules: PropTypes.shape({
    data: PropTypes.array,
  }),
  companyId: PropTypes.number,
  authors: PropTypes.any,
  modalData: PropTypes.any,
  departments: PropTypes.array,
  competencies: PropTypes.array,
  categories: PropTypes.array,
  toggleModal: PropTypes.func,
}

TrainingAdd.defaultProps = {
  userRole: 2,
  libTracks: { data: [] },
  libCourses: { data: [] },
  libModules: { data: [] },
  companyId: 0,
  authors: [],
  departments: [],
  competencies: [],
  categories: [],
  modalData: {},
  toggleModal: () => {},
}

const mapStateToProps = state => ({
  userRole: state.app.app_role_id,
  libTracks: state.develop.templates.tracks,
  libCourses: state.develop.templates.courses,
  libModules: state.develop.templates.modules,
  companyId: state.app.selectedCompany[0],
  authors: state.app.authors,
  departments: state.app.departments,
  competencies: state.app.competencies,
  categories: state.app.categories,
  modalData: state.app.modalData,
})

const mapDispatchToProps = dispatch => ({
  saveTemplate: (payload, image, video, pdf, file, mode, after, route) =>
    dispatch(DevActions.librarytemplatesaveRequest(payload, image, video, pdf, file, mode, after, route)),
  toggleModal: e => dispatch(AppActions.modalRequest(e)),
})

export default connect(mapStateToProps, mapDispatchToProps)(TrainingAdd)

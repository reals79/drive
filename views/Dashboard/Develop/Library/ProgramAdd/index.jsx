import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { filter, find, propEq } from 'ramda'
import {
  ErrorBoundary,
  LibraryProgramsCareer as CareerCard,
  LibraryProgramsCertification as CertificationCard,
  LibraryProgramsBadge as BadgeCard,
} from '@components'
import AppActions from '~/actions/app'
import DevActions from '~/actions/develop'

class ProgramAdd extends React.Component {
  state = {
    type: this.props.match.params.activeTab,
  }

  render() {
    const { authors, departments, competencies, categories, history, company, companies, modalData } = this.props
    const { type } = this.state
    const tags = { authors, departments, competencies, categories }
    const quotaOptions = filter(x => !x.label.includes('Quarter'), this.props.quotaOptions)
    const _company = find(propEq('id', company.id), companies)
    const jobRoles = _company.job_roles

    return (
      <ErrorBoundary>
        {type === 'careers' && (
          <CareerCard.Add
            company={company}
            tags={tags}
            jobs={jobRoles}
            quotaOptions={quotaOptions}
            history={history}
            modalData={modalData}
            onSave={e => this.props.saveProgram(e)}
            onModal={e => this.props.toggleModal(e)}
          />
        )}
        {type === 'certifications' && (
          <CertificationCard.Add
            company={company}
            tags={tags}
            quotaOptions={quotaOptions}
            history={history}
            modalData={modalData}
            onSave={(e, image, pdf) => this.props.saveProgram(e, image, pdf)}
            onModal={e => this.props.toggleModal(e)}
          />
        )}
        {type === 'badges' && (
          <BadgeCard.Add
            tags={tags}
            history={history}
            onSave={e => this.props.saveProgram(e)}
            onModal={e => this.props.toggleModal(e)}
          />
        )}
      </ErrorBoundary>
    )
  }
}

ProgramAdd.propTypes = {
  authors: PropTypes.array,
  company: PropTypes.shape({
    id: PropTypes.number,
  }),
  categories: PropTypes.array,
  departments: PropTypes.array,
  competencies: PropTypes.array,
  saveProgram: PropTypes.func,
  toggleModal: PropTypes.func,
}

ProgramAdd.defaultProps = {
  authors: [],
  company: {
    id: 0,
  },
  categories: [],
  departments: [],
  competencies: [],
  saveProgram: () => {},
  toggleModal: () => {},
}

const mapStateToProps = state => ({
  authors: state.app.authors,
  company: state.app.company_info,
  companies: state.app.companies,
  categories: state.app.categories,
  departments: state.app.departments,
  competencies: state.app.competencies,
  quotaOptions: state.develop.libraryQuotaOptions,
  modalData: state.app.modalData,
})

const mapDispatchToProps = dispatch => ({
  saveProgram: (e, image, pdf) => dispatch(DevActions.librarysaveRequest(e, image, pdf)),
  toggleModal: e => dispatch(AppActions.modalRequest(e)),
})

export default connect(mapStateToProps, mapDispatchToProps)(ProgramAdd)

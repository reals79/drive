import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { filter, find, propEq } from 'ramda'
import {
  ErrorBoundary,
  Filter,
  LibraryProgramsCareer as CareerCard,
  LibraryProgramsBadge as BadgeCard,
  LibraryProgramsCertification as CertificateCard,
} from '@components'
import AppActions from '~/actions/app'
import DevActions from '~/actions/develop'

class ProgramEdit extends Component {
  constructor(props) {
    super(props)

    const type = props.match.params.activeTab
    const id = Number(props.match.params.id)

    const { templates } = props
    const program = find(propEq('id', id), templates[type].data)

    this.state = { id, type, program }

    this.handleSelectMenu = this.handleSelectMenu.bind(this)
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { match, templates } = nextProps
    const type = match.params.activeTab
    const id = Number(match.params.id)
    const program = find(propEq('id', id), templates[type].data)
    return { id, type, program }
  }

  handleSelectMenu(e) {
    const { program, type } = this.state
    const { companyId } = this.props
    switch (e) {
      case 'assign':
        this.props.toggleModal({
          type: 'Assign Program',
          data: { before: { modules: [program] }, after: [], companyId },
          callBack: null,
        })
        break
      case 'detail view':
        this.props.history.push({
          pathname: `/library/programs/${type}/${program.id}/view`,
          state: { editable: false },
        })
        break
      case 'edit':
        this.props.history.push({
          pathname: `/library/programs/${type}/${program.id}/edit`,
          state: { editable: true },
        })
        break
      case 'quick assign':
        this.props.toggleModal({
          type: 'Quick Assign',
          data: {
            before: { template: program, type: 'Program', from: 'template', companyId },
            after: null,
          },
          callBack: null,
        })
        break
      default:
        break
    }
  }

  render() {
    const { role, companyId, authors, departments, competencies, categories, companies, history } = this.props
    const { program, type } = this.state
    const tags = { authors, departments, competencies, categories }
    const quotaOptions = filter(x => !x.label.includes('Quarter'), this.props.quotaOptions)
    const company = find(propEq('id', companyId), companies)
    const jobRoles = company.job_roles

    return (
      <ErrorBoundary>
        <Filter backTitle={`all ${type}`} onBack={() => history.goBack()} />

        {type === 'careers' && (
          <CareerCard.Edit
            tags={tags}
            jobs={jobRoles}
            userRole={role}
            program={program}
            history={history}
            quotaOptions={quotaOptions}
            onModal={e => this.props.toggleModal(e)}
            onSave={e => this.props.saveProgram(e)}
            onSelect={this.handleSelectMenu}
          />
        )}
        {type === 'certifications' && (
          <CertificateCard.Edit
            tags={tags}
            jobs={jobRoles}
            userRole={role}
            program={program}
            history={history}
            quotaOptions={quotaOptions}
            onModal={e => this.props.toggleModal(e)}
            onSave={(e, image, pdf) => this.props.saveProgram(e, image, pdf)}
            onSelect={this.handleSelectMenu}
          />
        )}
        {type === 'badges' && <BadgeCard.Detail data={program} />}
      </ErrorBoundary>
    )
  }
}

ProgramEdit.propTypes = {
  role: PropTypes.number,
  templates: PropTypes.any,
  authors: PropTypes.array,
  categories: PropTypes.array,
  departments: PropTypes.array,
  competencies: PropTypes.array,
  saveProgram: PropTypes.func,
  toggleModal: PropTypes.func,
}

ProgramEdit.defaultProps = {
  role: 1,
  companyId: 0,
  templates: {},
  authors: [],
  categories: [],
  departments: [],
  competencies: [],
  companies: [],
  saveProgram: () => {},
  toggleModal: () => {},
}

const mapStateToProps = state => ({
  role: state.app.app_role_id,
  companyId: state.app.company_info.id,
  templates: state.develop.templates,
  authors: state.app.authors,
  categories: state.app.categories,
  departments: state.app.departments,
  competencies: state.app.competencies,
  companies: state.app.companies,
  quotaOptions: state.develop.libraryQuotaOptions,
})

const mapDispatchToProps = dispatch => ({
  getProgramDetail: e => dispatch(DevActions.libraryprogramdetailRequest(e)),
  saveProgram: (e, image, pdf) => dispatch(DevActions.librarysaveRequest(e, image, pdf)),
  toggleModal: e => dispatch(AppActions.modalRequest(e)),
})

export default connect(mapStateToProps, mapDispatchToProps)(ProgramEdit)

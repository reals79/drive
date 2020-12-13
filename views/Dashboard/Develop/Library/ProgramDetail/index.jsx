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
import { ProgramTypes } from '~/services/config'

class ProgramDetail extends Component {
  constructor(props) {
    super(props)
    const type = props.match.params.activeTab
    const id = Number(props.match.params.id)
    const { templates } = props
    const program = find(propEq('id', id), templates[type].data)
    this.state = { id, type, program }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { match, templates } = nextProps
    const type = match.params.activeTab
    const id = Number(match.params.id)
    if (id !== prevState.id) {
      const program = find(propEq('id', id), templates[type].data)
      return { id, type, program }
    }
  }

  handleSelectMenu = e => {
    const { type, program } = this.state
    const { companyId } = this.props
    const disabled = filter(e => e !== type, ProgramTypes)

    switch (e) {
      case 'assign':
        this.props.toggleModal({
          type: 'Assign Program',
          data: {
            before: { modules: [program], disabled, levels: program.data.levels, companyId },
            after: this.props.getProgramDetail(program, type),
          },
          callBack: null,
        })
        break
      case 'detail view':
        this.props.history.push(`/library/programs/${type}/${program.id}/view`)
        break
      case 'edit':
        this.props.history.push(`/library/programs/${type}/${program.id}/edit`)
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
    const company = find(propEq('id', companyId), companies)
    const jobRoles = company.job_roles

    return (
      <ErrorBoundary>
        <Filter backTitle={`all ${type}`} onBack={() => history.goBack()} />
        {type === 'careers' && (
          <CareerCard.Detail
            data={program}
            authors={authors}
            departments={departments}
            competencies={competencies}
            categories={categories}
            userRole={role}
            jobs={jobRoles}
            onModal={e => this.props.toggleModal(e)}
            onSave={e => this.props.saveProgram(e)}
            onSelect={this.handleSelectMenu}
          />
        )}
        {type === 'certifications' && (
          <CertificateCard.Detail
            userRole={role}
            data={program}
            authors={authors}
            departments={departments}
            competencies={competencies}
            categories={categories}
            jobs={jobRoles}
            onModal={e => this.props.toggleModal(e)}
            onSave={e => this.props.saveProgram(e)}
            onSelect={this.handleSelectMenu}
          />
        )}
        {type === 'badges' && <BadgeCard.Detail data={program} />}
      </ErrorBoundary>
    )
  }
}

ProgramDetail.propTypes = {
  role: PropTypes.number,
  templates: PropTypes.any,
  authors: PropTypes.array,
  categories: PropTypes.array,
  departments: PropTypes.array,
  competencies: PropTypes.array,
  saveProgram: PropTypes.func,
  toggleModal: PropTypes.func,
  getProgramDetail: PropTypes.func,
}

ProgramDetail.defaultProps = {
  role: 1,
  templates: {},
  authors: [],
  categories: [],
  departments: [],
  competencies: [],
  saveProgram: () => {},
  toggleModal: () => {},
  getProgramDetail: () => {},
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
})

const mapDispatchToProps = dispatch => ({
  saveProgram: e => dispatch(DevActions.librarysaveRequest(e)),
  toggleModal: e => dispatch(AppActions.modalRequest(e)),
  getProgramDetail: (payload, type, route) => dispatch(DevActions.libraryprogramdetailRequest(payload, type, null)),
})

export default connect(mapStateToProps, mapDispatchToProps)(ProgramDetail)

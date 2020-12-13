import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { find, propEq } from 'ramda'
import { Filter, ErrorBoundary, LibraryProgramsCertification as CertificateCard } from '@components'
import AppActions from '~/actions/app'
import DevActions from '~/actions/develop'

class CertificationEdit extends Component {
  constructor(props) {
    super(props)

    const userId = Number(props.match.params.userId)
    const certId = Number(props.match.params.id)

    const { templates } = props
    const program = find(propEq('id', certId), templates.certifications.data)

    this.state = { program }

    this.handleSelect = this.handleSelect.bind(this)
  }

  handleSelect() {}

  render() {
    const { authors, departments, competencies, categories, companyId, companies, userRole } = this.props
    const tags = { authors, departments, competencies, categories }
    const { program } = this.state
    const company = find(propEq('id', companyId), companies)
    const jobRoles = company.job_roles

    return (
      <ErrorBoundary>
        <Filter backTitle="Back" onBack={() => this.props.history.goBack()} />
        <CertificateCard.Edit
          tags={tags}
          program={program}
          jobs={jobRoles}
          role={userRole}
          onModal={e => this.props.toggleModal(e)}
          onSave={e => this.props.saveProgram(e)}
          onSelect={this.handleSelect}
        />
      </ErrorBoundary>
    )
  }
}

CertificationEdit.propTypes = {
  authors: PropTypes.array,
  categories: PropTypes.array,
  departments: PropTypes.array,
  competencies: PropTypes.array,
  saveProgram: PropTypes.func,
  toggleModal: PropTypes.func,
}

CertificationEdit.defaultProps = {
  authors: [],
  categories: [],
  departments: [],
  competencies: [],
  saveProgram: () => {},
  toggleModal: () => {},
}

const mapStateToProps = state => ({
  userRole: state.app.app_role_id,
  companyId: state.app.company_info.id,
  templates: state.develop.templates,
  authors: state.app.authors,
  categories: state.app.categories,
  departments: state.app.departments,
  competencies: state.app.competencies,
  companies: state.app.companies,
  templates: state.develop.templates,
})

const mapDispatchToProps = dispatch => ({
  saveProgram: e => dispatch(DevActions.librarysaveRequest(e)),
  toggleModal: e => dispatch(AppActions.modalRequest(e)),
})

export default connect(mapStateToProps, mapDispatchToProps)(CertificationEdit)

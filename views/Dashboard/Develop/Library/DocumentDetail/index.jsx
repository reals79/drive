import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { find, isEmpty, isNil, propEq } from 'ramda'
import { ErrorBoundary, LibraryDocumentCard as DocumentCard } from '@components'
import AppActions from '~/actions/app'
import DevActions from '~/actions/develop'
import { loading } from '~/services/util'

class DocumentDetail extends React.Component {
  constructor(props) {
    super(props)

    const type = props.match.params.activeTab
    const id = Number(props.match.params.id)
    let document = null
    const { templates } = props
    if (!isNil(id)) {
      document = find(propEq('id', id), templates[`${type}`].data)
    }

    this.state = { document }
    this.handleUpdate = this.handleUpdate.bind(this)
    this.handleToggle = this.handleToggle.bind(this)
  }

  handleUpdate(e) {
    this.props.updateDocument(e, null, null)
  }

  handleToggle(e) {
    this.props.toggleModal(e)
  }

  render() {
    const { busy, disabled, authors, departments, competencies, categories, history } = this.props
    const { document } = this.state

    if (isNil(document)) return null

    return (
      <ErrorBoundary>
        <DocumentCard.Detail
          type={this.props.match.params.activeTab}
          history={history}
          busy={busy}
          disabled={disabled}
          document={document}
          authors={authors}
          departments={departments}
          competencies={competencies}
          categories={categories}
          onUpdate={this.handleUpdate}
          onToggle={this.handleToggle}
        />
      </ErrorBoundary>
    )
  }
}

DocumentDetail.propTypes = {
  busy: PropTypes.bool,
  disabled: PropTypes.bool,
  templates: PropTypes.any,
  authors: PropTypes.any,
  departments: PropTypes.array,
  competencies: PropTypes.array,
  categories: PropTypes.array,
  toggleModal: PropTypes.func,
}

DocumentDetail.defaultProps = {
  busy: false,
  disabled: false,
  templates: {},
  authors: [],
  departments: [],
  competencies: [],
  categories: [],
  toggleModal: () => {},
}

const mapStateToProps = state => ({
  busy: loading(state.develop.status),
  disabled: !(isEmpty(state.app.modalType) || isNil(state.app.modalType)),
  templates: state.develop.templates,
  authors: state.app.authors,
  departments: state.app.departments,
  competencies: state.app.competencies,
  categories: state.app.categories,
})

const mapDispatchToProps = dispatch => ({
  updateDocument: (payload, thumbnail, attachment) =>
    dispatch(DevActions.adddocumentRequest(payload, thumbnail, attachment)),
  toggleModal: e => dispatch(AppActions.modalRequest(e)),
})

export default connect(mapStateToProps, mapDispatchToProps)(DocumentDetail)

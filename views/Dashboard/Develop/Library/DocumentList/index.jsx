import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Tabs, Tab } from 'react-bootstrap'
import { equals } from 'ramda'
import {
  ErrorBoundary,
  Filter,
  LibraryStatus as Status,
  LibraryDocumentCard as DocumentCard,
  Search,
} from '@components'
import AppActions from '~/actions/app'
import DevActions from '~/actions/develop'
import { DocumentTabs } from '~/services/config'

class DocumentList extends Component {
  constructor(props) {
    super(props)

    const regExp = /^\/library\/documents\/\w+\/((\w+)|(\d+)\/\w+)$/g
    const str = props.locations[0]
    let activeTab = 'powerpoint'
    if (regExp.test(str)) activeTab = str.split('/')[3]

    this.state = { activeTab, filter: '' }

    this.showModal = this.showModal.bind(this)
    this.handleSearch = this.handleSearch.bind(this)
    this.showPreview = this.showPreview.bind(this)
    this.handleTab = this.handleTab.bind(this)
    this.handlePagination = this.handlePagination.bind(this)
    this.handleModal = this.handleModal.bind(this)
    this.handleToggle = this.handleToggle.bind(this)
  }

  componentDidMount() {
    if (this.props.history.action !== 'POP') {
      this.props.getTemplates(this.state.filter, this.state.activeTab, 1, 10)
    }
  }

  handleModal(e) {
    this.props.toggleModal(e)
  }

  handleToggle(e, id) {
    const { activeTab } = this.state
    if (equals('Detail View', e)) {
      this.props.history.push(`/library/documents/${activeTab}/${id}/view`)
    } else if (equals('Edit View', e)) {
      this.props.history.push(`/library/documents/${activeTab}/${id}/edit`)
    }
  }

  handleTab(tab) {
    this.props.getTemplates('', tab, 1, 10)
    this.setState({ activeTab: tab, filter: '' })
  }

  handleSearch(e) {
    const filter = e.target.value
    this.props.getTemplates(e.target.value, tab, 1, 10)
    this.setState({ filter })
  }

  handlePagination(page) {
    const { activeTab, filter } = this.state
    this.props.getTemplates(filter, activeTab, page, 10)
  }

  showPreview(document) {
    this.props.toggleModal({
      type: 'View Document',
      data: { before: document, after: null },
      callBack: null,
    })
  }

  showModal() {
    const { activeTab } = this.state
    switch (activeTab) {
      case 'powerpoint':
        this.props.toggleModal({
          type: 'Add Document',
          data: { before: { id: 0, name: 'Power Point' }, after: null },
          callBack: null,
        })
        break
      case 'word':
        this.props.toggleModal({
          type: 'Add Document',
          data: { before: { id: 1, name: 'Word' }, after: null },
          callBack: null,
        })
        break
      case 'pdf':
        this.props.toggleModal({
          type: 'Add Document',
          data: { before: { id: 2, name: 'PDF' }, after: null },
          callBack: null,
        })
        break
      // hiding envelop for now
      // case 'envelope':
      //   this.props.toggleModal({
      //     type: 'Add Document',
      //     data: { before: { id: 3, name: 'Envelope' }, after: null },
      //     callBack: null,
      //   })
      //   break
      default:
        break
    }
  }

  render() {
    const { activeTab } = this.state
    const { templates, isAdmin } = this.props

    return (
      <ErrorBoundary className="bg-main">
        <Filter aligns={['left', 'right']} addTitle={activeTab} onAdd={this.showModal} />

        <div className="bg-white px-4 pt-4">
          <p className="dsl-b22 bold mb-0">Documents</p>
          <div className="d-flex justify-content-end">
            <Search onChange={this.handleSearch} />
          </div>
        </div>

        <Tabs
          className="bg-white px-4"
          defaultActiveKey="powerpoint"
          activeKey={activeTab}
          id="documents"
          onSelect={this.handleTab}
        >
          <Tab eventKey="powerpoint" title="Power Point">
            <Status type="Power Points" showToggle counts={templates.powerpoint.total} />
            <DocumentCard.List
              isAdmin={isAdmin}
              iconName="fal fa-file-powerpoint"
              documentName="PPT"
              data={templates.powerpoint.data}
              current={templates.powerpoint.current_page}
              perPage={templates.powerpoint.per_page}
              total={templates.powerpoint.last_page}
              onModal={this.handleModal}
              onToggle={this.handleToggle}
              onShow={this.showPreview}
              onChange={this.handlePagination}
            />
          </Tab>
          <Tab eventKey="word" title="Words">
            <Status type="Words" showToggle counts={templates.word.total} />
            <DocumentCard.List
              isAdmin={isAdmin}
              iconName="fal fa-file-word"
              documentName="Word"
              data={templates.word.data}
              perPage={templates.word.per_page}
              current={templates.word.current_page}
              total={templates.word.last_page}
              onModal={this.handleModal}
              onToggle={this.handleToggle}
              onShow={this.showPreview}
              onChange={this.handlePagination}
            />
          </Tab>
          <Tab eventKey="pdf" title="PDF">
            <Status type="PDF" showToggle counts={templates.pdf.total} />
            <DocumentCard.List
              isAdmin={isAdmin}
              iconName="fal fa-file-pdf"
              documentName="PDF"
              data={templates.pdf.data}
              perPage={templates.pdf.per_page}
              current={templates.pdf.current_page}
              total={templates.pdf.last_page}
              onModal={this.handleModal}
              onToggle={this.handleToggle}
              onShow={this.showPreview}
              onChange={this.handlePagination}
            />
          </Tab>
          <Tab eventKey="esign" title="eSign">
            <Status type="eSign" showToggle counts={templates.esign.total} />
            <DocumentCard.List
              isAdmin={isAdmin}
              iconName="fal fa-at"
              documentName="eSign"
              data={templates.esign.data}
              perPage={templates.esign.per_page}
              current={templates.esign.current_page}
              total={templates.esign.last_page}
              onModal={this.handleModal}
              onToggle={this.handleToggle}
              onShow={this.showPreview}
              onChange={this.handlePagination}
            />
          </Tab>
          {/* Hiding envelope for now [TOP-2430]  */}
          {/* <Tab eventKey="envelope" title="Envelopes">
            <Status type="Envelopes" showToggle counts={templates.envelope.total} />
            <DocumentCard.List
              iconName="fal fa-envelope-open-text"
              documentName="Envelope"
              data={templates.envelope.data}
              perPage={templates.envelope.per_page}
              current={templates.envelope.current_page}
              total={templates.envelope.last_page}
              onToggle={this.handleToggle}
              onShow={this.showPreview}
              onChange={this.handlePagination}
            />
          </Tab> */}
          <Tab eventKey="packets" title="Packets">
            <Status type="Packets" showToggle counts={templates.packets.total} />
            <DocumentCard.List
              isAdmin={isAdmin}
              iconName="fal fa-envelope-open-text"
              documentName="Packet"
              data={templates.packets.data}
              perPage={templates.packets.per_page}
              current={templates.packets.current_page}
              total={templates.packets.last_page}
              onModal={this.handleModal}
              onToggle={this.handleToggle}
              onShow={this.showPreview}
              onChange={this.handlePagination}
            />
          </Tab>
        </Tabs>
      </ErrorBoundary>
    )
  }
}

DocumentList.propTypes = {
  isAdmin: PropTypes.bool,
  templates: PropTypes.any,
  modalData: PropTypes.any,
  getTemplates: PropTypes.func,
  toggleModal: PropTypes.func,
}

DocumentList.defaultProps = {
  isAdmin: false,
  templates: {},
  modalData: {},
  getTemplates: () => {},
  toggleModal: () => {},
}

const mapStateToProps = state => ({
  isAdmin: state.app.app_role_id < 3,
  templates: state.develop.templates,
  modalData: state.app.modalData.after,
  locations: state.app.locations,
})

const mapDispatchToProps = dispatch => ({
  getTemplates: (filter, mode, current = 1, per = 10) =>
    dispatch(DevActions.librarytemplatesRequest({ filter, mode, current, per })),
  toggleModal: e => dispatch(AppActions.modalRequest(e)),
})

export default connect(mapStateToProps, mapDispatchToProps)(DocumentList)

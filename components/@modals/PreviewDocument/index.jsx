import React, { Component } from 'react'
import { Document, Page } from 'react-pdf/dist/entry.webpack'
import { Pagination } from '@components'
import './PreviewDocument.scss'

class PreviewDocument extends Component {
  constructor(props) {
    super(props)
    this.state = {
      attachment: props.card.data.attachment,
      numPages: null,
      pageNumber: 1,
    }
  }

  onDocumentLoadSuccess = ({ numPages }) => {
    this.setState({ numPages })
  }

  handleChangePage(page) {
    const { numPages } = this.state
    if (page > numPages) return
    this.setState({ pageNumber: page })
  }

  render() {
    const { attachment, pageNumber, numPages } = this.state
    return (
      <div className="document-preview">
        <div className="modal-body">
          <Document
            file={attachment}
            onLoadSuccess={this.onDocumentLoadSuccess}
            className="d-center"
          >
            <Page pageNumber={pageNumber} />
          </Document>
          {numPages > 1 && (
            <Pagination
              current={pageNumber}
              perPage={1}
              total={numPages}
              onChange={page => this.handleChangePage(page)}
            />
          )}
        </div>
      </div>
    )
  }
}

export default PreviewDocument

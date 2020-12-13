import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { equals } from 'ramda'
import { Pagination } from '@components'
import { length } from '~/services/util'
import Edit from './Edit'
import Detail from './Detail'
import Document from './List'

class List extends Component {
  handleMenuChange(document, e) {
    const selectedMenu = e[0].value
    if (equals(selectedMenu, 'Assign')) {
      this.props.onModal({
        type: 'Assign Document',
        data: { before: { documents: [] }, after: [] },
        callBack: null,
      })
    } else {
      this.props.onToggle(selectedMenu, document.id)
    }
  }

  render() {
    const {
      isAdmin,
      iconName,
      documentName,
      data,
      perPage,
      current,
      total,
      onChange,
      onShow,
      onToggle,
    } = this.props

    return (
      <div className="library-document-card ">
        {data.map((document, index) => (
          <Document
            key={`document${index}`}
            isAdmin={isAdmin}
            name={document.name || document.title}
            description={document.data.description}
            iconName={iconName}
            documentName={documentName}
            modules={length(document.children)}
            updated={document.updated_at}
            attachments={document.data.attachment ? document.data.attachment : document.data.image}
            onToggle={e => onToggle(e)}
            onChange={e => this.handleMenuChange(document, e)}
            onShow={() => onShow(document)}
          />
        ))}
        <Pagination perPage={perPage} current={current} total={total} onChange={onChange} />
      </div>
    )
  }
}

List.propTypes = {
  data: PropTypes.array,
  onToggle: PropTypes.func,
}

List.defaultProps = {
  data: [],
  onToggle: () => {},
}

export { List, Detail, Edit }

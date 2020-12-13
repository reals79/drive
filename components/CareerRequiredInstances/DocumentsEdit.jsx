import React from 'react'
import PropTypes from 'prop-types'
import { Pagination, Thumbnail } from '@components'
import { inPage } from '~/services/util'
import { LibraryTypes } from '~/services/config'
import './CareerRequiredInstances.scss'

class DocumentsEdit extends React.PureComponent {
  state = { current: 1, per: 5 }

  handlePagination = e => {
    this.setState({ current: e })
  }

  handlePer = e => {
    this.setState({ per: e })
  }

  render() {
    const { current, per } = this.state
    const { data } = this.props

    return (
      <div className="career-required-instances">
        <div className="documents">
          {data.map((item, index) => {
            const type = toLower(replace(/\s/g, '', item.data.type))
            const thumbnail = LibraryTypes[type].icon
            if (inPage(index, current, per)) {
              return (
                <div className="d-flex justify-content-between py-2" key={`doc${index}`}>
                  <div className="d-flex align-items-center">
                    <Icon name="fal fa-circle mr-3" size={25} color="#969faa" />
                    <Thumbnail src={thumbnail} label={item.data.type} size="tiny" />
                    <div className="ml-3">
                      <p className="dsl-b14 text-400 mb-1">{item.title}</p>
                      <p className="dsl-m12 mb-0">Completeness: none</p>
                    </div>
                  </div>
                  <div className="edit">
                    <Icon name="far fa-ellipsis-h" size={16} color="#c3c7cc" />
                  </div>
                </div>
              )
            }
          })}
        </div>
        <Pagination
          current={current}
          per={per}
          pers={[5, 10, 'all']}
          total={Math.ceil(data.length / per)}
          onChange={this.handlePagination}
          onPer={this.handlePer}
        />
      </div>
    )
  }
}

DocumentsEdit.propTypes = {
  data: PropTypes.array,
}

DocumentsEdit.defaultProps = {
  data: [],
}

export default DocumentsEdit

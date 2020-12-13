import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { clone, includes } from 'ramda'
import { Button, Dropdown, Icon, Input } from '@components'
import AppActions from '~/actions/app'
import DevActions from '~/actions/develop'
import { LibraryTypes, ProgramTypes } from '~/services/config'
import { loading } from '~/services/util'
import './DuplicateModule.scss'

class DuplicateModule extends Component {
  constructor(props) {
    super(props)

    const hasTitle = includes(props.type, ['scorecards', 'careers', 'certifications'])
    let data = { ...props.data }
    if (hasTitle) {
      data.title = `Duplicate: ${props.data.title}`
    } else {
      data.name = `Duplicate: ${props.data.name}`
    }

    this.state = {
      data,
      hasTitle,
      submitted: false,
    }
  }

  handleChangeTitle = title => {
    const data = clone(this.state.data)
    const { hasTitle } = this.state
    if (hasTitle) {
      data.title = title
    } else {
      data.name = title
    }
    this.setState({ data })
  }

  handleChangeAuthor = e => {
    const data = clone(this.state.data)
    data.author_id = e[0]
    this.setState({ data })
  }

  handleSubmit = () => {
    const { data } = this.state
    const { type } = this.props

    let payload = null
    if (includes(type, ProgramTypes)) {
      payload = {
        type,
        data: {
          program: {
            ...data,
            id: null,
            published: 0,
          },
        },
      }
    } else if (type === 'scorecards') {
      payload = {
        type,
        data: {
          scorecard: {
            ...data,
            id: null,
            published: 0,
          },
        },
      }
    } else {
      payload = {
        type,
        data: {
          template: {
            ...data,
            id: null,
            published: 0,
          },
        },
      }
    }

    if (payload) {
      this.props.saveLibraryModule(payload)
    }
    this.setState({ submitted: true })
  }

  handleOpenLibraries = () => {
    const { type } = this.props
    const tags = {
      authors: [],
      categories: [],
      departments: [],
      competencies: [],
    }
    this.props.setFilters(tags, type, false)
    this.handleCloseModal()
  }

  handleCloseModal = () => {
    this.setState({ submitted: false })
    this.props.onClose && this.props.onClose()
  }

  render() {
    const { type, authors, success } = this.props
    const { data, hasTitle, submitted } = this.state

    return (
      <div className="duplicate-modal">
        {!(success && submitted) && (
          <div className="modal-header bg-primary text-white">
            <Icon name="fal fa-copy mr-2" color="white" size={17} />
            <span>{`Duplicate: ${LibraryTypes[type].label}`}</span>
          </div>
        )}
        <div className="modal-body">
          {success && submitted ? (
            <div className="d-flex">
              <div className="success-icon">
                <Icon name="far fa-check-circle" color="#27b012" size={20} />
              </div>
              <div className="w-100">
                <p className="dsl-b20 text-500">Success</p>
                <p className="dsl-b14 text-400">
                  You successfully duplicated a career. It is unpublished stance, do you want to see all unpublished
                  careers now?
                </p>
                <p className="dsl-m12">
                  You can do it later. To find unpublished careers in the library you need to turn on unpublished view
                  on the list page.
                </p>
                <div className="d-h-end">
                  <Button name="NO" type="link" onClick={this.handleCloseModal} />
                  <Button name="YES" type="medium" onClick={this.handleOpenLibraries} />
                </div>
              </div>
            </div>
          ) : (
            <>
              <Input
                className="mb-3"
                title="Title (keep it same or change)"
                placeholder="Type here..."
                direction="vertical"
                value={hasTitle ? data.title : data.name}
                onChange={this.handleChangeTitle}
              />
              <Dropdown
                title="Author"
                direction="vertical"
                width="fit-content"
                data={authors}
                getValue={e => e.name}
                onChange={this.handleChangeAuthor}
              />
              <div className="d-h-end w-100">
                <Button name="DUPLICATE" onClick={this.handleSubmit} />
              </div>
            </>
          )}
        </div>
      </div>
    )
  }
}

DuplicateModule.propTypes = {
  type: PropTypes.string,
  data: PropTypes.any,
  authors: PropTypes.array,
  success: PropTypes.bool,
  onClose: PropTypes.func,
  setFilters: PropTypes.func,
  saveLibraryModule: PropTypes.func,
}

DuplicateModule.defaultProps = {
  type: '',
  data: {},
  authors: [],
  success: false,
  onClose: () => {},
  setFilters: () => {},
  saveLibraryModule: () => {},
}

const mapStateToProps = state => ({
  success: loading(state.develop.status, 'pending-dls'),
})

const mapDispatchToProps = dispatch => ({
  saveLibraryModule: e => dispatch(DevActions.librarysaveRequest(e)),
  setFilters: (tags, mode, published) => dispatch(AppActions.advancedsearchRequest(tags, mode, published)),
})

export default connect(mapStateToProps, mapDispatchToProps)(DuplicateModule)

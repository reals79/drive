import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Modal, Row, Col } from 'react-bootstrap'
import { equals, clone, includes, length, without } from 'ramda'
import { Button, Icon } from '@components'
import AppActions from '~/actions/app'
import './AdvancedSearch.scss'

class AdvancedSearch extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      show: false,
      selectedOptions: props.selected,
      isSelectAll:
        equals(0, props.selected.authors.length) &&
        equals(0, props.selected.categories.length) &&
        equals(0, props.selected.departments.length) &&
        equals(0, props.selected.competencies.length),
    }
    this.hideModal = this.hideModal.bind(this)
    this.showModal = this.showModal.bind(this)
    this.handleApply = this.handleApply.bind(this)
    this.handleSelectItem = this.handleSelectItem.bind(this)
  }

  handleSelectItem(key, item) {
    const { selectedOptions } = this.state
    if (!includes(item.id, selectedOptions[key])) {
      const temp = clone(selectedOptions)
      temp[key].push(item.id)
      this.setState({ selectedOptions: temp, isSelectAll: false })
    } else {
      let temp = clone(selectedOptions)
      temp[key] = without([item.id], temp[key])
      if (
        length(temp.authors) === 0 &&
        length(temp.departments) === 0 &&
        length(temp.competencies) === 0 &&
        length(temp.categories) === 0
      ) {
        this.setState({
          isSelectAll: true,
          selectedOptions: {
            authors: [],
            departments: [],
            competencies: [],
            categories: [],
          },
        })
      } else {
        this.setState({ selectedOptions: temp, isSelectAll: false })
      }
    }
  }

  handleSelectAll() {
    this.setState({
      isSelectAll: true,
      selectedOptions: {
        authors: [],
        departments: [],
        competencies: [],
        categories: [],
      },
    })
  }

  handleApply() {
    this.props.setFilters(this.state.selectedOptions, this.props.mode, this.props.published)
    this.setState({ show: false })
  }

  hideModal() {
    this.setState({ show: false })
  }

  showModal() {
    const { selected } = this.props
    this.setState({
      show: true,
      selectedOptions: selected,
      isSelectAll:
        equals(0, selected.authors.length) &&
        equals(0, selected.categories.length) &&
        equals(0, selected.departments.length) &&
        equals(0, selected.competencies.length),
    })
  }

  render() {
    const { show } = this.state
    const { selectedOptions, isSelectAll } = this.state
    const { className, authors, categories, competencies, departments } = this.props

    return (
      <div className={className}>
        <span className="dsl-p14 cursor-pointer" onClick={this.showModal}>
          Advanced Search
        </span>
        <Modal className="app-modal advanced-search" show={show} onHide={this.hideModal}>
          <div className="modal-header">
            <Icon name="fal fa-search mr-2" color="white" size={14} />
            <span className="dsl-w14">Advanced Search</span>
          </div>
          <div className="modal-body">
            <Row className="mx-0 pb-0">
              <Col xs={6} md={3}>
                <div
                  className={`option-item ${isSelectAll ? 'active' : ''}`}
                  onClick={() => this.handleSelectAll()}
                >
                  Show All
                </div>
              </Col>
            </Row>
            <Row className="mx-0 pt-1">
              <Col xs={6} md={3} className="border-r">
                <div className="option-label">Author</div>
                {authors.map(author => (
                  <div
                    className={`option-item${
                      includes(author.id, selectedOptions.authors) ? ' active' : ''
                    }`}
                    key={author.id}
                    onClick={this.handleSelectItem.bind(this, 'authors', author)}
                  >
                    {author.name}
                  </div>
                ))}
              </Col>
              <Col xs={6} md={3} className="border-r">
                <div className="option-label">Department</div>
                {departments.map(department => (
                  <div
                    className={`option-item${
                      includes(department.id, selectedOptions.departments) ? ' active' : ''
                    }`}
                    key={department.id}
                    onClick={this.handleSelectItem.bind(this, 'departments', department)}
                  >
                    {department.name}
                  </div>
                ))}
              </Col>
              <Col xs={6} md={3} className="border-r">
                <div className="option-label">Competency</div>
                {competencies.map(competency => (
                  <div
                    className={`option-item${
                      includes(competency.id, selectedOptions.competencies) ? ' active' : ''
                    }`}
                    key={competency.id}
                    onClick={this.handleSelectItem.bind(this, 'competencies', competency)}
                  >
                    {competency.name}
                  </div>
                ))}
              </Col>
              <Col xs={6} md={3}>
                <div className="option-label">Category</div>
                {categories.map(category => (
                  <div
                    className={`option-item ${
                      includes(category.id, selectedOptions.categories) ? 'active' : ''
                    }`}
                    key={category.id}
                    onClick={this.handleSelectItem.bind(this, 'categories', category)}
                  >
                    {category.name}
                  </div>
                ))}
              </Col>
            </Row>
          </div>
          <div className="modal-footer">
            <Button name="APPLY" onClick={this.handleApply} />
          </div>
        </Modal>
      </div>
    )
  }
}

AdvancedSearch.propTypes = {
  mode: PropTypes.oneOf([
    'tracks',
    'courses',
    'modules',
    'careers',
    'certifications',
    'badges',
    'power points',
    'words',
    'pdf',
    'envelopes',
    'habits',
    'habitslist',
    'habits schedules',
    'quotas',
    'scorecards',
    'esign',
    'packets',
  ]),
  published: PropTypes.bool,
}

AdvancedSearch.defaultProps = {
  mode: 'tracks',
  published: false,
}

const mapStateToProps = state => ({
  type: state.app.modalType,
  data: state.app.modalData,
  callback: state.app.modalCallBack,
  authors: state.app.authors,
  categories: state.app.categories,
  competencies: state.app.competencies,
  departments: state.app.departments,
  selected: state.app.selectedTags,
})

const mapDispatchToProps = dispatch => ({
  setFilters: (tags, mode, published) =>
    dispatch(AppActions.advancedsearchRequest(tags, mode, published)),
})

export default connect(mapStateToProps, mapDispatchToProps)(AdvancedSearch)

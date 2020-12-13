import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { clone, equals, propEq, find, toLower, without } from 'ramda'
import classNames from 'classnames'
import { AdvancedSearch, Icon, Toggle } from '@components'
import AppActions from '~/actions/app'
import './LibraryStatus.scss'

class LibraryStatus extends React.Component {
  constructor(props) {
    super(props)

    this.handleDeselect = this.handleDeselect.bind(this)
    this.handleChangeToggle = this.handleChangeToggle.bind(this)
  }

  handleDeselect(type, id) {
    const selected = clone(this.props.selected)
    selected[`${type}`] = without([id], selected[`${type}`])
    this.props.setFilters(selected, toLower(this.props.type), this.props.published)
  }

  handleChangeToggle(checked) {
    const { selected, type } = this.props
    this.props.setFilters(selected, toLower(type), !checked)
  }

  render() {
    const {
      className,
      type,
      admin,
      counts,
      authors,
      categories,
      departments,
      competencies,
      selected,
      published,
      showCounts = true,
      showToggle,
      dataCy,
    } = this.props

    return (
      <div className={classNames('library-status', className)} data-cy={dataCy}>
        <div className="advanced-search pb-4">
          <AdvancedSearch mode={toLower(type)} published={published} />
        </div>
        {showCounts && (
          <p className="dsl-b16 text-500 text-capitalize">
            {type}: {counts}
          </p>
        )}
        <div className="d-flex justify-content-between">
          <div className="filters">
            {equals(0, selected.authors.length) &&
            equals(0, selected.categories.length) &&
            equals(0, selected.departments.length) &&
            equals(0, selected.competencies.length) ? (
              <div className="d-flex chip" key="ls-all">
                <span className="dsl-b14">Showing All</span>
                <Icon name="fal fa-times cursor-pointer ml-1" color="#343f4b" size={14} />
              </div>
            ) : (
              <>
                {selected.authors.map((item, index) => (
                  <div
                    className="d-flex chip"
                    key={`ls-${index}`}
                    onClick={this.handleDeselect.bind(this, 'authors', item)}
                  >
                    <span className="dsl-b14">{find(propEq('id', item), authors).name}</span>
                    <Icon name="fal fa-times cursor-pointer ml-1" color="#343f4b" size={14} />
                  </div>
                ))}
                {selected.categories.map((item, index) => (
                  <div
                    className="d-flex chip"
                    key={`ls-${index}`}
                    onClick={this.handleDeselect.bind(this, 'categories', item)}
                  >
                    <span className="dsl-b14">{find(propEq('id', item), categories).name}</span>
                    <Icon name="fal fa-times cursor-pointer ml-1" color="#343f4b" size={14} />
                  </div>
                ))}
                {selected.departments.map((item, index) => (
                  <div
                    className="d-flex chip"
                    key={`ls-${index}`}
                    onClick={this.handleDeselect.bind(this, 'departments', item)}
                  >
                    <span className="dsl-b14">{find(propEq('id', item), departments).name}</span>
                    <Icon name="fal fa-times cursor-pointer ml-1" color="#343f4b" size={14} />
                  </div>
                ))}
                {selected.competencies.map((item, index) => (
                  <div
                    className="d-flex chip"
                    key={`ls-${index}`}
                    onClick={this.handleDeselect.bind(this, 'competencies', item)}
                  >
                    <span className="dsl-b14">{find(propEq('id', item), competencies).name}</span>
                    <Icon name="fal fa-times cursor-pointer ml-1" color="#343f4b" size={14} />
                  </div>
                ))}
              </>
            )}
          </div>
          {admin && showToggle && (
            <div className="toggle-section">
              <Toggle
                reversed
                checked={!published}
                leftLabel="Published"
                rightLabel="Drafts"
                onChange={this.handleChangeToggle}
              />
            </div>
          )}
        </div>
      </div>
    )
  }
}

LibraryStatus.propTypes = {
  className: PropTypes.string,
  type: PropTypes.string,
  admin: PropTypes.bool,
  counts: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  selected: PropTypes.any,
  published: PropTypes.bool,
  showToggle: PropTypes.bool,
}

LibraryStatus.defaultProps = {
  className: '',
  type: 'Tracks',
  counts: 0,
  admin: false,
  authors: [],
  categories: [],
  departments: [],
  competencies: [],
  selected: {},
  published: true,
  showToggle: false,
}

const mapStateToProps = state => ({
  admin: state.app.app_role_id < 3,
  authors: state.app.authors,
  categories: state.app.categories,
  departments: state.app.departments,
  competencies: state.app.competencies,
  selected: state.app.selectedTags,
  published: state.app.published,
})

const mapDispatchToProps = dispatch => ({
  setFilters: (tags, mode, published) =>
    dispatch(AppActions.advancedsearchRequest(tags, mode, published)),
})

export default connect(mapStateToProps, mapDispatchToProps)(LibraryStatus)

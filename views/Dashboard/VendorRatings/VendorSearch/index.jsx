import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Row, Col } from 'react-bootstrap'
import { path } from 'ramda'
import {
  Button,
  Search,
  Tabs,
  VendorSearchBlogs,
  VendorSearchCompanies,
  VendorSearchForums,
  VendorSearchPeople,
  VendorSearchProducts,
  VendorSearchTraining,
} from '@components'
import VenAction from '~/actions/vendor'
import { InitialGlobalSearchResult } from '~/services/config'
import './VendorSearch.scss'

const tabs = [
  { name: 'all', label: 'All' },
  { name: 'people', label: 'People' },
  { name: 'companies', label: 'Companies' },
  { name: 'products', label: 'Products' },
  { name: 'training', label: 'Training' },
  { name: 'blogs', label: 'Blogs' },
  { name: 'forums', label: 'Forums' },
]

class VendorSearch extends Component {
  state = { search: '', tab: 'all' }

  componentDidMount() {
    if (path(['location', 'param', 'search'], this.props)) {
      const { search } = this.props.location.param
      this.setState({ search })
    } else {
      this.props.globalSearch({ data: { search: '' } })
    }
  }

  handleChangeSearch = e => {
    const search = e.target.value
    this.setState({ search })
  }

  handleSearch = () => {
    const { search } = this.state
    this.props.globalSearch({ data: { search } })
  }

  handleChangeTab = tab => {
    this.setState({ tab })
  }

  render() {
    const { tab } = this.state
    const { authors, searchResult } = this.props
    return (
      <div className="vendor-rating-search">
        <div className="vendor-rating-search-input mb-2">
          <p className="dsl-b20 bold">Search</p>
          <div className="d-h-start mb-3">
            <Search className="search-input" onChange={this.handleChangeSearch} />
            <Button type="medium" name="SEARCH" onClick={this.handleSearch} />
          </div>
          <Tabs className="search-tabs" active={tab} type="white" tabs={tabs} onTab={this.handleChangeTab} />
        </div>
        {tab === 'all' ? (
          <Row className="mx-0">
            <Col xs={8} className="vendor-rating-search-results">
              <p className="dsl-b20 bold">Search Results</p>
              <VendorSearchPeople data={searchResult.peoples} onSeeAll={() => this.handleChangeTab('people')} />
              <VendorSearchProducts data={searchResult.products} onSeeAll={() => this.handleChangeTab('products')} />
              <VendorSearchTraining
                authors={authors}
                data={[...searchResult.tracks, ...searchResult.courses, ...searchResult.modules]}
                onSeeAll={() => this.handleChangeTab('training')}
              />
              <VendorSearchBlogs data={searchResult.blogs} onSeeAll={() => this.handleChangeTab('blogs')} />
              <VendorSearchForums data={searchResult.forums} onSeeAll={() => this.handleChangeTab('forums')} />
            </Col>
            <Col xs={4} className="pr-0 pl-2">
              <div className="vendor-rating-search-companies">
                <VendorSearchCompanies
                  data={searchResult.companies}
                  onSeeAll={() => this.handleChangeTab('companies')}
                />
              </div>
            </Col>
          </Row>
        ) : (
          <div className="vendor-rating-search-results">
            {tab === 'people' && <VendorSearchPeople data={searchResult.peoples} type="full" />}
            {tab === 'companies' && <VendorSearchCompanies data={searchResult.companies} type="full" />}
            {tab === 'products' && <VendorSearchProducts data={searchResult.products} type="full" />}
            {tab === 'training' && (
              <VendorSearchTraining
                authors={authors}
                data={[...searchResult.tracks, ...searchResult.courses, ...searchResult.modules]}
                type="full"
              />
            )}
            {tab === 'blogs' && <VendorSearchBlogs data={searchResult.blogs} type="full" />}
            {tab === 'forums' && <VendorSearchForums data={searchResult.forums} type="full" />}
          </div>
        )}
      </div>
    )
  }
}

VendorSearch.propTypes = {
  authors: PropTypes.array,
  searchResult: PropTypes.any,
}

VendorSearch.defaultProps = {
  authors: [],
  searchResult: InitialGlobalSearchResult,
}

const mapStateToProps = state => ({
  userId: state.app.id,
  authors: state.app.authors,
  searchResult: state.vendor.globalSearchResult,
})

const mapDispatchToProps = dispatch => ({
  globalSearch: e => dispatch(VenAction.globalsearchRequest(e)),
})

export default connect(mapStateToProps, mapDispatchToProps)(VendorSearch)

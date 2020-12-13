import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Row, Col } from 'react-bootstrap'
import { concat, equals, isEmpty, keys, prop, toUpper, toLower, uniqBy, length } from 'ramda'
import { AutoComplete, Avatar, Button, Dropdown, Icon, Rating, Pagination } from '@components'
import CompanyActions from '~/actions/company'
import VenAction from '~/actions/vendor'
import { convertUrl, inPage } from '~/services/util'
import './ByCompany.scss'

class ByCompany extends Component {
  state = {
    vendors: [],
    companies: null,
    vendorAlphaList: [],
    search: null,
    selected: null,
    currentComp: 1,
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { vendorCompaniesAlphabet } = nextProps
    const { companies } = prevState
    if (vendorCompaniesAlphabet && !equals(vendorCompaniesAlphabet, companies)) {
      let vendors = []
      const vendorAlphaList = keys(vendorCompaniesAlphabet).map((alphaKey, index) => {
        const items = vendorCompaniesAlphabet[alphaKey].map(({ id, name }) => ({ id, name, alphaKey }))
        vendors = concat(vendors, items)
        return { id: index, name: toUpper(alphaKey), count: vendorCompaniesAlphabet[alphaKey].length }
      })
      vendors = uniqBy(prop('id'), vendors)
      return { vendors, vendorAlphaList, companies: vendorCompaniesAlphabet, selected: vendorAlphaList[0] }
    }
    return null
  }

  componentDidMount() {
    this.props.getCompanies({ sort: 'alphabet' })
  }

  handleClickLetter = selected => () => {
    this.setState({ selected })
    this.setState({ currentComp: 1 })
  }

  handleSearchVendor = search => {
    this.setState({ search })
    if (this.props.authenticated) {
      this.props.getCompanies({ sort: 'alphabet', payload: { letter: search.name } })
    }
  }

  handleSelectLetter = e => {
    const selected = e[0]
    this.setState({ selected })
  }

  handleOpenCompany = vr => () => {
    const payload = { id: vr?.business_id }
    const route = `/company/${vr?.business_id}/about`
    this.props.openCompanyView(payload, route)
  }

  handleOpenRate = vr => () => {
    const after = {
      type: 'MODAL_REQUEST',
      payload: {
        type: 'Rate Vendor',
        data: { before: { company: vr?.id, category: null, product: null }, after: null },
        callBack: null,
      },
    }
    this.props.getCompanies({ payload: { per_page: 1000 }, after })
    this.props.getCategories({ isCategory: true })
  }

  render() {
    const { companies, vendors, vendorAlphaList, selected, currentComp } = this.state

    return (
      <div className="vendor-rating-company">
        <div className="d-h-start mb-3">
          <Button
            type="link"
            className="btn-vendor-ratings"
            name="Vendor Ratings"
            onClick={() => this.props.history.push(`/vendor-ratings/home`)}
          />
          <p className="dsl-m14 mb-0">
            <Icon name="far fa-chevron-right mx-2" size={12} color="#969faa" />
            By Company
          </p>
        </div>
        <div className="vendor-company-search">
          <p className="dsl-b22 bold">Search for a Vendor</p>
          <div className="d-h-between w-50">
            <AutoComplete
              placeholder="Search here..."
              className="w-100"
              type="vendor"
              options={vendors}
              onSearch={this.handleSearchVendor}
            />
            <p className="dsl-p14 ml-3 mb-0 text-400 btn-search">Search</p>
          </div>
        </div>
        <Row className="mx-0 mt-2">
          <Col xs={2} className="p-0 pr-2">
            <div className="vendor-company-alpha-list w-100 h-100 box-detail">
              <p className="dsl-b18 bold">A-Z</p>
              {vendorAlphaList.map(item => (
                <div
                  key={item.id}
                  className="d-h-start py-3 cursor-pointer border-bottom"
                  onClick={this.handleClickLetter(item)}
                >
                  <p className="dsl-b16 bold mb-0">{item.name === 'NO' ? '#' : item.name}</p>
                  <p className="dsl-m12 ml-2 mb-0">{`(${item.count})`}</p>
                </div>
              ))}
            </div>
          </Col>
          <Col xs={10} className="vendor-company-list">
            <div className="d-h-between py-2">
              <p className="dsl-b18 bold mb-0">Vendors List</p>
              <Dropdown
                title="Select letter: "
                data={vendorAlphaList}
                width={'auto'}
                align="right"
                placeholder="Select"
                defaultIds={[0]}
                returnBy="data"
                getValue={data => (data['name'] === 'NO' ? '#' : data['name'])}
                onChange={this.handleSelectLetter}
              />
            </div>
            {selected && (
              <>
                <div className="d-h-start py-2">
                  <p className="dsl-b18 bold mb-0">{selected.name === 'NO' ? '#' : selected.name}</p>
                  <p className="dsl-m12 ml-1 mb-0">({selected.count})</p>
                </div>
                {companies[toLower(selected.name)].map((vendor, index) => {
                  const { name, parent } = vendor
                  const rating_recommended_avg = vendor.stats?.rating_recommended_avg
                  const rating_recommended_count = vendor.stats?.rating_recommended_count
                  const { contact, description } = vendor.data
                  const logo = convertUrl(vendor.logo, '/images/default_company.svg')
                  if (inPage(index, currentComp, 15))
                    return (
                      <Row key={vendor.id} className="mx-0 py-3 vendor-bottom-border">
                        <Col xs={10} className="cursor-pointer pl-0 py-3" onClick={this.handleOpenCompany(vendor)}>
                          <div className="d-flex justify-content-between">
                            <Avatar
                              url={logo}
                              className="avatar-small"
                              size="large"
                              type="logo"
                              borderWidth={0}
                              backgroundColor="#f6f7f8"
                            />
                            <div className="pl-3 w-100">
                              <p className="dsl-b16 text-500 mb-2">{name}</p>
                              <div className="d-h-start mb-3">
                                <Rating className="mr-3" score={Number(rating_recommended_avg)} />
                                <p className="dsl-b14 mb-0">{rating_recommended_count}% recommended</p>
                              </div>
                              <p className="dsl-m14 mb-0 truncate-two">{description}</p>
                            </div>
                          </div>
                        </Col>
                        <Col xs={2} className="contact-detail p-0">
                          <div className="d-flex flex-column align-items-end">
                            {parent ? (
                              <p className="dsl-p14 mb-1">{parent.name}</p>
                            ) : (
                              <p className="dsl-p14 mb-1">Company</p>
                            )}
                            {contact && !isEmpty(contact.phone) ? (
                              <p className="dsl-m14 mb-1">{contact.phone}</p>
                            ) : (
                              <p className="dsl-m14 mb-1">Phone not provided</p>
                            )}
                          </div>
                          <div className="d-flex flex-column align-items-center">
                            <Button type="link" name="RATE IT" onClick={this.handleOpenRate(vendor)} />
                            {vendor.logo && contact && !isEmpty(contact.phone) ? (
                              <Button type="medium" name="SPECIAL QUOTE" />
                            ) : (
                              <div className="py-3" />
                            )}
                          </div>
                        </Col>
                      </Row>
                    )
                })}
              </>
            )}
            {selected && companies[toLower(selected.name)].length >= 15 && (
              <Pagination
                current={currentComp}
                perPage={15}
                total={Math.ceil(length(companies[toLower(selected.name)]) / 15)}
                onChange={e => this.setState({ currentComp: e })}
              />
            )}
          </Col>
        </Row>
      </div>
    )
  }
}

ByCompany.propTypes = {
  vendorCompaniesAlphabet: PropTypes.any,
  getCategories: PropTypes.func,
  getCompanies: PropTypes.func,
  openCompanyView: PropTypes.func,
}

ByCompany.defaultProps = {
  vendorCompaniesAlphabet: {},
  getCategories: () => {},
  getCompanies: () => {},
  openCompanyView: () => {},
}

const mapStateToProps = state => ({
  authenticated: !isEmpty(state.app.token),
  vendorCompaniesAlphabet: state.vendor.vendorCompaniesAlphabet,
})

const mapDispatchToProps = dispatch => ({
  getCategories: e => dispatch(VenAction.getcategoriesRequest(e)),
  getCompanies: e => dispatch(VenAction.getvendorcompaniesRequest(e)),
  openCompanyView: (payload, route) => dispatch(CompanyActions.getbusinessRequest(payload, route)),
})

export default connect(mapStateToProps, mapDispatchToProps)(ByCompany)

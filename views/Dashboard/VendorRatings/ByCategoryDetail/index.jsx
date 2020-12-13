import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Row, Col, Image } from 'react-bootstrap'
import { toast } from 'react-toastify'
import { extendMoment } from 'moment-range'
import originalMoment from 'moment'
import { find, isNil, propEq, filter, concat } from 'ramda'
import { Button, DatePicker, Icon, Pagination, Rating, Thumbnail } from '@components'
import AppActions from '~/actions/app'
import CompanyActions from '~/actions/company'
import VenAction from '~/actions/vendor'
import './ByCategoryDetail.scss'

const moment = extendMoment(originalMoment)

class ByCategoryDetail extends Component {
  state = {
    categoryId: Number(this.props.match.params.id),
    category: null,
    startDate: moment()
      .subtract(2, 'years')
      .format('YYYY-MM-DD'),
    endDate: moment().format('YYYY-MM-DD'),
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { categoryId, startDate, endDate } = prevState
    const { categories, getDetail } = nextProps
    const category = find(propEq('id', categoryId), categories)
    if (category && !category.products) {
      getDetail({ categoryId, payload: { per_page: 25, page: 1, date_start: startDate, date_end: endDate } })
    }
    return { category }
  }

  getCategoryProducts = (per_page, page, date_start, date_end) => {
    const { categoryId } = this.state
    this.props.getDetail({ categoryId, payload: { per_page, page, date_start, date_end } })
  }

  handleChangePage = page => {
    const { category, startDate, endDate } = this.state
    const { products } = category
    this.getCategoryProducts(products.per_page, page, startDate, endDate)
  }

  handleChangePer = perPage => {
    const { category, startDate, endDate } = this.state
    const { products } = category
    this.getCategoryProducts(perPage, products?.current_page || 1, startDate, endDate)
  }

  handleOpenDetail = product => () => {
    const { category } = this.state
    const { parent } = product
    if (parent.business_id) {
      const payload = { id: parent.business_id }
      const route = `/company/${parent.business_id}/products?category=${category.id}`
      this.props.getBusiness(payload, route)
      this.props.getPopular({ category_id: category.id })
    } else {
      toast.error('This product does not have business yet. Please reach out to Brandon!', {
        position: toast.POSITION.TOP_CENTER,
        pauseOnFocusLoss: false,
        hideProgressBar: true,
      })
    }
  }

  handleRateProduct = product => () => {
    const { category } = this.state
    this.props.toggleModal({
      type: 'Rate Vendor',
      data: { before: { product, categoryId: category.id }, after: null },
      callBack: null,
    })
  }

  handleDateChange = e => {
    const startDate = e.start.format('YYYY-MM-DD')
    const endDate = e.end.format('YYYY-MM-DD')
    const { products } = this.state.category
    this.setState({ startDate, endDate })
    this.getCategoryProducts(products?.per_page || 25, products?.current_page || 1, startDate, endDate)
  }

  render() {
    const { category, startDate, endDate } = this.state
    if (isNil(category)) return null
    const { name, description, products } = category
    const premium = filter(x => x.data?.sponsored_level === 'gold', products?.data || [])
    const plus = filter(x => x.data?.sponsored_level === 'silver', products?.data || [])
    const featured = concat(premium, plus)
    const standard = filter(
      x => x.data?.sponsored_level !== 'gold' && x.data?.sponsored_level !== 'silver',
      products?.data || []
    )

    return (
      <div className="vendor-rating-category-detail">
        <div className="d-h-between mb-2">
          <div className="d-flex align-items-center">
            <Button
              type="link"
              className="btn-vendor-ratings"
              name="Vendor Ratings"
              onClick={() => this.props.history.push(`/vendor-ratings/home`)}
            />
            <Button
              type="link"
              className="btn-vendor-ratings"
              name=" - By Category"
              onClick={() => this.props.history.goBack()}
            />
            <p className="dsl-m14 mb-0">{` - ${name}`}</p>
          </div>
          <Button type="link" className="btn-vendor-ratings" onClick={() => this.props.history.goBack()}>
            <div className="d-flex align-items-center">
              <Icon name="far fa-arrow-left mr-2" color="#376caf" size={14} />
              <p className="dsl-p14 mb-0">Back to all the categories</p>
            </div>
          </Button>
        </div>
        <Row className="m-0">
          <Col xs={7} className="category-detail">
            <div className="category-detail-contents">
              <p className="dsl-b18 bold">{name}</p>
              <p className="dsl-b14">{description}</p>
            </div>
          </Col>
          <Col xs={5} className="category-logo">
            <Image src="/images/DSA_logo.png" className="w-100" />
          </Col>
        </Row>
        <div className="d-h-end p-3">
          <DatePicker
            calendar="range"
            append="caret"
            format="MMM D"
            as="span"
            align="right"
            mountEvent
            closeAfterSelect
            value={moment.range(startDate, endDate)}
            onSelect={this.handleDateChange}
          />
        </div>
        {featured && (
          <div className="featured-list mt-2">
            <div className="featured-list-title">
              <p className="dsl-b18 bold mb-1">Featured Listings</p>
            </div>
            {featured.map((product, index) => {
              const { name, logo, stats, data, parent } = product
              const { description } = data
              const contact = parent?.data?.contact || {}
              return (
                <div className="featured-list-product" key={`featured-list-${index}`}>
                  <Row className="border-bottom mx-0 py-3">
                    <Col xs={2} className="d-h-center px-0">
                      <Image src={logo} />
                    </Col>
                    <Col xs={10} className="d-flex pr-0">
                      <div className="w-100" onClick={this.handleOpenDetail(product)}>
                        <p className="dsl-b16 mb-1">{name}</p>
                        <div className="d-h-start py-2">
                          <Rating score={Math.round(Number(stats?.rating_avg) * 100) / 100} className="mr-2" />
                          <p className="dsl-b14 mb-0 mr-3">{`${Math.round(stats?.rating_recommended_avg * 100) /
                            100}% recommended`}</p>
                          <p className="dsl-b14 mb-0">{`${stats?.rating_count} ratings`}</p>
                        </div>
                        <p className="dsl-b14 truncate-four half-spacing mb-1">{description}</p>
                        {product?.media && (
                          <Row className="mx-0">
                            {product.media.map(item => (
                              <Col key={item.id} className="pl-0" xs={6} sm={3} md={2}>
                                <Thumbnail src={item.data?.file_path} size="responsive" />
                              </Col>
                            ))}
                          </Row>
                        )}
                      </div>
                      <div className="company-contacts">
                        <div className="mb-3">
                          <p className="dsl-p14 text-right mb-2">{parent?.name || ''}</p>
                          <p className="dsl-b14 text-right mb-2">{contact?.phone}</p>
                        </div>
                        <div className="d-flex flex-column align-items-end">
                          <Button
                            type="link"
                            name="RATE IT"
                            className="btn-company-contact"
                            onClick={this.handleRateProduct(product)}
                          />
                          <Button className="btn-company-contact" name="SPECIAL QUOTE" />
                        </div>
                      </div>
                    </Col>
                  </Row>
                </div>
              )
            })}
          </div>
        )}
        {standard && (
          <div className="featured-list mt-2">
            <div className="featured-list-title">
              <p className="dsl-b18 bold mb-1">Standard Listings</p>
            </div>
            {standard.map((product, index) => {
              const { name, logo, stats, data, parent } = product
              const { description } = data
              const contact = parent?.data?.contact || {}
              return (
                <div className="featured-list-product" key={`featured-list-${index}`}>
                  <Row className="border-bottom mx-0 py-3">
                    <Col xs={2} className="d-h-center px-0">
                      <Image src={logo} />
                    </Col>
                    <Col xs={10} className="d-flex pr-0">
                      <div className="w-100" onClick={this.handleOpenDetail(product)}>
                        <p className="dsl-b16 mb-1">{name}</p>
                        <div className="d-h-start py-2">
                          <Rating score={Math.round(Number(stats?.rating_avg) * 100) / 100} className="mr-2" />
                          <p className="dsl-b14 mb-0 mr-3">{`${Math.round(stats?.rating_recommended_avg * 100) /
                            100}% recommended`}</p>
                          <p className="dsl-b14 mb-0">{`${stats?.rating_count} ratings`}</p>
                        </div>
                        <p className="dsl-b14 truncate-four half-spacing mb-1">{description}</p>
                      </div>
                      <div className="company-contacts">
                        <div className="mb-3">
                          <p className="dsl-p14 text-right mb-2">{parent?.name || ''}</p>
                          <p className="dsl-b14 text-right mb-2">{contact?.phone}</p>
                        </div>
                        <div className="d-flex flex-column align-items-end">
                          <Button
                            type="link"
                            name="RATE IT"
                            className="btn-company-contact"
                            onClick={this.handleRateProduct(product)}
                          />
                          <Button className="btn-company-contact" name="SPECIAL QUOTE" />
                        </div>
                      </div>
                    </Col>
                  </Row>
                </div>
              )
            })}
          </div>
        )}
        {products && (
          <Pagination
            per={products.per_page}
            current={products.page}
            total={products.last_page}
            onChange={this.handleChangePage}
            onPer={this.handleChangePer}
          />
        )}
      </div>
    )
  }
}

ByCategoryDetail.propTypes = {
  userId: PropTypes.number,
  categories: PropTypes.array,
  getDetail: PropTypes.func,
  getCompanyDetail: PropTypes.func,
  toggleModal: PropTypes.func,
}

ByCategoryDetail.defaultProps = {
  userId: 0,
  categories: [],
  getDetail: () => {},
  getCompanyDetail: () => {},
  toggleModal: () => {},
}

const mapStateToProps = state => ({
  userId: state.app.id,
  categories: state.vendor.categories.all,
})

const mapDispatchToProps = dispatch => ({
  getDetail: e => dispatch(VenAction.getcategoryproductsRequest(e)),
  getCompanyDetail: e => dispatch(VenAction.getvendorcompanyRequest(e)),
  getBusiness: (payload, route) => dispatch(CompanyActions.getbusinessRequest(payload, route)),
  getPopular: e => dispatch(VenAction.getcategorypopularproductsRequest(e)),
  toggleModal: e => dispatch(AppActions.modalRequest(e)),
})

export default connect(mapStateToProps, mapDispatchToProps)(ByCategoryDetail)

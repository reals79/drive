import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { find, propEq, filter, sortWith, descend, isNil, type } from 'ramda'
import { Col, Image, Row } from 'react-bootstrap'
import Slider from 'react-slick'
import { Button, Dropdown, Icon, Rating } from '@components'
import { history } from '~/reducers'
import AppActions from '~/actions/app'
import VenAction from '~/actions/vendor'
import { convertUrl } from '~/services/util'
import Product from './Products/PopularProduct'

const VENDORS = [{ name: ' ' }]
const vendorWorks = [
  {
    icon: 'fal fa-star',
    info: 'Rate your vendors with honest feedback. We don’t publish your identity.',
  },
  {
    icon: 'fal fa-user-headset',
    info: 'Our review team calls your store and verifies every review before it is published.',
  },
  {
    icon: 'fal fa-search',
    info: 'Search for vendors by category or by category and get unbiased feedback for every decision.',
  },
]

class Plus extends React.Component {
  state = {
    vendor: null,
    companyId: 188333,
    products: [],
    showProducts: 8,
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { categories } = nextProps
    const { all } = categories
    let products = []
    all.forEach(item => {
      if (item.popular) {
        if (item.popular.data) {
          const product = item.popular.data
          product.forEach(item => {
            products.push(item)
          })
        }
      }
    })
    products = filter(x => x.parent_id, products)
    products = sortWith([descend(x => x.parent.stats.rating_count)], products)
    return { products }
  }

  componentDidMount() {
    this.props.getCategories()
  }

  handleRateProduct = () => {
    const { vendor } = this.state
    const { categories } = this.props
    const { all } = categories
    const category = find(propEq('id', vendor[0]), all)

    this.props.toggleModal({
      type: 'Rate Vendor',
      data: { before: { product: category.popular.data[0], categoryId: category.id }, after: null },
      callBack: null,
    })
  }

  handleOpenCategoryDetail = item => event => {
    event.preventDefault()
    this.props.getDetail({
      categoryId: item.id,
      payload: { per_page: 25 },
      route: `/vendor-ratings/by-category/${item.id}`,
    })
  }

  render() {
    const { companyId, products, showProducts, vendor } = this.state
    const { companies, categories } = this.props
    const { all, popular } = categories
    const company = find(propEq('id', companyId), companies)
    const settings = {
      infinite: true,
      slidesToShow: 5,
      slidesToScroll: 5,
      rows: 2,
      arrows: false,
    }
    return (
      <div className="vendor-home">
        <p className="dsl-m14">Vendor Ratings</p>
        <div className="categories">
          <div className="inner-content">
            <p className="dsl-w22 text-400">Vendor Ratings</p>
            <p className="dsl-w16 mb-1">Find the right dealership vendor for your store,</p>
            <p className="dsl-w16">based on over 40,000 verified dealer reviews.</p>
            <div className="d-flex">
              <Button type="medium" name="BY CATEGORY" onClick={() => history.push('/vendor-ratings/by-category')} />
              <Button type="medium" name="BY COMPANY" onClick={() => history.push('/vendor-ratings/by-company')} />
              <Button type="medium" name="SEARCH" onClick={() => history.push('/vendor-ratings/search')} />
            </div>
            <p className="dsl-w16 mt-4 mb-0">Rate Vendor</p>
          </div>
        </div>

        <div className="d-flex justify-content-between align-items-end mb-4">
          <span className="dsl-b22 text-400 mt-4">Popular Categories</span>
          <span className="dsl-b16 cursor-pointer" onClick={() => this.slider.slickNext()}>
            {`Scroll for more >>`}
          </span>
        </div>
        <Slider ref={slider => (this.slider = slider)} {...settings}>
          {popular.map((item, index) => {
            const category = find(propEq('id', item.id), all)
            const products = category && category.popular ? category.popular.total : 0
            const reviews = parseInt(item.data.ratings.avg_rating_count)
            return (
              <div
                className="card popular-category cursor-pointer"
                onClick={this.handleOpenCategoryDetail(item)}
                key={`popular-category-${item.id}`}
              >
                <p className="dsl-b14 bold">{`${item.name}`}</p>
                <p className="dsl-m14 mb-0">{`${products} Products`}</p>
                <p className="dsl-m14 mb-0">{`${reviews} Reviews`}</p>
              </div>
            )
          })}
        </Slider>
        <div className="how-vendor mt-3">
          <div className="inner-content">
            <p className="dsl-w22 bold">How Vendor Ratings Works</p>
            <Row className="d-center mb-4">
              {vendorWorks.map((item, index) => {
                return (
                  <Col xs={3} className="item" key={`vendor-work-${index}`}>
                    <div className="circle mb-2">
                      <Icon name={item.icon} size={30} color="#fff" />
                    </div>
                    <div className="text-center">
                      <p className="dsl-w16 mb-2">{item.info}</p>
                    </div>
                  </Col>
                )
              })}
            </Row>

            <div className="d-flex">
              <Button type="medium" name="MORE INFO" />
              <Button className="add-vendor" type="medium" name="ADD VENDOR" />
            </div>
          </div>
        </div>

        <div className="dealer-satisfaction mt-3">
          <div className="inner-content">
            <Image src="/images/DSA_logo_small.png" />
            <p className="dsl-w22 bold my-3">Dealer Satisfaction Awards</p>
            <p className="dsl-w16 mb-2 desc">
              Each year we honor those companies who have the highest verified dealership satisfaction.
            </p>
            <Button
              className="read-more mt-3"
              type="medium"
              name="READ MORE"
              onClick={() => history.push('/vendor-ratings/by-category')}
            />
          </div>
        </div>

        <div className="card mt-3">
          <div className="d-flex justify-content-between mb-4">
            <span className="dsl-b22 bold">Popular Products</span>
            <span className="dsl-b16">{`Scroll for more >>`}</span>
          </div>
          <div className="d-flex">
            <Row className="p-3 mx-0">
              {products.map((product, index) => {
                if (index < showProducts) {
                  const url = convertUrl(product.logo, '/images/default_company.svg')
                  const score = parseFloat(product.parent?.stats?.rating_avg)
                  const rating = parseFloat(product.parent?.stats?.rating_recommended_avg)
                  return (
                    <Col xs={3} key={product.id} className="mb-3">
                      <Product
                        logo={url}
                        title={product.name}
                        score={Number(score).toFixed(1)}
                        recommendation={Number(rating).toFixed(1)}
                      />
                    </Col>
                  )
                }
              })}
            </Row>
          </div>
          <div className="d-flex justify-content-end">
            <Button className="mt-3" type="medium" name="SEE ALL" />
          </div>
        </div>

        <div className="rate-vendor mt-3">
          <div className="inner-content">
            <p className="dsl-w22 text-400">Rate a Vendor</p>
            <Dropdown
              data={all}
              width={200}
              placeholder="Select a Vendor"
              getValue={data => data['name']}
              onChange={e => this.setState({ vendor: e })}
            />
            <Rating className="mt-3" score={0} empty="fal fa-star color-white" full="fas fa-star color-white" />
            <Button className="rate-btn mt-3" type="medium" name="RATE IT" onClick={this.handleRateProduct} />
            <p className="dsl-w16 mt-4 mb-2">Didn't find what you were looking for?</p>
            <div className="d-flex">
              <span className="dsl-w16 bold">Add Company</span>
              <span className="dsl-w16 mx-3">or</span>
              <span className="dsl-w16 bold">Add Product</span>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

Plus.propTypes = {
  categories: PropTypes.shape({
    all: PropTypes.array,
    popular: PropTypes.array,
  }),
  companies: PropTypes.array,
}

Plus.defaultProps = {
  categories: {
    all: [],
    popular: [],
  },
  companies: [],
  getCategories: () => {},
  toggleModal: () => {},
}

const mapStateToProps = state => ({
  categories: state.vendor.categories,
  companies: state.vendor.companies,
  vendorCompanies: state.vendor.vendorCompanies,
})

const mapDispatchToProps = dispatch => ({
  getCategories: () => dispatch(VenAction.getcategoriesRequest()),
  getDetail: e => dispatch(VenAction.getcategoryproductsRequest(e)),
  toggleModal: e => dispatch(AppActions.modalRequest(e)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Plus)

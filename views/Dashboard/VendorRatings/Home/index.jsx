import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { ascend, clone, descend, filter, find, isEmpty, propEq, sortWith } from 'ramda'
import { Col, Image, Row, Tab, Tabs } from 'react-bootstrap'
import Slider from 'react-slick'
import { Button, Dropdown, Icon, Rating } from '@components'
import AppActions from '~/actions/app'
import VenAction from '~/actions/vendor'
import { history } from '~/reducers'
import { convertUrl } from '~/services/util'
import { RATING_STATUS } from '~/services/constants'
import Product from './PopularProduct'
import './Home.scss'

const vendorWorks = [
  {
    icon: 'fal fa-star',
    info: 'Dealers rate and reviews the products they use.',
  },
  {
    icon: 'fal fa-user-headset',
    info: 'Each review is verified by phone before being published',
  },
  {
    icon: 'fal fa-search',
    info: 'Verified ratings and feedback guide you to the right vendor.',
  },
]

const icon = [
  'fal fa-business-time',
  'fal fa-tools',
  'fal fa-user-tie',
  'fal fa-file-alt',
  'fal fa-phone-office',
  'fal fa-garage-open',
  'fal fa-store',
  'fal fa-users-medical',
]

class Home extends React.Component {
  state = {
    vendor: null,
    products: [],
    showProducts: 8,
    rating: 0,
    companyName: [],
    companyId: '',
    productId: '',
    recommend: 0,
    activeTab: 'company',
    productList: [],
    selectedCompany: [null],
    selectedCategory: [null],
    selectedProduct: [null],
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
    this.props.getRecents()
    this.props.getCompanies({ payload: { per_page: 1000 } })
  }

  handleRateProduct = () => {}

  handleVendor = e => {
    const { categories } = this.props
    const { all } = categories
    const category = find(propEq('id', e[0]), all)
    this.props.getDetail({ categoryId: e[0], payload: { per_page: 25 } })
    const product = category.popular.data[0]
    const { parent } = product
    this.setState({ companyName: parent, vendor: e })
  }

  handleOpenCategoryDetail = item => event => {
    event.preventDefault()
    this.props.getDetail({
      categoryId: item.id,
      payload: { per_page: 25 },
      route: `/vendor-ratings/by-category/${item.id}`,
    })
  }

  handleTab = tab => {
    this.setState({ activeTab: tab })
  }

  handleAddProduct = from => () => {
    this.props.toggleModal({
      type: 'Add Product',
      data: { before: { from }, after: null },
      callBack: null,
    })
  }

  handleChangeRate = rating => {
    this.setState({ rating })
  }

  handleChangeRecommend = recommend => {
    this.setState({ recommend })
  }

  handleSelectCategoryCallback = e => {
    this.setState({ productList: e?.data })
  }

  handleChangeDropdown = type => e => {
    if (type === 'company') {
      const { companies } = this.props
      const selectedDetail = find(propEq('id', e[0]), companies)
      this.setState({ selectedCompany: e, productList: selectedDetail?.products || [] })
    }
    if (type === 'category') {
      this.setState({ selectedCategory: e })
      this.props.getDetail({
        categoryId: e[0],
        payload: {},
        callback: this.handleSelectCategoryCallback,
      })
    }
    if (type === 'product') {
      this.setState({ selectedProduct: e })
    }
  }

  handleChangeRate = e => {
    this.setState({ rating: e })
  }

  handleChangeRecommend = e => {
    this.setState({ recommend: e })
  }

  handleOpenRateVendor = () => {
    const { activeTab, selectedCategory, selectedCompany, selectedProduct } = this.state
    this.props.toggleModal({
      type: 'Rate Vendor',
      data: {
        before: {
          tab: activeTab,
          company: selectedCompany[0],
          category: selectedCategory[0],
          product: selectedProduct[0],
        },
        after: null,
      },
      callBack: null,
    })
  }

  render() {
    const {
      showProducts,
      vendor,
      rating,
      companyName,
      recommend,
      activeTab,
      productList,
      selectedCompany,
      selectedCategory,
      selectedProduct,
    } = this.state
    const { authenticated, categories, companies, recentProducts } = this.props
    const { all, popular } = categories

    const popularCategories = sortWith([ascend(x => x.name)], popular)

    const RecommendSymbol = [...Array(10)].map((item, idx) => {
      let styleClass = `rate-vendor-recommend-rate`
      if (idx + 1 === recommend) styleClass = `active ${styleClass}`
      return (
        <div key={`rating-${idx}`} className={styleClass}>
          {idx + 1}
        </div>
      )
    })

    return (
      <div className="vendor-home">
        <div className="categories">
          <div className="inner-content">
            <p className="dsl-w22">Vendor Ratings</p>
            <p className="dsl-w28 mb-5">How progressive dealers select vendors</p>
            <div className="d-flex">
              <Button type="medium" name="By Category" onClick={() => history.push('/vendor-ratings/by-category')} />
              <Button type="medium" name="By Company" onClick={() => history.push('/vendor-ratings/by-company')} />
              <Button type="medium" name="Search" onClick={() => history.push('/vendor-ratings/search')} />
            </div>
          </div>
        </div>
        <div className="popular-categories my-5">
          <div className="d-flex justify-content-center">
            <span className="dsl-b28 text-400 mt-4 title-color">Popular Categories</span>
          </div>
          <Row className="items py-4 px-5">
            {popularCategories.map((item, index) => {
              const category = find(propEq('id', item.id), all)
              const products = category?.popular?.total || 0
              const reviews = parseInt(item.data.ratings.avg_rating_count)
              return (
                index <= 7 && (
                  <Col
                    className="text-center contents py-4"
                    xs={6}
                    sm={4}
                    md={3}
                    onClick={this.handleOpenCategoryDetail(item)}
                    key={`popular-category-${item.id}`}
                  >
                    <Icon name={icon[index]} color="#8c8c8c" size={22} />
                    <p className="dsl-b14 text-400 mb-2 popular-category-title">{`${item.name}`}</p>
                    <p className="dsl-m12 mb-0">
                      {`${products} Products`}/{`${reviews} Reviews`}
                    </p>
                  </Col>
                )
              )
            })}
          </Row>
          <div className="d-flex justify-content-center cate-btn pb-4">
            <Button
              name="All Categories"
              className="btn-cate"
              onClick={() => {
                history.push('/vendor-ratings/by-category')
              }}
            />
          </div>
        </div>
        <div className="how-vendor py-5">
          <div className="inner-content py-4">
            <p className="dsl-w22">How Vendor Ratings Works</p>
            <Row className="d-center mb-4">
              {vendorWorks.map((item, index) => {
                return (
                  <Col xs={12} sm={3} className="item" key={`vendor-work-${index}`}>
                    <div className="circle mb-3">
                      <Icon name={item.icon} size={30} color="#fff" />
                    </div>
                    <div className="text-center">
                      <p className="dsl-w14 mb-2">{item.info}</p>
                    </div>
                  </Col>
                )
              })}
            </Row>

            <div className="d-flex">
              <Button type="medium" name="Find Vendors" />
              <Button type="medium" name="Learn More" />
            </div>
          </div>
        </div>
        <div className="dealer-satisfaction py-5">
          <div className="inner-content py-5">
            <Image src="/images/DSA_logo_Big_Image.png" width="300px" />
            <p className="dsl-w16 my-4 desc">Honoring those products with the highest {'\n'} dealer satisfaction.</p>
            <Button
              className="read-more"
              type="medium"
              name="View Winners"
              onClick={() => history.push('/vendor-ratings/dealer-satisfaction-award')}
            />
          </div>
        </div>

        {/* <div className="card mt-3">
          <div className="d-flex justify-content-between mb-4">
            <span className="dsl-b22 bold">Popular Products</span>
            <span className="dsl-b16">Scroll for more >></span>
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
                        onClick={() => history.push(`/vendor-ratings/products/${product.id}`)}
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
        </div> */}

        <div className="card mt-3">
          <div className="d-flex justify-content-between mb-4">
            <span className="dsl-b28 text-400 mt-4 title-color">Recently Updated</span>
            <span className="dsl-b16">{`Scroll for more >>`}</span>
          </div>
          <div className="d-flex">
            <Row className="p-3 mx-0">
              {recentProducts.data.map((product, index) => {
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
                        onClick={() => history.push(`/vendor-ratings/products/${product.parent_id}`)}
                      />
                    </Col>
                  )
                }
              })}
            </Row>
          </div>
        </div>
        <div className="rate-vendor">
          <p className="dsl-b28 text-400 mb-4 text-center">Rate a Vendor</p>
          <div className="rate-vendor-card shadow-sm">
            <Tabs className="bg-white" defaultActiveKey="company" activeKey={activeTab} onSelect={this.handleTab}>
              <Tab eventKey="company" title="By Company">
                <Dropdown
                  className="py-3 rate-vendor-dropdown"
                  title="Company"
                  width="fit-content"
                  defaultIds={selectedCompany}
                  data={companies}
                  getValue={e => e.name}
                  onChange={this.handleChangeDropdown('company')}
                />
              </Tab>
              <Tab eventKey="category" title="By Category">
                <Dropdown
                  className="py-3 rate-vendor-dropdown"
                  title="Category"
                  width="fit-content"
                  defaultIds={selectedCategory}
                  data={all}
                  getValue={e => e.name}
                  onChange={this.handleChangeDropdown('category')}
                />
              </Tab>
            </Tabs>
            <Dropdown
              className="py-3 rate-vendor-dropdown"
              title="Product"
              width="fit-content"
              defaultIds={selectedProduct}
              data={productList}
              getValue={e => e.name}
              onChange={this.handleChangeDropdown('product')}
            />
            <div className="d-h-start">
              <Rating
                className="py-3 rate-vendor-rating"
                title="Star Rating"
                readonly={false}
                score={rating}
                size="large"
                fractions={2}
                onChange={this.handleChangeRate}
              />
              {RATING_STATUS[rating.toFixed(0)] && (
                <div className="rate-vendor-modal-status">
                  <span className="dsl-b22">{RATING_STATUS[rating.toFixed(0)]}</span>
                </div>
              )}
            </div>
            <Rating
              className="py-3 rate-vendor-modal-rating"
              title="Likely to recommend?"
              readonly={false}
              showScore={false}
              score={recommend}
              size="large"
              topRate={10}
              empty={RecommendSymbol}
              full={RecommendSymbol}
              feedback={['Poor', 'Good', 'Excellent']}
              onChange={this.handleChangeRecommend}
            />
            <div className="pt-3 d-h-end">
              <Button name="Submit" onClick={this.handleOpenRateVendor} />
            </div>
          </div>
          <div className="rate-vendor-bottom text-center mt-4">
            <p className="dsl-b12 mb-2">Didn't find what you were looking for?</p>
            <div className="d-flex dsl-b12 mb-0 rate-btn justify-content-center align-items-center">
              <div>
                <Button
                  className="bold"
                  type="link"
                  name="Add Company"
                  disabled={!authenticated}
                  onClick={this.handleAddProduct('company')}
                />
              </div>
              <div>Or</div>
              <div>
                <Button
                  className="bold"
                  type="link"
                  name="Add Product"
                  disabled={!authenticated}
                  onClick={this.handleAddProduct('product')}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

Home.propTypes = {
  authenticated: PropTypes.bool.isRequired,
  categories: PropTypes.shape({
    all: PropTypes.array,
    popular: PropTypes.array,
  }),
  companies: PropTypes.array,
  getCompanies: PropTypes.func,
}

Home.defaultProps = {
  authenticated: false,
  categories: {
    all: [],
    popular: [],
  },
  companies: [],
  getCompanies: () => {},
  getCategories: () => {},
  getDetail: () => {},
  toggleModal: () => {},
}

const mapStateToProps = state => ({
  authenticated: !isEmpty(state.app.token),
  categories: state.vendor.categories,
  recentProducts: state.vendor.recentProducts,
  companies: state.vendor.vendorCompanies?.data,
})

const mapDispatchToProps = dispatch => ({
  getCompanies: e => dispatch(VenAction.getvendorcompaniesRequest(e)),
  getCategories: () => dispatch(VenAction.getcategoriesRequest()),
  getDetail: e => dispatch(VenAction.getcategoryproductsRequest(e)),
  getRecents: () => dispatch(VenAction.getrecentlyupdatedproductsRequest()),
  toggleModal: e => dispatch(AppActions.modalRequest(e)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Home)

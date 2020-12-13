import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Row, Col, Image } from 'react-bootstrap'
import { find, isEmpty, length, propEq, slice } from 'ramda'
import { Button, Rating } from '@components'
import VenAction from '~/actions/vendor'
import './ByCategory.scss'

class ByCategory extends Component {
  state = { hovered: null }

  componentDidMount() {
    this.props.getCategories()
  }

  handleMouseEnter = item => event => {
    event.preventDefault()
    this.setState({ hovered: item })
  }

  handleMouseLeave = () => event => {
    event.preventDefault()
    this.setState({ hovered: null })
  }

  handleOpenDetail = item => event => {
    event.preventDefault()
    this.props.getDetail({
      categoryId: item.id,
      payload: { per_page: 25 },
      route: `/vendor-ratings/by-category/${item.id}`,
    })
  }

  render() {
    const { hovered } = this.state
    const { categories } = this.props
    const { all, popular } = categories
    const populars = length(popular) > 9 ? slice(0, 9, popular) : popular

    return (
      <div className="vendor-rating-category">
        <div className="d-flex align-items-center">
          <Button
            type="link"
            className="btn-vendor-ratings"
            name="Vendor Ratings"
            onClick={() => this.props.history.push(`/vendor-ratings/home`)}
          />
          <p className="dsl-m14 mb-0">{` - By Category`}</p>
        </div>
        <div className="popular-category mb-2">
          <p className="dsl-b20 bold">Popular Categories</p>
          <Row className="m-0 p-2">
            {populars.map(item => {
              const category = find(propEq('id', item.id), all)
              const products = category && category.popular ? category.popular.total : 0
              return (
                <Col xs={4} key={item.id} className="popular-category-item" onClick={this.handleOpenDetail(item)}>
                  <p className="dsl-b15 mb-0 py-2 pr-1">{item.name}</p>
                  <p className="dsl-d14 mb-0 py-2">({products})</p>
                </Col>
              )
            })}
          </Row>
        </div>
        <Row className="m-0">
          <Col xs={8} className="p-0">
            <div className="all-category cursor-pointer mr-2">
              <div className="d-h-between px-4">
                <p className="dsl-b20 bold">All Categories</p>
                {/*<Search />*/}
              </div>
              <Row className="d-h-end border-bottom py-2 mx-4 my-0">
                <Col xs={6} />
                <Col xs={3} className="p-0">
                  <p className="dsl-b14 text-right m-0">Products</p>
                </Col>
                <Col xs={3} className="p-0">
                  <p className="dsl-b14 text-right m-0">Verified Ratings</p>
                </Col>
              </Row>
              {all.map(category => {
                const isHover = hovered ? category.id === hovered.id : false
                const { popular } = category
                return (
                  <Row
                    key={category.id}
                    className={`category-item ${isHover ? 'hovered' : ''}`}
                    onMouseEnter={this.handleMouseEnter(category)}
                    onMouseLeave={this.handleMouseLeave()}
                    onClick={this.handleOpenDetail(category)}
                  >
                    <Col xs={6} className="p-0">
                      <p className="dsl-p16 m-0">{category.name}</p>
                    </Col>
                    <Col xs={3} className="p-0">
                      <p className="dsl-b16 text-right m-0">{popular ? popular.total : 0}</p>
                    </Col>
                    <Col xs={3} className="p-0">
                      <p className="dsl-b16 text-right m-0">
                        {Math.ceil(Number(category.data.ratings.avg_rating_count))}
                      </p>
                    </Col>
                  </Row>
                )
              })}
            </div>
          </Col>
          <Col xs={4} className="p-0">
            {hovered ? (
              <div className="preview-category mb-2">
                <div className="preview-info">
                  <p className="dsl-b18 bold">Featured</p>
                  {hovered.popular &&
                    hovered.popular.data.map((item, index) => (
                      <Row key={`${item.id}-${index}`} className="mx-0 py-3">
                        <Col xs={5} className="pl-0">
                          <Image src={item.logo} width="100%" height="100%" />
                        </Col>
                        <Col xs={7} className="pl-0">
                          <p className="dsl-b16 mb-0">{item.name}</p>
                          <Rating score={Math.round(item?.stats?.rating_avg * 10) / 10} />
                        </Col>
                      </Row>
                    ))}
                </div>
              </div>
            ) : (
              <div className="preview-category">
                <div className="preview-info d-center">
                  <p className="dsl-b14 text-center">
                    Find the variety you are looking for and explore over 40,000 verified reviews from your dealer
                    peers!
                  </p>
                </div>
              </div>
            )}
          </Col>
        </Row>
      </div>
    )
  }
}

ByCategory.propTypes = {
  categories: PropTypes.shape({
    all: PropTypes.array,
    popular: PropTypes.array,
  }),
  getCategories: PropTypes.func,
}

ByCategory.defaultProps = {
  categories: {
    all: [],
    popular: [],
  },
  getCategories: () => {},
}

const mapStateToProps = state => ({
  authenticated: !isEmpty(state.app.token),
  userId: state.app.id,
  categories: state.vendor.categories,
})

const mapDispatchToProps = dispatch => ({
  getCategories: () => dispatch(VenAction.getcategoriesRequest()),
  getDetail: e => dispatch(VenAction.getcategoryproductsRequest(e)),
})

export default connect(mapStateToProps, mapDispatchToProps)(ByCategory)

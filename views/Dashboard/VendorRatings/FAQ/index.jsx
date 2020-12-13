import React from 'react'
import { connect } from 'react-redux'
import classNames from 'classnames'
import { Row, Col } from 'react-bootstrap'
import { Button, Icon } from '@components'
import AppActions from '~/actions/app'
import VenAction from '~/actions/vendor'
import { convertUrl } from '~/services/util'
import PopularProduct from './PopularProduct'
import './FAQ.scss'

const vendorFAQ = [
  {
    que: 'What is Vendor Ratings?',
    ans:
      '  Vendor Ratings is the only peer-to-peer vendor feedback mechanism in automotive retail. Dealerships can rate and review their vendors, providing feedback on how well they perform. These ratings and reviews are published so that dealers can evaluate and select the best solution for their stores.',
  },
  {
    que: 'How are the products ranked?',
    ans:
      'Products are listed in categories. Inside each category, products are ranked according to a weighted Bayesian algorithm. This algorithm takes into account the volume of reviews, the number of stars, the percent recommended, and the recency of reviews. Companies can elect to sponsor their listing.  In each category the premium listings are displayed above the basic listings.',
  },
  {
    que: 'What is the premium listing?',
    ans:
      'Some vendors choose to sponsor their product listing. A premium listing moves the product to the top of page 1 within the respective category similar to the way paid ads on Google automatically have placement at the top of the first page.',
  },
  {
    que: 'How are reviews calculated?',
    ans:
      'The vendor products are ranked based on a weighted Bayesian Algorithm. This is a standard mathematical calculation that looks at the number of stars the reviewer gave as well as the statistically valid sample size needed, relative to the competitive set, to create a ranking based on the statistical accuracy of the results.',
  },
  {
    que: 'How are reviews verified?',
    ans:
      '  has a team that verifies 100% of the reviews that ultimately go on to the Vendor Ratings platform. They call the dealership and verify the validity of the review before it is posted.',
  },
  {
    que: 'Can I leave a review?',
    ans:
      'Only current dealership employees can leave a review that will get posted to the product page. If someone leaves a review that isn’t an employee of a dealership, that review will get discarded once someone from our team calls them.',
  },
  {
    que: 'How do I submit a review?',
    ans:
      'The person leaving the review needs to have a valid   profile. Once they have that, they can leave a review basically anywhere on the platform by clicking on the orange button that says either “Rate a Vendor” or “Rate this Product”.',
  },
  {
    que: 'What are the categories?',
    ans:
      'The Vendor Ratings platform breaks down into approximately 30 categories that comprise all the different products and solutions within automotive. Each product is categorized as accurately as possible and is easily accessible for dealerships to search by category and find all products within a certain category.',
  },
  {
    que: 'Who wins a Dealer Satisfaction Award?',
    ans:
      ' The   Dealer Satisfaction Awards recognize the solutions with the highest vendor ratings. There are three award winners.   recognizes the “Highest Rated” vendor and two “Top Rated” vendors. These awards reflect products and providers with a proven record of success and excellence in serving their dealer clients. The Dealer Satisfaction Award trophies are presented annually at the NADA conference.',
  },
  {
    que: "What is the Buyer's guide?",
    ans:
      'The   Buyer’s Guide provides dealers with a one-stop guide to source and research vendor categories essential for dealership operations. Each listing details the company, product, and reputation metrics. Sponsored vendors also get a description and contact information. The Buyer’s Guide is delivered to over 24,000+ dealer professionals with an additional 12,000+ reach during NADA.',
  },
]

class FAQ extends React.PureComponent {
  state = { column: 0, isOpen: true, showProducts: 5 }

  componentDidMount() {
    this.props.getPopularProduct()
  }

  handleVisibility = index => {
    const { isOpen } = this.state
    this.setState({ column: index, isOpen: !isOpen })
  }

  handleRateProduct = product => {
    this.props.toggleModal({
      type: 'Rate Vendor',
      data: {
        before: { company: product?.parent_id, product: product?.id, category: Number(product?.data?.category) },
        after: null,
      },
      callBack: null,
    })
  }

  render() {
    const { column, isOpen, showProducts } = this.state
    const { popularProducts, history } = this.props

    return (
      <div className="vendor-rating-faq">
        <p className="dsl-m14 pl-3">Vendor Ratings</p>
        <div className="popular-que-category col-md-12 col-sm-9">
          <h4 className="pb-2">FAQ</h4>
          {vendorFAQ.map((item, index) => (
            <div key={index} className="pb-2">
              <div className="d-flex pt-2" onClick={() => this.handleVisibility(index)}>
                <div className="dsl-b15 d-flex">
                  <p>{index + 1}. &nbsp;</p>
                  <p className="m-0">{item.que}</p>
                </div>
                <div className="pl-2 dsl-b15">
                  <span>
                    {column == index && isOpen ? (
                      <Icon name="fas fa-sort-up caret" className="icon-text" />
                    ) : (
                      <Icon name="fas fa-sort-down caret" className="icon-text" />
                    )}
                  </span>
                </div>
              </div>
              <div
                className={classNames(
                  'pt-1 dsl-b14 line-height ml-3 pl-2',
                  column == index && isOpen ? 'd-block' : 'd-none'
                )}
              >
                <p className="mb-0">{item.ans}</p>
              </div>
            </div>
          ))}
          <div className="d-flex pt-md-5 justify-content-between flex-col pt-none">
            <div className="pt-2 dsl-b14">
              <p>If You still have questions, please fill free to call us.Your support team will gladly help you.</p>
            </div>
            <div className="btn-justify">
              <Button className="btn-view-photos btn-width" type="medium" name="CALL SUPPORT" />
            </div>
          </div>
        </div>
        <div className="popular-que-category col-md-12 col-sm-9 mt-3">
          <h4 className="pb-2">Popular Products</h4>
          <Row className="p-3 mx-0">
            {popularProducts?.data?.map((product, index) => {
              if (index < showProducts) {
                const url = convertUrl(product.logo, '/images/default_company.svg')
                const rating = parseFloat(product.parent?.stats?.rating_recommended_avg)
                return (
                  <Col xs={2} key={product.id} className="mb-3 product">
                    <PopularProduct
                      logo={url}
                      title={product.name}
                      recommendation={Number(rating).toFixed(0)}
                      onReview={() => this.handleRateProduct(product)}
                    />
                  </Col>
                )
              }
            })}
          </Row>
          <div className="d-h-end">
            <Button
              className="btn-view-photos btn-width"
              type="medium"
              name="See More"
              onClick={() => history.push('/vendor-ratings/by-category')}
            />
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  popularProducts: state.vendor.popularProducts,
})

const mapDispatchToProps = dispatch => ({
  getPopularProduct: () => dispatch(VenAction.getpopularproductsRequest()),
  toggleModal: e => dispatch(AppActions.modalRequest(e)),
})

export default connect(mapStateToProps, mapDispatchToProps)(FAQ)

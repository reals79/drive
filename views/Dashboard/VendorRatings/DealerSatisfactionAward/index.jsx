import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Image, Row, Col } from 'react-bootstrap'
import Lightbox from 'react-image-lightbox'
import { Avatar, Button, Rating } from '@components'
import VenAction from '~/actions/vendor'
import './DealerSatisfactionAward.scss'

const PHOTOES = [
  '/images/awards/P1199218.jpg',
  '/images/awards/Dealer Car Search.jpg',
  '/images/awards/NADA-4.jpg',
  '/images/awards/NADA-7.jpg',
  '/images/awards/NADA-12.jpg',
  '/images/awards/AutoMate.jpg',
  '/images/awards/CarNow.jpg',
  '/images/awards/CDK Global.jpg',
  '/images/awards/Customer Scout.jpg',
  '/images/awards/Dealer E Process.jpg',
  '/images/awards/DealerSocket.jpg',
  '/images/awards/ELead_2.jpg',
  '/images/awards/FourEyes.jpg',
  '/images/awards/MaxDigital.jpg',
  '/images/awards/Miscelaneous DSA-2.jpg',
  '/images/awards/Miscelaneous DSA-3.jpg',
  '/images/awards/Miscelaneous DSA-5.jpg',
  '/images/awards/Miscelaneous DSA-6.jpg',
  '/images/awards/Miscelaneous DSA-7.jpg',
  '/images/awards/Miscelaneous DSA-8.jpg',
  '/images/awards/Miscelaneous DSA-10.jpg',
  '/images/awards/ProMax.jpg',
  '/images/awards/Reynolds and Reynolds.jpg',
  '/images/awards/TrueCar.jpg',
]
const photoLen = PHOTOES.length

class DealerSatisfactionAward extends Component {
  state = {
    index: 0,
    isOpen: false,
  }

  componentDidMount() {
    this.props.getAwards()
  }

  handleOpenPhotos = index => {
    this.setState({ index, isOpen: true })
  }

  handleClosePhotos = () => {
    this.setState({ index: 0, isOpen: false })
  }

  handleNextPhoto = () => {
    const index = (this.state.index + 1) % photoLen
    this.setState({ index })
  }

  handlePrePhoto = () => {
    const index = (this.state.index + photoLen - 1) % photoLen
    this.setState({ index })
  }

  render() {
    const { isOpen, index } = this.state
    const { vendorAwards } = this.props
    return (
      <div className="dealer-satisfaction-award">
        <div className="d-h-start">
          <Button
            type="link"
            className="btn-vendor-ratings"
            name="Vendor Ratings"
            onClick={() => this.props.history.push(`/vendor-ratings/home`)}
          />
          <p className="dsl-m14 mb-0">{` - Reports`}</p>
        </div>
        <div className="dealer-satisfaction-award-hero">
          <div className="award-hero-section">
            <Image src="/images/award.png" className="h-100" />
            <div className="award-hero-detail py-3">
              <Image src="/images/DSA_logo_small.png" className="ds-satisfaction-logo" />
              <p className="dsl-w30 mt-4 mb-3">Honoring those solutions with the highest dealer satisfaction.</p>
              <p className="dsl-w16">
                Each year the verified ratings across all productions are tallied and ranked. Those companies who
                demonstrate the highest levels of dealer satisfaction across their customer base are recognized with a
                Dealer Satisfaction Award to honor their service to our industry.
              </p>
              <Button className="btn-see-winners" type="medium" name="SEE WINNERS" />
            </div>
          </div>
        </div>
        <div className="dealer-satisfaction-award-photos">
          <p className="dsl-b30 text-center">Dealer Satisfaction is defined as it should be:</p>
          <p className="dsl-b30 text-center">by dealers actually using the products to drive success.</p>
          <p className="dsl-b16 text-center">
              collects thousands of product reviews each month through our market research team and vendor
            ratings platform. Every review is verified allowing us to publish a real time Dealer Satisfaction Rating for
            each product in the industry across a variety of categories. Dealer use the platform to buy with confidence.
            Vendors use the platform for valuable market insight to improve.
          </p>
          <p className="dsl-b16 text-center">
            At the end of each year, we tally the tens of thousands of verified dealer ratings, and recognized those
            companies whoes efforts to serve the dealer body and rewarded them with the Highest Dealer Satisfaction in
            their competitive landscape.
          </p>
          <Row className="mx-0">
            <Col xs={6} className="px-0 pb-2 pr-2">
              <Image src={PHOTOES[0]} className="w-100 h-100 border-5" onClick={() => this.handleOpenPhotos(0)} />
            </Col>
            <Col xs={6} className="p-0 d-flex flex-wrap">
              <div className="w-50 pb-2 pr-2">
                <Image src={PHOTOES[1]} className="w-100 h-100 border-5" onClick={() => this.handleOpenPhotos(1)} />
              </div>
              <div className="w-50 pb-2 pr-2">
                <Image src={PHOTOES[2]} className="w-100 h-100 border-5" onClick={() => this.handleOpenPhotos(2)} />
              </div>
              <div className="w-50 pb-2 pr-2">
                <Image src={PHOTOES[3]} className="w-100 h-100 border-5" onClick={() => this.handleOpenPhotos(3)} />
              </div>
              <div className="w-50 pb-2 pr-2">
                <Image src={PHOTOES[4]} className="w-100 h-100 border-5" onClick={() => this.handleOpenPhotos(4)} />
              </div>
            </Col>
          </Row>
          <div className="d-center my-3">
            <Button
              className="btn-view-photos"
              type="medium"
              name="VIEW PHOTOS"
              onClick={() => this.handleOpenPhotos(0)}
            />
          </div>
        </div>
        <div className="dealer-satisfaction-award-winners">
          <div className="mt-3 pt-5 pb-3">
            <p className="dsl-b30 text-center">Dealer Satisfaction Award Winners</p>
            <p className="dsl-b16 w-75 mx-auto text-center">
              The following products archieved the greatest dealer satisfaction in their respected categories:
            </p>
            <div className="winners-list">
              {vendorAwards.map(winners => {
                const { id, name, entity_awards } = winners
                return (
                  <div key={`winner-${id}`} className="mb-5">
                    <p className="dsl-b24 text-500">{name}</p>
                    <Row>
                      {entity_awards.map(award => {
                        const { content } = award
                        const avatarURL = content && content.data ? content.data.logo : '/images/default_company.svg'
                        const name = content ? content.name : 'Elead Service'
                        const description =
                          content && content.data
                            ? content.data.description
                            : "DealerSocket's CRM will allow you to manage fresh ups, phone ups and internet leads all from one tool. Your dealership"
                        const rating = Number(content?.stats?.rating_avg)
                        const recommended =
                          content && content.stats ? Math.round(content?.stats?.rating_recommended_avg) : 0

                        return (
                          <Col xs={12} sm={4} key={`award-${award.id}`}>
                            <div className="d-center p-4">
                              <Avatar
                                url={avatarURL}
                                type="logo"
                                size="extraLarge"
                                backgroundColor="white"
                                borderColor="#c3c7cc"
                                borderWidth={1}
                              />
                            </div>
                            <p className="dsl-b20 text-center bold">{name}</p>
                            <div className="d-center mb-2">
                              <Rating score={rating} />
                              <p className="dsl-14 mb-0 ml-3">{`${recommended}% recommended`}</p>
                            </div>
                            <p className="dsl-b14 truncate-four">{description}</p>
                          </Col>
                        )
                      })}
                    </Row>
                  </div>
                )
              })}
            </div>
          </div>
          <div className="opinion-count-section">
            <p className="dsl-w30">Make your opinion count!</p>
            <p className="dsl-w16 text-center w-75 mx-auto">
              We encourage all dealers to rate their vendors. We publish your rating and comments anonymously, after we
              have called your store to verify your review. Leaving a review takes about 2minutes, just click the link
              below to get started.
            </p>
            <div className="d-center my-3">
              <Button className="btn-see-winners" type="medium" name="RATE VENDOR" />
            </div>
          </div>
        </div>
        {isOpen && (
          <Lightbox
            reactModalStyle={{ overlay: { zIndex: 999 } }}
            mainSrc={PHOTOES[index]}
            nextSrc={PHOTOES[(index + 1) % photoLen]}
            prevSrc={PHOTOES[(index + photoLen - 1) % photoLen]}
            onCloseRequest={this.handleClosePhotos}
            onMovePrevRequest={this.handlePrePhoto}
            onMoveNextRequest={this.handleNextPhoto}
          />
        )}
      </div>
    )
  }
}

DealerSatisfactionAward.propTypes = {
  vendorAwards: PropTypes.any,
  getAwards: PropTypes.func,
}

DealerSatisfactionAward.defaultProps = {
  vendorAwards: {},
  getAwards: () => {},
}

const mapStateToProps = state => ({
  vendorAwards: state.vendor.vendorAwards,
})

const mapDispatchToProps = dispatch => ({
  getAwards: () => dispatch(VenAction.getvendorawardsRequest()),
})

export default connect(mapStateToProps, mapDispatchToProps)(DealerSatisfactionAward)

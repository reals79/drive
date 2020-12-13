import React from 'react'
import { connect } from 'react-redux'
import { Row, Col } from 'react-bootstrap'
import Slider from 'react-slick'
import { Icon, Button, LandingAnalyticsCard as Card, LandingContact } from '@components'
import AppActions from '~/actions/app'
import './Landing.scss'

const sliderSettings = {
  customPaging: function() {
    return <div className="custom-dot" />
  },
  slidesToShow: 4,
  slidesToScroll: 0,
  infinite: true,
  dots: true,
  responsive: [
    {
      breakpoint: 1199,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 768,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 576,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      },
    },
  ],
}

const Landing = props => (
  <div className="analytics-landing">
    <div className="section demo">
      <div className="container">
        <h2 className="section-title">Real Time Industry Benchmarking</h2>
        <p className="section-detail">
          Overlay your analytics with real time competitive benchmarks. Discover opportunities, monitor impact,
          accelerate growth.
        </p>
        <Button className="demo-btn" onClick={() => props.toggleModal('CTA')} name="DEMO NOW" />
      </div>
    </div>

    <div className="section try">
      <Row>
        <Col sm={12} lg={7} md={4} className="bg-loading" />
        <Col sm={12} lg={4} md={8} className="mr-lg-2 ml-lg-3">
          <h4 className="section-title">Your Analytics are Incomplete.</h4>
          <p className="section-detail">But don’t stress, we’ve got you covered.</p>
          <p className="dsl-b14 mb-4">
            As a marketer, you have mountains of metrics, but you are missing something critical - knowing exactly how
            you stack up in the digital market.
          </p>
          <p className="dsl-b14 mb-4">
            We aggregate metrics across thousands of dealerships (all kept anonymous of course) and allow you to compare
            your real-time performance against other stores in your market. You decide which benchmarks you want to
            compare. Now you can see if you are keeping pace, overspending or falling behind the competition.
          </p>
          <p className="dsl-b14 mb-4">
            Discover hidden opportunities. Validate your marketing decisions with vendor-neutral insights. Know exactly
            what you need to focus on.
          </p>
          <div className="checkline">
            <Icon name="fas fa-check" size={15} color="dark-grey" />
            <span className="dsl-b14 ml-2">
              Compare yourself to dealership indexes nationwide or within your zip code.
            </span>
          </div>
          <div className="checkline">
            <Icon name="fas fa-check" size={15} color="dark-grey" />
            <span className="dsl-b14 ml-2">Validate marketing decisions with vendor neutral data.</span>
          </div>
          <div className="checkline">
            <Icon name="fas fa-check" size={15} color="dark-grey" />
            <span className="dsl-b14 ml-2">Discover & exploit weak spots in your competition.</span>
          </div>
          <div className="checkline mb-4">
            <Icon name="fas fa-check" size={15} color="dark-grey" />
            <span className="dsl-b14 ml-2">
              Make metrics actionable by setting goals, managing tasks and assigning training.
            </span>
          </div>
          <Button className="try-btn" name="TRY IT NOW" />
        </Col>
      </Row>
    </div>
    <div className="section membership py-5 custom-item-align">
      <div className="container">
        <Row>
          <Col>
            <h3 className="section-title">Get Started for Free</h3>
            <p className="dsl-b24 ">It only takes a few minutes.</p>
            <p className="dsl-b24 mb-5">Choose a plan below to get the insight you are looking for</p>
            <div className="d-flex flex-wrap justify-content-center">
              <Slider {...sliderSettings} className="comment-slider">
                <Card onDemoNow={() => props.toggleModal('CTA')} type="basic" key={0} />
                <Card onDemoNow={() => props.toggleModal('CTA')} type="advanced" active={true} key={1} />
                <Card onDemoNow={() => props.toggleModal('CTA')} type="premium" key={2} />
                <Card onDemoNow={() => props.toggleModal('CTA')} type="enterprise" key={3} />
              </Slider>
            </div>
          </Col>
        </Row>
      </div>
    </div>
    <div className="section tabulation">
      <p className="title">Get Started Today</p>
      <p className="sub-title">Compare our plans to see which one is right for you</p>
      <div className="plans-table">
        <div className="d-flex header">
          <div className="col-sm-12 col-md-3 plan" />
          <div className="col-sm-12 col-md-3 status">
            <p className="status--category m-0">Basic</p>
            <p className="status--charge m-0">$59 / month</p>
          </div>
          <div className="col-sm-12 col-md-3 status">
            <p className="status--category m-0">Advanced</p>
            <p className="status--charge m-0">$399 / month</p>
          </div>
          <div className="col-sm-12 col-md-3 status">
            <p className="status--category m-0">Premiun</p>
            <p className="status--charge m-0">$599 / month</p>
          </div>
        </div>
        <div className="d-flex data">
          <div className="col-sm-12 col-md-3 plan">
            <p className="comparison">Comparison Sets:</p>
          </div>
          <div className="col-sm-12 status" />
          <div className="col-sm-12 status" />
          <div className="col-sm-12 status" />
        </div>
        <div className="d-flex data">
          <div className="col-sm-12 col-md-3 plan">
            <p>Your Store</p>
          </div>
          <div className="col-sm-12 col-md-3 status">
            <p>
              <Icon name="fas fa-check" size={15} />
            </p>
          </div>
          <div className="col-sm-12 col-md-3 status">
            <p>
              <Icon name="fas fa-check" size={15} />
            </p>
          </div>
          <div className="col-sm-12 col-md-3 status">
            <p>
              <Icon name="fas fa-check" size={15} />
            </p>
          </div>
        </div>
        <div className="d-flex data">
          <div className="col-sm-12 col-md-3 plan">
            <p>Your Group</p>
          </div>
          <div className="col-sm-12 col-md-3 status">
            <p>
              <Icon name="fas fa-check" size={15} />
            </p>
          </div>
          <div className="col-sm-12 col-md-3 status">
            <p>
              <Icon name="fas fa-check" size={15} />
            </p>
          </div>
          <div className="col-sm-12 col-md-3 status">
            <p>
              <Icon name="fas fa-check" size={15} />
            </p>
          </div>
        </div>
        <div className="d-flex data">
          <div className="col-sm-12 col-md-3 plan">
            <p>National Average</p>
          </div>
          <div className="col-sm-12 col-md-3 status">
            <p>
              <Icon name="fas fa-check" size={15} />
            </p>
          </div>
          <div className="col-sm-12 col-md-3 status">
            <p>
              <Icon name="fas fa-check" size={15} />
            </p>
          </div>
          <div className="col-sm-12 col-md-3 status">
            <p>
              <Icon name="fas fa-check" size={15} />
            </p>
          </div>
        </div>
        <div className="d-flex data">
          <div className="col-sm-12 col-md-3 plan">
            <p>National Average Domestic, Import & Luxury</p>
          </div>
          <div className="col-sm-12 col-md-3 status" />
          <div className="col-sm-12 col-md-3 status">
            <p>
              <Icon name="fas fa-check" size={15} />
            </p>
          </div>
          <div className="col-sm-12 col-md-3 status">
            <p>
              <Icon name="fas fa-check" size={15} />
            </p>
          </div>
        </div>
        <div className="d-flex data">
          <div className="col-sm-12 col-md-3 plan">
            <p>National Average Franchise</p>
          </div>
          <div className="col-sm-12 col-md-3 status" />
          <div className="col-sm-12 col-md-3 status">
            <p>
              <Icon name="fas fa-check" size={15} />
            </p>
          </div>
          <div className="col-sm-12 col-md-3 status">
            <p>
              <Icon name="fas fa-check" size={15} />
            </p>
          </div>
        </div>
        <div className="d-flex data">
          <div className="col-sm-12 col-md-3 plan">
            <p>National Top 10%</p>
          </div>
          <div className="col-sm-12 col-md-3 status" />
          <div className="col-sm-12 col-md-3 status">
            <p>
              <Icon name="fas fa-check" size={15} />
            </p>
          </div>
          <div className="col-sm-12 col-md-3 status">
            <p>
              <Icon name="fas fa-check" size={15} />
            </p>
          </div>
        </div>
        <div className="d-flex data">
          <div className="col-sm-12 col-md-3 plan">
            <p>National Top 10% Domestic, Import & Luxury</p>
          </div>
          <div className="col-sm-12 col-md-3 status" />
          <div className="col-sm-12 col-md-3 status">
            <p>
              <Icon name="fas fa-check" size={15} />
            </p>
          </div>
          <div className="col-sm-12 col-md-3 status">
            <p>
              <Icon name="fas fa-check" size={15} />
            </p>
          </div>
        </div>
        <div className="d-flex data">
          <div className="col-sm-12 col-md-3 plan">
            <p>National Top 10% Franchise</p>
          </div>
          <div className="col-sm-12 col-md-3 status" />
          <div className="col-sm-12 col-md-3 status" />
          <div className="col-sm-12 col-md-3 status">
            <p>
              <Icon name="fas fa-check" size={15} />
            </p>
          </div>
        </div>
        <div className="d-flex data">
          <div className="col-sm-12 col-md-3 plan">
            <p>Regional Average</p>
          </div>
          <div className="col-sm-12 col-md-3 status" />
          <div className="col-sm-12 col-md-3 status" />
          <div className="col-sm-12 col-md-3 status">
            <p>
              <Icon name="fas fa-check" size={15} />
            </p>
          </div>
        </div>
        <div className="d-flex data">
          <div className="col-sm-12 col-md-3 plan">
            <p>Regional Average Domestic, Import & Luxury</p>
          </div>
          <div className="col-sm-12 col-md-3 status" />
          <div className="col-sm-12 col-md-3 status" />
          <div className="col-sm-12 col-md-3 status">
            <p>
              <Icon name="fas fa-check" size={15} />
            </p>
          </div>
        </div>
        <div className="d-flex data">
          <div className="col-sm-12 col-md-3 plan">
            <p>Regional Average Franchise</p>
          </div>
          <div className="col-sm-12 col-md-3 status" />
          <div className="col-sm-12 col-md-3 status" />
          <div className="col-sm-12 col-md-3 status">
            <p>
              <Icon name="fas fa-check" size={15} />
            </p>
          </div>
        </div>
        <div className="d-flex data">
          <div className="col-sm-12 col-md-3 plan">
            <p>Regional Top 10%</p>
          </div>
          <div className="col-sm-12 col-md-3 status" />
          <div className="col-sm-12 col-md-3 status" />
          <div className="col-sm-12 col-md-3 status">
            <p>
              <Icon name="fas fa-check" size={15} />
            </p>
          </div>
        </div>
        <div className="d-flex data">
          <div className="col-sm-12 col-md-3 plan">
            <p>Regional Top 10% Domestic, Import & Luxury</p>
          </div>
          <div className="col-sm-12 col-md-3 status" />
          <div className="col-sm-12 col-md-3 status" />
          <div className="col-sm-12 col-md-3 status">
            <p>
              <Icon name="fas fa-check" size={15} />
            </p>
          </div>
        </div>
        <div className="d-flex data">
          <div className="col-sm-12 col-md-3 plan">
            <p>Regional Top 10% Franchise</p>
          </div>
          <div className="col-sm-12 col-md-3 status" />
          <div className="col-sm-12 col-md-3 status" />
          <div className="col-sm-12 col-md-3 status">
            <p>
              <Icon name="fas fa-check" size={15} />
            </p>
          </div>
        </div>
        <div className="d-flex data">
          <div className="col-sm-12 col-md-3 plan" />
          <div className="col-sm-12 col-md-3 status">
            <p>
              <Button onClick={() => props.toggleModal('CTA')} name="REGISTER" />
            </p>
          </div>
          <div className="col-sm-12 col-md-3 status">
            <p>
              <Button onClick={() => props.toggleModal('CTA')} name="REGISTER" />
            </p>
          </div>
          <div className="col-sm-12 col-md-3 status">
            <p>
              <Button onClick={() => props.toggleModal('CTA')} name="REGISTER" />
            </p>
          </div>
        </div>
      </div>
    </div>
    <div className="section contact">
      <LandingContact
        title="Get your Nerd on it"
        subtitle="It only takes a couple of minutes"
        btntitle="register"
        onDemoNow={() => props.toggleModal('CTA')}
      />
    </div>
  </div>
)

const mapDispatchToProps = dispatch => ({
  toggleModal: type => dispatch(AppActions.modalRequest({ type, data: null, callBack: null })),
})

export default connect(null, mapDispatchToProps)(Landing)

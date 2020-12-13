import React from 'react'
import { connect } from 'react-redux'
import { Row, Col, Button } from 'react-bootstrap'
import Slider from 'react-slick'
import { Icon, LandingComment, LandingContact } from '@components'
import AppActions from '~/actions/app'
import './Landing.scss'

const sliderSettings = {
  customPaging: function() {
    return <div className="custom-dot" />
  },
  slidesToShow: 2,
  slidesToScroll: 1,
  infinite: true,
  dots: true,
  responsive: [
    {
      breakpoint: 576,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      },
    },
  ],
}

const comments = [
  {
    comment:
      "  Human Capital Management is going to enrich every employee, every teammate that you have at every level…It's considerably helped our turnover, which has helped our bottom line. ",
    fullname: 'Adam Green',
    role: 'General Sales Manager',
    company: '',
    avatar: 'Adam Green.png',
  },
  {
    comment:
      '  Human Capital Management has allowed us to create a structured framework for developing our people.',
    fullname: 'Mark Brown',
    role: 'Director of Sales, Marketing&Corporate Potential',
    company: '',
    avatar: 'Mark Brown.png',
  },
  {
    comment:
      "  Human Capital Management is going to enrich every employee, every teammate that you have at every level…It's considerably helped our turnover, which has helped our bottom line. ",
    fullname: 'Adam Green',
    role: 'General Sales Manager',
    company: '',
    avatar: 'Adam Green.png',
  },
  {
    comment:
      '  Human Capital Management has allowed us to create a structured framework for developing our people.',
    fullname: 'Mark Brown',
    role: 'Director of Sales, Marketing&Corporate Potential',
    company: '',
    avatar: 'Mark Brown.png',
  },
]

const Landing = props => (
  <div className="mng-landing">
    <div className="section demo">
      <div className="container">
        <Row>
          <Col>
            <div className="custom-item-align flex-column text-wrap">
              <h2 className="section-title">Maximize Employee Performance</h2>
              <p className="section-detail">
                New hire orientations, training & development, performance reviews and more.
              </p>
              <Button
                className="demo-btn mt-4 mt-xl-5 d-md-block d-none"
                onClick={() =>
                  props.toggleModal({
                    type: 'CTA',
                    data: null,
                    callBack: null,
                  })
                }
              >
                DEMO NOW
              </Button>
            </div>
          </Col>
        </Row>
      </div>
    </div>
    <div className="section learn custom-item-align">
      <div className="container">
        <Row>
          <Col>
            <h3 className="section-title">Build Rockstar Employees</h3>
            <p className="section-detail">Power up the most important asset in your business: your people</p>
          </Col>
        </Row>
        <Row>
          <Col sm={6} xl={3}>
            <div className="mt-5 text-center">
              <Icon name="fal fa-chart-line" size={42} color="#376caf" />
              <p className="dsl-b18 mt-4 mb-2 bold">Maximize Performance</p>
              <span className="dsl-b16">
                The right management processes will close more deals and keep guests coming back. Drive more volume,
                gross and CSI without more marketing or inventory expenses.
              </span>
            </div>
          </Col>
          <Col sm={6} xl={3}>
            <div className="mt-5 text-center">
              <Icon name="fal fa-thumbs-up" size={42} color="#376caf" />
              <p className="dsl-b18 mt-4 mb-2 bold">Strengthen Culture</p>
              <span className="dsl-b16">
                Execute your processes more consistently by automating your people strategy, training consistently, and
                holding your team accountable.
              </span>
            </div>
          </Col>
          <Col sm={6} xl={3}>
            <div className="mt-5 text-center">
              <Icon name="fal fa-map-marker-smile" size={42} color="#376caf" />
              <p className="dsl-b18 mt-4 mb-2 bold">Increase Retention</p>
              <span className="dsl-b16">
                Stop the revolving door by providing new employees with career visibility, professional training and a
                path to succeed from day one.
              </span>
            </div>
          </Col>
          <Col sm={6} xl={3}>
            <div className="mt-5 text-center">
              <Icon name="fal fa-tachometer-fastest" size={42} color="#376caf" />
              <p className="dsl-b18 mt-4 mb-2 bold">Accelerate Growth</p>
              <span className="dsl-b16">
                Ramp up new employees from new hire to top performer much faster with our automated orientations and
                career mapping. Get your employees producing quickly!
              </span>
            </div>
          </Col>
          <Col>
            <div className="text-center">
              <Button
                className="demo-btn mt-5 mb-3"
                onClick={() =>
                  props.toggleModal({
                    type: 'CTA',
                    data: null,
                    callBack: null,
                  })
                }
              >
                LEARN MORE
              </Button>
            </div>
          </Col>
        </Row>
      </div>
    </div>
    <div className="section manage custom-item-align">
      <div className="container">
        <Row>
          <Col>
            <h3 className="section-title">Manage the key processes that amplify employees</h3>
            <p className="section-detail mb-5">
              Our software does the heavy lifting so your managers can focus on closing deals
            </p>
          </Col>
        </Row>
        <div className="section-items m-auto">
          <Row>
            <Col xs={6} md={4} className="text-center mt-5">
              <Icon name="far fa-user-tie" size={38} color="#fff" />
              <p className="icon-title mt-1 mb-0">Employee</p>
              <p className="icon-title mb-0">Onboarding</p>
            </Col>
            <Col xs={6} md={4} className="text-center mt-5">
              <Icon name="far fa-university" size={38} color="#fff" />
              <p className="icon-title mt-1 mb-0">Training</p>
              <p className="icon-title mb-0">& Development</p>
            </Col>
            <Col xs={6} md={4} className="text-center mt-5">
              <Icon name="fas fa-tasks" size={38} color="#fff" />
              <p className="icon-title mt-1 mb-0">Performance</p>
              <p className="icon-title mb-0">Reviews</p>
            </Col>
            <Col xs={6} md={4} className="text-center mt-5">
              <Icon name="far fa-check-circle" size={38} color="#fff" />
              <p className="icon-title mt-1 mb-0">Task & Project</p>
              <p className="icon-title mb-0">Management</p>
            </Col>
            <Col xs={6} md={4} className="text-center mt-5">
              <Icon name="far fa-briefcase" size={38} color="#fff" />
              <p className="icon-title mt-1 mb-0">Career</p>
              <p className="icon-title mb-0">Management</p>
            </Col>
            <Col xs={6} md={4} className="text-center mt-5">
              <Icon name="far fa-chart-bar" size={38} color="#fff" />
              <p className="icon-title mt-1 mb-0">Employee Records</p>
              <p className="icon-title mb-0">& Reporting</p>
            </Col>
          </Row>
        </div>
      </div>
    </div>
    <div className="section comment custom-item-align">
      <div className="container">
        <Row>
          <Col>
            <h3 className="section-title text-center mb-3">Customer Reviews</h3>
            <Slider {...sliderSettings} className="comment-slider">
              {comments.map((item, index) => {
                return (
                  <LandingComment
                    key={`comment-${index}`}
                    comment={item.comment}
                    name={item.fullname}
                    avatar={item.avatar}
                    company={item.company}
                    role={item.role}
                  />
                )
              })}
            </Slider>
          </Col>
        </Row>
      </div>
    </div>
    <div className="section video custom-item-align">
      <div className="container">
        <Row>
          <Col>
            <div className="d-flex align-items-center justify-content-center flex-column">
              <h3 className="section-title">Advanced Dealerships Have Professional Human Capital Management</h3>
              <p className="section-detail">Watch and see what that means to you</p>
              <Button
                className="play"
                onClick={() =>
                  props.toggleModal({
                    type: 'Landing modal',
                    data: {
                      before: {
                        url: 'https://player.vimeo.com/video/294268057',
                        height: 290,
                        width: 'auto',
                      },
                      after: null,
                    },
                    callBack: null,
                  })
                }
              >
                <Icon name="fas fa-play mobile-screen" size={40} color="#fff" />
                <Icon name="fas fa-play desktop-screen" size={90} color="#fff" />
              </Button>
              <p className="play-title text-center">SEE THE VIDEO</p>
            </div>
          </Col>
        </Row>
      </div>
    </div>
    <div className="section performance custom-item-align flex-column">
      <div className="mt-xl-0 mt-md-5">
        <div className="container-fluid">
          <Row>
            <Col>
              <div className="custom-item-align mt-5">
                <h3 className="section-title">
                    Will Help You Cut Costs and Increase Employee Performance
                </h3>
                <p className="section-detail mb-sm-3 mb-2 ">Employee turnover eats at the bottom line</p>
                <Row>
                  <Col xs={12} md={7} xl={5}>
                    <div className="section-info ml-lg-5 ml-0">
                      <p>
                          enables your store to attract, build and retain the top performing employees by
                        implementing the processes that help employees perform. We stop employee turnover that costs the
                        dealerships hundreds of thousands of dollars by giving employees a measurable career path.
                      </p>
                      <p>
                        The average dealership turns over 70% of their sales staff every year. Each untrained newbie
                        burns about $44,500 in lost opportunity as they ramp up. Then, when they feel uncertain about
                        the future they leave forcing the dealer to start the cycle over again.
                      </p>
                      <p>
                        The revolving door costs hundreds of thousands of dollars per year by wasting the opportunities
                        that you had invested to bring in. Untrained employees hurt your customer experience and take a
                        disproportionate amount of a managers time. However, this is fixable by instilling a few
                        critical processes.
                      </p>
                      <p>
                        Our automated on-boarding, professional training, performance reviews, and more will stop
                        turnover and increase your production. We make your store more attractive in the market to bring
                        in the best talent. We will maximize your potential.
                      </p>
                      <Button
                        className="btn-more mt-sm-3 mt-2"
                        onClick={() =>
                          props.toggleModal({
                            type: 'CTA',
                            data: null,
                            callBack: null,
                          })
                        }
                      >
                        LEARN MORE
                      </Button>
                    </div>
                  </Col>
                  <Col xs={12} md={5} xl={7} className="pr-md-0">
                    <div className="section-image position-relative h-100 w-100">
                      <img src="/images/landing/phones.png" alt="image" />
                    </div>
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </div>
    <div className="section asset">
      <LandingContact
        onDemoNow={() =>
          props.toggleModal({
            type: 'CTA',
            data: null,
            callBack: null,
          })
        }
        title="Your People are Your Most Important Asset."
        subtitle="Let us magnify them"
      />
    </div>
  </div>
)

const mapDispatchToProps = dispatch => ({
  toggleModal: e => dispatch(AppActions.modalRequest(e)),
})

export default connect(null, mapDispatchToProps)(Landing)

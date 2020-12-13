import React from 'react'
import { connect } from 'react-redux'
import { Row, Col } from 'react-bootstrap'
import { length } from 'ramda'
import Slider from 'react-slick'
import { LandingDemo, LandingClass, LandingComment, LandingContact, Button } from '@components'
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
      breakpoint: 768,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      },
    },
  ],
}

const demo = [
  {
    avatar: 'demo1.png',
    trackName: 'New Hire Orientation',
    demoNotify: 'Set the right foundation',
  },
  {
    avatar: 'demo2.png',
    trackName: 'Modern Sales Process',
    demoNotify: 'Selling today’s consumer',
  },
  {
    avatar: 'demo3.png',
    trackName: 'Overcoming Objections',
    demoNotify: 'Closing against modern objection',
  },
  {
    avatar: 'demo4.png',
    trackName: 'Phone Training',
    demoNotify: 'Improve your lead capture',
  },
  {
    avatar: 'demo5.png',
    trackName: 'Lead Handing',
    demoNotify: 'Boost closing rates',
  },
  {
    avatar: 'demo6.png',
    trackName: 'Chat Training',
    demoNotify: 'Provide real-time service',
  },
  {
    avatar: 'demo7.png',
    trackName: 'Digital Marketing',
    demoNotify: 'Attract more customers for less',
  },
  {
    avatar: 'demo8.png',
    trackName: 'Sales Management',
    demoNotify: 'Lead your team to new levels',
  },
  {
    avatar: 'demo9.png',
    trackName: 'Leadership & Team Building',
    demoNotify: 'Create the high performers you need',
  },
  {
    avatar: 'demo12.png',
    trackName: 'BDC Management',
    demoNotify: 'Generate and close more opportunities',
  },
  {
    avatar: 'demo10.png',
    trackName: 'Finance & Insurnace',
    demoNotify: 'Boost gross and improve your PVR',
  },
  {
    avatar: 'demo11.png',
    trackName: 'Service Drive Sales',
    demoNotify: 'Amplify the loyalty loop',
  },
]
const classes = [
  {
    brand: 'fal fa-user-plus',
    title: 'New Hire Orientations',
    info: 'Set the right foundation when on boarding',
  },
  {
    brand: 'fal fa-file-certificate',
    title: 'Certifications & Badging',
    info: 'Build competencies and track your teams achievements',
  },
  {
    brand: 'fal fa-keynote',
    title: 'Meetings in a box',
    info: 'Hold quality meetings on the fly',
  },
  {
    brand: 'fal fa-brain',
    title: 'Dealership Training Plans',
    info: 'Ensure continual growth among your people',
  },
]

const comments = [
  {
    comment:
      'I can honestly say before DSU we closed all of our leads at 8%, and since using the University we have closed 13% under 60 days.',
    fullname: 'Craig Waikem',
    role: 'Internet Director',
    company: '',
    avatar: 'Craig Waikem.png',
  },
  {
    comment:
      'With the continued support and training of   University, we have increased the lead count from our website by 35%.',
    fullname: 'Jeremy Rhudy',
    role: 'Internet/ BDC Director',
    company: '',
    avatar: 'Jeremy Rhudy.png',
  },
  {
    comment:
      'I can honestly say before DSU we closed all of our leads at 8%, and since using the University we have closed 13% under 60 days.',
    fullname: 'Craig Waikem',
    role: 'Internet Director',
    company: '',
    avatar: 'Craig Waikem.png',
  },
  {
    comment:
      'With the continued support and training of   University, we have increased the lead count from our website by 35%.',
    fullname: 'Jeremy Rhudy',
    role: 'Internet/ BDC Director',
    company: '',
    avatar: 'Jeremy Rhudy.png',
  },
]

const Landing = props => (
  <div className="develop-landing">
    <div className="section demo">
      <div className="container">
        <Row>
          <Col>
            <div className="custom-item-align flex-column text-wrap w-100 h-100">
              <h2 className="section-title">
                Every Top Performing Team
                <br />
                Is Built on World-Class Training
              </h2>
              <p className="section-detail">Modern training for your dealership</p>
              <Button
                className="demo-btn mt-4 mt-xl-5 "
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

    <div className="section research custom-item-align">
      <div className="container">
        <Row>
          <Col>
            <p className="section-title">
              Training that covers the essential
              <br />
              learning areas for your dealership to succeed
            </p>
            <p className="section-detail">
              With automated on-boarding, career paths, performance reviews, modern training and more,
              <br />
              we not only create a strong culture to attract top talent, but we grow the team once they are there
            </p>
          </Col>
        </Row>
      </div>
      <div className="section demo-section">
        <div className="container">
          <Row className="top-demo mx-auto">
            {length(demo) > 2 &&
              [0, 1, 2].map(index => {
                return (
                  <Col xs={12} sm={6} md={4} key={`demo-${index}`} className="px-0">
                    <LandingDemo
                      avatar={demo[index].avatar}
                      borderColor="#969faa"
                      trackName={demo[index].trackName}
                      demoNotify={demo[index].demoNotify}
                    />
                  </Col>
                )
              })}
          </Row>
          <Row className="middle-demo mx-auto">
            {length(demo) > 8 &&
              [3, 4, 5, 6, 7, 8].map(index => {
                return (
                  <Col xs={12} sm={6} md={4} key={`demo-${index}`} className="px-0">
                    <LandingDemo
                      avatar={demo[index].avatar}
                      trackName={demo[index].trackName}
                      demoNotify={demo[index].demoNotify}
                      onDemo={() => this.props.toggleModal('CTA')}
                    />
                  </Col>
                )
              })}
          </Row>
          <Row className="bottom-demo mx-auto">
            {length(demo) > 11 &&
              [9, 10, 11].map(index => {
                return (
                  <Col xs={12} sm={6} md={4} key={`demo-${index}`} className="px-0">
                    <LandingDemo
                      avatar={demo[index].avatar}
                      borderColor="#969faa"
                      trackName={demo[index].trackName}
                      demoNotify={demo[index].demoNotify}
                      onDemo={() => this.props.toggleModal('CTA')}
                    />
                  </Col>
                )
              })}
          </Row>
          <Row>
            <Col>
              <div className="text-center">
                <Button
                  className="demo-btn m-auto "
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
    </div>
    <div className="section manage custom-item-align mt-4">
      <div className="container">
        <h3 className="section-title">World-Class Curriculum built specifically for dealerships</h3>
        <p className="section-detail">Save your managers time & deliver big in the training moments that matter</p>
        <Row className="section-items mt-0 mb-5">
          {length(classes) > 0 &&
            classes.map((item, index) => {
              return (
                <Col xs={6} sm={3} key={`lclass-${index}`}>
                  <LandingClass brand={item.brand} title={item.title} info={item.info} />
                </Col>
              )
            })}
        </Row>
        <Button
          className="act-btn m-auto"
          onClick={() =>
            props.toggleModal({
              type: 'CTA',
              data: null,
              callBack: null,
            })
          }
        >
          ACT NOW
        </Button>
      </div>
    </div>
    <div className="section comment custom-item-align">
      <div className="container">
        <Row>
          <Col>
            <h3 className="section-title mb-3 text-center">Customer Reviews</h3>
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
    <div className="section asset">
      <LandingContact
        btntitle="CONTACT US"
        onDemoNow={() =>
          props.toggleModal({
            type: 'CTA',
            data: null,
            callBack: null,
          })
        }
        title="Invest in Your People"
        subtitle="Start growing your team today!"
      />
    </div>
  </div>
)

const mapDispatchToProps = dispatch => ({
  toggleModal: e => dispatch(AppActions.modalRequest(e)),
})

export default connect(null, mapDispatchToProps)(Landing)

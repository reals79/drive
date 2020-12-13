import React, { PureComponent } from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import { Row, Col, Image } from 'react-bootstrap'
import Slider from 'react-slick'
import { equals, isEmpty } from 'ramda'
import { Icon, LandingComment, Button } from '@components'
import AppActions from '~/actions/app'
import Team from './team'
import Video from './video'
import './Landing.scss'

function CustomArrow(props) {
  const { className, style, isNext, onClick } = props
  return (
    <div className={className} style={style} onClick={onClick}>
      <Icon name={`far fa-chevron-${isNext ? 'right' : 'left'}`} size={18} color="#fff" />
    </div>
  )
}

const slider1Settings = {
  slidesToShow: 6,
  slidesToScroll: 1,
  infinite: true,
  dots: false,
  nextArrow: <CustomArrow isNext />,
  prevArrow: <CustomArrow isNext={false} />,
  responsive: [
    {
      breakpoint: 992,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 576,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
      },
    },
  ],
}

const slider2Settings = {
  customPaging: function() {
    return <div className="custom-dot" />
  },
  slidesToShow: 2,
  slidesToScroll: 1,
  infinite: true,
  dots: true,
  arrows: false,
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

const brands = [
  '/images/brands/autonation.png',
  '/images/brands/asbury.png',
  '/images/brands/gregg_young_automotive.png',
  '/images/brands/hendrick_automotive_group.png',
  '/images/brands/ken_garff.png',
  '/images/brands/penske_automotive.png',
  '/images/brands/autonation.png',
  '/images/brands/asbury.png',
  '/images/brands/gregg_young_automotive.png',
  '/images/brands/hendrick_automotive_group.png',
  '/images/brands/ken_garff.png',
  '/images/brands/penske_automotive.png',
]

const comments = [
  {
    comment: "Expected it to be similar to Digital Dealer, but in the ways that it wasn't....made it much better!!",
    fullname: 'Amy Boehm',
    role: '',
    company: 'KAR Auto Group',
    avatar: 'Amy Boehm.png',
  },
  {
    comment: "It's always my favorite seminar of the year",
    fullname: 'Brad Lillie',
    role: '',
    company: 'Gregg Young Auto Group',
    avatar: 'Brad Lillie.png',
  },
  {
    comment:
      'This is the best conference I attend every year. I cannot think of any convention that provides more value to me and my company',
    fullname: 'Evan Martin',
    role: '',
    company: 'Autovest',
    avatar: 'Evan Martin.png',
  },
  {
    comment: 'The experience is incredible... The keynotes have the most value - they push you more.',
    fullname: 'Derrick Woolfson',
    role: '',
    company: 'Beltway Companies',
    avatar: 'Derrick Woolfson.png',
  },
  {
    comment:
      "DSES was very refreshing this year. I feel recharged and ready to return to my dealership with a year's worth of knowledge to share and implement!",
    fullname: 'Josh Copeland',
    role: '',
    company: "Taylor's Auto Group",
    avatar: 'Josh Copeland.png',
  },
]

const advanced = [
  {
    id: 0,
    type: 'presidents',
    title: 'Presidents Club',
    detail:
      'Supersized 20 group with some of the most innovative dealers in the industry. Collaborate and learn to grow your brand, your capital and your people.',
    for: 'Owners, GMs, Group Ex, Executives',
    when: 'TBD',
    where: 'TBD',
    link: 'http://www. .com/presidents-club',
  },
  {
    id: 1,
    type: 'dses',
    title: 'DSES',
    detail:
      'Three day executive retreat in Q4 designed to study retail innovation with world-leading experts, to help you write your business plan for next year.',
    for: 'Executive Teams, Owners, GMs, Marketing, GSMs, Fixed Ops',
    when: 'Nov. 2-6, 2020',
    where: 'Attend Virtually',
    link: 'http://www. .com/dses',
  },
  {
    id: 2,
    type: 'leadership',
    title: 'Leadership Academy',
    detail:
      'Two day certification program that teaches the leadership skills and processes needed to build high-performing teams.',
    for: 'Department Managers, HR, Team Leads',
    when: 'Quarterly',
    where: '  Campus, Salt Lake City, UT',
    link: 'https://www. .com/leadership-academy',
  },
  {
    id: 3,
    type: 'webinar',
    title: 'Webinars',
    detail:
      'Quick, actionable training sessions led by   instructors, or industry partners on tactical topics for all your staff.',
    for: 'Store Staff (Varies)',
    when: '4x Monthly',
    link: 'http:// .com/webinar',
  },
]

const fuelings = [
  {
    id: 0,
    type: 'presidents',
    title: '  Presidents Club',
    detail:
      'Dealer Principals, GMs and Group Executives participate in a Super-sized 20 group. Presidents Club meets each spring to bring fresh, innovative strategies to your business. Discover what the top groups in the country are doing to transform their brand, capital, and their people.',
    where: '',
    link: 'http://www. .com/presidents-club',
  },
  {
    id: 1,
    type: 'dses',
    title: '  Executive Summit',
    detail:
      'Entire dealership leadership teams meet in the annual 4th QTR to build your business plans for the next year. Learn strategies and tactics from world-renowned experts and educators from top business schools and prepare your dealership to have its best year ever.',
    where: 'Attend Virtually',
    link: 'http://www. .com/dses',
  },
  {
    id: 2,
    type: 'leadership',
    title: '  Leadership Academy',
    detail:
      'Dealership Managers looking to advance leadership-specific skills collaborate in a hands-on, two-day leadership training course. Leadership Academy focuses on the processes that leaders use to develop high performing teams. Your managers will come away with the tools needed to build successful teams and improve employee performance.',
    where: '  Campus Salt Lake City, UT',
    link: 'https://www. .com/leadership-academy',
  },
  {
    id: 3,
    type: 'webinar',
    title: 'Webinars',
    detail:
      'Dealership employees receive relevant instruction and actionable takeaways they can use to increase traffic, sell more cars, and improve fixed ops performance.  Webinars are free and provide fresh insights to your team on a weekly basis.',
    where: '4 topics each month',
    link: 'http:// .com/webinar',
  },
]

const videos = [
  {
    id: 0,
    type: 'presidents',
    title: 'Presidents Club',
    link: 'https:// .wistia.com/medias/ggsnjniv3m',
  },
  {
    id: 1,
    type: 'dses',
    title: 'DSES',
    link: 'https:// .wistia.com/medias/nr1e1m26wf',
  },
  {
    id: 2,
    type: 'leadership',
    title: 'Leadership Academy',
    link: 'https:// .wistia.com/medias/ckoxxa4fjz',
  },
]

const links = [
  {
    id: 0,
    type: 'presidents',
    link: 'http://www. .com/presidents-club',
  },
  {
    id: 1,
    type: 'dses',
    link: 'http://www. .com/dses',
  },
  {
    id: 2,
    type: 'leadership',
    link: 'https://www. .com/leadership-academy',
  },
  {
    id: 3,
    type: 'webinar',
    link: 'http:// .com/webinar',
  },
]

class Landing extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      nav1: null,
      nav2: null,
    }
    this.advanceRef = React.createRef()
    this.handleClick = this.handleClick.bind(this)
  }

  componentDidMount() {
    this.setState({
      nav1: this.slider1,
      nav2: this.slider2,
    })
  }

  handleClick() {
    ReactDOM.findDOMNode(this.advanceRef.current).scrollIntoView()
  }

  render() {
    return (
      <div className="events-landing">
        <div className="section top">
          <div className="container">
            <Row>
              <Col>
                <h2 className="section-title">  Events</h2>
                <p className="section-detail mb-5">The highest quality, most forward-thinking training experiences.</p>
                <Button className="demo-btn m-auto" onClick={this.handleClick}>
                  LEARN MORE
                </Button>
              </Col>
            </Row>
          </div>
        </div>
        <div className="section advanced" ref={this.advanceRef}>
          <div className="container-fluid">
            <h3 className="section-title mt-lg-0 mt-md-5">Advanced training experiences to grow your team.</h3>
            <p className="section-detail">
              Each event is tailored to specific job roles, covers relevant topics, and brings in multiple experts to
              drive performance at your store.
            </p>
            <Row className="mt-md-5 px-5 mt-sm-1">
              {advanced.map(team => (
                <Col xs={12} lg={3} sm={6} md={6} key={team.id}>
                  <Team size="small" className="mb-3" type={team.type} title={team.title} link={team.link} />
                  <p className="dsl-b16 training-detail">{team.detail}</p>
                  <div className="d-flex mt-3">
                    <p className="dsl-b16 team-label">For:</p>
                    <p className="dsl-b16">{team.for}</p>
                  </div>
                  <div className="d-flex">
                    <p className="dsl-b16 team-label">When:</p>
                    <p className="dsl-b16">{team.when}</p>
                  </div>
                  {team.where && (
                    <div className="d-flex">
                      <p className="dsl-b16 team-label">Where:</p>
                      <p className="dsl-b16">{team.where}</p>
                    </div>
                  )}
                </Col>
              ))}
            </Row>
          </div>
        </div>
        <div className="section slider">
          <div className="container-fluid">
            <h3 className="section-title">  is trusted to educate the top automotive retailers in world.</h3>
            <p className="section-detail">Join and learn with the most progressive minds in the industry.</p>
            <Slider
              className="comment-slider"
              asNavFor={this.state.nav2}
              ref={slider => (this.slider1 = slider)}
              {...slider1Settings}
            >
              {brands.map((item, index) => (
                <div className="brand-image-view" key={`brands-${index}`}>
                  <div className="d-flex align-items-center justify-content-center slider-img-wrap">
                    <Image className="brand-image" src={item} />
                  </div>
                </div>
              ))}
            </Slider>
            <Slider
              className="comment-slider"
              asNavFor={this.state.nav1}
              ref={slider => (this.slider2 = slider)}
              {...slider2Settings}
            >
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
          </div>
        </div>
        <div className="section fueling">
          <div className="container-fluid">
            <h3 className="section-title">Fueling Excellence</h3>
            <p className="section-detail">
              World class performance is built on world class training.
              <br />
              Invest in your success and register today.
            </p>
            {fuelings.map((team, index) => (
              <Row
                className={`mt-3 mt-md-5 px-xl-5 px-md-2 w-100 ${equals(index % 2, 0) ? '' : 'flex-md-row-reverse'}`}
                key={team.id}
              >
                <Col sm={12} md={6} className="justify-content-md-start justify-content-sm-center d-flex">
                  <Team size="medium" type={team.type} />
                </Col>
                <Col sm={12} md={6} className="mt-3">
                  <p className="dsl-b22 bold title">{team.title}</p>
                  <p className="dsl-b16 description">{team.detail}</p>
                  <p className="dsl-b16 bold description">{team.where}</p>
                  {team.link && (
                    <Button
                      type="medium"
                      className="learn-more-btn"
                      onClick={() => !isEmpty(team.link) && window.open(team.link, '_self')}
                    >
                      LEARN MORE
                    </Button>
                  )}
                </Col>
              </Row>
            ))}
          </div>
        </div>
        <div className="section glimpse">
          <div className="container">
            <h3 className="section-title">Get a Glimpse of the Experience</h3>
            <p className="section-detail">See what you can experience at each of our events.</p>
            <Row className="mt-4">
              {videos.map(video => (
                <Col sm={12} md={6} lg={4} key={video.id} className="mb-4">
                  <Video title={video.title} type={video.type} url={video.link} onModal={this.props.toggleModal} />
                </Col>
              ))}
            </Row>
          </div>
        </div>
        <div className="section attend">
          <div className="container">
            <h3 className="section-title">Who Should Attend These Events?</h3>
            <p className="section-detail"></p>
            <div className="section-graph">
              <Image className="attend-image" src="/images/landing/events_attend_graph.png" />
            </div>
          </div>
        </div>
        <div className="section links">
          <div className="container">
            <div className="d-flex img-wrap">
              {links.map(({ id, type, link }) => (
                <Button
                  type="link"
                  className="link-button"
                  onClick={() => !isEmpty(link) && window.open(link, '_self')}
                >
                  <Image className="link-button-image w-75" src={`/images/landing/events_${type}_logo.png`} />
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  toggleModal: e => dispatch(AppActions.modalRequest(e)),
})

export default connect(null, mapDispatchToProps)(Landing)

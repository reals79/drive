import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Row, Col, Button } from 'react-bootstrap'
import moment from 'moment'
import Slider from 'react-slick'
import { equals, length, keys, splitEvery, isEmpty, indexOf } from 'ramda'
import { CheckIcon, Icon, CareerPagination } from '@components'
import AppActions from '~/actions/app'
import DevActions from '~/actions/develop'
import { CareerProgramStatus, AssetsURL } from '~/services/config'
import RequiredHabits from './RequiredHabits'
import './CareerSlider.scss'

function CustomArrow(props) {
  const { className, style, onClick, name } = props
  return (
    <div className={className} style={{ ...style, display: 'block' }} onClick={onClick}>
      <Icon name={`fal fa-angle-${name}`} color="#c3c7cc" size={35} />
    </div>
  )
}

class CareerSlider extends React.PureComponent {
  state = {
    pageIndex: this.props.currentJob,
    page: 0,
    isPromoteRequested: false,
  }

  componentDidMount() {
    const { currentCompanyInfo, userId, programs, fetchReports } = this.props
    if (isEmpty(programs)) {
      fetchReports(currentCompanyInfo.id, userId)
    }
  }

  handlePageChange(e) {
    this.setState({ pageIndex: e, page: 0 })
  }

  handlePromotion(id) {
    const { promotionCard, promoteUser, toggleModal } = this.props
    if (isEmpty(promotionCard)) return
    promoteUser(id)
    const payload = {
      type: 'Approval Task',
      data: { before: promotionCard },
      callBack: null,
    }
    toggleModal(payload)
    this.setState({ isPromoteRequested: true })
  }

  render() {
    const { currentJob, habits, developments, programs } = this.props
    const { pageIndex, isPromoteRequested, page } = this.state
    const devs = splitEvery(10, developments[pageIndex])[page]
    const pages = Math.floor((length(developments[pageIndex]) + 5) / 10)

    return (
      <div className="career-slider">
        <Slider
          infinite
          prevArrow={<CustomArrow name="left" />}
          nextArrow={<CustomArrow name="right" />}
          initialSlide={currentJob}
          afterChange={e => this.handlePageChange(e)}
        >
          {programs.map((program, key) => (
            <div className="item px-0" key={key}>
              <p className="dsl-b20 bold">{program.title}</p>
              <p className="dsl-b14">
                Started :{' '}
                {moment
                  .utc(program.created_at)
                  .local()
                  .format('M/D/YY')}
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                {CareerProgramStatus[program.status]} :{' '}
                {moment
                  .utc(program.updated_at)
                  .local()
                  .format('M/D/YY')}
              </p>

              <div className="mt-4">
                <div className="block px-0">
                  <Row className="line bold pl-3">
                    <Col className=" header-title" xs={6}>
                      <span className="dsl-b14">Performance Requirements</span>
                    </Col>
                    <Col className="text-center" xs={3}>
                      <span className="dsl-b14">Target</span>
                    </Col>
                    <Col className="text-center " xs={3}>
                      <span className="dsl-b14">Actual</span>
                    </Col>
                  </Row>
                  {program.data.achievements.map(require => (
                    <Row className="row-item py-1 pl-3" key={require.item_id}>
                      <Col className="" xs={6}>
                        <div className="align-items-center">
                          <CheckIcon checked={equals(require.status, 1)} />
                          <div className="l-content text-left">
                            <span className={`${equals(require.status, 1) ? 'dsl-d14 text-line-through' : 'dsl-b14'}`}>
                              {require.text
                                .replace(/%20/g, ' ')
                                .replace(/%22/g, ' ')
                                .replace(/%25/g, ' ')}
                            </span>
                            <br />
                            {equals(require.status, 1) && require.completed_at && (
                              <span className="dsl-d12">
                                Completed:{' '}
                                {moment
                                  .utc(require.completed_at)
                                  .local()
                                  .format('M/D/YYYY')}
                              </span>
                            )}
                          </div>
                        </div>
                      </Col>
                      <Col className="text-center" xs={3}>
                        <span>{require.item_id}</span>
                      </Col>
                      <Col className="text-center cursor-pointer blue-text" xs={3}>
                        <input className="perform-actual" type="number" />
                      </Col>
                    </Row>
                  ))}
                </div>

                {length(keys(habits[pageIndex])) > 0 && (
                  <div className="block px-0 habits-block">
                    <Row className="line bold pl-3">
                      <Col className=" header-title" xs={6}>
                        <span>Required Habits</span>
                      </Col>
                      <Col className="text-center " xs={3}>
                        <span>Target</span>
                      </Col>
                      <Col className="text-center " xs={3}>
                        <span>Actual</span>
                      </Col>
                    </Row>
                    <RequiredHabits data={habits[pageIndex]} />
                  </div>
                )}

                {length(developments[pageIndex]) > 0 && (
                  <>
                    <div className="development-block block px-0">
                      <Row className="line bold pl-3">
                        <Col className="header-title" xs={6}>
                          <span>Development</span>
                        </Col>
                        <Col className="text-center" xs={2}>
                          <span>Modules</span>
                        </Col>
                        <Col className="text-center" xs={2}>
                          <span>Completed</span>
                        </Col>
                        <Col className="text-center" xs={2}>
                          <span>Status</span>
                        </Col>
                      </Row>

                      {devs.map(dev => {
                        const url =
                          !isEmpty(dev.thumb_url) &&
                          indexOf('', dev.thumb_url) < 0 &&
                          indexOf('amazonaws.com', dev.thumb_url) < 0
                            ? `${AssetsURL}${dev.thumb_url}`
                            : dev.thumb_url
                        const thumb_url = isEmpty(url) ? '/images/no-image.jpg' : url
                        return (
                          <Row className="row-item py-1 pl-3" key={dev.id}>
                            <Col xs={6}>
                              <div className="align-items-center">
                                <CheckIcon checked={equals(dev.module_totals.COMPLETE[1], 100)} />
                                <div className="image-wrapper">
                                  <div className="thumb-image" style={{ backgroundImage: `url('${thumb_url}')` }} />
                                </div>
                                <div className="l-content text-left">
                                  <span
                                    className={`${
                                      equals(dev.module_totals.COMPLETE[1], 100)
                                        ? 'dsl-d14 text-line-through'
                                        : 'dsl-b14'
                                    }`}
                                  >
                                    {dev.name}
                                  </span>
                                </div>
                              </div>
                              <div className="l-content text-left">
                                <span
                                  className={`${
                                    equals(dev.module_totals.COMPLETE[1], 100) ? 'dsl-d14 text-line-through' : 'dsl-b14'
                                  }`}
                                >
                                  {dev.name}
                                </span>
                              </div>
                              <div className="l-content text-left">
                                <span
                                  className={`${
                                    equals(dev.module_totals.COMPLETE[1], 100) ? 'dsl-d14 text-line-through' : 'dsl-b14'
                                  }`}
                                >
                                  {dev.name}
                                </span>
                              </div>
                            </Col>
                            <Col className="text-center" xs={2}>
                              <span>{dev.module_totals.TOTAL[0]}</span>
                            </Col>
                            <Col className="text-center" xs={2}>
                              <span>{dev.module_totals.COMPLETE[0]}</span>
                            </Col>
                            <Col className="text-center" xs={2}>
                              <span>{equals(program.job_status, 'not started') ? 'Not Started' : dev.status}</span>
                            </Col>
                          </Row>
                        )
                      })}
                    </div>
                    {length(developments[pageIndex]) > 10 && (
                      <CareerPagination
                        currentPage={page + 1}
                        totalPages={pages}
                        onPage={e => this.setState({ page: e - 1 })}
                        onNext={() => page + 1 < pages && this.setState({ page: page + 1 })}
                        onPrev={() => page > 0 && this.setState({ page: page - 1 })}
                      />
                    )}
                  </>
                )}
              </div>
              <div className="text-right pr-4">
                <Button
                  variant="primary"
                  disabled={program.status < 4 || isPromoteRequested}
                  className="rounded-circle px-4"
                  onClick={() => this.handlePromotion(program.company_id)}
                >
                  Request Promotion
                </Button>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    )
  }
}

CareerSlider.propTypes = {
  employeeName: PropTypes.string,
  currentCompanyInfo: PropTypes.object,
  programs: PropTypes.array,
  requirements: PropTypes.array,
  habits: PropTypes.array,
  developments: PropTypes.array,
  mapRequest: PropTypes.func,
}

CareerSlider.defaultProps = {}

const mapStateToProps = state => ({
  employeeName: state.app.first_name + ' ' + state.app.last_name,
  userId: state.app.id,
  currentCompanyInfo: state.app.company_info,
  currentJob: state.develop.careerCurJobIndex,
  jobs: state.develop.careerJobs,
  programs: state.develop.careerPrograms,
  requirements: state.develop.careerRequirements,
  habits: state.develop.careerHabits,
  developments: state.develop.careerDevelopments,
  promotionCard: state.develop.careerPromotionCard,
})

const mapDispatchToProps = dispatch => ({
  fetchReports: (companyId, userId) => dispatch(DevActions.careerdevreportsRequest(companyId, userId)),
  promoteUser: companyId => dispatch(DevActions.careerpromoteRequest(companyId)),
  toggleModal: e => dispatch(AppActions.modalRequest(e)),
})

export default connect(mapStateToProps, mapDispatchToProps)(CareerSlider)

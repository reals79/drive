import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Row, Col } from 'react-bootstrap'
import { equals, isNil, filter, find, propEq } from 'ramda'
import moment from 'moment'
import classNames from 'classnames'
import { Icon, LearnChildField, Thumbnail, CheckIcon, EditDropdown } from '@components'
import { UserRoles, AdminDotsType } from '~/services/config'
import './LearnFeedGrid.scss'

class LearnFeedGrid extends Component {
  constructor(props) {
    super(props)

    this.state = {
      direction: 'bottom',
      assignees: [],
      scroll: false,
    }
    this.handleDetailsViewClick = this.handleDetailsViewClick.bind(this)
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { employees, card } = nextProps
    const employeeList = []
    const assignees = []
    if (!isNil(card.data.users)) {
      for (const user of card.data.users) {
        const employee = find(propEq('id', user), employees)
        if (!isNil(employee)) {
          employeeList.push(employee)
        }
      }
      for (const emp of employeeList) {
        assignees.push({ value: emp.id, label: emp.name })
      }
      return { assignees }
    }
    return null
  }

  handleScroll(event) {
    const { card } = this.props
    if (card.data.child_count < 5) return
    const bottom = (card.data.child_count - 4) * 85
    if (event.currentTarget.scrollTop >= bottom) {
      this.setState({ direction: 'top' })
    } else if (equals(event.currentTarget.scrollTop, 0)) {
      this.setState({ direction: 'bottom' })
    }
  }

  handleDetailsViewClick = card => {
    this.props.onChange('detail view', card)
  }

  render() {
    const { card, dueDate, modules, onClickChild, role, userId, programId, assignedBy, dataCy } = this.props
    const { direction, scroll } = this.state
    const { data } = card
    const overlay = card.retention_quiz ? (
      <div className="overlay">
        <div className="quiz-mark">
          <Icon name="fal fa-question-circle" color="#676767" />
          <span className="dsl-m12 mt-3">Retention Quiz</span>
        </div>
      </div>
    ) : null

    let dotsMenu = filter(x => !equals('Assign', x) && !equals('Bulk Unassign', x), AdminDotsType)
    if (role >= UserRoles.USER && !equals(assignedBy, userId)) {
      dotsMenu = filter(x => !equals('Edit', x), dotsMenu)
    }

    return (
      <div className="learn-feed-grid" data-cy={dataCy}>
        <Row className="custom-row" data-cy="trainingFeedStat">
          <Col
            className={`d-flex tab-device pr-0 ${equals(data.child_count, data.completed) && 'completed'}`}
            sm={12}
            md={7}
          >
            <CheckIcon className="custom-checkbox" size={26} checked={equals(data.child_count, data.completed)} />
            <div className="d-flex d-flex-1 justify-content-between">
              <div className="course-title ml-2">
                <p className="dsl-m12 text-400 mb-0 align-items-center mb-1" data-cy="feedAssignBy">
                  {isNil(programId)
                    ? equals(assignedBy, userId)
                      ? 'Self Assigned'
                      : 'Manager Assigned'
                    : `Program Assigned : `}
                </p>
                <p className="dsl-m16 text-400 line-height-22 mb-2" data-cy="feedTitle">
                  {data.name}
                </p>
              </div>
              <div className="due-date" data-cy="dueDate">
                <p className="dsl-m12 text-400 mb-0 text-right mb-1">Due Date</p>
                <p className="dsl-m16 text-400 text-right mb-1 ">
                  <span className="desktop-screen">{dueDate}</span>
                  <span className="mobile-screen">{moment(dueDate).format('MMM DD')}</span>
                </p>
              </div>
            </div>
          </Col>
          <Col sm={12} md={5} className="custom-tab-width pr-0 desktop-screen" data-cy="feedModuleAssignStat">
            <div className="mheader ml-3">
              <div className="d-flex-2 pl-2 tablet-screen" data-cy="moduleCount">
                <p className="dsl-m12 text-400 px-2 text-center">Modules</p>
                <p className="dsl-m16 text-center text-400">{data.child_count || 0}</p>
              </div>
              <div className="d-flex-2 pl-2 tablet-screen" data-cy="moduleCompleted">
                <p className="dsl-m12 text-400 px-2 text-center">Completed</p>
                <p className="dsl-m16 text-center text-400">{data.completed || 0}</p>
              </div>
              <div className="d-flex-2 pl-2 tablet-screen" data-cy="moduleRemaining">
                <p className="dsl-m12 text-400 px-2 text-center">Remaining</p>
                <p className="dsl-m16 text-center text-400">{data.child_count - data.completed || 0}</p>
                {/* <p className="dsl-b16 text-center bold">{feedData.remaining}</p> */}
              </div>
              <div className="d-flex-1 mr-auto cursor-pointer pr-4 justify-content-md-end" data-cy="feedEditDropdown">
                <EditDropdown options={dotsMenu} onChange={e => this.props.onChange(e, card)} />
              </div>
            </div>
          </Col>
        </Row>
        <Row>
          <Col sm={12} md={7} className="pr-md-0 pr-sm-5">
            <Thumbnail
              onClick={() => onClickChild(0, 'course')}
              src={data.thumb_url}
              size="responsive"
              overlay={overlay}
              className="cursor-pointer"
              dataCy="feedThumbnail"
            />
            <Col sm={12} md={5} className="custom-tab-width pr-0 mt-3 mb-5 mobile-screen p-0">
              <div className="mheader" onClick={this.handleDetailsViewClick.bind(this, card)}>
                <div className="mobile-tab" data-cy="moduleCountMobile">
                  <p className="dsl-b16 text-center text-600 mb-2">{data.child_count || 0}</p>
                  <p className="dsl-m12 text-400 px-2">Modules</p>
                </div>
                <div className="pl-2 mobile-tab" data-cy="moduleCompletedMobile">
                  <p className="dsl-b16 text-center text-600 mb-2">{data.completed || 0}</p>
                  <p className="dsl-m12 text-400 px-2">Completed</p>
                </div>
                <div className="pl-2  mobile-tab" data-cy="moduleRemainingMobile">
                  <p className="dsl-b16 text-center text-600 mb-2">{data.child_count - data.completed || 0}</p>
                  <p className="dsl-m12 text-400 px-2">Remaining</p>
                  {/* <p className="dsl-b16 text-center bold">{feedData.remaining}</p> */}
                </div>
              </div>
            </Col>
            <div className="pt-4 feed-description desktop-screen" data-cy="feedDescription">
              <p className="dsl-b16 description line-height-22">{data.description}</p>
            </div>
          </Col>
          <Col sm={12} md={5}>
            <div
              data-cy="videoModuleList"
              className={classNames('desktop-screen mx-height', scroll && 'mcontent')}
              onScroll={e => this.handleScroll(e)}
            >
              {modules.map(
                (child, index) =>
                  (scroll || (index < 4 && !scroll)) && (
                    <LearnChildField
                      key={child.id}
                      type={child.card_type_id}
                      name={child.data.name || child.name}
                      dataCy={`feedLearnChildField${index}`}
                      status={child.status}
                      disabled={card.retention_quiz && !equals(child.card_type_id, 16)}
                      onClick={() => onClickChild(index, 'module')}
                    />
                  )
              )}
            </div>
            {modules.length > 4 && (
              <div className="main-blue d-center mt-4 d-flex" onClick={() => this.setState({ scroll: !scroll })}>
                <span className="dsl-p14">{!scroll ? 'MORE' : 'LESS'} MODULES&nbsp;</span>
                <Icon name={!scroll ? 'far fa-angle-down' : 'far fa-angle-up'} size={14} color="#376caf" />
              </div>
            )}
            {card.child_count > 4 && (
              <div className="main-blue d-center mt-4 desktop-screen" data-cy="feedMoreModule">
                <span className="dsl-p12 bold">More Modules</span>
                <Icon
                  name={`far ml-2 bold ${equals(direction, 'top') ? 'fa-angle-up' : 'fa-angle-down'}`}
                  size={12}
                  color="#376caf"
                />
              </div>
            )}
          </Col>
        </Row>
      </div>
    )
  }
}

LearnFeedGrid.propTypes = {
  type: PropTypes.number,
  role: PropTypes.number,
  trackName: PropTypes.string,
  card: PropTypes.any,
  modules: PropTypes.any,
  dueDate: PropTypes.string,
  onClick: PropTypes.func,
  onClickChild: PropTypes.func,
  onModal: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
}

LearnFeedGrid.defaultProps = {
  type: 1,
  role: 1,
  trackName: 'New Hire Orientation',
  card: {},
  modules: {},
  dueDate: '3/26/2018',
  onClick: () => {},
  onClickChild: () => {},
  onModal: () => {},
  onUpdate: () => {},
  onDelete: () => {},
}

const mapStateToProps = state => ({
  employees: state.app.employees,
  userId: state.app.id,
  role: state.app.app_role_id,
})

export default connect(mapStateToProps, null)(LearnFeedGrid)

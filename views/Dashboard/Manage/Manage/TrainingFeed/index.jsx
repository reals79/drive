import React, { Component } from 'react'
import { connect } from 'react-redux'
import { clone, equals, isNil, split } from 'ramda'
import { toast } from 'react-toastify'
import moment from 'moment'
import {
  ErrorBoundary,
  Filter,
  LearnFeedGrid as FeedGrid,
  ViewMoreLearnPagination as ViewMorePagination,
} from '@components'
import AppActions from '~/actions/app'
import DevActions from '~/actions/develop'
import MngActions from '~/actions/manage'
import { SPECIALOPTIONS } from '~/services/config'
import './TrainingFeed.scss'

class TrainingFeed extends Component {
  state = { userId: this.props.userId, perPage: 10, page: 1 }

  componentDidMount() {
    const { userId, page, perPage } = this.state
    this.handleFetchCourses(userId, page, perPage)
  }

  handleFetchCourses = (userId, page, perPage, other = '') => {
    if (userId < 0) return
    this.props.getFeeds({
      userId,
      page,
      perPage,
      sort: 'ASC',
      type: 'courses',
      other,
    })
  }

  handleFilter = (type, data) => {
    const { userId, page, perPage } = this.state
    if (equals('employee', type)) {
      if (data[0].id < 0) {
        this.handleFetchCourses(userId, page, perPage)
      } else {
        this.setState({ userId: data[0].id })
        this.handleFetchCourses(data[0].id, page, perPage)
      }
    } else if (type === 'company' && data[0].id > 0) {
      this.handleFetchCourses(userId, page, perPage, `company_id=${data[0].id}`)
    }
  }

  showModal(course) {
    if (equals(course.data.child_count, 0) || isNil(course.data.child_count)) return
    this.props.resetAttactedURL()
    const { page, perPage } = this.state
    this.props.toggleModal({
      type: 'Preview',
      data: { before: { course, module: course.children[0], page, perPage }, after: null },
      callBack: null,
    })
  }

  showChild(index, card, type) {
    const { page, perPage } = this.state
    if (equals(card.data.child_count, 0) || isNil(card.data.child_count)) {
      toast.warn(`Sorry, the course has no any module.`, {
        position: toast.POSITION.BOTTOM_CENTER,
        pauseOnFocusLoss: false,
        hideProgressBar: true,
      })
      return
    }
    const remainingCount = card.data.child_count - card.data.completed
    index =
      remainingCount == 0 && index == 0
        ? 0
        : remainingCount !== 0 && index == 0 && type == 'course'
        ? card.data.completed
        : index

    const modalData = clone(this.props.modalData)
    if (isNil(index)) return
    if (isNil(modalData.before)) modalData.before = {}

    this.props.resetAttactedURL()
    if (isNil(card)) {
      modalData.before.module = modalData.before.course.children[index]
      modalData.before.prevmodule = modalData.before.course.children[index - 1]
      modalData.before.index = index
      modalData.before.page = page
      modalData.before.perPage = perPage
    } else {
      modalData.before.course = card
      modalData.before.module = card.children[index]
      modalData.before.prevmodule = card.children[index - 1]
      modalData.before.index = index
      modalData.before.page = page
      modalData.before.perPage = perPage
    }

    this.props.toggleModal({
      type: 'Preview',
      data: modalData,
      callBack: null,
    })
  }

  handleChange = () => {
    const { userId, perPage, page } = this.state
    const _perPage = perPage + 10

    this.setState({ perPage: _perPage })
    this.handleFetchCourses(userId, page, _perPage)
  }

  handleDeleteCourse = course => {
    const { userId, perPage, page } = this.state
    this.props.updateCardInstance({
      event: 'delete',
      cardId: course.id,
      card: course,
      after: {
        type: 'FETCHFEEDS_REQUEST',
        payload: { userId, page, perPage, type: 'courses' },
      },
    })
  }

  handleChangeMenu = (event, card) => {
    const { companyInfo } = this.props
    switch (event) {
      case 'detail view': {
        this.props.history.push({
          pathname: `/library/training/courses/${card.card_template_id}/view`,
          state: { card },
        })
        break
      }
      case 'edit': {
        const { page, perPage, userId } = this.state
        this.props.toggleModal({
          type: 'Quick Edit',
          data: {
            before: {
              template: card,
              type: 'courses',
              from: 'instance',
              companyId: companyInfo.id,
              after: {
                type: 'FETCHFEEDS_REQUEST',
                payload: { userId, page, perPage, type: 'courses' },
              },
            },
          },
          callBack: {
            onDelete: () => {
              this.handleDeleteCourse(card)
            },
          },
        })
        break
      }
      case 'preview view': {
        this.showChild(0, card)
        break
      }
      case 'quick assign': {
        this.props.toggleModal({
          type: 'Quick Assign',
          data: { before: { template: card, type: 'Course' }, after: null },
          callBack: null,
        })
        break
      }
      default:
        break
    }
  }

  render() {
    const { courses } = this.props
    if (isNil(courses)) return null

    const { userId, perPage, page } = this.state
    const cards = courses.data
    const pages = courses.last_page

    return (
      <ErrorBoundary className="dev-develop-feed" dataCy="trainingFeedShowcase">
        <Filter type="individual" removed={[[], [SPECIALOPTIONS.LIST]]} onChange={this.handleFilter} />

        <div className="feed-header">
          <p className="dsl-b22 bold">Training Feed</p>
        </div>

        {cards.map((card, index) => {
          const dueDate = isNil(card.due_at)
            ? moment(split(' ', card.updated_at)[0])
                .add(Number(card.data.estimated_completion), 'days')
                .format('MMM D, YY')
            : moment(card.due_at).format('MMM D, YY')
          return (
            <FeedGrid
              key={card.id}
              dataCy={`trainingFeedItem${index}`}
              type={card.card_type_id}
              card={card}
              trackName={card.track_name}
              programId={card.program_id}
              assignedBy={card.assigned_by}
              userId={userId}
              modules={card.children}
              dueDate={dueDate}
              onClick={() => this.showModal(card)}
              onClickChild={(index, type) => this.showChild(index, card, type)}
              onUpdate={(type, id) => this.props.updateTask(type, card.id)}
              onDelete={id => this.props.deleteTask(id)}
              onModal={e => this.props.toggleModal(e)}
              onChange={this.handleChangeMenu}
            />
          )
        })}
        <ViewMorePagination
          dataCy="trainingFeedViewMore"
          pages={pages}
          current={page}
          showing={perPage}
          onChange={this.handleChange}
        />
      </ErrorBoundary>
    )
  }
}

const mapStateToProps = state => ({
  userId: state.app.id,
  companyInfo: state.app.company_info,
  courses: state.develop.instances.courses,
  modalData: state.app.modalData,
})

const mapDispatchToProps = dispatch => ({
  deleteTask: cardId => dispatch(MngActions.deletetaskRequest(cardId, 'course')),
  getFeeds: e => dispatch(DevActions.fetchfeedsRequest(e)),
  resetAttactedURL: () => dispatch(AppActions.uploadSuccess('')),
  toggleModal: payload => dispatch(AppActions.modalRequest(payload)),
  updateCardInstance: e => dispatch(DevActions.updatecardinstanceRequest(e)),
  updateTask: (event, cardId) => dispatch(MngActions.updatetaskRequest(event, cardId)),
})

export default connect(mapStateToProps, mapDispatchToProps)(TrainingFeed)

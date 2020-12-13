import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { toast } from 'react-toastify'
import { equals, find, propEq, findIndex, move, remove, length, clone, path } from 'ramda'
import {
  ErrorBoundary,
  LibraryTrackCard as TrackCard,
  LibraryCourseCard as CourseCard,
  LibraryModuleCard as ModuleCard,
} from '@components'
import AppActions from '~/actions/app'
import DevActions from '~/actions/develop'

class TrainingDetail extends Component {
  constructor(props) {
    super(props)

    const type = props.match.params.activeTab
    const id = props.match.params.id
    const track = find(propEq('id', Number(id)), props.libTracks.data) || null // track, course, module
    const course = find(propEq('id', Number(id)), props.libCourses.data) || null
    const module = find(propEq('id', Number(id)), props.libModules.data) || null

    this.state = { id, type, track, course, module }

    this.handleCardMenu = this.handleCardMenu.bind(this)
    this.handleChildMenu = this.handleChildMenu.bind(this)
    this.handleDeleteTemplate = this.handleDeleteTemplate.bind(this)
    this.handleShowDetail = this.handleShowDetail.bind(this)
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const id = nextProps.match.params.id
    const type = nextProps.match.params.activeTab
    const card = path(['state', 'card'], nextProps.location)
    const track = find(propEq('id', Number(id)), nextProps.libTracks.data) || card
    const course = find(propEq('id', Number(id)), nextProps.libCourses.data) || card
    const module = find(propEq('id', Number(id)), nextProps.libModules.data) || card

    return { type, track, course, module }
  }

  handleCardMenu(event) {
    const { type, track, course, module } = this.state
    let card = track

    if (equals('courses', type)) {
      card = course
    } else if (equals('modules', type)) {
      card = module
    }

    switch (event) {
      case 'edit':
        const id = card.card_template_id ? card.card_template_id : card.id
        const filter = this.props.history.location.state.filter || ''
        const page = this.props.history.location.state.page || 1
        this.props.history.push({
          pathname: `/library/training/${type}/${id}/edit`,
          state: {
            card,
            filter,
            page,
          },
        })
        break

      case 'preview view':
        {
          if (equals(type, 'tracks')) {
            toast.info('Upcoming Soon.', {
              position: toast.POSITION.TOP_CENTER,
            })
          }
          if (equals(type, 'courses')) {
            this.props.toggleModal({
              type: 'Preview',
              data: { before: { course, module: course.children[0], index: 0 }, after: null },
              callBack: null,
            })
          }
          if (equals(type, 'modules')) {
            this.props.toggleModal({
              type: 'Preview',
              data: {
                before: { course: { children: [module] }, module: module, index: 0 },
                after: null,
              },
              callBack: null,
            })
          }
        }
        break

      default:
        break
    }
  }

  handleChildMenu(event, item) {
    const { type, track, course } = this.state
    const { companyId } = this.props

    switch (event) {
      case 'detail view': {
        this.handleShowDetail(item, 'view')
        break
      }
      case 'edit': {
        this.handleShowDetail(item, 'edit')
        break
      }
      case 'preview view': {
        let payload = {}
        if (equals(type, 'tracks')) {
          payload = {
            type: 'Preview',
            data: { before: { course: item, module: item.children[0], index: 0 }, after: null },
            callBack: null,
          }
          this.props.toggleModal(payload)
        }
        if (equals(type, 'courses')) {
          const index = findIndex(propEq('id', item.id), course.children)
          if (index > -1) {
            payload = {
              type: 'Preview',
              data: { before: { course, module: { ...item, status: 0 }, index }, after: null },
              callBack: null,
            }
            this.props.toggleModal(payload)
          }
        }
        break
      }
      case 'quick assign': {
        if (equals(type, 'track')) {
          this.props.toggleModal({
            type: 'Quick Edit',
            data: {
              before: {
                template: item,
                type: `courses`,
                from: 'template',
                after: null,
                deletable: false,
                companyId,
              },
            },
            callBack: {
              onDelete: () => this.handleDeleteTemplate(item),
            },
          })
        }
        break
      }
      case 'move up': {
        if (equals('courses', type)) {
          const index = findIndex(propEq('id', item.id), course.children)
          if (index > -1) {
            let newModules = clone(course.data.modules)
            let newCourses = clone(course.children)

            if (equals(index, 0)) return
            newModules = move(index, index - 1, newModules)
            newCourses = move(index, index - 1, newCourses)

            const cards = newModules.map((item, key) => {
              return {
                blocked_by: equals(key, 0) ? null : newModules[key - 1].card_template_id,
                card_template_id: item.card_template_id,
                card_type_id: item.card_type_id,
                complete_course: 0,
                delay_days: 0,
              }
            })
            const newCourse = {
              ...course,
              children: newCourses,
              data: {
                ...course.data,
                modules: cards,
                module_count: length(newModules),
                thumb_url: course.data.thumbnail,
              },
            }
            const payload = {
              template: newCourse,
            }
            const filter = this.props.history.location.state.filter || ''
            const page = this.props.history.location.state.page || 1
            const after = {
              type: 'LIBRARYTEMPLATES_REQUEST',
              payload: { current: page, filter: filter, mode: 'courses', per: 25 },
            }
            this.props.saveTemplate(payload, null, null, null, null, 'courses', after)
          }
        }
        if (equals('tracks', type)) {
          const index = findIndex(propEq('id', item.id), track.data.cards)
          if (index > -1) {
            let newCards = clone(track.data.cards)
            if (equals(index, 0)) return
            newCards = move(index, index - 1, newCards)

            let modules = 0
            const cards = newCards.map(({ id, blocked_by, children }) => {
              modules = modules + length(children)
              return {
                alert_manager: '0',
                blocked_by: blocked_by,
                card_template_id: id,
                card_type: 'course',
                complete_track: '0',
              }
            })
            const newTrack = {
              ...track,
              data: {
                ...track.data,
                cards,
                course_count: length(cards),
                module_count: modules,
                thumb_url: track.thumbnail,
              },
            }
            const payload = {
              track: newTrack,
            }
            const after = {
              type: 'LIBRARYTRACKDETAIL_REQUEST',
              payload: { data: newTrack },
            }
            this.props.saveTemplate(payload, null, null, null, null, 'tracks', after)
          }
        }
        break
      }
      case 'move down': {
        if (equals('courses', type)) {
          const index = findIndex(propEq('id', item.id), course.children)
          if (index > -1) {
            let newModules = clone(course.data.modules)
            let newCourses = clone(course.children)
            if (equals(index + 1, length(newModules))) return

            newModules = move(index, index + 1, newModules)
            newCourses = move(index, index + 1, newCourses)

            const cards = newModules.map((item, key) => {
              return {
                blocked_by: equals(key, 0) ? null : newModules[key - 1].card_template_id,
                card_template_id: item.card_template_id,
                card_type_id: item.card_type_id,
                complete_course: 0,
                delay_days: 0,
              }
            })
            const newCourse = {
              ...course,
              children: newCourses,
              data: {
                ...course.data,
                modules: cards,
                module_count: length(newModules),
                thumb_url: course.data.thumbnail,
              },
            }
            const payload = {
              template: newCourse,
            }
            const filter = this.props.history.location.state.filter || ''
            const page = this.props.history.location.state.page || 1
            const after = {
              type: 'LIBRARYTEMPLATES_REQUEST',
              payload: { current: page, filter: filter, mode: 'courses', per: 25 },
            }
            this.props.saveTemplate(payload, null, null, null, null, 'courses', after)
          }
        }
        if (equals('tracks', type)) {
          const index = findIndex(propEq('id', item.id), track.data.cards)
          if (index > -1) {
            let newCards = clone(track.data.cards)

            if (equals(index + 1, length(newCards))) return
            newCards = move(index, index + 1, newCards)

            let modules = 0
            const cards = newCards.map(({ id, blocked_by, children }) => {
              modules = modules + length(children)
              return {
                alert_manager: '0',
                blocked_by: blocked_by,
                card_template_id: id,
                card_type: 'course',
                complete_track: '0',
              }
            })
            const newTrack = {
              ...track,
              data: {
                ...track.data,
                cards,
                course_count: length(cards),
                module_count: modules,
                thumb_url: track.thumbnail,
              },
            }
            const payload = {
              track: newTrack,
            }
            const after = {
              type: 'LIBRARYTRACKDETAIL_REQUEST',
              payload: { data: newTrack },
            }
            this.props.saveTemplate(payload, null, null, null, null, 'tracks', after)
          }
        }
        break
      }
      case 'remove': {
        if (equals('courses', type)) {
          const index = findIndex(propEq('id', item.id), course.children)
          if (index > -1) {
            let newModules = clone(course.data.modules)
            let newCourses = clone(course.children)

            newModules = remove(index, 1, newModules)
            newCourses = remove(index, 1, newCourses)

            const cards = newModules.map((item, key) => {
              return {
                blocked_by: equals(key, 0) ? null : newModules[key - 1].card_template_id,
                card_template_id: item.card_template_id,
                card_type_id: item.card_type_id,
                complete_course: 0,
                delay_days: 0,
              }
            })
            const newCourse = {
              ...course,
              children: newCourses,
              data: {
                ...course.data,
                modules: cards,
                module_count: length(newModules),
                thumb_url: course.data.thumbnail,
              },
            }
            const payload = {
              template: newCourse,
            }
            const filter = this.props.history.location.state.filter || ''
            const page = this.props.history.location.state.page || 1
            const after = {
              type: 'LIBRARYTEMPLATES_REQUEST',
              payload: { current: page, filter: filter, mode: 'courses', per: 25 },
            }
            this.props.saveTemplate(payload, null, null, null, null, 'courses', after)
          }
        }
        if (equals('tracks', type)) {
          const index = findIndex(propEq('id', item.id), track.data.cards)
          if (index > -1) {
            let newCards = clone(track.data.cards)

            newCards = remove(index, 1, newCards)

            let modules = 0
            const cards = newCards.map(({ id, blocked_by, children }) => {
              modules = modules + length(children)
              return {
                alert_manager: '0',
                blocked_by: blocked_by,
                card_template_id: id,
                card_type: 'course',
                complete_track: '0',
              }
            })
            const newTrack = {
              ...track,
              data: {
                ...track.data,
                cards,
                course_count: length(cards),
                module_count: modules,
                thumb_url: track.thumbnail,
              },
            }
            const payload = {
              track: newTrack,
            }
            const after = {
              type: 'LIBRARYTRACKDETAIL_REQUEST',
              payload: { data: newTrack },
            }
            this.props.saveTemplate(payload, null, null, null, null, 'tracks', after)
          }
        }
        break
      }
      default:
        break
    }
  }

  handleShowDetail(card, mode = 'view') {
    const { type } = this.state
    if (equals('tracks', type)) {
      this.setState({ type: 'courses' })
      this.props.history.push({
        pathname: `/library/training/courses/${card.id}/${mode}`,
        state: {
          card,
        },
      })
    } else if (equals('courses', type)) {
      this.setState({ type: 'modules' })
      this.props.history.push({
        pathname: `/library/training/modules/${card.id}/${mode}`,
        state: {
          card,
        },
      })
    }
  }

  handleDeleteTemplate(template) {
    this.props.deleteTemplate({
      libType: 'template',
      event: 'delete',
      templateId: template.id,
      after: null,
    })
  }

  render() {
    const { userRole, authors, departments, competencies, categories, history } = this.props
    const { type, track, module, course } = this.state

    return (
      <ErrorBoundary>
        {equals('tracks', type) && track && (
          <TrackCard.Detail
            data={track}
            role={userRole}
            authors={authors}
            departments={departments}
            competencies={competencies}
            categories={categories}
            history={history}
            onModal={e => this.props.toggleModal(e)}
            onCardMenu={this.handleCardMenu}
            onChildMenu={this.handleChildMenu}
          />
        )}
        {equals('courses', type) && course && (
          <CourseCard.Detail
            data={course}
            role={userRole}
            authors={authors}
            departments={departments}
            competencies={competencies}
            categories={categories}
            history={history}
            onModal={e => this.props.toggleModal(e)}
            onCardMenu={this.handleCardMenu}
            onChildMenu={this.handleChildMenu}
          />
        )}
        {equals('modules', type) && module && (
          <ModuleCard.Detail
            data={module}
            role={userRole}
            authors={authors}
            departments={departments}
            competencies={competencies}
            categories={categories}
            history={history}
            onModal={e => this.props.toggleModal(e)}
            onCardMenu={this.handleCardMenu}
          />
        )}
      </ErrorBoundary>
    )
  }
}

TrainingDetail.propTypes = {
  userRole: PropTypes.number,
  libTracks: PropTypes.shape({
    data: PropTypes.array,
  }),
  libCourses: PropTypes.shape({
    data: PropTypes.array,
  }),
  libModules: PropTypes.shape({
    data: PropTypes.array,
  }),
  authors: PropTypes.any,
  departments: PropTypes.array,
  competencies: PropTypes.array,
  categories: PropTypes.array,
  toggleModal: PropTypes.func,
  deleteTemplate: PropTypes.func,
}
TrainingDetail.defaultProps = {
  userRole: 1,
  libTracks: { data: [] },
  libCourses: { data: [] },
  libModules: { data: [] },
  authors: [],
  departments: [],
  competencies: [],
  categories: [],
  toggleModal: () => {},
  deleteTemplate: () => {},
}

const mapStateToProps = state => ({
  userRole: state.app.app_role_id,
  libTracks: state.develop.templates.tracks,
  libCourses: state.develop.templates.courses,
  libModules: state.develop.templates.modules,
  authors: state.app.authors,
  departments: state.app.departments,
  competencies: state.app.competencies,
  categories: state.app.categories,
  companyId: state.app.company_info.id,
})

const mapDispatchToProps = dispatch => ({
  saveTemplate: (payload, image, video, pdf, file, mode, after) =>
    dispatch(DevActions.librarytemplatesaveRequest(payload, image, video, pdf, file, mode, after)),
  toggleModal: e => dispatch(AppActions.modalRequest(e)),
  deleteTemplate: e => dispatch(DevActions.libraryeventRequest(e)),
})

export default connect(mapStateToProps, mapDispatchToProps)(TrainingDetail)

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Tabs, Tab } from 'react-bootstrap'
import { toast } from 'react-toastify'
import queryString from 'query-string'
import { compose, dropLast, equals, find, head, isEmpty, isNil, join, juxt, tail, toUpper, propEq } from 'ramda'
import {
  Filter,
  Search,
  Pagination,
  ErrorBoundary,
  LibraryStatus as Status,
  LibraryTrackCard as TrackCard,
  LibraryCourseCard as CourseCard,
  LibraryModuleCard as ModuleCard,
  Dropdown,
} from '@components'
import AppActions from '~/actions/app'
import DevActions from '~/actions/develop'
import { LibraryTrainingTabs } from '~/services/config'
import './TrainingList.scss'

const pointFreeUpperCase = compose(dropLast(1), compose(join(''), juxt([compose(toUpper, head), tail])))

class TrainingList extends Component {
  constructor(props) {
    super(props)

    const regExp = /^\/library\/training+\/\w+\/((\w+)|(\d+)\/\w+)$/g
    const str = props.locations[0]
    let activeTab = 'courses'
    if (regExp.test(str)) activeTab = str.split('/')[3]

    const values = queryString.parse(props.location.search)
    if (!isNil(values.active) && !isEmpty(values.active)) {
      activeTab = values.active
      props.history.replace('/library/training')
    }

    this.state = { filter: null, activeTab, page: 1, per: 25 } // ['tracks', 'courses', 'modules']
    this.handleAdd = this.handleAdd.bind(this)
    this.handlePage = this.handlePage.bind(this)
    this.handlePer = this.handlePer.bind(this)
    this.handleTab = this.handleTab.bind(this)
    this.handleSelectMenu = this.handleSelectMenu.bind(this)
    this.handleDeleteTemplate = this.handleDeleteTemplate.bind(this)
    this.handleNavigation = this.handleNavigation.bind(this)
  }

  componentDidMount() {
    if (this.props.history.action !== 'POP') {
      const { filter, activeTab, page, per } = this.state
      this.props.getTemplates(filter, activeTab, page, per)
    }
  }

  handleAdd() {
    const { activeTab } = this.state
    this.props.history.push(`/library/training/${activeTab}/new`)
  }

  handleSearch(e) {
    const { activeTab, per } = this.state
    const filter = e.target.value
    this.props.getTemplates(filter, activeTab, 1, per)
    this.setState({ filter, page: 1 })
  }

  handlePage(page) {
    const { filter, activeTab, per } = this.state
    this.props.getTemplates(filter, activeTab, page, per)
    this.setState({ page })
  }

  handlePer(per) {
    const { activeTab, filter, page } = this.state
    this.props.getTemplates(filter, activeTab, page, per)
    this.setState({ per })
  }

  handleTab(tab) {
    const { per } = this.state
    this.props.getTemplates('', tab, 1, per)
    this.setState({ activeTab: tab, page: 1, filter: '' })
  }

  handleDeleteTemplate(template) {
    const { filter, activeTab, page, per } = this.state
    this.props.deleteTemplate({
      libType: equals(activeTab, 'tracks') ? 'track' : 'template',
      event: 'delete',
      templateId: template.id,
      after: {
        type: 'LIBRARYTEMPLATES_REQUEST',
        payload: { filter, mode: activeTab, current: page, per },
      },
    })
  }

  handleSelectMenu(event, item) {
    const { activeTab } = this.state
    const { companyId } = this.props
    switch (event) {
      case 'assign': {
        let payload = {
          type: 'Assign Training',
          data: {
            before: {
              disabled: equals(activeTab, 'courses') ? ['tracks'] : ['courses'],
              modules: [item],
              companyId,
            },
            after: null,
          },
          callBack: {},
        }
        if (equals(activeTab, 'modules')) {
          toast.info('Upcoming Soon.', {
            position: toast.POSITION.TOP_CENTER,
          })
          return
        }
        this.props.toggleModal(payload)
        break
      }
      case 'detail view': {
        this.handleNavigation(item.id, 'view')
        break
      }
      case 'edit': {
        this.handleNavigation(item.id, 'edit')
        break
      }
      case 'preview view': {
        if (equals(activeTab, 'tracks')) {
          toast.info('Upcoming Soon.', {
            position: toast.POSITION.TOP_CENTER,
          })
          return
        }
        let payload = {
          type: 'Preview',
          data: { before: { course: item, module: item.children[0], index: 0 }, after: null },
          callBack: null,
        }
        if (equals(activeTab, 'modules')) {
          payload = {
            type: 'Preview',
            data: { before: { course: { children: [item] }, module: item, index: 0 }, after: null },
            callBack: null,
          }
        }
        this.props.toggleModal(payload)
        break
      }
      case 'quick assign': {
        this.props.toggleModal({
          type: 'Quick Edit',
          data: {
            before: {
              template: item,
              type: activeTab,
              from: 'template',
              after: null,
              companyId,
            },
          },
          callBack: {
            onDelete: () => this.handleDeleteTemplate(item),
          },
        })
        break
      }
      case 'delete':
        this.props.toggleModal({
          type: 'Confirm',
          data: {
            before: {
              title: 'Delete',
              body: 'Are you sure you want to delete this item?',
            },
          },
          callBack: {
            onYes: () => this.handleDeleteTemplate(item),
          },
        })
        break
      case 'group training':
        const payload = {
          type: 'Preview',
          data: {
            before: { course: item, module: item.children[0], index: 0, attendance: true },
            after: null,
          },
          callBack: null,
        }
        this.props.toggleModal(payload)
        break
      default:
        break
    }
  }

  handleNavigation(id, mode) {
    const { activeTab, filter, page } = this.state

    if (equals(activeTab, 'tracks')) {
      const track = find(propEq('id', id), this.props.templates.tracks.data)
      if (!isNil(track)) {
        this.props.getTrackDetail(
          { data: track },
          {
            pathname: `/library/training/${activeTab}/${id}/${mode}`,
            state: { filter, page },
          }
        )
      }
    } else {
      this.props.history.push({
        pathname: `/library/training/${activeTab}/${id}/${mode}`,
        state: { filter, page },
      })
    }
  }

  render() {
    const { userRole, templates, employees, toggleModal } = this.props
    const { activeTab } = this.state

    return (
      <ErrorBoundary className="dev-library-training" dataCy="training-library-libraryShowcase">
        <Filter
          aligns={['left', 'right']}
          addTitle={pointFreeUpperCase(activeTab)}
          onAdd={this.handleAdd}
          dataCy={`training-library-${activeTab}-filterSection`}
        />
        <div className="bg-white pt-4">
          <p className="dsl-b22 bold mb-0">Training Library</p>
          <div className="d-flex justify-content-end">
            <Search onChange={e => this.handleSearch(e)} dataCy={`training-library-${activeTab}-search`} />
          </div>
        </div>
        <div className="custom-dropdown-mobile">
          <Dropdown
            className="px-1 pb-2 mobile-screen"
            dataCy={`training-library-${activeTab}-dropdown`}
            data={LibraryTrainingTabs}
            defaultIds={[1]}
            returnBy="data"
            getValue={e => e.label}
            onChange={e => this.handleTab(e[0].name)}
          />
        </div>
        <Tabs
          className="bg-white px-4 d-none d-md-flex"
          data-cy={`training-library-${activeTab}-tab`}
          defaultActiveKey="tracks"
          id="training"
          activeKey={activeTab}
          onSelect={this.handleTab}
        >
          <Tab eventKey="tracks" title="Tracks" data-cy="training-library-tracksTabContent">
            <Status type="Tracks" dataCy="training-library-tracksStatus" showToggle counts={templates.tracks.total} />
            <TrackCard.List
              userRole={userRole}
              data={templates.tracks.data}
              onToggle={this.handleNavigation}
              onModal={e => toggleModal(e)}
              onSelect={this.handleSelectMenu}
            />
          </Tab>
          <Tab eventKey="courses" title="Courses" data-cy={`training-library-coursesTabContent`}>
            <Status
              type="Courses"
              showToggle
              dataCy="training-library-coursesStatus"
              counts={templates.courses.total}
            />
            <CourseCard.List
              userRole={userRole}
              data={templates.courses.data}
              employees={employees}
              onToggle={this.handleNavigation}
              onModal={e => toggleModal(e)}
              onSelect={this.handleSelectMenu}
            />
          </Tab>
          <Tab eventKey="modules" title="Modules" data-cy={`training-library-modulesTabContent`}>
            <Status
              type="Modules"
              showToggle
              dataCy="training-library-modulesStatus"
              counts={templates.modules.total}
            />
            <ModuleCard.List
              userRole={userRole}
              data={templates.modules.data}
              onModal={e => toggleModal(e)}
              onSelect={this.handleSelectMenu}
              onToggle={this.handleNavigation}
            />
          </Tab>
        </Tabs>
        <Pagination
          per={Number(templates[activeTab].per_page)}
          current={templates[activeTab].current_page}
          total={templates[activeTab].last_page}
          onChange={this.handlePage}
          onPer={this.handlePer}
        />
      </ErrorBoundary>
    )
  }
}

TrainingList.propTypes = {
  userRole: PropTypes.number,
  templates: PropTypes.any,
  employees: PropTypes.array,
  toggleModal: PropTypes.func,
  getTemplates: PropTypes.func,
  deleteTemplate: PropTypes.func,
  getTrackDetail: PropTypes.func,
}

TrainingList.defaultProps = {
  userRole: 1,
  templates: {},
  employees: [],
  toggleModal: () => {},
  getTemplates: () => {},
  deleteTemplate: () => {},
  getTrackDetail: e => {},
}

const mapStateToProps = state => ({
  userRole: state.app.app_role_id,
  templates: state.develop.templates,
  companyId: state.app.company_info.id,
  employees: state.app.employees,
  locations: state.app.locations,
})

const mapDispatchToProps = dispatch => ({
  getTemplates: (filter, mode, current = 1, per = 10) =>
    dispatch(DevActions.librarytemplatesRequest({ filter, mode, current, per })),
  deleteTemplate: e => dispatch(DevActions.libraryeventRequest(e)),
  getTrackDetail: (e, route) => dispatch(DevActions.librarytrackdetailRequest(e, route)),
  toggleModal: e => dispatch(AppActions.modalRequest(e)),
})

export default connect(mapStateToProps, mapDispatchToProps)(TrainingList)

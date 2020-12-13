import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Tabs, Tab } from 'react-bootstrap'
import { equals, dropLast, filter, find, propEq } from 'ramda'
import {
  ErrorBoundary,
  Filter,
  Search,
  Pagination,
  LibraryStatus as Status,
  LibraryProgramsCareer as CareerCard,
  LibraryProgramsCertification as CertificationCard,
  Dropdown,
} from '@components'
import AppActions from '~/actions/app'
import DevActions from '~/actions/develop'
import { ProgramTypes, LibraryProgramTabs } from '~/services/config'
import './Program.scss'

class ProgramList extends Component {
  constructor(props) {
    super(props)

    const regExp = /^\/library\/programs\/\w+\/((\w+)|(\d+)\/\w+)$/g
    const str = props.locations[0]
    let activeTab = 'careers'
    if (regExp.test(str)) activeTab = str.split('/')[3]

    this.state = { activeTab, filter: null, page: 1, per: 25 }

    this.handleModal = this.handleModal.bind(this)
    this.handleOpenDetail = this.handleOpenDetail.bind(this)
    this.handlePage = this.handlePage.bind(this)
    this.handlePer = this.handlePer.bind(this)
    this.handleSearch = this.handleSearch.bind(this)
    this.handleTab = this.handleTab.bind(this)
    this.handleChangeMenu = this.handleChangeMenu.bind(this)
  }

  componentDidMount() {
    if (this.props.history.action !== 'POP') {
      const { filter, activeTab, page, per } = this.state
      this.props.getTemplates(filter, activeTab, page, per)
      this.props.getQuotaOptions()
    }
  }

  handleModal(e) {
    this.props.toggleModal(e)
  }

  handlePage(page) {
    const { activeTab, filter, per } = this.state
    this.props.getTemplates(filter, activeTab, page, per)
    this.setState({ page })
  }

  handlePer(per) {
    const { activeTab, filter, page } = this.state
    this.props.getTemplates(filter, activeTab, page, per)
    this.setState({ per })
  }

  handleSearch(e) {
    const filter = e.target.value
    const { activeTab, page, per } = this.state
    this.props.getTemplates(filter, activeTab, page, per)
    this.setState({ filter: e.target.value })
  }

  handleTab(tab) {
    this.props.getTemplates('', tab, 1, this.state.per)
    this.setState({ activeTab: tab, page: 1, filter: '' })
  }

  handleOpenDetail(id) {
    const { activeTab, filter, page } = this.state
    const program = find(propEq('id', id), this.props.templates[activeTab].data)
    this.props.getProgramDetail(program, activeTab, {
      pathname: `/library/programs/${activeTab}/${id}/view`,
      state: { filter, page },
    })
  }

  handleDeleteProgram(template) {
    const { activeTab, filter, page, per } = this.state
    this.props.deleteTemplate({
      libType: 'program',
      event: 'delete',
      templateId: template.id,
      after: {
        type: 'LIBRARYTEMPLATES_REQUEST',
        payload: { filter, mode: activeTab, current: page, per },
      },
    })
  }

  handleChangeMenu(event, program) {
    const { activeTab } = this.state
    const { companyId } = this.props
    const disabled = filter(x => !equals(x, activeTab), ProgramTypes)

    switch (event) {
      case 'assign': {
        const payload = {
          type: 'Assign Program',
          data: {
            before: { modules: [program], disabled, levels: program.data.levels, companyId },
            after: [],
          },
          callBack: null,
        }
        this.props.toggleModal(payload)
        break
      }
      case 'detail view': {
        this.props.getProgramDetail(program, activeTab, {
          pathname: `/library/programs/${activeTab}/${program.id}/view`,
          state: { filter: this.state.filter, page: this.state.page },
        })
        break
      }
      case 'edit': {
        this.props.getProgramDetail(program, activeTab, `/library/programs/${activeTab}/${program.id}/edit`)
        break
      }
      case 'quick assign': {
        this.props.toggleModal({
          type: 'Quick Assign',
          data: {
            before: {
              template: program,
              type: activeTab,
              from: 'template',
              after: null,
              companyId,
            },
          },
          callBack: {
            onDelete: () => this.handleDeleteProgram(program),
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
            onYes: () => this.handleDeleteProgram(program),
          },
        })
        break
      case 'duplicate':
        this.props.toggleModal({
          type: 'Duplicate Module',
          data: {
            before: {
              type: activeTab,
              object: program,
            },
          },
          callBack: null,
        })
        break
      default:
        break
    }
  }

  render() {
    const { activeTab } = this.state
    const { userRole, templates } = this.props

    return (
      <ErrorBoundary className="dev-library-programs">
        <Filter
          addTitle={dropLast(1, activeTab)}
          onAdd={() => this.props.history.push(`/library/programs/${activeTab}/new`)}
        />
        <div className="bg-white pt-4">
          <p className="dsl-b22 bold mb-0">Programs</p>
          <div className="d-flex justify-content-end">
            <Search onChange={this.handleSearch} />
          </div>
        </div>
        <div className="custom-dropdown-mobile">
          <Dropdown
            className="px-1 pb-2 mobile-screen"
            data={LibraryProgramTabs}
            defaultIds={[0]}
            returnBy="data"
            getValue={e => e.label}
            onChange={e => this.handleTab(e[0].name)}
          />
        </div>
        <Tabs
          className="program-tabs d-none d-md-flex"
          defaultActiveKey="careers"
          activeKey={activeTab}
          id="lib-programs"
          onSelect={this.handleTab}
        >
          <Tab eventKey="careers" title="Careers">
            <Status type="Careers" showToggle counts={templates.careers.total} />
            <CareerCard.List
              role={userRole}
              data={templates.careers.data}
              onModal={this.handleModal}
              onToggle={this.handleOpenDetail}
              onChange={this.handleChangeMenu}
            />
          </Tab>
          <Tab eventKey="certifications" title="Certifications">
            <Status type="Certifications" showToggle counts={templates.certifications.total} />
            <CertificationCard.List
              role={userRole}
              data={templates.certifications.data}
              onModal={this.handleModal}
              onToggle={this.handleOpenDetail}
              onChange={this.handleChangeMenu}
            />
          </Tab>
          {/* comment out the badge tab for now because it is an upcoming feature */}
          {/* <Tab eventKey="badges" title="Badges">
            <Status type="Badges" showToggle counts={templates.badges.total} />
            <BadgeCard.List
              role={userRole}
              data={templates.badges.data}
              onModal={this.handleModal}
              onToggle={id => this.props.history.push(`/library/programs/badges/${id}/view`)}
            />
          </Tab> */}
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

ProgramList.propTypes = {
  userRole: PropTypes.number,
  templates: PropTypes.any,
  getTemplates: PropTypes.func,
  deleteTemplate: PropTypes.func,
  toggleModal: PropTypes.func,
}

ProgramList.defaultProps = {
  userRole: 1,
  templates: {},
  getTemplates: () => {},
  deleteTemplate: () => {},
  toggleModal: () => {},
}

const mapStateToProps = state => ({
  userRole: state.app.app_role_id,
  templates: state.develop.templates,
  locations: state.app.locations,
  companyId: state.app.company_info.id,
})

const mapDispatchToProps = dispatch => ({
  getTemplates: (filter, mode, current = 1, per = 10) =>
    dispatch(DevActions.librarytemplatesRequest({ filter, mode, current, per })),
  deleteTemplate: e => dispatch(DevActions.libraryeventRequest(e)),
  getProgramDetail: (payload, type, route) => dispatch(DevActions.libraryprogramdetailRequest(payload, type, route)),
  getQuotaOptions: () => dispatch(DevActions.getquotaoptionsRequest()),
  toggleModal: e => dispatch(AppActions.modalRequest(e)),
})

export default connect(mapStateToProps, mapDispatchToProps)(ProgramList)

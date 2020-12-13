import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { concat, clone, equals, find, includes, isEmpty, isNil, length, merge, propEq, uniqBy } from 'ramda'
import { Modal } from 'react-bootstrap'
import OutsideClickHandler from 'react-outside-click-handler'
import { LearnFeedGrid } from '@components'
import {
  AdvancedEdit,
  AttachLibrary,
  AssignDocument,
  AssignProgram,
  AssignToDo,
  AssignTraining,
  QuickAssign,
  QuickEdit,
} from './Assign'
import AddAdmin from './AddAdmin'
import AddCategory from './AddCategory'
import AddCompany from './AddCompany'
import AddCompanyBlog from './AddCompanyBlog'
import AddEmployee from './AddEmployee'
import AddGlobalAuthor from './AddGlobalAuthor'
import AddInternalAuthor from './AddInternalAuthor'
import EditInternalAuthor from './EditInternalAuthor'
import AddForum from './AddForum'
import AddNewModule from './AddNewModule'
import AddNewQuota from './AddNewQuota'
import AddDocument from './AddDocument'
import AddNewTask from './AddNewTask'
import AddOwner from './AddOwner'
import AddPacket from './AddPacket'
import AddRating from './AddRating'
import AdvancedSearch from './AdvancedSearch'
import AddQuotaStars from './AddQuotaStars'
import ApprovalTask from './ApprovalTask'
import AddNewProject from './AddNewProject'
import AddProduct from './AddProduct'
import Authentication from './Authentication'
import Confirm from './Confirm'
import Comment from './Comment'
import CTA from './CTA'
import DuplicateModule from './DuplicateModule'
import EditBlogPost from './EditBlogPost'
import EditCourse from './EditCourse'
import EditProject from './EditProject'
import EditTask from './EditTask'
import GobalAuthorConfiguration from './GobalAuthorConfiguration'
import HCMConfiguration from './HCMConfiguration'
import BlogConfiguration from './BlogConfiguration'
import HCMLicenses from './HCMLicenses'
import BasicProductConfiguration from './BasicProductConfiguration'
import PlusProductConfiguration from './PlusProductConfiguration'
import PremiumProductConfiguration from './PremiumProductConfiguration'
import Important from './Important'
import InputActuals from './InputActuals'
import SaveActuals from './SaveActuals'
import Preview from './Preview'
import LoginModal from './LoginModal'
import PreviewDocument from './PreviewDocument'
import QuotaEmployeeList from './QuotaEmployeeList'
import RateVendor from './RateVendor'
import ScorecardDetail from './ScorecardDetail'
import TaskDetail from './TaskDetail'
import { BusinessHCMConfig, BusinessBlogConfig, BusinessProductConfig } from './Company'
import Success from './Success'
import ResetPassword from './ResetPassword'
import AddHabit from './AddHabit'
import UpgradeCompanyProfile from './UpgradeCompanyProfile'
import UploadBackgroundImage from './UploadBackgroundImage'
import UploadVendorAvatar from './UploadVendorAvatar'
import SocialNetwork from './SocialNetwork'

import AppActions from '~/actions/app'
import ComActions from '~/actions/community'
import DevActions from '~/actions/develop'
import ManageActions from '~/actions/manage'
import VenActions from '~/actions/vendor'

import './Modals.scss'

class AppModal extends Component {
  constructor(props) {
    super(props)
    const _index = props.data.before && props.data.before.index ? props.data.before.index : 0
    this.state = { isChanged: false, entity: '', _index, isFeed: false }
    this.hideModal = this.hideModal.bind(this)
    this.handleConfirm = this.handleConfirm.bind(this)
    // Dismiss modals when reloading...
    if (equals(window.performance.navigation.type, 1)) {
      this.hideModal()
    }
  }

  hideModal(e) {
    const { type, data } = this.props
    let after = null

    if (!isNil(e) && !isEmpty(e)) {
      if (!isNil(data.after) && !isEmpty(data.after)) {
        const all = concat(data.after, e)
        after = uniqBy(x => x.id, all)
      } else {
        after = e
      }
    } else {
      if (includes('Add New Module', type)) {
        after = this.props.data.after
      }
    }

    this.props.toggleModal({
      type: '',
      data: { before: null, after },
      callBack: null,
    })
  }

  handleConfirm() {
    if (equals(this.state.isChanged, true)) {
      this.props.toggleModal({
        type: 'Confirm',
        data: {
          before: {
            title: 'Confirm',
            body:
              'Are you sure you want to navigate away and lose your information ? You have an unfinished ' +
              this.state.entity +
              '.',
            description:
              'The information you just worked with will be erased and you will need to start from the scratch next time.',
          },
        },
        callBack: {
          onYes: () => {
            this.setState({ isChanged: false })
          },
        },
      })
    } else {
      this.hideModal()
    }
  }

  handleUpdate(payload, image, video, pdf, file, type) {
    if (equals(type, 'tracks')) {
    } else if (equals(type, 'courses')) {
    } else {
      this.props.saveTemplate(payload, image, video, pdf, file, type)
      this.hideModal()
    }
  }

  handleChange(value) {
    this.setState({ isChanged: true })
    this.setState({ entity: value })
  }

  handleAdvancedSearch(ids) {
    const { data, searchTemplate } = this.props
    searchTemplate({ mode: data.before.mode, filter: data.before.filter, ids })
    this.hideModal()
  }

  previewSetCurrentCourse(course) {
    const { data } = this.props
    data.before.course = course
    this.props.toggleModal({
      type: null,
      data,
      callBack: null,
    })
  }

  previewSetCurrentModule(index, module) {
    const { data } = this.props
    const newData = {
      ...data,
      before: {
        ...data.before,
        index,
        module: isNil(module.locked) ? merge(module, { locked: 0, status: 0 }) : module,
      },
    }
    this.props.toggleModal({
      type: null,
      data: newData,
      callBack: null,
    })
  }

  previewGetCurrentModule(e) {
    const data = clone(e.data)
    data.name = e.name
    data.child_count = e.children.length
    return data
  }

  previewShowChild(index, card) {
    if (isNil(index)) return
    this.props.resetAttactedURL()
    if (isNil(card)) {
      this.previewSetCurrentModule(index, this.props.data.before.course.children[index])
      this.setState({ _index: Number(index), isFeed: false })
    } else {
      this.previewSetCurrentCourse(card)
      this.previewSetCurrentModule(index, card.children[index])
      this.setState({ _index: Number(index), isFeed: false })
    }
  }

  previewPreviousFeed() {
    const { data } = this.props
    const { index } = data.before
    if (equals(index, 0)) {
      return
    }
    this.props.resetAttactedURL()
    this.previewSetCurrentModule(index - 1, data.before.course.children[index - 1])
    this.setState({ _index: index - 1 })
  }

  previewNextFeed() {
    const { data } = this.props
    const { index } = data.before
    if (equals(index + 1, data.before.course.data.child_count)) {
      this.hideModal()
      return
    }
    this.props.resetAttactedURL()
    this.previewSetCurrentModule(index + 1, data.before.course.children[index + 1])
    this.setState({ _index: index + 1 })
  }

  previewCardRate() {
    console.log('rating module clicked')
  }

  previewSaveAndExit() {
    this.setState({ _index: 0 })
    this.hideModal()
  }

  previewUpdateCard(e, page, perPage) {
    const { data } = this.props
    this.props.updateCard(e, data.before.module.id, page, perPage, data.before.after)
  }

  previewFileUpload(payload) {
    this.props.upload(payload)
  }

  previewResetQuiz(e) {
    this.props.resetQuiz(e.data.assessment_id)
  }

  previewAddAttachment(attachments) {
    const { data } = this.props
    const newAttachments = [...data.before.module.data.attachments, ...attachments]
    const payload = data.before.module.setIn(['data', 'attachments'], newAttachments)
    this.props.updateModule(payload)
  }

  previewVideoState(e) {
    const { data } = this.props
    const cardState = {
      id: data.before.module.id,
      name: data.before.module.data.name,
      card_type_id: data.before.module.card_type_id,
      card_template_id: data.before.module.card_template_id,
      feed_id: data.before.module.feed_id,
      parent_id: data.before.module.parent_id,
      status: data.before.module.status,
      played: e.played,
      playedSeconds: e.playedSeconds,
    }
    this.props.updateVideoState(cardState)
  }

  previewLockedModule() {
    const { data } = this.props
    if (isNil(data.before.course)) {
      return null
    }
    for (const index in data.before.course.children) {
      if (equals(data.before.course.children[index].id, data.before.module.blocked_by)) {
        return Number(index)
      }
    }
    return null
  }

  previewToggleFeed() {
    this.setState({ isFeed: !this.state.isFeed })
  }

  render() {
    const { show, type, data, callback, templates, instances } = this.props
    const { authors, departments, competencies, categories } = this.props
    const { attachedURL } = this.props
    const {
      avatar,
      user,
      userId,
      token,
      companyId,
      name,
      managerId,
      userRole,
      employees,
      companies,
      projects,
      review,
      careerReport,
      certificationReport,
      locations,
      vrCompanies,
      vendorCategories,
      departmentsList,
    } = this.props
    const lockedBy = equals(data?.before?.module?.locked, 1) ? this.previewLockedModule() : null
    const prevModule = data?.before?.prevmodule?.data
    const { isFeed } = this.state
    const MODALS = []

    const company = find(propEq('id', companyId), companies) || {}
    const _departments = company.departments || []
    const roles = company.job_roles || []

    if (isNil(type)) return null
    if (includes('Add Company', type)) {
      MODALS.push(
        <Modal className="app-modal large add-employee-modal" key="dsm-0" show={show} onHide={this.hideModal}>
          <AddCompany />
        </Modal>
      )
    } else if (includes('Add Employee', type)) {
      MODALS.push(
        <Modal className="app-modal large add-employee-modal" key="dsm-1" show={show} onHide={this.hideModal}>
          <AddEmployee
            roles={roles}
            departments={_departments}
            onAdd={e => this.props.addUsers(e, companyId)}
            onModal={e => this.props.toggleModal(e)}
            onClose={this.hideModal}
          />
        </Modal>
      )
    } else if (includes('Add Company Blog', type)) {
      MODALS.push(
        <Modal className="app-modal large" key="dsm-2" show={show} onHide={this.hideModal}>
          <AddCompanyBlog
            authors={authors}
            departments={departments}
            competencies={competencies}
            categories={categories}
            userId={userId}
            companyId={companyId}
            onSubmit={e => this.props.createBlog(e)}
            onClose={this.hideModal}
          />
        </Modal>
      )
    } else if (includes('Add Global Author', type)) {
      MODALS.push(
        <Modal className="app-modal small" key="dsm-62" centered show={show} onHide={this.hideModal}>
          <AddGlobalAuthor onClose={this.hideModal} />
        </Modal>
      )
    } else if (includes('Add Internal Author', type)) {
      MODALS.push(
        <Modal className="app-modal small" key="dsm-63" centered show={show} onHide={this.hideModal}>
          <AddInternalAuthor data={data.before} onClose={this.hideModal} />
        </Modal>
      )
    } else if (includes('Edit Internal Author', type)) {
      MODALS.push(
        <Modal className="app-modal small" key="dsm-64" centered show={show} onHide={this.hideModal}>
          <EditInternalAuthor data={data.before} onClose={this.hideModal} />
        </Modal>
      )
    } else if (includes('Add New Module', type)) {
      MODALS.push(
        <Modal className="app-modal large" key="dsm-3" show={show} onHide={this.hideModal}>
          <AddNewModule
            authors={authors}
            departments={departments}
            competencies={competencies}
            categories={categories}
            onCreate={(e, image, video, pdf, file) => this.handleUpdate(e, image, video, pdf, file, 'modules')}
            onClose={this.hideModal}
          />
        </Modal>
      )
    } else if (includes('Add New Quota', type)) {
      MODALS.push(
        <Modal className="app-modal small" key="dsm-4" show={show} onHide={this.hideModal}>
          <AddNewQuota
            authors={authors}
            departments={departments}
            competencies={competencies}
            categories={categories}
            onCreate={e => this.props.createQuota(e)}
            onClose={this.hideModal}
          />
        </Modal>
      )
    } else if (includes('Add Owner', type)) {
      MODALS.push(
        <Modal className="app-modal large" key="dsm-5" show={show} onHide={this.hideModal}>
          <AddOwner onClose={this.hideModal} />
        </Modal>
      )
    } else if (includes('Add Packet', type)) {
      MODALS.push(
        <Modal className="app-modal large" key="dsm-6" show={show} onHide={this.hideModal}>
          <AddPacket data={templates} employees={employees} onClose={this.hideModal} />
        </Modal>
      )
    } else if (includes('Add Rating', type)) {
      MODALS.push(
        <Modal className="app-modal large" key="dsm-7" show={show} onHide={this.hideModal}>
          <AddRating
            userId={userId}
            employees={employees}
            quota={data.before}
            onAdd={e => this.props.createQuota(e)}
            onClose={this.hideModal}
          />
        </Modal>
      )
    } else if (includes('Add Document', type)) {
      MODALS.push(
        <Modal className="app-modal" key="dsm-8" show={show} onHide={this.hideModal}>
          <AddDocument
            type={data.before}
            authors={authors}
            departments={departments}
            competencies={competencies}
            categories={categories}
            onCreate={(e, attachment) => this.props.addDocument(e, attachment)}
            onClose={this.hideModal}
          />
        </Modal>
      )
    } else if (includes('Add New Project', type)) {
      MODALS.push(
        <Modal className="app-modal medium" key="dsm-9" show={show} onHide={this.hideModal}>
          <AddNewProject
            userId={userId}
            employees={employees}
            onAdd={e => this.props.addProject(e)}
            onClose={this.hideModal}
          />
        </Modal>
      )
    } else if (includes('Add New Task', type)) {
      MODALS.push(
        <Modal className="app-modal small" key="dsm-10" backdrop="static" show={show} onHide={this.hideModal}>
          <OutsideClickHandler disabled={includes('-', type)} onOutsideClick={this.handleConfirm}>
            <AddNewTask
              employees={employees}
              companies={companies}
              projects={projects}
              companyId={companyId}
              projectId={data.before.projectId}
              userIds={data.before.assignees || [userId]}
              callback={callback}
              onAdd={(e, users, projectId) => this.props.addTask(e, users, projectId)}
              onUpload={e => this.props.upload(e)}
              onModal={e => this.props.toggleModal(e)}
              onClose={this.hideModal}
              onChange={() => this.handleChange('task')}
              onSelectProject={e => this.props.selectProject(e)}
            />
          </OutsideClickHandler>
        </Modal>
      )
    } else if (includes('Attach Library', type)) {
      MODALS.push(
        <Modal className="app-modal medium" key="dsm-11" show={show} onHide={this.hideModal}>
          <AttachLibrary
            data={templates}
            callback={callback}
            show={data.before.show}
            selected={data.before.selected || []}
            employees={employees}
            role={userRole}
            onSearch={e => this.props.searchTemplate(e)}
            onClose={this.hideModal}
          />
        </Modal>
      )
    } else if (includes('Assign Document', type)) {
      MODALS.push(
        <Modal className="app-modal medium" key="dsm-12" show={show} onHide={this.hideModal}>
          <AssignDocument
            data={templates}
            callback={callback}
            disabled={data.before.disabled}
            userIds={data.before.assignees || [userId]}
            role={userRole}
            employees={employees}
            onAssign={e => this.props.assignTraining(e)}
            onSearch={e => this.props.searchTemplate(e)}
            onModal={e => this.props.toggleModal(e)}
            onClose={this.hideModal}
          />
        </Modal>
      )
    } else if (includes('Assign Program', type)) {
      MODALS.push(
        <Modal className="app-modal medium" key="dsm-13" show={show} onHide={this.hideModal}>
          <AssignProgram
            data={templates}
            callback={callback}
            disabled={data.before.disabled}
            userIds={data.before.assignees || [userId]}
            companyId={data.before.companyId || companyId}
            selected={data.before.modules || []}
            after={data.before.after}
            role={userRole}
            employees={employees}
            levels={data.before.levels}
            onModal={e => this.props.toggleModal(e)}
            onAssign={e => this.props.assignPrograms(e)}
            onSearch={e => this.props.searchTemplate(e)}
            onClose={this.hideModal}
          />
        </Modal>
      )
    } else if (includes('Assign ToDo', type)) {
      MODALS.push(
        <Modal className="app-modal medium" key="dsm-14" show={show} onHide={this.hideModal}>
          <AssignToDo
            data={templates}
            callback={callback}
            disabled={data.before.disabled}
            userIds={data.before.assignees || [userId]}
            companyIds={[companyId]}
            selected={data.before.modules || []}
            after={data.before.after}
            role={userRole}
            employees={employees}
            companies={companies}
            onAssign={e => this.props.assignTraining(e)}
            onSearch={e => this.props.searchTemplate(e)}
            onModal={e => this.props.toggleModal(e)}
            onFetchEmployees={() => this.props.fetchEmployees()}
            onClose={this.hideModal}
          />
        </Modal>
      )
    } else if (includes('Assign Training', type)) {
      MODALS.push(
        <Modal className="app-modal medium" key="dsm-15" show={show} onHide={this.hideModal}>
          <AssignTraining
            data={templates}
            callback={callback}
            disabled={data.before.disabled}
            userIds={data.before.assignees || [userId]}
            companyId={data.before.companyId || companyId}
            selected={data.before.modules || []}
            role={userRole}
            employees={employees}
            onAssign={e => this.props.assignTraining(e)}
            onSearch={e => this.props.searchTemplate(e)}
            onModal={e => this.props.toggleModal(e)}
            onClose={this.hideModal}
          />
        </Modal>
      )
    } else if (includes('Authentication', type)) {
      MODALS.push(
        <Modal className="app-modal medium" key="dsm-16" show={show} onHide={this.hideModal}>
          <Authentication
            onLogin={this.props.loginRequest}
            onRegister={this.props.registerUser}
            route={data.before.route}
            after={data.before.after}
            onModal={e => this.props.toggleModal(e)}
            onClose={this.hideModal}
          />
        </Modal>
      )
    } else if (includes('Quick Assign', type)) {
      MODALS.push(
        <Modal className="app-modal small quick-assign-modal" key="dsm-17" show={show} onHide={this.hideModal}>
          <QuickAssign
            data={data.before.template}
            callback={callback}
            type={data.before.type}
            from={data.before.from}
            companyId={data.before.companyId || companyId}
            userId={userId}
            employees={employees}
            onAssign={e => this.props.assignTraining(e, data.before.after)}
            onAssignPrograms={e => this.props.assignPrograms(e)}
            onModal={e => this.props.toggleModal(e)}
            onClose={this.hideModal}
          />
        </Modal>
      )
    } else if (includes('Quick Edit', type)) {
      MODALS.push(
        <Modal className="app-modal small quick-assign-modal" key="dsm-18" show={show} onHide={this.hideModal}>
          <QuickEdit
            data={data.before.template}
            type={data.before.type}
            after={data.before.after}
            from={data.before.from}
            deletable={data.before.deletable}
            deleteTitle={data.before.deleteTitle}
            userId={data.before.userId || userId}
            companyId={data.before.companyId || companyId}
            role={userRole}
            employees={employees}
            callback={callback}
            onUpdate={e => this.props.updateCardInstance(e)}
            assignPrograms={e => this.props.assignPrograms(e)}
            onAssign={(e, after) => this.props.assignTraining(e, after)}
            onModal={e => this.props.toggleModal(e)}
            onFetchEmployees={() => this.props.fetchEmployees()}
            onClose={this.hideModal}
          />
        </Modal>
      )
    } else if (includes('Approval Task', type)) {
      MODALS.push(
        <Modal className="app-modal medium" key="dsm-19" show={show} onHide={this.hideModal}>
          <ApprovalTask task={data.before} onAdd={(e, act) => this.props.addDevComment(e, act)} />
        </Modal>
      )
    } else if (includes('Edit Blog Post', type)) {
      MODALS.push(
        <Modal className="app-modal large" key="dsm-20" show={show} onHide={this.hideModal}>
          <EditBlogPost
            data={data.before.post}
            businessId={data.before.businessId}
            blog={data.before.blog}
            userId={data.before.userId || user?.community_user?.id}
            type={data.before.active}
            onSubmit={e => this.props.saveblogPost(e)}
            onClose={this.hideModal}
          />
        </Modal>
      )
    } else if (includes('CTA', type)) {
      MODALS.push(
        <Modal className="app-modal medium" key="dsm-21" show={show} onHide={this.hideModal}>
          <CTA />
        </Modal>
      )
    } else if (includes('Edit Course', type)) {
      MODALS.push(
        <Modal className="app-modal medium" key="dsm-22" show={show} onHide={this.hideModal}>
          <EditCourse
            card={data.before.card}
            assignees={data.before.assignees}
            employees={employees}
            userId={userId}
            onUpdate={payload => this.props.editTask(payload)}
            onClose={this.hideModal}
          />
        </Modal>
      )
    } else if (includes('Edit Project', type)) {
      MODALS.push(
        <Modal className="app-modal small" key="dsm-23" show={show} onHide={this.hideModal}>
          <EditProject
            project={data.before.card}
            userId={userId}
            employees={employees}
            onUpdate={payload => this.props.updateProject(payload)}
            onDelete={projectId => this.props.deleteProject(projectId)}
            onModal={e => this.props.toggleModal(e)}
            onClose={this.hideModal}
          />
        </Modal>
      )
    } else if (includes('Edit Task', type)) {
      MODALS.push(
        <Modal className="app-modal medium" key="dsm-24" show={show} onHide={this.hideModal}>
          <EditTask
            userId={userId}
            companyId={companyId}
            employees={employees}
            projects={projects}
            task={data.before.card}
            after={data.before.after}
            onEdit={e => this.props.updateCardInstance(e)}
            onUpload={e => this.props.upload(e)}
            onClose={this.hideModal}
          />
        </Modal>
      )
    } else if (includes('Global Author Configuration', type)) {
      MODALS.push(
        <Modal className="app-modal large" key="dsm-25" centered show={show} onHide={this.hideModal}>
          <GobalAuthorConfiguration onClose={this.hideModal} />
        </Modal>
      )
    } else if (includes('HCM Configuration', type)) {
      MODALS.push(
        <Modal className="app-modal large" key="dsm-26" centered show={show} onHide={this.hideModal}>
          <HCMConfiguration onClose={this.hideModal} />
        </Modal>
      )
    } else if (includes('Blog Configuration', type)) {
      MODALS.push(
        <Modal className="app-modal medium" key="dsm-27" centered show={show} onHide={this.hideModal}>
          <BlogConfiguration onClose={this.hideModal} />
        </Modal>
      )
    } else if (includes('HCM Licenses', type)) {
      MODALS.push(
        <Modal className="app-modal large" key="dsm-28" centered show={show} onHide={this.hideModal}>
          <HCMLicenses onClose={this.hideModal} />
        </Modal>
      )
    } else if (includes('Input Actuals', type)) {
      MODALS.push(
        <Modal className="app-modal large" key="dsm-29" centered show={show} onHide={this.hideModal}>
          <InputActuals
            userId={userId}
            userName={name}
            avatar={avatar}
            scorecards={data.before.scorecards}
            date={data.before.date}
            selected={data.before.selected}
            user={data.before.user}
            type={data.before.type}
            after={data.before.after}
            callback={callback}
            onSubmit={(e, callback) => this.props.saveQuotaActuals(e, callback)}
            onClose={this.hideModal}
          />
        </Modal>
      )
    } else if (includes('Save Actuals', type)) {
      MODALS.push(
        <Modal className="app-modal large" key="dsm-29" centered show={show} onHide={this.hideModal}>
          <SaveActuals
            userName={name}
            avatar={avatar}
            scorecards={data.before.scorecards}
            date={data.before.date}
            selected={data.before.selected}
            user={data.before.user}
            type={data.before.type}
            after={data.before.after}
            callback={callback}
            onSubmit={(e, callback) => this.props.saveQuotaActuals(e, callback)}
            onClose={this.hideModal}
          />
        </Modal>
      )
    } else if (includes('Task Detail', type)) {
      MODALS.push(
        <Modal className="app-modal large" key="dsm-30" show={show} onHide={this.hideModal}>
          <TaskDetail
            self={user}
            userId={userId}
            users={employees}
            role={userRole}
            projects={projects}
            locations={locations}
            task={data.before.card}
            after={data.before.after}
            quotas={instances['quotas'].data}
            careers={careerReport.programs}
            certifications={certificationReport.programs}
            uploadUrl={this.props.uploadUrl}
            onAdd={(e, id) => this.props.addMngComment(e, id)}
            onFetch={id => this.props.fetchTask(id)}
            onUpdate={(e, id, userId, after) => this.props.updateTask(e, id, userId, after)}
            onUpload={e => this.props.upload(e)}
            onDelete={e => this.props.deleteTask(e, 'task')}
            onModal={e => this.props.toggleModal(e)}
            onFetchProgram={(programId, route) => this.props.fetchProgram(programId, route)}
            onCompleteRequest={e => this.props.programPromote(e)}
            getCertificationDetail={(card, mode, route) => this.props.getCertificationDetail(card, mode, route)}
            onClose={this.hideModal}
          />
        </Modal>
      )
    } else if (includes('Landing modal', type)) {
      MODALS.push(
        <Modal className="app-modal landing-modal" key="dsm-31" show={show} onHide={this.hideModal} centered>
          <iframe src={data.before.url} width={data.before.width} height={data.before.height} scrolling="no" />
        </Modal>
      )
    } else if (includes('Premium Product Configuration', type)) {
      MODALS.push(
        <Modal className="app-modal large" key="dsm-32" show={show} onHide={this.hideModal} centered>
          <PremiumProductConfiguration onClose={this.hideModal} />
        </Modal>
      )
    } else if (includes('Plus Product Configuration', type)) {
      MODALS.push(
        <Modal className="app-modal large" key="dsm-33" show={show} onHide={this.hideModal} centered>
          <PlusProductConfiguration onClose={this.hideModal} />
        </Modal>
      )
    } else if (includes('Basic Product Configuration', type)) {
      MODALS.push(
        <Modal className="app-modal large" key="dsm-34" show={show} onHide={this.hideModal} centered>
          <BasicProductConfiguration onClose={this.hideModal} />
        </Modal>
      )
    } else if (includes('Preview', type)) {
      MODALS.push(
        <Modal className="app-modal bg-transparent xlarge" key="dsm-35" show={show} onHide={this.hideModal}>
          {isFeed ? (
            <LearnFeedGrid
              type={data.before.course.card_type_id}
              feedData={this.previewGetCurrentModule(data.before.course)}
              modules={data.before.course.children}
              dueDate={data.before.course.due_at}
              onClick={() => this.previewToggleFeed()}
              onClickChild={index => this.previewShowChild(index, data.before.course)}
            />
          ) : (
            <Preview
              userId={userId}
              managerId={managerId}
              index={data.before.index}
              card={data.before.module}
              course={data.before.course}
              attendance={data.before.attendance}
              allEmployees={employees}
              prevModule={prevModule}
              attachedURL={attachedURL}
              isFirstModule={data.before.index == 0}
              isLastModule={data.before.index == data.before.course.children.length - 1}
              lockModule={isNil(lockedBy) ? null : data.before.course.children[lockedBy]}
              onGoLockModule={() => this.previewShowChild(lockedBy)}
              onPrevious={() => this.previewPreviousFeed()}
              onNext={() => this.previewNextFeed()}
              onRate={() => this.previewCardRate()}
              onSave={() => this.previewSaveAndExit()}
              onUpdate={e => this.previewUpdateCard(e, data.before.page, data.before.perPage)}
              onUpload={e => this.previewFileUpload(e)}
              onResetQuiz={e => this.previewResetQuiz(e)}
              onNewAttach={e => this.previewAddAttachment(e)}
              onVideoState={e => this.previewVideoState(e)}
              onAssign={(payload, attendance) => this.props.assignTraining(payload, null, attendance)}
              onModal={e => this.props.toggleModal(e)}
              onClose={this.hideModal}
            />
          )}
        </Modal>
      )
    } else if (includes('View Document', type)) {
      MODALS.push(
        <Modal className="app-modal large" key="dsm-36" show={show} onHide={this.hideModal}>
          <PreviewDocument card={data.before} />
        </Modal>
      )
    } else if (includes('Advanced Search', type)) {
      MODALS.push(
        <Modal className="app-modal large" key="dsm-37" show={show} onHide={this.hideModal}>
          <AdvancedSearch
            options={data.before.options}
            selected={data.before.selected}
            onSearch={e => this.handleAdvancedSearch(e)}
          />
        </Modal>
      )
    } else if (includes('Add Quota Stars', type)) {
      MODALS.push(
        <Modal key="dsm-24" className="app-modal medium" key="dsm-38" show={show} centered onHide={this.hideModal}>
          <AddQuotaStars
            title={data.before.title}
            unit={data.before.unit}
            direction={data.before.direction}
            stars={data.after}
            onAdd={e => callback.onYes(e)}
            onClose={this.hideModal}
          />
        </Modal>
      )
    } else if (includes('Scorecard Detail', type)) {
      MODALS.push(
        <Modal key="dsm-31" className="app-modal large" key="39" show={show} centered onHide={this.hideModal}>
          <ScorecardDetail data={data.before.scorecard} date={data.before.date} onClose={this.hideModal} />
        </Modal>
      )
    } else if (includes('Advanced Edit', type)) {
      MODALS.push(
        <Modal className="app-modal advanced-edit-modal" key="dsm-40" centered show={show} onHide={this.hideModal}>
          <AdvancedEdit
            userId={data.before.userId || userId}
            schedules={data.before.schedules}
            tracks={data.before.tracks}
            programs={data.before.programs}
            after={data.before.after}
            onClose={this.hideModal}
            onUnassign={e => this.props.unassignContent(e)}
          />
        </Modal>
      )
    } else if (includes('Duplicate Module', type)) {
      MODALS.push(
        <Modal className="app-modal medium" key="dsm-41" centered show={show} onHide={this.hideModal}>
          <DuplicateModule
            data={data.before.object}
            type={data.before.type}
            authors={authors}
            onClose={this.hideModal}
          />
        </Modal>
      )
    } else if (includes('Quota Employee', type)) {
      MODALS.push(
        <Modal className="app-modal small" key="dsm-42" centered show={show} onHide={this.hideModal}>
          <QuotaEmployeeList
            data={data.before.quota}
            getIndividualQuotaReport={(e, route) => this.props.getIndividualQuotaReport(e, route)}
            onClose={this.hideModal}
          />
        </Modal>
      )
    } else if (includes('Rate Vendor', type)) {
      MODALS.push(
        <Modal className="app-modal" key="dsm-43" centered show={show} onHide={this.hideModal}>
          <RateVendor
            product={data.before.product}
            categoryId={data.before.categoryId}
            categories={vendorCategories}
            onSaveRate={e => this.props.saveVendorRating(e)}
            onClose={this.hideModal}
          />
        </Modal>
      )
    } else if (includes('Add Product', type)) {
      MODALS.push(
        <Modal className="app-modal" key="dsm-44" centered show={show} onHide={this.hideModal}>
          <AddProduct
            from={data.before.from}
            vrCompanies={vrCompanies}
            vrCategories={vendorCategories}
            onSearch={e => this.props.getVRCompanies(e)}
            onSaveProduct={e => this.props.saveVRProduct(e)}
            onSaveCompany={e => this.props.saveVRCompany(e)}
            onModal={e => this.props.toggleModal(e)}
            onClose={this.hideModal}
          />
        </Modal>
      )
    } else if (includes('Show Success', type)) {
      MODALS.push(
        <Modal
          key="dsm-45"
          className="app-modal small"
          centered
          show={show}
          onHide={callback && callback.onExit && setTimeout(() => callback.onExit() || this.hideModal(), 4000)}
        >
          <Success
            message={data.before.message}
            info={data.before.info}
            onLater={callback.onLater}
            onClaim={callback.onClaim}
            onClose={this.hideModal}
          />
        </Modal>
      )
    } else if (includes('Add Category', type)) {
      MODALS.push(
        <Modal className="app-modal small" key="dsm-46" centered show={show} onHide={this.hideModal}>
          <AddCategory
            after={data.after}
            data={data.before.data}
            index={data.before.index}
            blog={data.before.blog}
            categoryType={data.before.type}
            companyId={data.before.companyId}
            userId={data.before.userId}
            onClose={this.hideModal}
          />
        </Modal>
      )
    } else if (includes('Add Forum', type)) {
      MODALS.push(
        <Modal className="app-modal mlarge" key="dsm-47" show={show} onHide={this.hideModal}>
          <AddForum
            token={token}
            departmentsList={departmentsList}
            data={data.before.topic}
            event={data.before.event}
            page={data.before.page}
            perPage={data.before.perPage}
            history={this.props.history}
            onAddTopic={e => this.props.addForumTopic(e)}
            onEditTopic={e => this.props.editForumTopic(e)}
            onModal={e => this.props.toggleModal(e)}
            onClose={this.hideModal}
          />
        </Modal>
      )
    } else if (includes('Login modal', type)) {
      MODALS.push(
        <Modal className="app-modal" key="dsm-48" centered show={show} onHide={this.hideModal}>
          <LoginModal
            routeName={data.before.routeName}
            data={data.before.payload}
            onLogin={this.props.loginRequest}
            onAddTopic={e => this.props.addForumTopic(e)}
            onAddTopicComment={e => this.props.onAddTopicComment(e)}
            onClose={this.hideModal}
          />
        </Modal>
      )
    } else if (includes('Upgrade Company Profile', type)) {
      MODALS.push(
        <Modal className="app-modal large" key="dsm-49" centered show={show} onHide={this.hideModal}>
          <UpgradeCompanyProfile company={data.before?.company} onClose={this.hideModal} />
        </Modal>
      )
    } else if (includes('Add Admin', type)) {
      MODALS.push(
        <Modal className="app-modal medium" key="dsm-50" centered show={show} onHide={this.hideModal}>
          <AddAdmin company={data.before?.company} type={data.before?.type} onClose={this.hideModal} />
        </Modal>
      )
    } else if (includes('Upload Background Image', type)) {
      MODALS.push(
        <Modal className="app-modal medium" key="dsm-51" centered show={show} onHide={this.hideModal}>
          <UploadBackgroundImage entity={data.before?.entity} callback={callback} onClose={this.hideModal} />
        </Modal>
      )
    } else if (includes('Upload Vendor Avatar', type)) {
      MODALS.push(
        <Modal className="app-modal medium" key="dsm-52" centered show={show} onHide={this.hideModal}>
          <UploadVendorAvatar
            entity={data.before?.entity}
            userId={data.before?.userId}
            callback={callback}
            onClose={this.hideModal}
          />
        </Modal>
      )
    } else if (includes('Link Social Networks', type)) {
      MODALS.push(
        <Modal className="app-modal" key="dsm-53" centered show={show} onHide={this.hideModal}>
          <SocialNetwork
            company={data.before?.company}
            user={data.before?.user}
            callback={callback}
            onClose={this.hideModal}
          />
        </Modal>
      )
    }

    if (includes('Confirm', type)) {
      MODALS.push(
        <Modal className="app-modal confirm-modal" key="dsm-54" backdrop="static" show={show} onHide={this.hideModal}>
          <Confirm
            title={data.before.__title || data.before.title}
            body={data.before.__body || data.before.body}
            info={data.before.__description || data.before.description}
            yes={data.before.yesButtonText}
            no={data.before.noButtonText}
            onYes={() => {
              callback.onYes()
              this.hideModal()
            }}
            onNo={this.handleConfirm}
          />
        </Modal>
      )
    }

    if (includes('Important', type)) {
      MODALS.push(
        <Modal className="app-modal small" key="dsm-55" backdrop="static" show={show} onHide={this.hideModal}>
          <Important
            body={data.before.body}
            onYes={() => {
              callback.onYes()
              this.hideModal()
            }}
            onNo={this.handleConfirm}
            onClose={this.hideModal}
          />
        </Modal>
      )
    }

    if (includes('Comment', type)) {
      MODALS.push(
        <Modal className="app-modal confirm-modal" key="dsm-56" backdrop="static" show={show} onHide={this.hideModal}>
          <Comment
            title={data.before.title}
            body={data.before.body}
            info={data.before.description}
            onYes={e => {
              callback.onYes(e)
              this.hideModal()
            }}
            onNo={this.handleConfirm}
          />
        </Modal>
      )
    }

    if (includes('Business HCM Config', type)) {
      MODALS.push(
        <Modal className="app-modal medium" key="dsm-57" show={show} centered onHide={this.hideModal}>
          <BusinessHCMConfig />
        </Modal>
      )
    }

    if (includes('Business Blog Config', type)) {
      MODALS.push(
        <Modal className="app-modal medium" key="dsm-58" show={show} centered onHide={this.hideModal}>
          <BusinessBlogConfig />
        </Modal>
      )
    }

    if (includes('Business Product Config', type)) {
      MODALS.push(
        <Modal className="app-modal large" key="dsm-59" show={show} centered onHide={this.hideModal}>
          <BusinessProductConfig />
        </Modal>
      )
    }

    if (includes('Reset Password', type)) {
      MODALS.push(
        <Modal className="app-modal small" key="dsm-60" centered enforceFocus show={show} onHide={this.hideModal}>
          <ResetPassword onReset={e => this.props.resetPassword(e)} onClose={this.hideModal} />
        </Modal>
      )
    }

    if (includes('Add New Habit', type)) {
      MODALS.push(
        <Modal className="app-modal small" key="dsm-61" show={show} onHide={this.hideModal}>
          <AddHabit
            authors={authors}
            departments={departments}
            competencies={competencies}
            categories={categories}
            onCreate={payload => this.props.saveTemplate(payload, null, null, null, null, 'habits')}
            onClose={this.hideModal}
          />
        </Modal>
      )
    }

    if (length(MODALS)) return MODALS
    return null
  }
}

AppModal.propTypes = {
  type: PropTypes.string,
}

AppModal.defaultProps = {
  type: '',
}

const mapStateToProps = state => ({
  show: !isEmpty(state.app.modalType),
  type: state.app.modalType,
  data: state.app.modalData,
  callback: state.app.modalCallBack,

  user: state.app.user,
  userId: state.app.id,
  name: state.app.first_name + ' ' + state.app.last_name,
  avatar: state.app.avatar,
  token: state.app.token,
  userRole: state.app.app_role_id,
  companyId: state.app.company_info.id,
  managerId: state.app.manager_info.id,
  uploadUrl: state.app.learnUploadURL,

  templates: state.develop.templates,
  instances: state.develop.instances,

  authors: state.app.authors,
  departments: state.app.departments,
  competencies: state.app.competencies,
  categories: state.app.categories,

  companies: state.app.companies,
  employees: state.app.employees,
  projects: state.app.projects,

  careerReport: state.manage.careerReport,
  certificationReport: state.manage.certificationsReport,

  attachedURL: state.app.learnUploadURL,
  locations: state.app.locations,

  vendorCategories: state.vendor.categories,
  vrCompanies: state.vendor.vendorCompanies,
  departmentsList: state.community.departments,
})

const mapDispatchToProps = dispatch => ({
  assignTraining: (payload, after = null, attendance = null) =>
    dispatch(ManageActions.assigntrainingRequest(payload, after, attendance)),
  updateCardInstance: e => dispatch(DevActions.updatecardinstanceRequest(e)),
  updateProject: payload => dispatch(ManageActions.updateprojectRequest(payload)),
  searchModules: payload => dispatch(ManageActions.searchmodulesRequest(payload)),
  searchTemplate: payload => dispatch(DevActions.librarytemplatesRequest(payload)),
  saveTemplate: (payload, image, video, pdf, file, mode) =>
    dispatch(DevActions.librarytemplatesaveRequest(payload, image, video, pdf, file, mode)),
  addDevComment: (payload, act) => dispatch(DevActions.adddevcommentRequest(payload, act)),
  addDocument: (payload, attachment) => dispatch(DevActions.adddocumentRequest(payload, attachment)),
  createQuota: payload => dispatch(DevActions.createquotaRequest(payload)),
  addMngComment: (e, cardId) => dispatch(ManageActions.addmngcommentRequest(e, cardId)),
  addProject: e => dispatch(ManageActions.addprojectRequest(e)),
  addTask: (payload, users, projectId) => dispatch(ManageActions.addtaskRequest(payload, users, projectId)),
  editTask: payload => dispatch(ManageActions.edittaskRequest(payload)),
  addUsers: (payload, companyId) => dispatch(AppActions.postcompanyusersRequest(payload, companyId)),
  updateTask: (payload, cardId, userId, after) =>
    dispatch(ManageActions.updatetaskRequest(payload, cardId, userId, after)),
  deleteTask: (cardId, mode) => dispatch(ManageActions.deletetaskRequest(cardId, mode)),
  fetchTask: cardId => dispatch(ManageActions.fetchtaskdetailRequest(cardId)),
  upload: payload => dispatch(AppActions.uploadRequest(payload)),
  resetAttactedURL: () => dispatch(AppActions.uploadSuccess('')),
  updateCard: (event, cardId, page, perPage, after) =>
    dispatch(DevActions.updatecardRequest(event, cardId, page, perPage, after)),
  resetQuiz: quizId => dispatch(DevActions.resetquizRequest(quizId)),
  updateModule: payload => dispatch(DevActions.updatemoduleRequest(payload)),
  updateVideoState: payload => dispatch(DevActions.videostateRequest(payload)),
  toggleModal: payload => dispatch(AppActions.modalRequest(payload)),
  assignPrograms: e => dispatch(DevActions.programeventRequest(e)),
  saveQuotaActuals: (e, callback) => dispatch(ManageActions.postquotaactualsRequest(e, callback)),
  unassignContent: e => dispatch(ManageActions.unassigncontentRequest(e)),
  fetchEmployees: () => dispatch(AppActions.postmulticompanydataRequest()),
  programPromote: e => dispatch(DevActions.programpromotionRequest(e)),
  fetchProgram: (id, route) => dispatch(ManageActions.getcareerprogramRequest(id, route)),
  deleteProject: projectId => dispatch(ManageActions.deleteprojectRequest(projectId)),
  saveVendorRating: e => dispatch(VenActions.savevendorratingRequest(e)),
  getIndividualQuotaReport: (payload, route) =>
    dispatch(ManageActions.postindividualquotareportRequest(payload, route)),
  getVRCompanies: e => dispatch(VenActions.getvendorcompaniesRequest(e)),
  saveVRProduct: e => dispatch(VenActions.savevrproductRequest(e)),
  saveVRCompany: e => dispatch(VenActions.savevrcompanyRequest(e)),
  saveblogPost: e => dispatch(VenActions.saveblogpostRequest(e)),
  addForumTopic: e => dispatch(ComActions.addforumtopicRequest(e)),
  editForumTopic: e => dispatch(ComActions.editforumtopicRequest(e)),
  createBlog: e => dispatch(ComActions.postcreateblogRequest(e)),
  resetPassword: payload => dispatch(AppActions.postrecoverypasswordRequest(payload)),
  onAddTopicComment: e => dispatch(ComActions.addtopiccommentRequest(e)),
  selectProject: id => dispatch(AppActions.selectprojectRequest(id)),
  loginRequest: (payload, route, after) => dispatch(AppActions.loginRequest(payload, route, after)),
  getCertificationDetail: (e, mode, route) => dispatch(DevActions.libraryprogramdetailRequest(e, mode, route)),
  registerUser: (payload, route, after) => dispatch(ComActions.postregisteruserRequest(payload, route, after)),
})

export default connect(mapStateToProps, mapDispatchToProps)(AppModal)

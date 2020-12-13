import React from 'react'
import PropTypes from 'prop-types'
import OutsideClickHandler from 'react-outside-click-handler'
import { toast } from 'react-toastify'
import classNames from 'classnames'
import moment from 'moment'
import { find, isNil, propEq, values } from 'ramda'
import { Avatar, CheckBox, EditDropdown, Rating } from '@components'
import { ScorecardTaskType } from '~/services/config'
import { avatarBackgroundColor } from '~/services/util'
import './ScorecardItem.scss'

const UnKnownUser = {
  id: 0,
  name: 'UnKnown User',
  profile: {
    avatar: null,
  },
}

const calcInput = (item, startDate, endDate, type = 'status') => {
  if (item.scorecards && item.scorecards.length > 0) {
    const scorecard = item.scorecards[0]
    const quotas = scorecard.quotas
    if (!quotas.length) return type === 'status' ? 'No Scorecard' : 'NA'
    let sum = 0
    quotas.forEach(_quota => {
      const actuals = _quota.actuals.filter(actual => moment(actual.actual_at).isBetween(startDate, endDate, 'day'))
      if (actuals.length > 0) sum += 1
    })

    if (type === 'status') {
      return item.performance?.status == 2 ? 'Completed' : 'Incomplete'
    } else {
      const percent = ((100 * sum) / quotas.length).toFixed(2).toString()
      return item.performance?.status == 2 ? '100%' : `${Number(percent)}%`
    }
  } else {
    if (item.performance?.status == 2) return type === 'status' ? 'Completed' : '100%'
    else return type === 'status' ? 'No Scorecard' : 'NA'
  }
}

class ScorecardItem extends React.Component {
  state = {
    checked: !isNil(this.props.task.completed_at),
    openedPopup: false,
    startDate: moment(this.props?.task?.data?.year_month)
      .startOf('month')
      .format('YYYY-MM-DD'),
    endDate: moment(this.props?.task?.data?.year_month)
      .endOf('month')
      .format('YYYY-MM-DD'),
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { users, self, task } = nextProps

    if ((users && task) || self) {
      const user = find(propEq('id', task.user_id), users) || UnKnownUser
      const avatar = isNil(user) ? '' : user.profile.avatar
      const name = isNil(user) ? '' : user.name
      return { avatar, name, user }
    }

    return null
  }

  handleCheck = (id, e) => {
    toast.warn('This task will auto complete when the Scorecard task is completed.', {
      position: toast.POSITION.TOP_CENTER,
      pauseOnFocusLoss: false,
      hideProgressBar: true,
    })
  }

  handleInputActuals = () => {
    const { task } = this.props
    const { user, name, startDate } = this.state
    const { scorecards } = task.performance
    if (scorecards.length == 0) {
      this.handleAssign()
    } else {
      this.props.onModal({
        type: 'Save Actuals',
        data: {
          before: {
            user,
            scorecards,
            date: moment(startDate).format('YYYY-MM-DD'),
            after: {
              type: 'MODAL_REQUEST',
              payload: {
                type: 'Confirm',
                data: {
                  before: {
                    title: 'Success',
                    body: `Actuals were Saved, Do you want to go to Tasks page or keep working with the review for ${name}`,
                    yesButtonText: 'REVIEW',
                    noButtonText: 'TASKS',
                  },
                },
                callBack: {
                  onYes: () => {
                    this.handleReview()
                  },
                },
              },
            },
          },
        },
        callBack: {},
      })
    }
  }

  handleAssign = () => {
    const { userId } = this.props
    const { user } = this.state
    const payload = {
      type: 'Assign ToDo',
      data: {
        before: {
          modules: [],
          disabled: ['habits', 'habitslist', 'quotas'],
          assignees: [user.id],
          after: {
            type: 'FETCHTASKSFEED_REQUEST',
            userId,
            perPage: 500,
            page: 1,
          },
        },
        after: null,
      },
      callBack: null,
    }
    this.props.onModal(payload)
  }

  handleReview = () => {
    const { task } = this.props
    const { startDate, endDate } = this.state
    if (task.performance.scorecards.length == 0) {
      this.handleAssign()
    } else {
      const userId = task.user_id
      const companyId = task.company_id
      this.props.onReview(
        userId,
        companyId,
        `/hcm/performance-reviews/${userId}?date_start=${moment(startDate).format('YYYY-MM-DD')}`,
        startDate,
        endDate
      )
    }
  }

  handleUnassignScorecard = e => {
    const { task, userId } = this.props
    if (isNil(e.scorecards) || e.scorecards.length == 0) return
    this.props.onModal({
      type: 'Confirm',
      data: {
        before: {
          title: 'Unassign Scorecard',
          body: 'This will permanently delete the scorecard from your assignments.  Are you sure?',
        },
      },
      callBack: {
        onYes: () => {
          this.props.onDelete({
            scorecard: { id: e.scorecards[0].id },
            after: {
              type: 'FETCHTASKSFEED_REQUEST',
              userId,
              perPage: 500,
              page: 1,
            },
          })
        },
      },
    })
  }

  handleModal = e => {
    const { task } = this.props
    const { user } = this.state
    const { scorecards } = task.performance
    switch (e) {
      case 'assign scorecard': {
        this.handleAssign()
        break
      }
      case 'save actuals': {
        this.handleInputActuals()
        break
      }
      case 'start review': {
        this.handleReview()
        break
      }
      case 'unassign scorecard': {
        this.props.onModal({
          type: 'Quick Edit',
          data: {
            before: {
              template: scorecards.length ? scorecards[0] : {},
              userId: user.id,
              type: 'performanceScorecards',
              from: 'template',
              after: null,
            },
          },
          callBack: {
            onAssign: () => {
              this.handleAssign()
            },
            onDelete: () => {
              this.handleUnassignScorecard(task?.performance)
            },
          },
        })
        break
      }
      default:
        break
    }
  }

  handlePopupOpen = () => {
    const { openedPopup } = this.state
    this.setState({ openedPopup: !openedPopup })
  }

  onOutsideClick = () => {
    this.setState({ openedPopup: false })
  }

  render() {
    const { className, task, role } = this.props
    const { checked, avatar, openedPopup, name, startDate, endDate } = this.state
    const { performance, scorecards } = task?.performance
    let editOptions = []
    if (!scorecards.length) {
      editOptions = ScorecardTaskType[role].filter(option => option === 'Assign Scorecard')
    } else {
      editOptions = ScorecardTaskType[role].filter(option => option !== 'Assign Scorecard')
    }

    return (
      <div className={classNames('scorecard-item', className)}>
        <CheckBox id={task.id} size="regular" checked={checked} onChange={this.handleCheck.bind(this, task.id)} />
        <div className="scorecard-detail" onClick={this.handleInputActuals}>
          <div className="d-flex align-items-center mb-1">
            <Avatar
              className="d-flex-1"
              url={avatar}
              name={name}
              type="initial"
              backgroundColor={avatarBackgroundColor(task.user_id)}
            />
            <div className="d-flex-2 ml-2">
              <p className="dsl-b14 mb-0 text-400">{`${name} (${moment(startDate).format('MMMM YY')})`}</p>
              <p className="dsl-m12 mb-0 text-400">
                {performance?.status == 2
                  ? values(performance.data.scorecards)[0].title
                  : scorecards.length > 0
                  ? scorecards[0]?.title
                  : 'No Scorecard Assigned'}
              </p>
            </div>
            <div className={classNames('d-flex-1 text-center', performance?.status === 2 && 'd-flex-2')}>
              {performance?.status === 2 ? (
                <>
                  {performance?.data?.completed_average_star_rating === 'N/A' ? (
                    <span className="dsl-b14">Na (Per Manager)</span>
                  ) : (
                    <Rating score={performance?.data?.completed_average_star_rating} showScore={false} />
                  )}
                </>
              ) : (
                <span className="dsl-b14">{calcInput(task?.performance, startDate, endDate, 'actuals')}</span>
              )}
            </div>
          </div>
        </div>
        <OutsideClickHandler display="flex" onOutsideClick={this.onOutsideClick}>
          <div className="d-center" onClick={this.handlePopupOpen}>
            <EditDropdown options={editOptions} onChange={this.handleModal} openedPopup={openedPopup} />
          </div>
        </OutsideClickHandler>
      </div>
    )
  }
}

ScorecardItem.propTypes = {
  className: PropTypes.string,
  users: PropTypes.array.isRequired,
}

ScorecardItem.defaultProps = {
  className: '',
  users: [],
}

export default ScorecardItem

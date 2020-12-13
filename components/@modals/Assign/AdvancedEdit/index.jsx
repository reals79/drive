import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { toast } from 'react-toastify'
import { equals, isNil, isEmpty, length, slice, clone, filter, propEq, findIndex } from 'ramda'
import { Button } from '@components'
import List from './list'
import './AdvancedEdit.scss'

class AdvancedEdit extends Component {
  constructor(props) {
    super(props)

    const { schedules, tracks, programs } = this.props

    this.state = {
      schedules,
      tracks,
      programs,
      disabled: true,
      schedulePage: 1,
      trackPage: 1,
      programPage: 1,
      perPage: 5,
    }

    this.handleChangeDueDate = this.handleChangeDueDate.bind(this)
    this.handleUnassigned = this.handleUnassigned.bind(this)
    this.handleChangePage = this.handleChangePage.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleChangeDueDate(type, e, id) {
    const due_date = e.format('YYYY-MM-DD')
    if (equals(type, 'tracks')) {
      const tracks = clone(this.state.tracks)
      const index = findIndex(propEq('id', id), tracks)
      if (index > -1) {
        tracks[index] = {
          ...tracks[index],
          due_date,
        }
        this.setState({ tracks, disabled: false })
      }
    } else {
      const schedules = clone(this.state.schedules)
      const index = findIndex(propEq('id', id), tracks)
      if (index > -1) {
        schedules[index] = {
          ...schedules[index],
          due_date,
        }
        this.setState({ schedules, disabled: false })
      }
    }
  }

  handleUnassigned(type, e, id) {
    const unassigned = e.target.checked

    switch (type) {
      case 'tracks': {
        const tracks = clone(this.state.tracks)
        const index = findIndex(propEq('id', id), tracks)
        if (index > -1) {
          if (tracks[index].program_id) {
            toast.error(`Cannot unassign this track because it is a requirement for ${tracks[index]?.program_title}`, {
              position: toast.POSITION.TOP_RIGHT,
              pauseOnFocusLoss: false,
            })
          } else {
            tracks[index] = {
              ...tracks[index],
              unassigned,
            }
            this.setState({ tracks, disabled: false })
          }
        }
        break
      }
      case 'schedules': {
        const schedules = clone(this.state.schedules)
        const index = findIndex(propEq('id', id), tracks)
        if (index > -1) {
          schedules[index] = {
            ...schedules[index],
            unassigned,
          }
          this.setState({ schedules, disabled: false })
        }
        break
      }
      case 'programs': {
        const programs = clone(this.state.programs)
        const index = findIndex(propEq('id', id), programs)
        if (index > -1) {
          programs[index] = {
            ...programs[index],
            unassigned,
          }
          this.setState({ programs, disabled: false })
        }
        break
      }
      default:
        break
    }
  }

  handleChangePage(type, page) {
    if (type === 'tracks') {
      this.setState({ trackPage: page })
    }
    if (type === 'schedules') {
      this.setState({ schedulePage: page })
    } else {
      this.setState({ programPage: page })
    }
  }

  handleSubmit() {
    const { tracks, schedules, programs } = this.state
    const { userId, after } = this.props
    const unassignedTracks = filter(propEq('unassigned', true), tracks)
    const unassignedTrackIDs = unassignedTracks.map(e => e.id)
    const unassignedSchedules = filter(propEq('unassigned', true), schedules)
    const unassignedScheduleIDs = unassignedSchedules.map(e => e.id)
    const unassignedPrograms = filter(propEq('unassigned', true), programs)
    const unassignedProgramsIDs = unassignedPrograms.map(e => e.id)

    const unassignPayload = {
      unassign: [
        {
          user_id: userId,
          card_instance_id: [],
          track_id: unassignedTrackIDs,
          schedule_id: unassignedScheduleIDs,
          program_id: unassignedProgramsIDs,
        },
      ],
    }
    this.props.onUnassign({
      data: unassignPayload,
      after,
    })
    this.props.onClose()
  }

  render() {
    const { schedules, tracks, disabled, schedulePage, trackPage, programPage, programs, perPage } = this.state
    const noSchedules = isNil(schedules) || isEmpty(schedules)
    const noTracks = isNil(tracks) || isEmpty(tracks)
    const noPrograms = isNil(programs) || isEmpty(programs)
    let from = (schedulePage - 1) * perPage
    let to = schedulePage * perPage
    const totalSchedules = Math.ceil(length(schedules) / perPage)
    const viewSchedules = slice(from, to, schedules)
    from = (trackPage - 1) * perPage
    to = trackPage * perPage
    const totalTracks = Math.ceil(length(tracks) / perPage)
    const viewTracks = slice(from, to, tracks)
    from = (programPage - 1) * perPage
    to = programPage * perPage
    const viewPrograms = slice(from, to, programs)
    const totalPrograms = Math.ceil(length(programs) / perPage)

    return (
      <div className="assign-modal advanced-edit">
        <div className="modal-header">
          <span className="dsl-w14">Edit</span>
        </div>
        <div className="modal-body">
          {!noSchedules && (
            <List
              title="Schedule"
              data={viewSchedules}
              current={schedulePage}
              perPage={perPage}
              total={totalTracks}
              className={noTracks ? '' : 'border-bottom'}
              onChangeDueDate={this.handleChangeDueDate.bind(this, 'schedules')}
              onUnassign={this.handleUnassigned.bind(this, 'schedules')}
              onChangePage={this.handleChangePage.bind(this, 'schedules')}
            />
          )}
          {!noTracks && (
            <List
              title="Tracks"
              data={viewTracks}
              current={trackPage}
              perPage={perPage}
              total={totalTracks}
              onChangeDueDate={this.handleChangeDueDate.bind(this, 'tracks')}
              onUnassign={this.handleUnassigned.bind(this, 'tracks')}
              onChangePage={this.handleChangePage.bind(this, 'tracks')}
            />
          )}
          {!noPrograms && (
            <List
              title="Programs"
              data={viewPrograms}
              current={perPage}
              total={totalPrograms}
              onUnassign={this.handleUnassigned.bind(this, 'programs')}
              onChangePage={this.handleChangePage.bind(this, 'programs')}
            />
          )}
        </div>
        <div className="modal-footer">
          <Button name="SAVE" disabled={disabled} onClick={this.handleSubmit} />
        </div>
      </div>
    )
  }
}

AdvancedEdit.propTypes = {
  schedules: PropTypes.array,
  tracks: PropTypes.array,
  programs: PropTypes.array,
}

AdvancedEdit.defaultProps = {
  schedules: [],
  tracks: [],
  programs: [],
}

export default AdvancedEdit

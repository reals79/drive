import React from 'react'
import { Row, OverlayTrigger, Tooltip, Button as BootstrapButton } from 'react-bootstrap'
import { equals, isNil, length, includes, isEmpty } from 'ramda'
import { Icon, LearnFeedList as FeedList, Pagination, EditDropdown, Button } from '@components'
import { UserRoles } from '~/services/config'
import './AssignmentsCourseCard.scss'

const Section = ({ schedules, tracks, userRole, onDetail, onSelect, dataCy }) => {
  let scheduleCourses = 0
  const scheduleList = schedules.map((schedule, index) => {
    const { id, title, data } = schedule
    scheduleCourses += isNil(data.cards) ? 0 : length(data.cards)
    return (
      <div
        className="dsl-p14 section-title p-1 text-400"
        key={id}
        onClick={() => onDetail(schedule)}
      >
        {title}
        {equals(index + 1, length(schedules)) ? '' : ','}&ensp;
      </div>
    )
  })

  let trackCourses = 0
  const trackList = tracks.map((track, index) => {
    const { id, title, data } = track
    trackCourses += isNil(data.cards) ? 0 : length(data.cards)
    return (
      <div className="dsl-p14 section-title p-1 text-400" key={id} onClick={() => onDetail(track)}>
        {title}
        {equals(index + 1, length(tracks)) ? '' : ','}&ensp;
      </div>
    )
  })

  const trackMenus = length(tracks) > 0 ? ['Assign', 'Edit'] : ['Assign']

  return (
    <div className="assignments-course-section" data-cy={dataCy}>
      <p className="dsl-b18 bold mb-1 sm-font">Schedules & Tracks</p>
      <div className="d-flex align-item-center py-3">
        <div className="d-flex-7 dsl-m12 pr-2 text-400">Schedules & Tracks</div>
        <div className="d-flex-2 dsl-m12 mr-1 schedules-courses text-right text-400">Courses</div>
        <div className="d-flex-2 dsl-m12 tablet-screen" />
      </div>
      <div className="d-flex align-item-center border-top py-4">
        <div className="d-flex d-flex-7 pr-2">
          <p className="dsl-m14 section-label p-1 text-400">Schedules</p>
          <div className="d-flex flex-wrap">
            {length(schedules) > 0 ? (
              scheduleList
            ) : (
              <p className="dsl-m14 p-1 mb-0">No assigned schedule.</p>
            )}
          </div>
        </div>
        <div className="d-flex-2 dsl-b14 text-400 text-right" data-cy="scheduleCourseCount">
          {scheduleCourses}
        </div>
        <div className="d-flex-2 schedules-courses text-right d-none d-md-block">
          {userRole < UserRoles.USER && (
            <EditDropdown
              dataCy="scheduleCourseDropdown"
              options={trackMenus}
              onChange={e => onSelect(e, schedules, tracks)}
            />
          )}
        </div>
      </div>
      <div className="d-flex align-item-center border-top py-4">
        <div className="d-flex d-flex-7 pr-2">
          <p className="dsl-m14 section-label p-1 text-400">Tracks</p>
          <div className="d-flex flex-wrap">
            {length(tracks) > 0 ? (
              trackList
            ) : (
              <p className="dsl-m14 p-1 mb-0">No assigned track.</p>
            )}
          </div>
        </div>
        <div className="d-flex-2 dsl-b14 text-right text-400" data-cy="trackCourseCount">
          {trackCourses}
        </div>
        <div className="d-flex-2 schedules-courses text-right d-none d-md-block">
          {userRole < UserRoles.USER && (
            <EditDropdown
              dataCy="scheduletrackDropdown"
              options={trackMenus}
              onChange={e => onSelect(e, schedules, tracks)}
            />
          )}
        </div>
      </div>
    </div>
  )
}

const tooltip = (
  <Tooltip id="tooltip">
    <span className="dsl-b14">
      Carry over courses are courses that were assigned in prior months that are still not complete.
      Please complete them or have your manager archive them.
    </span>
  </Tooltip>
)

const List = ({
  bulkSelect,
  bulkList,
  trainings,
  assignments,
  userId,
  userRole,
  current,
  total,
  onPage,
  onPer,
  onModal,
  onSelect,
  onSelectAllBulks,
  onBulkSelect,
  onCancelBulk,
  onUnassignBulks,
  dataCy,
}) => (
  <>
    <div className="list-view-label">
      <p className="dsl-b18 bold mb-1">Courses</p>
      <div className="list-view-label-contents">
        <div className="d-flex w-100 py-3">
          <div className="d-flex-5 dsl-m12 pr-4 text-400">Courses</div>
          <div className="d-flex-5 d-flex-sm-0 d-center">
            <div className="d-flex-2 dsl-m12 text-right text-400 ">Modules</div>
            <div className="d-flex-2 dsl-m12 ml-2 text-right text-400">Completed</div>
            <div className="d-flex-2 dsl-m12 text-right text-400 d-none d-md-block">Due</div>
            <div className="d-flex-1" />
            <div className="d-flex-4 dsl-m12 text-left text-400 d-none d-md-block">Status</div>
            <div className="d-flex-1 dsl-m12 d-none d-md-block" />
          </div>
        </div>
        {equals(assignments.length, 0) && bulkSelect && (
          <div className="bulk-unassign">
            <Button type="link" className="select-all" onClick={onSelectAllBulks}>
              SELECT ALL
            </Button>
          </div>
        )}
      </div>
    </div>
    {assignments && !equals(assignments.length, 0) && (
      <div className="carry-over-section">
        <div className="info-container">
          <Row className="info justify-content-end">
            <OverlayTrigger placement="bottom" overlay={tooltip}>
              <BootstrapButton>
                <Icon
                  name="fas fa-info-circle"
                  color="#ff0000"
                  dataCy="openVideoPlayer"
                  size={20}
                />
              </BootstrapButton>
            </OverlayTrigger>
          </Row>
          {bulkSelect && (
            <div className="bulk-unassign">
              <Button type="link" className="select-all" onClick={onSelectAllBulks}>
                SELECT ALL
              </Button>
            </div>
          )}
        </div>
        {assignments.map((card, index) => (
          <FeedList
            key={card.id}
            bulk={bulkSelect}
            course={card}
            dataCy={`assignmentFeedItem${index}`}
            user={userId}
            userRole={userRole}
            selected={includes(card.id, bulkList)}
            onClick={() => onModal(card)}
            onSelect={e => onSelect(e, card)}
            onBulkSelect={onBulkSelect}
          />
        ))}
      </div>
    )}
    {trainings.map((card, index) => (
      <FeedList
        key={card.id}
        bulk={bulkSelect}
        course={card}
        dataCy={`assignmentFeedItem${index}`}
        user={userId}
        userRole={userRole}
        selected={includes(card.id, bulkList)}
        onClick={() => onModal(card)}
        onSelect={e => onSelect(e, card)}
        onBulkSelect={onBulkSelect}
      />
    ))}
    {equals(current, total) && (
      <div className="learn-feed-list" data-cy="noMoreCourseAssigned">
        <div className="border-bottom py-4">
          <p className="dsl-m14 text-center mb-0">No more courses assigned.</p>
        </div>
      </div>
    )}
    <Pagination current={current} total={total} onChange={onPage} onPer={onPer} />
    {bulkSelect && (
      <div className="d-flex justify-content-end">
        <Button type="low" dataCy="cancelBtn" className="mr-4" onClick={onCancelBulk}>
          CANCEL
        </Button>
        <Button dataCy="unassignBtn" disabled={isEmpty(bulkList)} onClick={onUnassignBulks}>
          UNASSIGN
        </Button>
      </div>
    )}
  </>
)

export { Section, List }

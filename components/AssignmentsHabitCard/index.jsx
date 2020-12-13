import React from 'react'
import { equals, length, isEmpty } from 'ramda'
import { Button, EditDropdown, Pagination } from '@components'
import { UserRoles } from '~/services/config'
import Habit from './ListCard'

function List(props) {
  const {
    bulkSelect,
    bulkList,
    dailyHabits,
    weeklyHabits,
    monthlyHabits,
    userId,
    userRole,
    total,
    current,
    onSelect,
    onPage,
    onPer,
    onSelectAllBulks,
    onBulkSelect,
    onCancelBulk,
    onUnassignBulks,
  } = props

  return (
    <>
      <Habit
        data={dailyHabits}
        dataCy="dailyHabits"
        userRole={userRole}
        userId={userId}
        title="Daily"
        onSelect={onSelect}
        hideSelectAll={dailyHabits.length === 0 || weeklyHabits.length === 0 || monthlyHabits.length === 0}
        onSelectAllBulks={onSelectAllBulks}
        bulkSelect={bulkSelect}
        bulkList={bulkList}
        onBulkSelect={onBulkSelect}
      />
      <Habit
        data={weeklyHabits}
        userRole={userRole}
        dataCy="weeklyHabit"
        userId={userId}
        title="Weekly"
        onSelect={onSelect}
        bulkSelect={bulkSelect}
        bulkList={bulkList}
        onBulkSelect={onBulkSelect}
      />
      <Habit
        data={monthlyHabits}
        userRole={userRole}
        dataCy="monthlyHabit"
        userId={userId}
        title="Monthly"
        onSelect={onSelect}
        bulkSelect={bulkSelect}
        bulkList={bulkList}
        onBulkSelect={onBulkSelect}
      />
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
}

const Section = ({ habitschedules, userRole, onDetail, onSelect }) => {
  let habitscheduleCourses = 0
  const habitscheduleList = habitschedules.map((card, index) => {
    const { id, data } = card
    habitscheduleCourses += data.child_count
    return (
      <div className="dsl-p14 section-title p-1 text-400" key={id} onClick={() => onDetail(card)}>
        {data.name}
        {equals(index + 1, length(habitschedules)) ? '' : ','}&ensp;
      </div>
    )
  })
  const dotsMenu = userRole < UserRoles.USER && !isEmpty(habitschedules) ? ['Assign', 'Edit Assignment'] : ['Assign']

  return (
    <div className="assignments-habitschedule-section" data-cy="habitSchedule">
      <p className="dsl-b18 bold mb-1">Habit Schedule</p>
      <div className="d-flex align-item-center py-3">
        <div className="d-flex-7 dsl-m12 pr-2 text-400">Habit Schedule</div>
        <div className="d-flex-2 dsl-m12 text-right text-400">Habits</div>
        <div className="d-flex-2 dsl-m12 d-none d-md-block" />
      </div>
      <div className="d-flex align-item-center border-top border-bottom py-4">
        <div className="d-flex d-flex-7 pr-2">
          <p className="dsl-b14 section-label p-1 text-400">Schedules</p>
          <div className="d-flex flex-wrap">
            {length(habitschedules) > 0 ? (
              habitscheduleList
            ) : (
              <p className="dsl-m14 p-1 mb-0">No assigned habit schedule.</p>
            )}
          </div>
        </div>
        <div className="d-flex-2 dsl-b14 text-right text-400 d-flex-md">{habitscheduleCourses}</div>
        <div className="d-flex-2 text-right d-none d-md-block">
          <EditDropdown options={dotsMenu} onChange={onSelect} />
        </div>
      </div>
    </div>
  )
}

export { List, Section }

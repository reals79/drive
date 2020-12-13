import React from 'react'
import { concat, equals, filter, isEmpty, isNil, length, uniqBy } from 'ramda'
import { Pagination, EditDropdown } from '@components'
import { UserRoles } from '~/services/config'
import Quota from './ListCard'

const List = ({ userRole, programQuotas, scorecardQuotas, total, current, onSelect, onPage, onPer }) => (
  <>
    <Quota data={scorecardQuotas} userRole={userRole} title="Scorecard" onSelect={onSelect} />
    <Quota data={programQuotas} userRole={userRole} title="Program" onSelect={onSelect} />
    <Pagination current={current} total={total} onChange={onPage} onPer={onPer} />
  </>
)

const ScorecardsSection = ({ scorecards, userRole, company = -1, onDetail, onSelect, onSelectMenu }) => {
  let scorecardQuotas = []
  scorecards = filter(e => company !== -1 && e.company_id == company, scorecards)
  const scorecardList = scorecards.map((card, index) => {
    const { id, title, quotas } = card
    if (!isNil(quotas)) scorecardQuotas = concat(scorecardQuotas, quotas)
    return (
      <div className="dsl-p14 section-title p-1 text-400" key={id} onClick={() => onDetail(card)}>
        {title}
        {equals(index + 1, length(scorecards)) ? '' : ','}&ensp;
      </div>
    )
  })
  const quotas = uniqBy(x => x.id, scorecardQuotas)
  const dotsMenu =
    userRole < UserRoles.USER && !isEmpty(scorecards) ? ['Assign', 'Edit Assignment', 'Edit Actuals'] : ['Assign']

  return (
    <>
      <div className="assignments-scorecard-section" data-cy="scorecardSection">
        <p className="dsl-b18 bold mb-1">Scorecards</p>
        <div className="d-flex align-item-center py-3">
          <div className="d-flex-7 dsl-m12 pr-2 text-400">Scorecards</div>
          <div className="d-flex-2 dsl-m12 text-right text-400">Quotas</div>
          <div className="d-flex-2 dsl-m12 d-flex-md" />
        </div>
        <div className="d-flex align-item-center border-top border-bottom py-4">
          <div className="d-flex d-flex-7 pr-2">
            <div className="d-flex flex-wrap">
              {length(scorecards) > 0 ? scorecardList : <p className="dsl-m14 p-1 mb-0">No assigned scorecard.</p>}
            </div>
          </div>
          <div className="d-flex-2 dsl-b14 text-right text-400">{length(quotas)}</div>
          <div className="d-flex-2 text-right d-flex-md">
            <EditDropdown options={dotsMenu} onChange={onSelectMenu} />
          </div>
        </div>
      </div>
      <Quota data={quotas} userRole={userRole} title="Scorecard" onSelect={onSelect} />
    </>
  )
}

const ProgramsSection = ({ programs, quotas, userRole, onDetail, onSelect, onSelectMenu }) => {
  const data = filter(program => !equals(program.status, 3), programs)
  const programList = data.map(({ id, title }, index) => (
    <div className="dsl-p14 section-title p-1 text-400" key={id} onClick={() => onDetail(card)}>
      {title}
      {equals(index + 1, length(data)) ? '' : ','}&ensp;
    </div>
  ))
  const dotsMenu =
    userRole < UserRoles.USER && !isEmpty(data) ? ['Assign', 'Edit Assignment', 'Edit Actuals'] : ['Assign']

  return (
    <>
      <div className="assignments-scorecard-section" data-cy="scorecardProgramSection">
        <p className="dsl-b18 bold mb-1">Programs</p>
        <div className="d-flex align-item-center py-3">
          <div className="d-flex-7 dsl-m12 pr-2 text-400">Programs</div>
          <div className="d-flex-2 dsl-m12 text-right text-400">Courses</div>
          <div className="d-flex-2 dsl-m12 d-flex-md" />
        </div>
        <div className="d-flex align-item-center border-top border-bottom py-4">
          <div className="d-flex d-flex-7 pr-2">
            <div className="d-flex flex-wrap">
              {length(data) > 0 ? programList : <p className="dsl-m14 p-1 mb-0">No assigned program.</p>}
            </div>
          </div>
          <div className="d-flex-2 dsl-b14 text-right text-400">{length(quotas)}</div>
          <div className="d-flex-2 text-right d-flex-md">
            <EditDropdown options={dotsMenu} onChange={onSelectMenu} />
          </div>
        </div>
      </div>
      <Quota data={quotas} userRole={userRole} title="Program" onSelect={onSelect} />
    </>
  )
}

export { List, ScorecardsSection, ProgramsSection }

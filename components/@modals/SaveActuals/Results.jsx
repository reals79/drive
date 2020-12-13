import React, { useState } from 'react'
import moment from 'moment'
import { filter, includes, values } from 'ramda'
import { Button, ProgressBar, Rating, Toggle } from '@components'
import { quotaCalc } from '~/services/util'
import ScoreCard from './ScoreCard'
import Career from './Career'

const Results = ({ scorecards, avatar, name, actuals, selected, type, onCheck, onComment, onSubmit }) => {
  const _scorecards = filter(e => includes('Scorecard', e?.source || []), scorecards[0].quotas)
  const _career = filter(e => includes('Career', e?.source || []), scorecards[0].quotas)
  const _certification = filter(e => includes('Certification', e?.source || []), scorecards[0].quotas)
  const [sisUnlocked, setSisUnlocked] = useState(true)
  const [cisUnlocked, setCisUnlocked] = useState(true)
  const [fisUnlocked, setFisUnlocked] = useState(true)
  const archivedCareer = filter(e => e.archived == '2', values(_career))
  const archivedCertification = filter(e => e.archived == '2', values(_certification))
  let totalscore = 0

  return (
    <div>
      {_scorecards.length > 0 && (
        <>
          <p className="dsl-b16 bold mb-1">Scorecard</p>
          <span className="dsl-m12 pb-2">
            {scorecards[0].title} | Assigned: {moment(scorecards[0].created_at).format('MMM DD, YY')}
          </span>
          <div className="d-flex border-bottom py-2">
            <div className="d-flex-1">
              <span className="dsl-m12">Include</span>
            </div>
            <div className="d-flex-4">
              <span className="dsl-m12">Quotas</span>
            </div>
            <div className="d-flex-1 text-right">
              <span className="dsl-m12">Target</span>
            </div>
            <div className="d-flex-1 text-right mr-5">
              <span className="dsl-m12">Actual</span>
            </div>
            {type !== 'programs' && (
              <div className="d-flex-2">
                <span className="dsl-m12">Score</span>
              </div>
            )}
            <div className="d-flex-1" />
          </div>
          {_scorecards.map(item => {
            const rating = actuals[item.id]?.actual ? quotaCalc(item, actuals[item.id].actual) : 0
            if (actuals[item.id]?.checked) totalscore += Number(rating)
            return selected
              ? selected == item.id
              : true && (
                  <ScoreCard
                    key={`sc${item.id}`}
                    avatar={avatar}
                    name={name}
                    data={item}
                    rating={rating}
                    type={type}
                    value={actuals[item.id]}
                    onCheck={onCheck(item)}
                    onComment={onComment(item.id)}
                  />
                )
          })}
          <div className="d-flex align-items-center py-4">
            <Toggle checked={sisUnlocked} leftLabel="Locked" rightLabel="Unlocked" onChange={e => setSisUnlocked(e)} />
            <span className="dsl-b14 bold ml-auto mr-3">Month Totals:</span>
            <Rating score={Number((totalscore / scorecards[0].quotas.length).toFixed(1).toString())} />
          </div>
          <span className="dsl-m12">
            {sisUnlocked ? 'Unlocked: Your employee can edit actuals' : 'Locked: Your employee can not edit actuals'}
          </span>
        </>
      )}
      {_career.length > 0 && (
        <>
          <p className="dsl-b16 bold mt-4 mb-1">Career</p>
          <span className="dsl-m12 pb-2">
            {scorecards[0].title} | Assigned: {moment(scorecards[0].created_at).format('MMM DD, YY')}
          </span>
          <div className="d-flex border-bottom py-2">
            <div className="d-flex-1">
              <span className="dsl-m12">Include</span>
            </div>
            <div className="d-flex-4">
              <span className="dsl-m12">Quota</span>
            </div>
            <div className="d-flex-1 pr-4">
              <span className="dsl-m12">History</span>
            </div>
            <div className="d-flex-1 text-right px-2">
              <span className="dsl-m12">Target</span>
            </div>
            <div className="d-flex-1 text-right px-2">
              <span className="dsl-m12">Actual</span>
            </div>
            <div className="d-flex-2 ml-4">
              <span className="dsl-m12">Status</span>
            </div>
            <div className="d-flex-1" />
          </div>
          {_career.map(item =>
            selected
              ? selected == item.id
              : true && (
                  <Career
                    key={`ca${item.id}`}
                    avatar={avatar}
                    name={name}
                    data={item}
                    type={type}
                    value={actuals[item.id]}
                    onCheck={onCheck(item)}
                    onComment={onComment(item.id)}
                  />
                )
          )}
          <div className="d-flex align-items-center py-4">
            <Toggle checked={cisUnlocked} leftLabel="Locked" rightLabel="Unlocked" onChange={e => setCisUnlocked(e)} />
            <span className="dsl-b14 bold ml-auto mr-3">Quotas Archived:</span>
            <ProgressBar value={Number(((100 * archivedCareer.length) / _career.length).toFixed(2).toString())} />
          </div>
          <span className="dsl-m12">
            {cisUnlocked ? 'Unlocked: Your employee can edit actuals' : 'Locked: Your employee can not edit actuals'}
          </span>
        </>
      )}
      {_certification.length > 0 && (
        <>
          <p className="dsl-b16 bold mt-4 mb-1">Certification</p>
          <span className="dsl-m12 pb-2">
            {scorecards[0].title} | Assigned: {moment(scorecards[0].created_at).format('MMM DD, YY')}
          </span>
          <div className="d-flex border-bottom py-2">
            <div className="d-flex-1">
              <span className="dsl-m12">Include</span>
            </div>
            <div className="d-flex-4">
              <span className="dsl-m12">Quota</span>
            </div>
            <div className="d-flex-1 pr-4">
              <span className="dsl-m12">History</span>
            </div>
            <div className="d-flex-1 text-right px-2">
              <span className="dsl-m12">Target</span>
            </div>
            <div className="d-flex-1 text-right px-2">
              <span className="dsl-m12">Actual</span>
            </div>
            <div className="d-flex-2 ml-4">
              <span className="dsl-m12">Status</span>
            </div>
            <div className="d-flex-1" />
          </div>
          {_certification.map(item =>
            selected
              ? selected == item.id
              : true && (
                  <Career
                    key={`cf${item.id}`}
                    avatar={avatar}
                    name={name}
                    data={item}
                    type={type}
                    value={actuals[item.id]}
                    onCheck={onCheck(item)}
                    onComment={onComment(item.id)}
                  />
                )
          )}
          <div className="d-flex align-items-center py-4">
            <Toggle checked={fisUnlocked} leftLabel="Locked" rightLabel="Unlocked" onChange={e => setFisUnlocked(e)} />
            <span className="dsl-b14 bold ml-auto mr-3">Quotas Archived:</span>
            <ProgressBar
              value={Number(((100 * archivedCertification.length) / _certification.length).toFixed(2).toString())}
            />
          </div>
          <span className="dsl-m12">
            {fisUnlocked ? 'Unlocked: Your employee can edit actuals' : 'Locked: Your employee can not edit actuals'}
          </span>
        </>
      )}
      <Button className="ml-auto" name="Save" onClick={onSubmit} />
    </div>
  )
}

export default Results

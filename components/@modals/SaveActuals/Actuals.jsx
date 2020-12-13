import React, { useState } from 'react'
import moment from 'moment'
import { filter, values } from 'ramda'
import { Button, ProgressBar, Toggle } from '@components'
import Quota from './Quota'

const Actuals = ({ scorecards, avatar, name, actuals, selected, onChange, onCheck, onComment, onSubmit }) => {
  const [isUnlocked, setIsUnlocked] = useState(true)
  const checkedItems = filter(e => e.actual, values(actuals))
  const progress = Math.round((100 * checkedItems.length) / values(actuals).length)

  return (
    <div>
      <p className="dsl-b16 bold mb-1">Quotas</p>
      <span className="dsl-m12 pb-2">Assigned: {moment(scorecards[0].created_at).format('MMM DD, YY')}</span>
      <div className="d-flex border-bottom py-2">
        <div className="d-flex-1">
          <span className="dsl-m12">Include</span>
        </div>
        <div className="d-flex-5">
          <span className="dsl-m12">Quotas</span>
        </div>
        <div className="d-flex-1 text-right">
          <span className="dsl-m12">Target</span>
        </div>
        <div className="d-flex-3 text-center">
          <span className="dsl-m12">Actual</span>
        </div>
        <div className="d-flex-1" />
      </div>
      {scorecards.map(scorecard =>
        scorecard.quotas.map(
          item =>
            (selected ? selected == item?.id : true) && (
              <Quota
                key={item?.id}
                avatar={avatar}
                name={name}
                data={item}
                value={actuals[item?.id]}
                onChange={onChange(scorecard.quotas, item?.id)}
                onCheck={onCheck(item)}
                onComment={onComment(item?.id)}
              />
            )
        )
      )}
      <div className="d-flex align-items-center py-4">
        <Toggle checked={isUnlocked} leftLabel="Locked" rightLabel="Unlocked" onChange={e => setIsUnlocked(e)} />
        <span className="dsl-b14 bold ml-auto mr-3">Acutals Saved:</span>
        <ProgressBar value={progress} />
      </div>
      <div className="d-flex align-items-center">
        <span className="dsl-m12 mr-auto">
          {isUnlocked ? 'Unlocked: Your employee can edit actuals' : 'Locked: Your employee can not edit actuals'}
        </span>
        <Button name="Save" onClick={onSubmit} />
      </div>
    </div>
  )
}

export default Actuals

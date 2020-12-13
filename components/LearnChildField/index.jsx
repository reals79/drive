import React from 'react'
import PropTypes from 'prop-types'
import { equals } from 'ramda'
import { Icon } from '@components'
import { CardType } from '~/services/config'
import '../LearnFeedGrid/LearnFeedGrid.scss'

const LearnChildField = props => (
  <div
    className={`fields ${props.disabled ? 'disabled' : 'cursor-pointer'}`}
    data-cy={props.dataCy}
    onClick={() => (props.disabled ? {} : props.onClick())}
  >
    <div className="fields-status align-items-center">
      <Icon
        name={`${equals(props.status, 3) ? 'fal fa-check-circle' : 'fal fa-circle'}`}
        size={26}
        color="#969faa"
        active={equals(props.status, 3)}
      />
    </div>
    <div className="fields-content">
      <p className="mb-0 align-items-center">
        <Icon name={`${CardType[props.type].alias}`} color="#676767" size={14} />
        <span className="dsl-m12 text-400 ml-2">{CardType[props.type].label}</span>
      </p>
      <p
        className={`dsl-m16 mb-0 turncate-lengthy-name text-400  ${equals(props.status, 3) ? 'text-line-through' : ''}`}
      >
        {props.name}
      </p>
    </div>
  </div>
)

LearnChildField.propTypes = {
  type: PropTypes.number,
  status: PropTypes.number,
  name: PropTypes.string,
}

LearnChildField.defaultProps = {
  type: 1,
  status: 0,
  name: '',
}

export default LearnChildField

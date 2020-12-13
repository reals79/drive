import React from 'react'
import PropTypes from 'prop-types'
import uniqid from 'uniqid'
import classNames from 'classnames'
import './CheckBox.scss'

const CheckBox = props => (
  <div className={classNames('ds-checkbox', props.className)} data-cy={props.dataCy} onClick={props.onClick}>
    <div className={classNames('checkmark', props.size, props.reversed && 'reversed')}>
      <input type="checkbox" id={props.id || new uniqid()} {...props} />
      <label className="check-box" htmlFor={props.id} />
    </div>
    {props.title && <span className="checktitle truncate text-vcenter ml-2">{props.title}</span>}
  </div>
)

CheckBox.propTypes = {
  title: PropTypes.string,
  className: PropTypes.string,
  checked: PropTypes.bool,
  reversed: PropTypes.bool,
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  size: PropTypes.oneOf(['tiny', 'small', 'regular', 'large']),
  onChange: PropTypes.func,
  onClick: PropTypes.func,
}

CheckBox.defaultProps = {
  title: '',
  className: '',
  id: 'dscheckbox',
  size: 'small',
  reversed: false,
  onChange: () => {},
  onClick: () => {},
}

export default CheckBox

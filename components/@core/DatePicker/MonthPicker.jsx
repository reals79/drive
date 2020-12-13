import React from 'react'
import PropTypes from 'prop-types'
import MonthCalendar from 'rc-calendar/lib/MonthCalendar'
import DatePicker from 'rc-calendar/lib/Picker'
import moment from 'moment'
import './DatePicker.scss'

const calendar = disabledDate => (
  <MonthCalendar disabledDate={disabledDate} style={{ marginTop: '30px', zIndex: 1000 }} />
)
const ALIGN = {
  left: { points: ['tl', 'tr'] },
  right: { points: ['tr', 'tr'] },
}

const MonthPicker = ({ align = 'left', disabledDate = () => null, value, trigger, onChange }) => (
  <DatePicker
    calendar={calendar(disabledDate)}
    align={ALIGN[align]}
    defaultValue={value.start}
    onChange={onChange}
    dropdownClassName="custom-month-picker"
  >
    {() => trigger}
  </DatePicker>
)

MonthPicker.propTypes = {
  trigger: PropTypes.node,
  value: PropTypes.object,
  onChange: PropTypes.func,
}

MonthPicker.defaultProps = {
  trigger: null,
  value: moment(),
  onChange: () => {},
}

export default MonthPicker

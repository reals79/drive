import React from 'react'
import PropTypes from 'prop-types'
import MonthCalendar from 'rc-calendar/lib/MonthCalendar'
import DatePicker from 'rc-calendar/lib/Picker'
import moment from 'moment'
import './CustomMonthPicker.scss'

const calendar = <MonthCalendar style={{ zIndex: 1000 }} />

const CustomMonthPicker = ({ value, trigger, onChange }) => (
  <DatePicker
    animation="slide-up"
    calendar={calendar}
    value={value}
    onChange={onChange}
    dropdownClassName="custom-month-picker"
  >
    {() => trigger}
  </DatePicker>
)

CustomMonthPicker.propTypes = {
  trigger: PropTypes.node,
  value: PropTypes.object,
  onChange: PropTypes.func,
}

CustomMonthPicker.defaultProps = {
  trigger: null,
  value: moment(),
  onChange: () => {},
}

export default CustomMonthPicker

import React from 'react'
import PropTypes from 'prop-types'
import DatePicker from 'react-datepicker'
import CustomInput from './CustomInput'
import './CustomDatePicker.scss'

const CustomDatePicker = ({ format, date, placeholder, minDate, maxDate, onSelect, right }) => (
  <div className={`custom-datepicker ${right ? 'right' : ''}`}>
    <DatePicker
      name="custom-datepicker"
      dateFormat={format}
      customInput={<CustomInput />}
      selected={date}
      minDate={minDate}
      maxDate={maxDate}
      placeholderText={placeholder}
      onSelect={e => onSelect(e)}
    />
  </div>
)

CustomDatePicker.propTypes = {
  right: PropTypes.bool,
  format: PropTypes.string,
  placeholder: PropTypes.string,
  date: PropTypes.any,
  minDate: PropTypes.any,
  maxDate: PropTypes.any,
  onSelect: PropTypes.func,
}

CustomDatePicker.defaultProps = {
  right: false,
  format: '',
  placeholder: 'Select',
  date: null,
  minDate: null,
  maxDate: null,
  onSelect: () => {},
}

export default CustomDatePicker

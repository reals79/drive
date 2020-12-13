import React from 'react'
import PropTypes from 'prop-types'
import DateRangePicker from 'react-daterange-picker'
import OutsideClickHandler from 'react-outside-click-handler'
import { isNil } from 'ramda'
import originalMoment from 'moment'
import { extendMoment } from 'moment-range'
import classNames from 'classnames'
import { Icon, Input } from '@components'
import MonthPicker from './MonthPicker'
import './DatePicker.scss'

const moment = extendMoment(originalMoment)
const MAXDATE = new Date('2022/12/31')
const MINDATE = new Date('2010/1/1')

const ICONS = {
  caret: 'fas fa-sort-down',
  calendar: 'fal fa-calendar-alt',
}

class DatePicker extends React.PureComponent {
  constructor(props) {
    super(props)

    const today = moment()
    let value = props.value
    if (isNil(value)) {
      if (props.calendar === 'day') value = new Date()
      else value = moment.range(today.clone().subtract(7, 'days'), today.clone())
    }
    this.state = { value, open: false }
  }

  componentDidMount() {
    if (this.props.mountEvent) {
      this.props.onSelect(this.state.value)
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.value !== this.props.value) {
      this.setState({ value: this.props.value })
    }
  }

  _getText() {
    const { format, calendar } = this.props
    const { value } = this.props
    if (isNil(value)) return null
    if (calendar === 'day') return moment(value).format(format)
    return `${moment(value.start).format(format)} - ${moment(value.end).format(format)}`
  }

  handleSelect = (e, isRange = true) => {
    let value
    if (isRange) value = e
    else value = { start: moment(e).startOf('month'), end: moment(e).endOf('month') }
    this.setState({ value })
    this.props.onSelect(value)
    if (this.props.closeAfterSelect) {
      this.setState({ open: false })
    }
  }

  handleToggle = () => {
    this.setState({ open: !this.state.open })
  }

  render() {
    const {
      className,
      calendar,
      direction,
      as,
      title,
      placeholder,
      disabled,
      months,
      minDate,
      maxDate,
      format,
      fontColor,
      iconColor,
      prepend,
      prependSize,
      append,
      appendSize,
      align,
      disabledDate,
      dataCy,
    } = this.props
    const { open, value } = this.state
    const _format = format !== 'M/D/YY' ? format : 'MMM YYYY'

    const monthPickerTrigger = (
      <div className="d-flex cursor-pointer">
        <p className="dsl-b14 text-400 mb-0 mr-2">{moment(value.start).format(_format)}</p>
        <Icon name="fas fa-chevron-down" color={iconColor} size={appendSize} />
      </div>
    )

    const showLabel = as !== 'input' && !isNil(title)

    return (
      <OutsideClickHandler onOutsideClick={() => this.setState({ open: false })}>
        <div className={classNames('ds-datepicker', className)} data-cy={dataCy}>
          {calendar !== 'month' && (
            <div className={classNames('ds-datepicker-input', direction)}>
              {showLabel && (
                <div
                  className={`dsl-m12 ${direction === 'horizontal' ? 'mt-1' : 'mb-2'}`}
                  style={{ color: fontColor }}
                  onClick={this.handleToggle}
                >
                  {title}
                </div>
              )}

              <div className="d-flex">
                {prepend !== 'none' && (
                  <Icon
                    name={`${ICONS[prepend]} text-vcenter mr-1 cursor-pointer`}
                    color={iconColor}
                    size={prependSize}
                    onClick={this.handleToggle}
                  />
                )}

                {as === 'input' && (
                  <Input
                    title={title}
                    direction={direction}
                    placeholder={placeholder}
                    disabled={disabled}
                    value={this._getText()}
                    onFocus={this.handleToggle}
                  />
                )}

                {as === 'span' && (
                  <span
                    className={classNames('dsl-b14 text-400 cursor-pointer', showLabel && 'ml-2')}
                    onClick={this.handleToggle}
                  >
                    {this._getText()}
                  </span>
                )}

                {append !== 'none' && (
                  <Icon
                    name={`${ICONS[append]} ml-2 cursor-pointer`}
                    color={iconColor}
                    size={appendSize}
                    onClick={this.handleToggle}
                  />
                )}
              </div>
            </div>
          )}

          {open && !disabled && (
            <div className={classNames('ds-datepicker-content', align)}>
              {calendar === 'day' && (
                <DateRangePicker
                  selectionType="single"
                  initialDate={moment(value).toDate()}
                  value={value}
                  minimumDate={minDate}
                  maximumDate={maxDate}
                  onSelect={this.handleSelect}
                />
              )}
              {calendar === 'range' && (
                <DateRangePicker
                  singleDateRange
                  selectionType="range"
                  initialRange={value}
                  value={value}
                  minimumDate={minDate}
                  maximumDate={maxDate}
                  onSelect={this.handleSelect}
                />
              )}
            </div>
          )}

          {calendar === 'month' && (
            <MonthPicker
              align={align}
              disabledDate={disabledDate}
              trigger={monthPickerTrigger}
              value={value}
              onChange={e => this.handleSelect(e, false)}
            />
          )}
        </div>
      </OutsideClickHandler>
    )
  }
}

DatePicker.propTypes = {
  className: PropTypes.string,
  calendar: PropTypes.oneOf(['day', 'range', 'month']),
  as: PropTypes.oneOf(['none', 'input', 'span', 'button']),
  direction: PropTypes.oneOf(['horizontal', 'vertical']),
  title: PropTypes.string,
  format: PropTypes.string,
  placeholder: PropTypes.string,
  align: PropTypes.oneOf(['left', 'right']),
  mountEvent: PropTypes.bool,
  months: PropTypes.number,
  value: PropTypes.any,
  disabled: PropTypes.bool,
  minDate: PropTypes.any,
  maxDate: PropTypes.any,
  fontColor: PropTypes.string,
  iconColor: PropTypes.string,
  prepend: PropTypes.oneOf(['none', 'caret', 'calendar']),
  prependSize: PropTypes.number,
  append: PropTypes.oneOf(['none', 'caret', 'calendar']),
  appendSize: PropTypes.number,
  closeAfterSelect: PropTypes.bool,
  disabledDate: PropTypes.func,
  onSelect: PropTypes.func,
}

DatePicker.defaultProps = {
  className: '',
  calendar: 'day',
  as: 'none',
  direction: 'horizontal',
  title: null,
  format: 'M/D/YY',
  placeholder: null,
  mountEvent: false,
  months: 1,
  value: null,
  disabled: false,
  minDate: MINDATE,
  maxDate: MAXDATE,
  fontColor: '#676767',
  iconColor: '#343f4b',
  prepend: 'none',
  prependSize: 10,
  append: 'none',
  appendSize: 10,
  align: 'left',
  closeAfterSelect: false,
  disabledDate: () => null,
  onSelect: () => {},
}

export default DatePicker

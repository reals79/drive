import React from 'react'
import PropTypes from 'prop-types'
import { Form } from 'react-bootstrap'
import { isEmpty } from 'ramda'
import classNames from 'classnames'
import { Icon } from '@components'
import './Input.scss'

class Input extends React.PureComponent {
  state = { focused: false, value: this.props.value || '' }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.value !== prevState.value) {
      return { value: nextProps.value || '' }
    }
    return null
  }

  handleBlur = e => {
    const value = e.target.value
    this.props.onBlur(value)
    setTimeout(() => {
      this.setState({ focused: false })
    }, 100)
  }

  handleChange = e => {
    const value = e.target.value
    this.setState({ value })
    this.props.onChange(value)
  }

  handleClear = () => {
    this.setState({ value: '' })
    this.props.onChange('')
  }

  hanldeFocus = () => {
    this.setState({ focused: true })
    this.props.onFocus()
  }

  handleKeyPress = e => {
    if (e.charCode === 13) {
      this.props.onEnter()
    }
  }

  render() {
    const {
      className,
      direction,
      title,
      type,
      as,
      rows,
      disabled,
      remove,
      error,
      placeholder,
      tooltip,
      dataCy,
    } = this.props
    const { focused, value } = this.state
    const classname = classNames(
      'core-input',
      className,
      direction,
      { focused },
      { remove },
      { error: !isEmpty(error) }
    )

    return (
      <div className={classname}>
        {!isEmpty(title) && <span className="core-input-label">{title}</span>}
        <div className="core-input-content">
          <Form.Control
            data-cy={dataCy}
            disabled={disabled}
            placeholder={placeholder}
            value={value}
            type={type}
            as={as}
            disabled={disabled}
            rows={rows}
            title={tooltip ? value : ''}
            onBlur={this.handleBlur}
            onChange={this.handleChange}
            onFocus={this.hanldeFocus}
            onKeyPress={this.handleKeyPress}
          />
          {!disabled && (
            <>
              <div className="clear" onClick={this.handleClear}>
                <Icon name="fas fa-times-circle cursor-pointer" color="#969faa" size={16} />
              </div>
              {remove && (
                <div className="delete">
                  <Icon name="fal fa-trash-alt" color="#969faa" size={12} />
                </div>
              )}
              {!isEmpty(error) && (
                <span className="error dsl-r12" data-cy={`${dataCy}ErrorMessage`}>
                  {error}
                </span>
              )}
            </>
          )}
        </div>
      </div>
    )
  }
}

Input.propTypes = {
  className: PropTypes.string,
  title: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  disabled: PropTypes.bool,
  remove: PropTypes.bool,
  tooltip: PropTypes.bool,
  type: PropTypes.string,
  as: PropTypes.oneOf(['input', 'textarea']),
  rows: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  placeholder: PropTypes.string,
  direction: PropTypes.oneOf(['horizontal', 'vertical']),
  error: PropTypes.string,
  onChange: PropTypes.func,
  onEnter: PropTypes.func,
  onFocus: PropTypes.func,
}

Input.defaultProps = {
  className: '',
  title: '',
  value: '',
  disabled: false,
  remove: false,
  tooltip: false,
  type: 'text',
  as: 'input',
  rows: '1',
  placeholder: '',
  direction: 'horizontal',
  error: '',
  onBlur: () => {},
  onChange: () => {},
  onEnter: () => {},
  onFocus: () => {},
}

export default Input

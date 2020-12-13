import React from 'react'
import PropTypes from 'prop-types'
import { Form, InputGroup } from 'react-bootstrap'
import { isEmpty } from 'ramda'
import classNames from 'classnames'
import { Icon } from '@components'
import './Text.scss'

class Text extends React.PureComponent {
  state = { value: this.props.value }

  static getDerivedStateFromProps(nextProps) {
    return { value: nextProps.value }
  }

  handleChange = e => {
    this.setState({ value: e.target.value })
    this.props.onChange(e.target.value)
  }

  handleClear = () => {
    this.setState({ value: '' })
    this.props.onChange('')
  }

  render() {
    const {
      controlId,
      className,
      type,
      direction,
      title,
      disabled,
      placeholder,
      titleWidth,
      valueWidth,
    } = this.props
    const { value } = this.state
    const classname = classNames('core-text', className, direction)

    return (
      <Form.Group controlId={controlId} className={classname}>
        {!isEmpty(title) && (
          <Form.Label className="dsl-m12" style={{ width: titleWidth }}>
            {title}
          </Form.Label>
        )}
        <InputGroup>
          <Form.Control
            className="dsl-b14"
            as={type}
            placeholder={placeholder}
            value={value}
            disabled={disabled}
            style={{ width: valueWidth }}
            onChange={this.handleChange}
          />
          {!disabled && (
            <InputGroup.Prepend onClick={this.handleClear}>
              <Icon name="fas fa-times-circle" color="#969faa" size={15} />
            </InputGroup.Prepend>
          )}
        </InputGroup>
      </Form.Group>
    )
  }
}

Text.propTypes = {
  controlId: PropTypes.string,
  className: PropTypes.string,
  type: PropTypes.oneOf(['input', 'textarea']),
  title: PropTypes.string.isRequired,
  value: PropTypes.string,
  disabled: PropTypes.bool,
  titleWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  valueWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  placeholder: PropTypes.string,
  direction: PropTypes.oneOf(['horizontal', 'vertical']),
  onChange: PropTypes.func,
}

Text.defaultProps = {
  controlId: 'core-input',
  className: '',
  type: 'input',
  title: '',
  value: '',
  disabled: false,
  titleWidth: 'auto',
  valueWidth: 'auto',
  placeholder: '',
  direction: 'horizontal',
  onChange: () => {},
}

export default Text

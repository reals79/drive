import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { equals, isNil } from 'ramda'
import { Animations } from '@components'
import './HoverDropdown.scss'

class HoverDropdown extends React.PureComponent {
  constructor(props) {
    super(props)

    this.state = {
      opened: false,
      title: '',
    }

    this.handleClose = this.handleClose.bind(this)
    this.handleOpen = this.handleOpen.bind(this)
    this.handleClick = this.handleClick.bind(this)
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { data, getValue, placeholder } = nextProps
    if (!equals(data.length, 0)) {
      let title = ''
      data.forEach((e, ind) => {
        title = title + getValue(e) + (equals(data.length, ind + 1) ? '' : ', ')
      })
      return { title }
    }
    return { title: placeholder }
  }

  handleClose() {
    this.setState({ opened: false })
  }

  handleOpen() {
    if (equals(this.props.data.length, 0) || this.props.disabled) return
    this.setState({ opened: true })
  }

  handleClick(item) {
    if (!isNil(item.program)) {
      this.props.onClick(item.program)
    }
  }

  render() {
    const { className, data, align, width, height } = this.props
    const { opened, title } = this.state
    const container = classNames('hover-dropdown', className, opened ? 'hover' : '')
    const menu = classNames('hover-dropdown-menu', align)
    const maxHeight = equals('auto', height) ? null : { maxHeight: height, overflowY: 'auto' }

    return (
      <div
        className={container}
        style={{ width }}
        onMouseEnter={this.handleOpen}
        onMouseLeave={this.handleClose}
      >
        <div className="hover-dropdown-toggle">{title}</div>
        <Animations.Popup className={menu} enter={10} exit={0} opened={opened} style={maxHeight}>
          {data.map((e, index) => (
            <div
              key={`hover-${this.props.getId(e)}-${index}`}
              className="hover-dropdown-item"
              onClick={this.handleClick.bind(this, e)}
            >
              {this.props.getValue(e)}
            </div>
          ))}
        </Animations.Popup>
      </div>
    )
  }
}

HoverDropdown.propTypes = {
  className: PropTypes.string,
  placeholder: PropTypes.string,
  data: PropTypes.arrayOf(PropTypes.any),
  disabled: PropTypes.bool,
  align: PropTypes.oneOf(['left', 'right']),
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  getId: PropTypes.func,
  getValue: PropTypes.func,
}

HoverDropdown.defaultProps = {
  className: '',
  placeholder: '',
  data: [],
  disabled: false,
  align: 'left',
  width: 'auto',
  height: 'auto',
  getId: data => data['id'],
  getValue: data => data['value'],
}

export default HoverDropdown

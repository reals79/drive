import React from 'react'
import PropTypes from 'prop-types'
import OutsideClickHandler from 'react-outside-click-handler'
import classNames from 'classnames'
import { any, append, equals, filter, find, includes, isEmpty, isNil, length, propEq, split } from 'ramda'
import { Animations, Avatar, Button, CheckBox, Icon, Pagination } from '@components'
import { SPECIALOPTIONS } from '~/services/config'
import { inPage } from '~/services/util'
import './Dropdown.scss'

class Dropdown extends React.PureComponent {
  state = {
    selected: [],
    opened: false,
    title: '',
    current1: 1,
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { caret, data, noOptionLabel, placeholder, getId, getValue } = nextProps

    let title = ''

    if (data.length === 0) return { title: noOptionLabel }
    if (caret === 'dots-without-title') return { title }

    const { selected } = prevState
    if (selected.length === 0) {
      return { title: placeholder }
    } else {
      if (selected.length < 3) {
        selected.forEach((sel, idx) => {
          const item = find(d => equals(getId(d), sel), data)
          if (!isNil(item)) {
            title = title + getValue(item) + (equals(selected.length, idx + 1) ? '' : ', ')
          }
        })
        return { title }
      } else {
        const item1 = find(d => equals(getId(d), selected[0]), data)
        const item2 = find(d => equals(getId(d), selected[1]), data)
        title = `${getValue(item1)}, ${getValue(item2)} ...`
        return { title }
      }
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { defaultIds, defaultIndexes, data } = prevProps
    if (
      !equals(defaultIds, this.props.defaultIds) ||
      !equals(defaultIndexes, this.props.defaultIndexes) ||
      !equals(data, this.props.data)
    ) {
      this.handleDefaultValues()
    }
  }

  componentDidMount() {
    this.handleDefaultValues()
  }

  handleDefaultValues = () => {
    const { data, defaultIds, defaultIndexes, mountEvent, returnBy } = this.props

    if (data.length === 0) return

    let items = []
    if (!isNil(defaultIds)) {
      defaultIds.forEach(id => {
        items.push(find(d => equals(this.props.getId(d), id), data))
      })
    }
    if (!isNil(defaultIds) && items.length === 0) items = [data[0]]
    if (!isNil(defaultIndexes)) {
      defaultIndexes.forEach(idx => {
        items.push(data[idx])
      })
    }
    items = filter(item => !isNil(item), items)

    let selected = []
    if (!isNil(items)) {
      selected = items.map(item => this.props.getId(item))
      this.setState({ selected })
    }

    if (selected.length === 0) return

    if (mountEvent) {
      if (returnBy === 'id') {
        this.props.onChange(selected)
      } else {
        this.props.onChange(items)
      }
    }
  }

  handleSpecial = ID => {
    const { data, returnBy } = this.props
    if (equals(SPECIALOPTIONS.ALL, ID)) {
      // User select All option
      const newData = filter(d => equals(this.props.getId(d), ID), data)
      const newSelected = newData.map(item => this.props.getId(item))
      if (returnBy === 'id') {
        this.props.onChange(newSelected)
      } else {
        this.props.onChange(newData)
      }
      this.setState({ selected: [SPECIALOPTIONS.ALL] })
    } else if (equals(SPECIALOPTIONS.LIST, ID)) {
      // User select List option
      const newData = filter(d => equals(this.props.getId(d), ID), data)
      const newSelected = newData.map(item => this.props.getId(item))
      if (returnBy === 'id') {
        this.props.onChange(newSelected)
      } else {
        this.props.onChange(newData)
      }
      this.setState({ selected: [SPECIALOPTIONS.LIST] })
    } else if (equals(SPECIALOPTIONS.NONE, ID)) {
      // User select None option
      this.props.onChange([])
      this.setState({ selected: [SPECIALOPTIONS.NONE] })
    }
    this.handleClose()
  }

  handleClose = () => {
    this.setState({ opened: false })
  }

  handleToggle = e => {
    e.stopPropagation()
    if (this.props.data.length === 0 || this.props.disabled) return
    this.props.multi ? this.setState({ opened: true }) : this.setState({ opened: !this.state.opened })
  }

  handleChange(data, checked) {
    const { multi, returnBy, disabledOptions, select } = this.props
    const { selected } = this.state
    const ID = this.props.getId(data)

    this.props.onSelected(ID)

    if (includes(ID, disabledOptions)) return

    if (ID < 0 && !equals(SPECIALOPTIONS.SELFASSIGNED, ID)) {
      this.handleSpecial(ID)
      return
    }

    let newSelected, newData

    if (multi) {
      if (selected[0] < 0) {
        newSelected = [ID]
        newData = filter(item => any(sl => equals(sl, this.props.getId(item)))(newSelected), this.props.data)
      } else {
        if (includes(ID, selected)) {
          newSelected = filter(x => x != ID, selected)
        } else {
          newSelected = append(ID, selected)
        }
        newData = filter(item => any(sl => equals(sl, this.props.getId(item)))(newSelected), this.props.data)
        newSelected = filter(item => !isNil(item), newSelected)
        newData = filter(item => !isNil(item), newData)
      }
    } else {
      newSelected = [ID]
      newData = filter(item => any(sl => equals(sl, this.props.getId(item)))(newSelected), this.props.data)
      newSelected = filter(item => !isNil(item), newSelected)
      newData = filter(item => !isNil(item), newData)

      !select && this.handleClose()
    }

    if (returnBy === 'id') {
      this.props.onChange(newSelected)
    } else {
      this.props.onChange(newData)
    }
    this.setState({ newData, newSelected })
    this.setState({ selected: newSelected })
  }

  handleClick = (data, checked) => e => {
    e.stopPropagation()
    this.handleChange(data, checked)
  }

  handleClear = async () => {
    const { data } = this.props
    const employee = find(propEq('id', -1), data)
    const company = find(propEq('name', ''), data)
    if (employee) {
      await this.handleChange(this.props.data[0], true)
    } else if (company) {
      await this.setState({ selected: [company.id] }, () => this.handleChange([company.id], true))
      await this.props.onChange(this.state.newData)
    } else {
      await this.setState({ selected: [data[0].id] }, () => this.handleChange([data[0].id], true))
      await this.props.onChange(this.state.newData)
    }
    this.handleClose()
  }

  handleApply = () => {
    if (this.props.returnBy === 'id') {
      this.props.onChange(this.state.newSelected)
    } else {
      this.props.onChange(this.state.newData)
    }
    this.handleClose()
  }

  handleRowClick = (data, checked) => e => {
    e.stopPropagation()
    this.handleChange(data, checked)
  }

  renderItem(data, idx) {
    const { type, selectable, splitted } = this.props
    const { selected } = this.state
    const active = includes(this.props.getId(data), selected) && selectable
    const className = classNames('core-dropdown-item', { active })
    const VALUE = this.props.getValue(data)

    if (equals(null, this.props.getId(data)) && equals('BLOCK', this.props.getValue(data))) {
      if (splitted) {
        return <div key="block" className="split-line" />
      }
      return
    }

    return (
      <div key={`cd${idx}`} className={className} onClick={this.handleRowClick(data, true)}>
        {type === 'thumbnail' && <Avatar className="mr-2" size="tiny" />}
        <span className="dsl-b16 no-wrap" data-cy={`dropdownItem${VALUE.replace(/[^A-Z0-9]+/gi, '')}`}>
          {VALUE}
        </span>
        <span className="d-flex-1" />
        {type === 'checkbox' && (
          <CheckBox
            className="ml-2"
            size="tiny"
            id={data.id}
            checked={active}
            onChange={e => this.handleChange(data, e.target.checked)}
          />
        )}
      </div>
    )
  }

  render() {
    const {
      className,
      data,
      title,
      align,
      width,
      height,
      multi,
      direction,
      titleDirection,
      caret,
      icon,
      iconColor,
      iconSize,
      selectable,
      disabled,
      placeholder,
      footer,
      dataCy,
    } = this.props
    const { opened, current1 } = this.state
    const container = classNames('core-dropdown', className)
    const toggle = classNames('core-dropdown-toggle', direction)
    const menu = classNames('core-dropdown-menu', align)
    const maxHeight = height === 'auto' ? null : { maxHeight: height, overflowY: 'scroll' }

    return (
      <OutsideClickHandler display="flex" onOutsideClick={this.handleClose}>
        <div data-cy={dataCy} className={container} style={{ width }}>
          <div className={toggle} onClick={this.handleToggle}>
            {!isEmpty(title) && selectable && (
              <div className={`core-dropdown-title dsl-m12 ${'vertical' === direction ? 'mb-2' : 'mr-2'}`}>{title}</div>
            )}
            {!isEmpty(this.state.title) && selectable && (
              <div className="core-dropdown-label">
                {titleDirection === 'horizontal' ? (
                  <span
                    className={classNames('dsl-b16 mr-3', {
                      'ml-2': direction === 'vertical',
                      'no-wrap': !multi,
                    })}
                  >
                    {this.state.title}
                  </span>
                ) : (
                  split(', ', this.state.title).map((item, idx) => (
                    <p
                      className={classNames('dsl-b16 mb-0 mr-4', {
                        'ml-2': direction === 'vertical',
                        'no-wrap': !multi,
                      })}
                      key={`${title}${idx}`}
                    >
                      {item}
                    </p>
                  ))
                )}
                {caret === 'down' && <Icon name="fas fa-sort-down caret" color={iconColor} size={iconSize} />}
                {caret === 'icon-with-title' && <Icon name={icon} color={iconColor} size={iconSize} />}
              </div>
            )}
            {isEmpty(this.state.title) && caret === 'dots-without-title' && (
              <Icon name={icon} color={iconColor} size={iconSize} />
            )}
            {!selectable && !isEmpty(placeholder) && <div className="core-dropdown-title">{placeholder}</div>}
          </div>
          <Animations.Popup className={menu} enter={10} exit={0} opened={opened} style={maxHeight}>
            <>
              {className == 'project-filter'
                ? data.map((item, idx) => {
                    if (inPage(idx, current1, 15)) return this.renderItem(item, idx)
                  })
                : data.map((item, idx) => this.renderItem(item, idx))}

              {multi && (
                <div className="d-flex mb-1 justify-content-end">
                  <Button className="ml-auto mt-2" name="Clear" type="link" onClick={this.handleClear} />
                  <Button
                    className="ml-auto mt-2 core-button medium size-small btn btn-primary"
                    name="Apply"
                    onClick={this.handleApply}
                  >
                    Apply
                  </Button>
                </div>
              )}
              {data.length >= 15 && className == 'project-filter' && (
                <Pagination
                  dataCy="taskOpen"
                  current={current1}
                  perPage={15}
                  total={Math.ceil(length(data) / 15)}
                  onChange={e => this.setState({ current1: e })}
                />
              )}
              {footer}
            </>
          </Animations.Popup>
        </div>
      </OutsideClickHandler>
    )
  }
}

Dropdown.propTypes = {
  className: PropTypes.string,
  data: PropTypes.arrayOf(PropTypes.any),
  type: PropTypes.oneOf(['default', 'checkbox', 'thumbnail']),
  title: PropTypes.string,
  noOptionLabel: PropTypes.string,
  placeholder: PropTypes.string,
  multi: PropTypes.bool,
  selectable: PropTypes.bool,
  disabled: PropTypes.bool,
  disabledOptions: PropTypes.array,
  align: PropTypes.oneOf(['left', 'right']),
  direction: PropTypes.oneOf(['horizontal', 'vertical']),
  titleDirection: PropTypes.oneOf(['horizontal', 'vertical']),
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  defaultIndexes: PropTypes.array,
  defaultIds: PropTypes.array,
  splitted: PropTypes.bool,
  caret: PropTypes.oneOf(['none', 'down', 'icon-with-title', 'dots-without-title']),
  icon: PropTypes.string,
  iconColor: PropTypes.string,
  iconSize: PropTypes.number,
  returnBy: PropTypes.oneOf(['id', 'data']),
  mountEvent: PropTypes.bool,
  select: PropTypes.bool,
  footer: PropTypes.node,
  getId: PropTypes.func,
  getValue: PropTypes.func,
  onChange: PropTypes.func,
  onSelected: PropTypes.func,
}

Dropdown.defaultProps = {
  className: '',
  data: [],
  type: 'default',
  title: '',
  noOptionLabel: 'No options',
  placeholder: 'Select',
  multi: false,
  selectable: true,
  disabled: false,
  disabledOptions: [],
  align: 'left',
  direction: 'horizontal',
  titleDirection: 'horizontal',
  width: 'auto',
  height: 'auto',
  defaultIndexes: null,
  defaultIds: null,
  splitted: false,
  caret: 'down',
  icon: 'far fa-ellipsis-h',
  iconColor: '#343f4b',
  iconSize: 10,
  returnBy: 'id',
  mountEvent: false,
  footer: null,
  select: false,
  getId: data => data['id'],
  getValue: data => data['value'],
  onChange: () => {},
  onSelected: () => {},
}

export default Dropdown

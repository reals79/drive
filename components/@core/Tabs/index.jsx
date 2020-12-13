import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { Dropdown } from 'react-bootstrap'
import { findIndex, propEq } from 'ramda'
import { Icon } from '@components'
import './Tabs.scss'

const Tabs = ({ className, active, type, tabs, onTab, onDropdown }) => {
  const previousIndex = findIndex(propEq('name', active), tabs) - 1
  let previous
  if (previousIndex > -1) previous = tabs[previousIndex].name

  return (
    <div className={classNames(className, 'ds-tabs', type)}>
      {tabs.map((item, index) => (
        <div
          className={classNames('ds-tabs-tab', item.name === previous && 'previous', item.name === active && 'active')}
          key={item.name}
          onClick={() => onTab(item.name)}
        >
          {item.type === 'label' && (
            <div className={classNames('px-3 my-2', index === tabs.length - 1 && 'border-0')}>{item.label}</div>
          )}
          {item.type === 'icon' && (
            <>
              {item.label.length === 0 ? (
                <div className={classNames('px-3 my-2', index === tabs.length - 1 && 'border-0')}>
                  <Icon name={item.name} color={type === 'blue' ? 'white' : '#376caf'} size={14} />
                </div>
              ) : (
                <Dropdown
                  className={classNames(index === tabs.length - 1 && 'border-0')}
                  alignRight
                  onSelect={onDropdown}
                >
                  <Dropdown.Toggle as="div" id="ds-tabs-dropdown">
                    <div className={classNames('px-3', index === tabs.length - 1 && 'border-0')}>
                      <Icon name={item.name} color={type === 'blue' ? 'white' : '#376caf'} size={14} />
                    </div>
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    {item.label.map((label, index) => (
                      <Dropdown.Item eventKey={index} key={index}>
                        {label}
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
              )}
            </>
          )}
        </div>
      ))}
    </div>
  )
}

Tabs.propTypes = {
  className: PropTypes.string,
  active: PropTypes.string,
  type: PropTypes.oneOf(['blue', 'white']),
  tabs: PropTypes.array,
  onTab: PropTypes.func,
}

Tabs.defaultProps = {
  className: '',
  active: 'foo',
  type: 'blue',
  tabs: [
    { name: 'foo', label: 'Foo', type: 'label' },
    { name: 'boo', label: 'Boo', type: 'label' },
    { name: 'fal fa-cog', label: ['Account Admin', 'Blog Admin', 'Reports'], type: 'icon' },
  ],
  onTab: () => {},
}

export default Tabs

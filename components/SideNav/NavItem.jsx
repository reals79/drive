import React, { memo } from 'react'
import classNames from 'classnames'
import { Icon } from '@components'

const NavItem = ({ title, icon, href, parent, active, collapsed, onClick, dataCy }) => {
  const classname = classNames('nav-item', { parent, active, collapsed })
  return (
    <div className={classname} onClick={() => (parent ? {} : onClick())}>
      {collapsed ? (
        <Icon size={20} name={icon} color="#c3c7cc" data-cy={dataCy} />
      ) : (
        <span className={`dsl-b14 ${parent ? 'text-400' : ''}`} data-cy={dataCy}>
          {title}
        </span>
      )}
    </div>
  )
}

export default memo(NavItem)

import React, { memo } from 'react'
import PropTypes from 'prop-types'
import { length } from 'ramda'
import { AssignMenu, AddMenu } from '~/services/config'
import './Submenu.scss'

const Submenu = ({ role, onClick, onClose }) => (
  <div className="sub-menu">
    <div className="sub-menu-backdrop" onClick={() => onClose()} />
    <ul className="list-group p-4 m-0">
      {length(AssignMenu[role]) > 0 && <p className="dsl-w14">Assign</p>}
      {AssignMenu[role].map((menu, index) => (
        <p
          key={`assign-menu-${index}`}
          data-cy={`Fab-${menu.replace(/\s+/g, '')}`}
          className="list-group-item dsl-w14"
          onClick={() => onClick(menu)}
        >
          {menu}
        </p>
      ))}

      {AddMenu[role].length > 0 && <p className="dsl-w14 mt-3">Add</p>}
      {AddMenu[role].map((menu, index) => (
        <p
          key={`add-menu-${index}`}
          data-cy={`Fab-${menu.replace(/\s+/g, '')}`}
          className="list-group-item dsl-w14"
          onClick={() => onClick(menu)}
        >
          {menu}
        </p>
      ))}
    </ul>
  </div>
)

Submenu.propTypes = {
  role: PropTypes.number,
  onClose: PropTypes.func,
  onClick: PropTypes.func.isRequired,
}

Submenu.defaultProps = {
  role: 1,
  onClose: () => {},
  onClick: () => {},
}

export default memo(Submenu)

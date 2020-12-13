import React from 'react'
import PropTypes from 'prop-types'
import Detail from './Detail'
import Edit from './Edit'

const Employees = ({ data, employees, isUser, mode, onDiscard }) => {
  if (mode === 'edit') return <Edit data={data} employees={employees} onDiscard={onDiscard} />
  else if (mode === 'detail') return <Detail data={data} employees={employees} isUser={isUser} />
}

export default Employees

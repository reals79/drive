import React from 'react'
import Detail from './Detail'
import Edit from './Edit'

const Org = ({ data, employees, mode, onDiscard }) => {
  if (mode === 'edit') return <Edit data={data} onDiscard={onDiscard} />
  else return <Detail data={data} employees={employees} />
}

export default Org

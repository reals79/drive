import React, { memo } from 'react'
import { isNil } from 'ramda'
import { Button } from '@components'

const Footer = ({ title = 'ASSIGN', selected, onAssign, onAdd, add = false }) => (
  <>
    {!isNil(onAdd) && !add && <Button type="link" name="ADD" dataCy="addBtn" onClick={onAdd} />}
    <Button name={title} dataCy="assignBtn" disabled={selected.length === 0} onClick={onAssign} />
  </>
)

export default memo(Footer)

import React, { memo } from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import { find, propEq } from 'ramda'
import { EditDropdown } from '@components'
import BasicShow from '../Products/BasicShow'
import Recent from '../Products/Recent'
import Others from '../Products/Others'

const Basic = ({ data, isAdmin, onEdit }) => {
  const categories = useSelector(state => state.vendor.categories.all)
  const category = find(propEq('id', Number(data?.data?.category)), categories)
  const products = category?.popular

  return (
    <>
      <div className="card position-relative mt-3">
        <BasicShow data={data} products={products} title={data.name} />
        {isAdmin && <EditDropdown className="edit-all" options={['Edit', 'Reports']} onChange={onEdit} />}
      </div>
      <div className="d-flex mt-3">
        <div className="d-flex-2 mr-2">
          <div className="card">
            <Recent data={data} />
          </div>
        </div>
        <div className="d-flex-1 ml-2">
          <div className="card">
            <Others data={category} />
          </div>
        </div>
      </div>
    </>
  )
}

export default memo(Basic)

import React, { memo } from 'react'
import { Icon } from '@components'

const LibraryEmptyList = ({ parentTitle, childTitle, onDragOver, onDrop }) => (
  <div className="p-4" onDragOver={e => onDragOver(e)} onDrop={e => onDrop(e)}>
    <div className="d-center">
      <Icon name="fal fa-user-chart mx-2" size={24} color="#969faa" />
      <Icon name="fal fa-video mx-2" size={24} color="#969faa" />
      <Icon name="fal fa-graduation-cap mx-2" size={48} color="#969faa" />
      <Icon name="fal fa-book-open mx-2" size={24} color="#969faa" />
      <Icon name="far fa-walking mx-2" size={24} color="#969faa" />
    </div>
    <div className="mt-4">
      <p className="dsl-d12 text-center m-0">
        To add {childTitle}s to this {parentTitle}, click the "+" button under the
      </p>
      <p className="dsl-d12 text-center m-0">
        {childTitle} title. After that you can edit every {childTitle} in this
      </p>
      <p className="dsl-d12 text-center m-0">
        {parentTitle}. You can also drag {childTitle}s into a specific order.
      </p>
    </div>
  </div>
)

export default memo(LibraryEmptyList)

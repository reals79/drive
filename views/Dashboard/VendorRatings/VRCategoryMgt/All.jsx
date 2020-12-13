import React, { useState } from 'react'
import { Button, CheckBox, EditDropdown, Input, Pagination, Thumbnail } from '@components'
import { inPage } from '~/services/util'

const data = [
  {
    featured: true,
    category: 'Unassigned',
    description: 'This is unasigned category, where all products that are not categorized put to.',
    products: 58,
    reviews: 321,
  },
  {
    featured: false,
    category: 'Accounting',
    description:
      'It is a long established fact that a reader will be distracted by the readable content of a page when looking atits layout. The point of using Lorem Ipsum is that it has a more-or-less',
    products: 15,
    reviews: 198,
  },
]

const All = () => {
  const [current, setCurrent] = useState(1)
  const [per, setPer] = useState(10)
  const [search, setSearch] = useState([])

  const handlePage = e => {
    setCurrent(e)
  }

  const handlePer = e => {
    if (e > 50) setCurrent(1)
    setPer(e)
  }

  return (
    <>
      <div className="d-flex mb-4">
        <Input className="ml-0" placeholder="Search here..." value={search} onChange={e => setSearch(e)} />
        <Button className="ml-4" name="SEARCH" type="link" />
      </div>
      <div className="d-flex border-bottom pb-3">
        <div className="d-flex-1">
          <span className="dsl-m12">Featured</span>
        </div>
        <div className="d-flex-2 pr-3">
          <span className="dsl-m12">Category(27)</span>
        </div>
        <div className="d-flex-3 pr-3">
          <span className="dsl-m12">Description</span>
        </div>
        <div className="d-flex-2 pr-3">
          <span className="dsl-m12">DSA</span>
        </div>
        <div className="d-flex-1 text-right pr-3">
          <span className="dsl-m12">Products</span>
        </div>
        <div className="d-flex-1 text-right pr-3">
          <span className="dsl-m12">Reviews</span>
        </div>
        <div className="w80" />
      </div>
      {data.map((item, index) => {
        if (inPage(index, current, per)) {
          return (
            <div className="d-flex h200 py-4 border-bottom" key={`d${index}`}>
              <div className="d-flex-1">
                <CheckBox size="tiny" checked={item.featured} onChange={() => {}} />
              </div>
              <div className="d-flex-2 pr-3">
                <span className="dsl-b14 text-400">{item.category}</span>
              </div>
              <div className="d-flex-3 pr-3">
                <span className="dsl-b14 text-400">{item.description}</span>
              </div>
              <div className="d-flex-2 pr-3">
                <Thumbnail size="responsive" />
              </div>
              <div className="d-flex-1 text-right pr-3">
                <span className="dsl-b14 text-400">{item.products}</span>
              </div>
              <div className="d-flex-1 text-right pr-3">
                <span className="dsl-b14 text-400">{item.reviews}</span>
              </div>
              <div className="w80">
                <EditDropdown options={['Add Category', 'Archieve', 'Edit']} />
              </div>
            </div>
          )
        }
      })}
      <Pagination
        current={current}
        total={Math.ceil(data.length / per)}
        per={per}
        pers={[10, 25, 50, 'all']}
        onChange={handlePage}
        onPer={handlePer}
      />
    </>
  )
}

export default All

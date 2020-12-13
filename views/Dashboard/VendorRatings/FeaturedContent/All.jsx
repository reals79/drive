import React, { useState } from 'react'
import classNames from 'classnames'
import { Button, CheckBox, EditDropdown, Input, Thumbnail, Pagination } from '@components'
import { inPage } from '~/services/util'

const data = [
  {
    checked: false,
    title: 'Unfeatured',
    header: 'Social Media and the Buying I started in the car business in 1995',
    parag:
      'It is a long established fact that a reader will be distracted by the readable content of page when looking at its layout. The point of using Loren Ipsum is that it has a more-or-less normal distribution of letters as opposed to using.',
    url: 'Https://drivingsaels.com/titie-of-featured',
    views: '757',
    clicks: '757',
    startdate: 'May 12, 20',
    enddate: 'May 22, 20',
  },
  {
    checked: true,
    title: 'Home',
    header: 'Social Media and the Buying I started in the car business in 1995',
    parag:
      'It is a long established fact that a reader will be distracted by the readable content of page when looking at its layout. The point of using Loren Ipsum is that it has a more-or-less normal distribution of letters as opposed to using.',
    url: 'Https://drivingsaels.com/titie-of-featured',
    views: '757',
    clicks: '757',
    startdate: 'May 12, 20',
    enddate: 'May 22, 20',
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
      <div className="d-flex flex-row card-bottom pt-3">
        <Input placeholder="Search here..." value={search} onChange={e => setSearch(e)} />
        <Button className="ml-4" name="SEARCH" type="link" />
      </div>
      <div className="d-flex flex-row card-header pb-0">
        <p className="dsl-b22 bold mr-auto mb-0">Featured Items</p>
        <Button name="+Add Featured" type="link" />
      </div>
      {data.map((item, index) => {
        if (inPage(index, current, per)) {
          return (
            <div
              className={classNames(
                'd-flex',
                index % per === 0
                  ? 'card-bottom'
                  : index % per === per - 1 || index === data.length - 1
                  ? 'card-header'
                  : 'card'
              )}
              key={`d${index}`}
            >
              <div className="d-flex justify-content-between mb-3">
                <CheckBox title={item.title} checked={item.checked} />
                <EditDropdown options={['Add New', 'Edit', 'Delete', 'Move up', 'Move down']} />
              </div>
              <p className="dsl-b18 bold">{item.header}</p>
              <div className="d-flex">
                <div className="d-flex-4 pr-3">
                  <Thumbnail size="responsive" />
                </div>
                <div className="d-flex-5 px-3">
                  <p className="dsl-b16">{item.parag}</p>
                  <span className="dsl-b14">{item.url}</span>
                </div>
                <div className="d-flex-3 border-left px-3">
                  <div className="d-flex">
                    <p className="dsl-m12 w70">Views</p>
                    <span className="dsl-b14">{item.views}</span>
                  </div>
                  <div className="d-flex">
                    <p className="dsl-m12 w70">Clicks</p>
                    <span className="dsl-b14">{item.clicks}</span>
                  </div>
                  <div className="d-flex">
                    <p className="dsl-m12 w70">Start date</p>
                    <span className="dsl-b14">{item.startdate}</span>
                  </div>
                  <div className="d-flex">
                    <p className="dsl-m12 w70">End date</p>
                    <span className="dsl-b14">{item.enddate}</span>
                  </div>
                </div>
              </div>
            </div>
          )
        }
      })}
      <Pagination
        className="card-content"
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

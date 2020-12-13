import React, { useState } from 'react'
import { Avatar, Button, Dropdown, EditDropdown, Input, Pagination } from '@components'
import { inPage } from '~/services/util'

const data = [
  {
    company: ' ',
    admin: 'Ian Barkley',
    products: 'Yes',
    library: 'Premium',
    job: 'No',
    blogs: 'Public',
    connections: 'Yes',
    hcms: ['Traning', 'Scorecards', 'Programs'],
  },
  {
    company: 'EchelonFront',
    admin: 'Unclaimed',
    products: 'No',
    library: 'No',
    job: 'No',
    blogs: 'No',
    connections: 'No',
    hcms: ['Traning'],
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
        <Input placeholder="Search here..." value={search} onChange={e => setSearch(e)} />
        <Button className="ml-4 mr-auto" name="SEARCH" type="link" />
        <Dropdown placeholder="Select" />
      </div>
      <div className="d-flex border-bottom pb-3">
        <div className="d-flex-3">
          <span className="dsl-m12">Company</span>
        </div>
        <div className="d-flex-2">
          <span className="dsl-m12">Admin</span>
        </div>
        <div className="d-flex-2">
          <span className="dsl-m12">Products</span>
        </div>
        <div className="d-flex-2">
          <span className="dsl-m12">Library</span>
        </div>
        <div className="d-flex-1">
          <span className="dsl-m12">Job</span>
        </div>
        <div className="d-flex-2">
          <span className="dsl-m12">Blogs</span>
        </div>
        <div className="d-flex-2">
          <span className="dsl-m12">Connections</span>
        </div>
        <div className="d-flex-2">
          <span className="dsl-m12">HCM</span>
        </div>
        <div className="w30" />
      </div>
      {data.map((item, index) => {
        if (inPage(index, current, per)) {
          return (
            <div className="d-flex align-items-center border-bottom h80" key={`d${index}`}>
              <div className="d-flex d-flex-3 align-items-center">
                <Avatar size="tiny" />
                <span className="dsl-b14 text-400 ml-2">{item.company}</span>
              </div>
              <div className="d-flex-2">
                <span className="dsl-b14 text-400">{item.admin}</span>
              </div>
              <div className="d-flex-2">
                <span className="dsl-b14 text-400">{item.products}</span>
              </div>
              <div className="d-flex-2">
                <span className="dsl-b14 text-400">{item.library}</span>
              </div>
              <div className="d-flex-1">
                <span className="dsl-b14 text-400">{item.job}</span>
              </div>
              <div className="d-flex-2">
                <span className="dsl-b14 text-400">{item.blogs}</span>
              </div>
              <div className="d-flex-2">
                <span className="dsl-b14 text-400">{item.connections}</span>
              </div>
              <div className="d-flex d-flex-2 flex-column">
                {item.hcms.map((hcm, hid) => (
                  <span className="dsl-b14 text-400 mb-1" key={`h${hid}`}>
                    {hcm}
                  </span>
                ))}
              </div>
              <div className="w30">
                <EditDropdown options={['Add Company', 'Archieve', 'Edit']} />
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

import React, { useState } from 'react'
import { Avatar, Button, Dropdown, EditDropdown, Input, Pagination } from '@components'
import { inPage } from '~/services/util'

const data = [
  {
    user: 'Bart Wilson',
    company: ' ',
    profile: '75%',
    hcm: 'Yes',
    activelogin: '15',
    lastlogin: 'Feb 4, 20',
  },
  {
    user: 'Ian Barkley',
    company: 'Allen Turner Hyundai',
    profile: '25%',
    hcm: 'Yes',
    activelogin: '25',
    lastlogin: 'Feb 4, 20',
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
      <div className="d-flex justify-content-between mb-4">
        <div className="d-flex">
          <Input className="ml-0" placeholder="Search here..." value={search} onChange={e => setSearch(e)} />
          <Button className="ml-4" name="SEARCH" type="link" />
        </div>
        <Dropdown placeholder="Active users" />
      </div>
      <div className="d-flex border-bottom pb-3">
        <div className="d-flex-4">
          <span className="dsl-m12">User</span>
        </div>
        <div className="d-flex-4">
          <span className="dsl-m12">Default Company</span>
        </div>
        <div className="d-flex-3 text-right">
          <span className="dsl-m12">profile optimized</span>
        </div>
        <div className="d-flex-2 text-right">
          <span className="dsl-m12">HCM</span>
        </div>
        <div className="d-flex-3 text-right">
          <span className="dsl-m12">Active logins</span>
        </div>
        <div className="d-flex-3 text-right">
          <span className="dsl-m12">Last login</span>
        </div>
        <div className="w50" />
      </div>
      {data.map((item, index) => {
        if (inPage(index, current, per)) {
          return (
            <div className="d-flex align-items-center border-bottom h80" key={`d${index}`}>
              <div className="d-flex d-flex-4 align-items-center">
                <Avatar size="tiny" />
                <span className="dsl-b14 text-400 ml-2">{item.user}</span>
              </div>
              <div className="d-flex-4">
                <span className="dsl-b14 text-400">{item.company}</span>
              </div>
              <div className="d-flex-3 text-right">
                <span className="dsl-b14 text-400">{item.profile}</span>
              </div>
              <div className="d-flex-2 text-right">
                <span className="dsl-b14 text-400">{item.hcm}</span>
              </div>
              <div className="d-flex-3 text-right">
                <span className="dsl-b14 text-400">{item.activelogin}</span>
              </div>
              <div className="d-flex-3 text-right">
                <span className="dsl-b14 text-400">{item.lastlogin}</span>
              </div>
              <div className="w50">
                <EditDropdown options={['Add user', 'Archieve', 'Ban IP', 'Block user', 'Edit']} />
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

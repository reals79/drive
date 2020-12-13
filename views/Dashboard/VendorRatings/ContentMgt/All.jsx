import React, { useState } from 'react'
import classNames from 'classnames'
import { Avatar, Button, CheckBox, Dropdown, EditDropdown, Input, Pagination } from '@components'
import { inPage } from '~/services/util'

const data = [
  {
    checked: false,
    checktitle: 'Unmoderated',
    type: 'New Blog',
    title: 'Welcome to theGrappone Automotive Team',
    description: 'Description text starts here one line.',
    authorname: 'Ian Barkley',
    authorcompany: ' ',
    authoraddress: '192.168.0.1',
    startdate: 'May 14, 20 2:30 pm',
    enddate: 'May 15, 205:30 pm',
    loggedname: 'Bard Wilson',
  },
  {
    checked: true,
    checktitle: 'Approved',
    type: 'New Blog',
    title: 'Welcome to theGrappone Automotive Team',
    description: 'Description text starts here one line.',
    authorname: 'Ian Barkley',
    authorcompany: ' ',
    authoraddress: '192.168.0.1',
    startdate: 'May 14, 20 2:30 pm',
    enddate: 'May 15, 205:30 pm',
    loggedname: 'Bard Wilson',
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
      <div className="card-content d-flex pb-4">
        <Input placeholder="Search here..." value={search} onChange={e => setSearch(e)} />
        <Button className="ml-4 mr-auto" name="SEARCH" type="link" />
        <Dropdown placeholder="Showing All" data={['']} getValue={e => e} />
      </div>
      <div className="card-content">
        <div className="d-flex w-100 border-bottom pb-2">
          <div className="d-flex-2">
            <span className="dsl-m12">Status/Type</span>
          </div>
          <div className="d-flex-3">
            <span className="dsl-m12">Title/Description</span>
          </div>
          <div className="d-flex-3">
            <span className="dsl-m12">Author</span>
          </div>
          <div className="d-flex-3">
            <span className="dsl-m12">Logged vs Moderated</span>
          </div>
          <div className="w30" />
        </div>
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
              <div className="d-flex-2">
                <CheckBox title={item.checktitle} checked={item.checked} />
                <p className="dsl-m12 ml30">{item.type}</p>
              </div>
              <div className="d-flex-3">
                <p className="dsl-b14 text-400">{item.title}</p>
                <p className="dsl-m12 truncate-one">{item.description}</p>
              </div>
              <div className="d-flex d-flex-3">
                <div className="d-flex-1">
                  <Avatar size="tiny" />
                </div>
                <div className="d-flex-3">
                  <p className="dsl-b14 text-400">{item.authorname}</p>
                  <p className="dsl-b14 text-400">{item.authorcompany}</p>
                  <p className="dsl-b14 text-400">{item.authoraddress}</p>
                </div>
              </div>
              <div className="d-flex-3">
                <p className="dsl-b14 text-400">{item.startdate}</p>
                <p className="dsl-b14 text-400">{item.enddate}</p>
                <p className="dsl-b14 text-400">{item.loggedname}</p>
              </div>
              <div className="w30">
                <EditDropdown />
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

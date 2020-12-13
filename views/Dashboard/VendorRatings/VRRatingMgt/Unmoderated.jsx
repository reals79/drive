import React, { useState } from 'react'
import classNames from 'classnames'
import { clone } from 'ramda'
import { Avatar, Button, CheckBox, EditDropdown, Input, Pagination, Rating } from '@components'
import { inPage } from '~/services/util'

const data = [
  {
    checktitle: 'Unmoderated',
    checked: false,
    categorytitle: 'CarsForSales CRM',
    category: 'CRM',
    manager: 'Internet Manager',
    contributions: 0,
    helpfulvotes: 0,
    date: 'May 22, 20 at 12:44pm',
    score: 1.7,
    recommended: 'NO',
    pros:
      'The UX of this product is super smooth. Its so easy to use.  It takes no traning, and a kid could use it to creat value',
    cons:
      'The only thing wrong with is that I can think of is that it should wash your dishes, and maybe your laundry.',
    dealership: 'Honda of Toyota',
    reviewer: 'Johana Mendos',
    phone: '111 332 4422',
    email: 'hondadoftoyota@company.com',
    ipaddress: '192.168.0.1',
    notes: [
      {
        date: 'May 22 at 1:30 pm',
        attempt: 'Call the store, I think this is fake.',
      },
      {
        date: 'May 22 at 2:31 pm',
        attempt: 'Attempt1: no answer',
      },
      {
        date: 'May 24 at 4:15 pm',
        attempt: 'Attempt2: still nothing',
      },
    ],
  },
  {
    checktitle: 'Unmoderated',
    checked: false,
    categorytitle: 'EleadOne CRM',
    category: 'CRM',
    manager: 'Sales Manager',
    contributions: 0,
    helpfulvotes: 0,
    date: 'May 22, 20 at 12:44pm',
    score: 4.5,
    recommended: 'YES',
    pros:
      'The UX of this product is super smooth. Its so easy to use.  It takes no traning, and a kid could use it to creat value',
    cons:
      'The only thing wrong with is that I can think of is that it should wash your dishes, and maybe your laundry.',
    dealership: 'Toyota of Orlando',
    reviewer: 'Peter Johns',
    phone: '111 332 4422',
    email: 'hondadoftoyota@company.com',
    ipaddress: '192.168.0.1',
    notes: [],
  },
]

const Unmoderated = () => {
  const [current, setCurrent] = useState(1)
  const [per, setPer] = useState(10)
  const [search, setSearch] = useState([])
  const [note, setNote] = useState([])

  const handleNote = index => e => {
    const temp = clone(note)
    temp[index] = e
    setNote(temp)
  }

  const handlePage = e => {
    setCurrent(e)
  }

  const handlePer = e => {
    if (e > 50) setCurrent(1)
    setPer(e)
  }

  return (
    <>
      <div className="d-flex align-items-center card-content">
        <Input className="py-3" placeholder="Search here..." value={search} onChange={e => setSearch(e)} />
        <Button className="ml-4" name="SEARCH" type="link" onClicked={() => {}} />
      </div>
      <div className="card-content pt-3">
        <p className="dsl-b18 bold mb-0">New Reviews</p>
      </div>
      {data.map((item, index) => {
        if (inPage(index, current, per)) {
          return (
            <div
              className={classNames(
                index % per === 0
                  ? 'card-bottom'
                  : index % per === per - 1 || index === data.length - 1
                  ? 'card-header'
                  : 'card'
              )}
              key={`d${index}`}
            >
              <div className="d-flex justify-content-between mb-3">
                <CheckBox title={item.checktitle} checked={item.checked} />
                <EditDropdown options={['Add Review', 'Edit', 'Verify']} />
              </div>
              <div className="d-flex">
                <div className="d-flex-3 px-3">
                  <div className="d-flex mb-4">
                    <div className="d-flex-1 pr-3">
                      <Avatar className="ml-auto" size="small" />
                    </div>
                    <div className="d-flex-6 align-items-center">
                      <p className="dsl-b14 text-400 mt-2 mb-0">{item.categorytitle}</p>
                      <span className="dsl-m12">Category: {item.category}</span>
                    </div>
                  </div>
                  <div className="d-flex">
                    <div className="d-flex-1 pr-3">
                      <Avatar className="ml-auto" size="tiny" />
                    </div>
                    <div className="d-flex-6">
                      <div className="d-flex">
                        <div className="d-flex-3">
                          <p className="dsl-b14 text-400 mb-2">{item.manager}</p>
                          <p className="dsl-m14 mb-2">
                            {item.contributions} contributions - {item.helpfulvotes} helpful votes
                          </p>
                          <p className="dsl-b14 text-400 mb-2">{item.date}</p>
                        </div>
                        <div className="d-flex-2">
                          <Rating score={item.score} />
                          <span className="dsl-b14">Recommended: {item.recommended}</span>
                        </div>
                      </div>
                      <p className="dsl-b14 bold my-3">the worst CMS we have ever used</p>
                      <div className="d-flex">
                        <div className="d-flex-1">
                          <p className="dsl-b14 text-400 mt-1">Pros:</p>
                        </div>
                        <div className="d-flex-6">
                          <span className="dsl-m14 font-italic">{item.pros}</span>
                        </div>
                      </div>
                      <div className="d-flex">
                        <div className="d-flex-1">
                          <p className="dsl-b14 text-400 mt-1">Cons:</p>
                        </div>
                        <div className="d-flex-6">
                          <span className="dsl-m14 font-italic">{item.cons}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="d-flex-2 border-left pl-5">
                  <p className="dsl-b16 bold">Contact</p>
                  <div className="d-flex mb-3">
                    <span className="dsl-m12 w80">Dealership</span>
                    <span className="dsl-b12 text-400 mr-auto">{item.dealership}</span>
                  </div>
                  <div className="d-flex mb-3">
                    <span className="dsl-m12 w80">Reviewer</span>
                    <span className="dsl-b12 text-400 mr-auto">{item.reviewer}</span>
                  </div>
                  <div className="d-flex mb-3">
                    <span className="dsl-m12 w80">Phone</span>
                    <span className="dsl-b12 text-400 mr-auto">{item.phone}</span>
                  </div>
                  <div className="d-flex truncate-one mb-3">
                    <span className="dsl-m12 w80">Email</span>
                    <span className="dsl-b12 text-400 mr-auto">{item.email}</span>
                  </div>
                  <div className="d-flex mb-4">
                    <span className="dsl-m12 w80">IP Address</span>
                    <span className="dsl-b12 text-400 mr-auto">{item.ipaddress}</span>
                  </div>
                  <p className="dsl-b16 bold">Notes</p>
                  {item.notes?.map((note, idx) => (
                    <div className="d-flex" key={`n${idx}`}>
                      <div className="d-flex-1">
                        <Avatar size="tiny" />
                      </div>
                      <div className="d-flex-5 mb-3">
                        <p className="dsl-b12 mb-0">{note.date}</p>
                        <span className="dsl-b12 text-400">{note.attempt}</span>
                      </div>
                    </div>
                  ))}
                  <div className="d-flex mb-3">
                    <div className="d-flex-1">
                      <Avatar size="tiny" />
                    </div>
                    <div className="d-flex-5">
                      <Input placeholder="Type here..." value={note[index]} onChange={handleNote(index)} />
                    </div>
                  </div>
                  <Button className="ml-auto" name="SAVE" type="link" onClicked={() => {}} />
                </div>
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

export default Unmoderated

import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { filter } from 'ramda'
import { Avatar, Button, EditDropdown, Pagination } from '@components'
import AppActions from '~/actions/app'
import { UserRoles } from '~/services/config'
import { inPage } from '~/services/util'
import './HumanCapital.scss'

const Library = ({ data }) => {
  const role = useSelector(state => state.app.primary_role_id)
  const [gcurrent, setGcurrent] = useState(1)
  const [gper, setGper] = useState(15)
  const [icurrent, setIcurrent] = useState(1)
  const [iper, setIper] = useState(15)
  const globalAuthors = filter(e => e.type === 3, data.library?.authors || [])
  const internalAuthors = filter(e => e.type === 1, data.library?.authors || [])

  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(AppActions.getallauthorsRequest())
  }, [])

  const handleDropdown = author => e => {
    if (e === 'edit') {
      const payload = {
        type: 'Edit Internal Author',
        data: { before: { author, data } },
      }
      dispatch(AppActions.modalRequest(payload))
    } else if (e === 'remove') {
      const payload = { author_id: author.id }
      const callback = { id: data.business_id }
      dispatch(AppActions.postdeleteauthorRequest(payload, callback))
    } else {
    }
  }

  const handleGPage = e => {
    setGcurrent(e)
  }

  const handleGPer = e => {
    if (e > 50) setGcurrent(1)
    setGper(e)
  }

  const handleIPage = e => {
    setIcurrent(e)
  }

  const handleIPer = e => {
    if (e > 50) setIcurrent(1)
    setIper(e)
  }

  const handleGlobalAdd = () => {
    const payload = {
      type: 'Add Global Author',
    }
    dispatch(AppActions.modalRequest(payload))
  }

  const handleCompanyAdd = () => {
    const payload = {
      type: 'Add Internal Author',
      data: { before: { data } },
    }
    dispatch(AppActions.modalRequest(payload))
  }

  return (
    <div className="human-capital">
      <p className="dsl-b18 bold mt-4 mb-4">Global Authors</p>
      <div className="d-flex py-2 border-bottom library_header">
        <div className="d-flex-10">
          <span className="dsl-m12">Author</span>
        </div>
        <div className="d-flex-2">
          <span className="dsl-m12">Type</span>
        </div>
        <div className="d-flex-3 text-right">
          <span className="dsl-m12">Modules</span>
        </div>
        <div className="d-flex-3 text-right">
          <span className="dsl-m12">Courses</span>
        </div>
        <div className="d-flex-3 text-right">
          <span className="dsl-m12">Tracks</span>
        </div>
        <div className="w50" />
      </div>
      {globalAuthors.length > 0 ? (
        <>
          {globalAuthors.map((item, index) => {
            if (inPage(index, gcurrent, gper)) {
              return (
                <div className="d-flex py-3 align-items-center library-author-panel border-bottom" key={`l${index}`}>
                  <div className="d-flex align-items-center d-flex-10">
                    <Avatar />
                    <span className="dsl-m14 ml-3">{item.name}</span>
                  </div>
                  <div className="responsive_list">
                    <div className="d-flex-2">
                      <span className="dsl-m14 text-capitalize">{item.access_type}</span>
                    </div>
                    <div className="d-flex-3 responsive_text_align">
                      <span className="dsl-m14">{item.module_count}</span>
                    </div>
                    <div className="d-flex-3 responsive_text_align">
                      <span className="dsl-m14">{item.course_count}</span>
                    </div>
                    <div className="d-flex-3 responsive_text_align">
                      <span className="dsl-m14">{item.track_count}</span>
                    </div>
                  </div>
                  <div className="w50">
                    <EditDropdown
                      options={
                        role === UserRoles.SUPER_ADMIN ? ['Remove', 'View'] : role === UserRoles.ADMIN ? ['view'] : ['']
                      }
                      onChange={handleDropdown(item)}
                    />
                  </div>
                </div>
              )
            }
          })}
          <Pagination
            className="w-100 mb-2"
            current={gcurrent}
            per={gper}
            pers={[15, 25, 50, 'all']}
            total={Math.ceil(globalAuthors?.length / gper)}
            onChange={handleGPage}
            onPer={handleGPer}
          />
        </>
      ) : (
        <p className="dsl-m14 text-center p-4">No Global Authors.</p>
      )}
      <Button className="ml-auto" name="Add" type="link" onClick={handleGlobalAdd} />
      <p className="dsl-b18 bold mt-4 mb-4">Internal Authors</p>
      <div className="d-flex py-2 border-bottom library_header">
        <div className="d-flex-10">
          <span className="dsl-m12">Author</span>
        </div>
        <div className="d-flex-2">
          <span className="dsl-m12">Type</span>
        </div>
        <div className="d-flex-3 text-right">
          <span className="dsl-m12">Modules</span>
        </div>
        <div className="d-flex-3 text-right">
          <span className="dsl-m12">Courses</span>
        </div>
        <div className="d-flex-3 text-right">
          <span className="dsl-m12">Tracks</span>
        </div>
        <div className="w50" />
      </div>
      {internalAuthors.length > 0 ? (
        <>
          {internalAuthors.map((item, index) => {
            if (inPage(index, icurrent, iper)) {
              return (
                <div className="d-flex py-3 align-items-center library-author-panel border-bottom" key={`l${index}`}>
                  <div className="d-flex align-items-center d-flex-10">
                    <Avatar />
                    <span className="dsl-m14 ml-3">{item.name}</span>
                  </div>
                  <div className="responsive_list">
                    <div className="d-flex-2">
                      <span className="dsl-m14 text-capitalize">{item.access_type}</span>
                    </div>
                    <div className="d-flex-3 responsive_text_align">
                      <span className="dsl-m14">{item.module_count}</span>
                    </div>
                    <div className="d-flex-3 responsive_text_align">
                      <span className="dsl-m14">{item.course_count}</span>
                    </div>
                    <div className="d-flex-3 responsive_text_align">
                      <span className="dsl-m14">{item.track_count}</span>
                    </div>
                  </div>
                  <div className="w50">
                    <EditDropdown
                      options={role < UserRoles.MANAGER ? ['Edit', 'Remove', 'View'] : ['']}
                      onChange={handleDropdown(item)}
                    />
                  </div>
                </div>
              )
            }
          })}
          <Pagination
            className="w-100 mb-2"
            current={icurrent}
            per={iper}
            pers={[15, 25, 50, 'all']}
            total={Math.ceil(internalAuthors?.length / iper)}
            onChange={handleIPage}
            onPer={handleIPer}
          />
        </>
      ) : (
        <p className="dsl-m14 text-center p-4">No Internal Authors.</p>
      )}
      <Button className="ml-auto" name="Add" type="link" onClick={handleCompanyAdd} />
    </div>
  )
}

export default Library

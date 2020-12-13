import React, { memo, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { useSelector, useDispatch } from 'react-redux'
import { clone } from 'ramda'
import { Button, Dropdown, Icon, Input } from '@components'
import AppActions from '~/actions/app'
import VenActions from '~/actions/vendor'
import './HCMLicenses.scss'

const StepThree = ({ onNext, onPrevious }) => {
  const _md = useSelector(state => state.app.modalData)
  const data = _md?.before?.data
  const initGlobalAuthors = data.global_authors
  const initCompanyAuthors = ['']
  const allAuthors = useSelector(state => state.app.allAuthors)

  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(AppActions.getallauthorsRequest())
  }, [])

  const [global, setGlobal] = useState(initGlobalAuthors)
  const [company, setCompany] = useState(initCompanyAuthors)
  const [author, setAuthor] = useState(initCompanyAuthors)
  const [library, setLibrary] = useState(initCompanyAuthors)

  const handleAddGlobal = () => {
    const temp = clone(global)
    temp.push(null)
    setGlobal(temp)
  }
  const handleGlobal = (e, index) => {
    const temp = clone(global)
    temp[index] = e
    setGlobal(temp)
  }
  const handleAddCompany = () => {
    const temp = clone(company)
    temp.push(null)
    setCompany(temp)
  }
  const handleCompany = (e, index) => {
    const temp = clone(author)
    temp[index] = e
    setAuthor(temp)
  }

  const handleSave = () => {
    const payload = { author: global[0] }
    dispatch(AppActions.postsaveauthorRequest(payload))
    onNext()
  }

  return (
    <>
      <p className="dsl-b18 bold mt-5">Library</p>
      <Input
        className="description ml-0"
        placeholder="Define the authors for the company."
        value={library}
        onChange={e => setLibrary(e)}
      />
      <div className="d-flex align-items-center mt-5 mb-3">
        <span className="dsl-b18 text-400">Global Authors</span>
        <Icon name="fa fa-plus-circle cursor-pointer ml-3" color="#969faa" size={16} onClick={handleAddGlobal} />
      </div>
      {global.map((item, index) => (
        <Dropdown
          className="mb-4"
          key={`a${index}`}
          defaultIds={initGlobalAuthors.map(item => item.id)}
          title={`Global Author ${index + 1}`}
          placeholder="Select"
          width="fit-content"
          data={allAuthors.globalAuthors}
          returnBy="data"
          getValue={e => e.name}
          onChange={e => handleGlobal(e[0], index)}
        />
      ))}
      <div className="d-flex align-items-center mt-5 mb-3">
        <span className="dsl-b18 text-400">Company Authors</span>
        <Icon name="fa fa-plus-circle cursor-pointer ml-3" color="#969faa" size={16} onClick={handleAddCompany} />
      </div>
      {company.map((item, index) => (
        <Input
          className="mb-3 mr-5"
          key={`c${index}`}
          title={`Company Author ${index + 1}`}
          placeholder="Type here..."
          value={author[index]}
          onChange={e => handleCompany(e, index)}
        />
      ))}
      <div className="body-footer">
        <Button type="medium" name="PREVIOUS" onClick={onPrevious} />
        <Button className="ml-3" name="NEXT" onClick={handleSave} />
      </div>
    </>
  )
}

StepThree.propTypes = {}

StepThree.defaultProps = {}

export default memo(StepThree)

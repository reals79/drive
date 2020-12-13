import React, { Component } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { find, isEmpty, isNil, propEq, equals } from 'ramda'
import { AdvancedSearch, Button, DatePicker, Dropdown, Icon, Input, Thumbnail } from '@components'
import { LibraryTypes } from '~/services/config'
import './AddPacket.scss'

const TABS = [
  { name: 'careers', label: 'Career' },
  { name: 'certifications', label: 'Certificate' },
]

class AddPacket extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selected: TABS[0].name,
      title: '',
      description: '',
      search: '',
    }
    this.handleTitle = this.handleTitle.bind(this)
    this.handleDescription = this.handleDescription.bind(this)
    this.handleSearch = this.handleSearch.bind(this)
  }

  handleTitle(e) {
    this.setState({ title: e })
  }

  handleDescription(e) {
    this.setState({ description: e })
  }

  handleSearch(e) {
    this.setState({ search: e })
  }

  render() {
    const { data, employees } = this.props
    const { selected, title, description, search } = this.state

    return (
      <div className="add-packet">
        <div className="modal-header">
          <Icon name="fal fa-plus-circle" size={12} color="#fff" />
          <span className="dsl-w12 ml-1">Add Packet</span>
        </div>
        <div className="modal-body">
          <Input
            title="Packet title"
            placeholder="Type here..."
            direction="vertical"
            value={title}
            onChange={this.handleTitle}
          />
          <Input
            className="mt-3"
            title="Packet description"
            placeholder="Type here..."
            direction="vertical"
            as="textarea"
            rows={3}
            value={description}
            onChange={this.handleDescription}
          />
          <Input
            className="mt-3"
            title="Attach documents"
            placeholder="Search here..."
            direction="vertical"
            value={search}
            onChange={this.handleSearch}
          />
          <div className="d-flex">
            <AdvancedSearch className="ml-auto mt-4" />
          </div>
          <div className="d-flex justify-content-between mt-5">
            <span className="dsl-m12">Viewing: 78</span>
            <span className="dsl-m12">Selected: 0</span>
          </div>
          <div className="list-container">
            <div className="d-flex mb-2">
              {TABS.map((tab, index) => (
                <div key={index}>
                  <span
                    className={`dsl-p16 cursor-pointer${equals(tab.name, selected) ? ' bold' : ''}`}
                  >
                    {tab.label}
                  </span>
                  {!equals(index, TABS.length - 1) && <span className="dsl-p16 mx-3">|</span>}
                </div>
              ))}
            </div>
            <div className="list-content">
              {data[selected].data.map((item, index) => {
                const icon = LibraryTypes[selected].icon
                const thumb = isEmpty(icon) ? item.thumbnail || item.data.thumb_url : icon
                const isSelected = !isNil(find(propEq('id', item.id), selected))
                return (
                  <div className={`list-item${isSelected ? ' active' : ''}`} key={`lml${index}`}>
                    <Thumbnail src={thumb} size="tiny" label={LibraryTypes[selected].label} />
                    <div className="d-flex-1 ml-2 mr-4">
                      <p className="dsl-b14 bold truncate-two mb-1">{item.name || item.title}</p>
                      <p className="dsl-b12 truncate-two mb-0">{item.data.description}</p>
                    </div>
                    <div className="item-plus" onClick={() => onAdd(item)}>
                      <Icon name="fal fa-plus" size={24} color="#c3c7cc" />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
          <div className="d-flex">
            <div className="d-flex-1">
              <Dropdown
                className="mt-3"
                multi
                title="Assign to"
                width="fit-content"
                data={employees}
                direction="vertical"
                getValue={e => e['name']}
                onChange={() => {}}
              />
            </div>
            <div className="d-flex-1">
              <Dropdown
                className="mt-3"
                multi
                title="Manager"
                width="fit-content"
                data={employees}
                direction="vertical"
                getValue={e => e['name']}
                onChange={() => {}}
              />
            </div>
          </div>
          <div className="d-flex mt-4">
            <DatePicker
              className="duedate-calender"
              title="Due date"
              direction="vertical"
              value={moment()}
              format="MMM DD, YY"
              fontColor="secondary"
              calendar="day"
              append="caret"
              as="span"
              append="caret"
              closeAfterSelect
              onSelect={() => {}}
            />
          </div>
        </div>
        <div className="modal-footer">
          <Button name="ADD" />
        </div>
      </div>
    )
  }
}

AddPacket.propTypes = {}

AddPacket.defaultProps = {}

export default AddPacket

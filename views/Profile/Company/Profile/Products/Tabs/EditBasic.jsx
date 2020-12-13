import React from 'react'
import PropTypes from 'prop-types'
import { Button, EditDropdown, Input, Rating } from '@components'

class Basic extends React.Component {
  state = {
    title: this.props.data.name,
    phone: this.props.data.data?.contact?.phone,
    website: this.props.data.data?.website,
    chat: 'Chat with us',
    contact: 'CONTACT',
    description: this.props.data.data.description,
  }

  handleClaimPage = () => {}

  handleDiscard = () => {}

  handleSave = () => {
    const { data } = this.props
    const { title, description, website, phone, contact } = this.state
    const payload = {
      product: {
        id: data.id,
        parent_id: data.parent_id,
        name: title,
        data: { category: null, description, contact: { email: contact, phone }, website },
      },
    }
    this.props.onSubmit(payload)
  }

  render() {
    const { onEdit, isAdmin } = this.props
    const { title, phone, website, chat, contact, description } = this.state

    return (
      <div className="card position-relative mt-3">
        <div className="d-flex align-items-end mb-3">
          <Input
            className="edit-plus-title"
            placeholder="Type here..."
            value={title}
            onChange={e => this.setState({ title: e })}
          />
          <span className="dsl-m12 ml-2 mb-1">Claim page</span>
        </div>
        <div className="d-flex">
          <div className="d-flex-1 mt-3">
            <p className="dsl-b18 bold">Ratings</p>
            <div className="d-flex">
              <Rating score={5} size="medium" />
              <span className="dsl-b20 text-400 ml-2">5.0</span>
            </div>
            <p className="dsl-b18 bold mt-2">90% Recommended</p>
            <p className="dsl-b14 mt-4">2398 Verified Ratings</p>
            <p className="dsl-b14 mt-1">By 980 Verified Dealership</p>

            <div className="d-flex border-top mr-3">
              <Button className="ml-auto mt-3" type="medium" name="CLAIM PAGE" onClick={this.handleClaimPage} />
            </div>
          </div>
          <div className="d-flex-2 mt-3">
            <p className="dsl-b18 bold">About</p>
            <Input
              className="edit-description"
              placeholder="Type here..."
              value={description}
              as="textarea"
              rows={10}
              onChange={e => this.setState({ description: e })}
            />
          </div>
        </div>
        <div className="d-flex align-items-end mt-3">
          <Button className="ml-auto" type="medium" name="DISCARD" onClick={this.handleDiscard} />
          <Button className="ml-3" name="SAVE" onClick={this.handleSave} />
        </div>
        {isAdmin && <EditDropdown className="edit-all" options={['Edit', 'Reports']} onChange={onEdit} />}
      </div>
    )
  }
}

export default Basic

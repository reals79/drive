import React from 'react'
import PropTypes from 'prop-types'
import { Button, EditDropdown, Icon, Input, Rating, Thumbnail } from '@components'

class Plus extends React.Component {
  state = {
    title: this.props.data.name,
    phone: this.props.data.data?.contact?.phone,
    website: this.props.data.data?.website,
    chat: 'Chat with us',
    contact: this.props.data.data?.contact?.email,
    description: this.props.data.data.description,
    thumbnail: '/images/accord_sample.jpg',
  }

  handleDiscard = () => {
    this.props.onCancel()
  }

  handleSave = () => {
    const { data } = this.props
    const { title, description, thumbnail, website, phone, contact } = this.state
    const payload = {
      product: {
        id: data.id,
        parent_id: data.parent_id,
        name: title,
        data: { category: null, description, contact: { email: contact, phone }, website },
      },
    }
    this.props.onSubmit(payload, thumbnail, false)
  }

  render() {
    const { onEdit, isAdmin } = this.props
    const { title, phone, website, chat, contact, description, thumbnail } = this.state

    return (
      <div className="card position-relative mt-3">
        <div className="d-flex align-items-end mb-3">
          <Input
            className="edit-plus-title"
            placeholder="Type here..."
            value={title}
            onChange={e => this.setState({ title: e })}
          />
          <div className="d-flex mb-1">
            <Icon name="fa fa-check-circle ml-2" color="green" size={14} />
            <span className="dsl-m12 ml-1">Claimed</span>
          </div>
        </div>
        <div className="d-flex">
          <div className="d-flex-1 mt-3">
            <p className="dsl-b18 bold">Ratings</p>
            <div className="d-flex">
              <Rating score={5} size="medium" />
              <span className="dsl-b20 text-400 ml-2">5.0</span>
            </div>
            <p className="dsl-b18 bold mt-2">90% Recommended</p>
            <p className="dsl-b14 mt-5">2398 Verified Ratings</p>
            <p className="dsl-b14 mt-1">By 980 Verified Dealership</p>

            <p className="dsl-b20 bold mt-5">Contact</p>
            <div className="contact mt-4">
              <Icon name="fal fa-phone-alt head" color="dark" size={14} />
              <Input
                className="edit-plus-title"
                placeholder="Type here..."
                value={phone}
                onChange={e => this.setState({ phone: e })}
              />
            </div>
            <div className="contact mt-4">
              <Icon name="fal fa-window-maximize head" color="dark" size={14} />
              <Input
                className="edit-plus-title"
                placeholder="Type here..."
                value={website}
                onChange={e => this.setState({ website: e })}
              />
            </div>
            <div className="contact mt-4">
              <Icon name="fal fa-comment head" color="dark" size={14} />
              <Input
                className="edit-plus-title"
                placeholder="Type here..."
                value={chat}
                onChange={e => this.setState({ chat: e })}
              />
            </div>
            <div className="contact mt-4">
              <Icon name="fal fa-envelope head" color="dark" size={14} />
              <Input
                className="edit-plus-title"
                placeholder="Type here..."
                value={contact}
                onChange={e => this.setState({ contact: e })}
              />
            </div>
          </div>
          <div className="d-flex-2">
            <Thumbnail
              className="mt-3"
              type="upload"
              src={thumbnail}
              size="responsive"
              onSubmit={e => this.setState({ thumbnail: e })}
            />
            <p className="dsl-b18 bold mt-3">About</p>
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

export default Plus

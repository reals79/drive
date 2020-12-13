import React from 'react'
import PropTypes from 'prop-types'
import { toast } from 'react-toastify'
import { Button, EditDropdown, Icon, Input, Rating, Thumbnail, Upload } from '@components'

class General extends React.Component {
  state = {
    title: this.props.data.name,
    phone: this.props.data.data?.contact?.phone,
    website: this.props.data.data?.website,
    chat: 'Chat with us',
    contact: this.props.data.data?.contact?.email,
    description: this.props.data.data.description,
    uploadTitle1: '',
    uploadFile1: null,
    uploadTitle2: '',
    uploadFile2: null,
    thumbnail1: null,
    thumbnail2: null,
    thumbnail3: null,
    thumbnail4: null,
    thumbnail5: null,
    thumbnail6: null,
  }

  handleDiscard = () => {
    this.props.onCancel()
  }

  handleSave = () => {
    const { data } = this.props
    const {
      title,
      description,
      website,
      phone,
      contact,
      uploadFile1,
      uploadTitle1,
      thumbnail1,
      thumbnail2,
      thumbnail3,
      thumbnail4,
      thumbnail5,
      thumbnail6,
    } = this.state
    const payload = {
      product: {
        id: data.id,
        parent_id: data.parent_id,
        name: title,
        data: { category: null, description, contact: { email: contact, phone }, website },
      },
    }
    if (uploadFile1 && !uploadTitle1) {
      toast.error('Please name your document.', {
        position: toast.POSITION.TOP_RIGHT,
        pauseOnFocusLoss: false,
        hideProgressBar: true,
      })
    } else {
      this.props.onSubmit(
        payload,
        null,
        false,
        uploadFile1,
        uploadTitle1,
        thumbnail1,
        thumbnail2,
        thumbnail3,
        thumbnail4,
        thumbnail5,
        thumbnail6
      )
    }
  }

  render() {
    const { onEdit, isAdmin } = this.props
    const {
      title,
      phone,
      website,
      chat,
      contact,
      description,
      uploadTitle1,
      uploadTitle2,
      thumbnail1,
      thumbnail2,
      thumbnail3,
      thumbnail4,
      thumbnail5,
      thumbnail6,
    } = this.state

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
          <div className="d-flex-1 mr-1">
            <Thumbnail
              type="upload"
              src={thumbnail1}
              size="responsive"
              accept="video/*"
              onDrop={e => this.setState({ thumbnail1: e })}
            />
          </div>
          <div className="d-flex-1 mx-1">
            <Thumbnail
              type="upload"
              src={thumbnail2}
              size="responsive"
              accept="video/*"
              onDrop={e => this.setState({ thumbnail2: e })}
            />
          </div>
          <div className="d-flex d-flex-1 ml-1">
            <div className="d-flex-1 mr-1">
              <Thumbnail
                className="mb-1"
                type="upload"
                src={thumbnail3}
                size="responsive"
                accept="video/*"
                onDrop={e => this.setState({ thumbnail3: e })}
              />
              <Thumbnail
                className="mt-1"
                type="upload"
                src={thumbnail4}
                size="responsive"
                accept="video/*"
                onDrop={e => this.setState({ thumbnail4: e })}
              />
            </div>
            <div className="d-flex-1 ml-1">
              <Thumbnail
                className="mb-1"
                type="upload"
                src={thumbnail5}
                size="responsive"
                accept="video/*"
                onDrop={e => this.setState({ thumbnail5: e })}
              />
              <Thumbnail
                className="mt-1"
                type="upload"
                src={thumbnail6}
                size="responsive"
                accept="video/*"
                onDrop={e => this.setState({ thumbnail6: e })}
              />
            </div>
          </div>
        </div>
        <div className="d-flex">
          <div className="d-flex-1 mt-3">
            <div className="border-bottom mr-4">
              <p className="dsl-b18 bold">Ratings</p>
              <div className="d-flex">
                <Rating score={5} size="medium" />
                <span className="dsl-b20 text-400 ml-2">5.0</span>
              </div>
              <p className="dsl-b18 bold mt-2">90% Recommended</p>
              <p className="dsl-b14 mt-5">2398 Verified Ratings</p>
              <p className="dsl-b14 mt-1">By 980 Verified Dealership</p>
            </div>

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
            <p className="dsl-b18 bold mt-3">About</p>
            <Input
              className="edit-description"
              placeholder="Type here..."
              value={description}
              as="textarea"
              rows={10}
              onChange={e => this.setState({ description: e })}
            />
            <div className="border-top mt-4 pt-4">
              <p className="dsl-b18 bold mt-3">Offers</p>
              <div className="d-flex">
                <div className="border border-5 mr-3 p-3">
                  <Input
                    className="edit-plus-title"
                    placeholder="Type here..."
                    value={uploadTitle1}
                    onChange={e => this.setState({ uploadTitle1: e })}
                  />
                  <Upload
                    className="upload"
                    size={14}
                    icon=""
                    multiple={false}
                    color="#376caf"
                    title="UPLOAD"
                    onRead={e => this.setState({ uploadFile1: e })}
                  />
                  <p className="dsl-d12 text-center">Upload PDF file</p>
                </div>

                {/* <div className="border border-5 ml-3 p-3">
                  <Input
                    className="edit-plus-title"
                    placeholder="Type here..."
                    value={uploadTitle2}
                    onChange={e => this.setState({ uploadTitle2: e })}
                  />
                  <Upload
                    className="upload"
                    size={14}
                    icon=""
                    multiple={false}
                    color="#376caf"
                    title="UPLOAD"
                    onRead={e => this.setState({ uploadFile2: e[0] })}
                  />
                  <p className="dsl-d12 text-center">Upload PDF file</p>
                </div> */}
              </div>
            </div>
            <div className="d-flex border-top mt-3 pt-4">
              <Button className="ml-auto" type="medium" name="DISCARD" onClick={this.handleDiscard} />
              <Button className="ml-3" name="SAVE" onClick={this.handleSave} />
            </div>
          </div>
        </div>
        {isAdmin && <EditDropdown className="edit-all" options={['Edit', 'Reports']} onChange={onEdit} />}
      </div>
    )
  }
}

export default General

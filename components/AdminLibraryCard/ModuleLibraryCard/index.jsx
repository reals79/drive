import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Image, Media } from 'react-bootstrap'
import { Icon } from '@components'
import './ModuleLibraryCard.scss'

class ModuleLibraryCard extends Component {
  constructor(props) {
    super(props)
    this.state = { isOpened: false }
  }

  handleToggle() {
    const { isOpened } = this.state
    this.setState({ isOpened: !isOpened })
  }

  handleClose() {
    this.setState({ isOpened: false })
  }

  render() {
    const { isOpened } = this.state

    return (
      <div className="module-library-card">
        <div className="lib-content border-left-5">
          <Media>
            <Media.Left>
              <Image className="small" src="https://dummyimage.com/300.png/09f/fff" />
            </Media.Left>
            <Media.Body>
              {/* <Media.Heading className="dsl-b14">{props.cardItems.name}</Media.Heading> */}

              <p className="dsl-d12 col-xs-8 px-0">+ title</p>
              <p className="dsl-d12 fr px-0">Assigned:23</p>
              <Media.Heading className="dsl-b14 col-xs-12 px-0 bold">Module Name</Media.Heading>
              <p className="dsl-d14 col-xs-12 px-0 descrip">
                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem
                Ipsum has been the industry's standard dummy text ever since the 1500s, when ...
              </p>
            </Media.Body>
          </Media>
        </div>
        <div className="add mx-0 border-right-5">
          <Icon name="fal fa-plus" size={30} color="#376caf" />
          <span>Edit</span>
        </div>
        <div
          className={`border-5 add ${isOpened ? 'active' : ''}`}
          onClick={() => this.handleToggle()}
        >
          <Icon name="fal fa-plus" size={30} color="#376caf" />
          <span>Add</span>
        </div>
        {isOpened && (
          <div className="add-modal">
            <p className="mb-2">Assign To User</p>
            <p className="mb-2">Add To Courses</p>
            <p className="mb-2">Edit Track</p>
          </div>
        )}
      </div>
    )
  }
}

export default ModuleLibraryCard

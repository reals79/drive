import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Col, Image, Media } from 'react-bootstrap'
import { Icon } from '@components'
import './CourseLibraryCard.scss'

class CourseLibraryCard extends Component {
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
      <div className="course-library-card">
        <div className="lib-content border-left-5">
          {/* <Media.Heading className="dsl-b14">{props.cardItems.name}</Media.Heading> */}
          <Col xs={1} className="px-0 pr-2">
            <Icon size={20} name="fal fa-circle" color="#c3c7cc" />
          </Col>
          <Col xs={2} className="px-0 pr-2">
            <Image className="small w-100" src="https://dummyimage.com/300.png/09f/fff" />
          </Col>
          <Col xs={3} className="px-0 pr-2">
            <p className="dsl-d12 col-xs-12 px-0 mr-2">Courses:12</p>
            <Media.Heading className="dsl-b14 col-xs-5 px-0 bold">Course Name</Media.Heading>
          </Col>
          <Col xs={1} className="px-0 pr-2">
            5 Oct 2915
          </Col>
          <Col xs={1} className="px-0 pr-2">
            Program: Career
          </Col>
          <Col xs={1} className="px-0 pr-2">
            5
          </Col>
          <Col xs={1} className="px-0 pr-2">
            3
          </Col>
          <Col xs={1} className="px-0 pr-2">
            4
          </Col>
          <Col xs={1} className="px-0">
            <div
              className={`border-5 add ${isOpened ? 'active' : ''}`}
              onClick={() => this.handleToggle()}
            >
              <Icon name="fal fa-plus" size={30} color="#376caf" />
            </div>
            {isOpened && (
              <div className="add-modal">
                <p className="mb-2">Assign To User</p>
                <p className="mb-2">Add To Courses</p>
                <p className="mb-2">Edit Track</p>
              </div>
            )}
          </Col>
        </div>
      </div>
    )
  }
}

export default CourseLibraryCard

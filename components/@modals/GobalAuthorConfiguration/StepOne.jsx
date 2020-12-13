import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { clone } from 'ramda'
import { Avatar, Button, Input, Thumbnail } from '@components'

const StepOne = ({ onClose }) => {
  const task = useSelector(state => state.app.modalData.after)
  const [title, setTitle] = useState(task?.name)
  const [description, setDescription] = useState('Description')
  const [videos, setVideos] = useState([
    { id: 1, value: '' },
    { id: 2, value: '' },
    { id: 3, value: '' },
  ])
  const [standards, setStandards] = useState([
    { id: 1, title: 'Why we are', value: '', description: '' },
    { id: 2, title: 'What we teach', value: '', description: '' },
  ])

  const handleInput = index => e => {
    const temp = clone(videos)
    temp[index].value = e
    setVideos(temp)
  }

  const handleStarndardsVal = index => e => {
    const temp = clone(standards)
    temp[index].value = e
    setStandards(temp)
  }

  const handleStarndardsDes = index => e => {
    const temp = clone(standards)
    temp[index].description = e
    setStandards(temp)
  }

  return (
    <>
      <div className="d-flex mb-3">
        <div className="d-flex-2 m-2">
          <span className="dsl-m12">Upload hero image</span>
          <Thumbnail type="upload" size="responsive" />
        </div>
        <div className="d-flex-3 m-2">
          <Input
            className="mb-3"
            title={title}
            placeholder="Type here..."
            direction="vertical"
            value={title}
            onChange={e => setTitle(e)}
          />
          <Input
            className="mb-3"
            title="Description"
            placeholder="Type here..."
            direction="vertical"
            as="textarea"
            rows="5"
            value={description}
            onChange={e => setDescription(e)}
          />
          <span className="dsl-m12 mt-2 mb-3">Name CTA</span>
          <Button name="Buy Now" disabled />
        </div>
      </div>
      <div className="d-flex mb-3">
        <div className="d-flex-1 text-center">
          <p className="dsl-m16">Tracks</p>
          <span className="dsl-m16 bold">{task?.track_count}</span>
        </div>
        <div className="d-flex-1 text-center">
          <p className="dsl-m16">Courses</p>
          <span className="dsl-m16 bold">{task?.course_count}</span>
        </div>
        <div className="d-flex-1 text-center">
          <p className="dsl-m16">Modules</p>
          <span className="dsl-m16 bold">{task?.module_count}</span>
        </div>
        <div className="d-flex-1 text-center">
          <p className="dsl-m16">Certifications</p>
          <span className="dsl-m16 bold">0</span>
        </div>
      </div>
      <div className="d-flex mb-3">
        {videos.map((item, index) => (
          <div className="d-flex-1 m-1" key={`v${index}`}>
            <span className="dsl-m12">Upload video</span>
            <Thumbnail type="upload" accept="video/*" size="responsive" />
            <Input
              className="mt-3"
              title="Title for video"
              placeholder={`Title for video ${item.id} is here`}
              direction="vertical"
              value={item.value}
              onChange={handleInput(index)}
            />
          </div>
        ))}
      </div>
      <div className="d-flex mb-3">
        {standards.map((item, index) => (
          <div className="d-flex-1 m-1" key={`s${index}`}>
            <div className="d-flex mb-3">
              <div className="d-flex-2">
                <Avatar size="regular" />
              </div>
              <div className="d-flex d-flex-5 align-items-center">
                <p className="dsl-m12">{`Change "${item.title}" icon here or keep it standard`}</p>
              </div>
            </div>
            <Input
              className="my-3"
              title={`${item.title} title`}
              placeholder={`${item.title} title here`}
              direction="vertical"
              value={item.value}
              onChange={handleStarndardsVal(index)}
            />
            <Input
              className="mb-3"
              title="Description"
              placeholder="Type here..."
              direction="vertical"
              as="textarea"
              rows="5"
              value={item.description}
              onChange={handleStarndardsDes(index)}
            />
          </div>
        ))}
      </div>
      <div className="text-center mb-3">
        <span className="dsl-m12">Name CTA</span>
        <Button className="ml-auto mr-auto" name="Buy Now" disabled />
      </div>
      <div className="d-flex mb-2">
        <Button className="ml-auto" type="link" name="Cancel" onClick={() => onClose()} />
        <Button className="ml-3" name="Preview" onClick={() => {}} />
      </div>
    </>
  )
}

export default StepOne

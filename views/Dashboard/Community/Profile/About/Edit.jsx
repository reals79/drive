import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col } from 'react-bootstrap'
import { equals, clone } from 'ramda'
import originalMoment from 'moment'
import { extendMoment } from 'moment-range'
import { Avatar, Button, DatePicker, Input, Icon } from '@components'
import CommunityActions from '~/actions/community'
import { convertUrl } from '~/services/util'
import './About.scss'

const moment = extendMoment(originalMoment)

const Edit = ({ user, avatar, cover, onCancel }) => {
  const dispatch = useDispatch()

  const appUser = useSelector(state => state.app.user)
  const [prevUser, setPrevUser] = useState(null)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [infoBio, setInfoBio] = useState('')
  const [jobTitle, setJobTitle] = useState('')
  const [phone, setPhone] = useState('')
  const [office, setOffice] = useState('')
  const [email, setEmail] = useState('')
  const [experience, setExperience] = useState([])
  const [education, setEducation] = useState([])
  const [accolades, setAccolades] = useState([])

  useEffect(() => {
    if (!equals(prevUser, user)) {
      setPrevUser(user)
      setFirstName(user.first_name || '')
      setLastName(user.last_name || '')
      setInfoBio(user.profile?.info_bio || '')
      setEmail(user.profile?.contact_email || '')
      setPhone(user.profile?.contact_phone || '')
      setOffice(user.profile?.office || '')
      setJobTitle(user.profile?.job_title || '')
      setExperience(user.profile?.experience || [])
      setEducation(user.profile?.education || [])
      setAccolades(user.profile?.accolades || [])
    }
  }, [user])

  const handleSave = () => {
    let after = null
    if (appUser.community_user_id === user.id) {
      after = {
        type: 'POSTEDITPROFILE_REQUEST',
        userId: appUser.id,
        payload: {
          user: {
            ...appUser,
            job_title: jobTitle,
            profile: {
              ...appUser.profile,
              avatar,
              job_title: jobTitle,
              first_name: firstName,
              last_name: lastName,
              phone,
            },
          },
        },
      }
    }
    const payload = {
      data: {
        user: {
          ...user,
          avatar,
          cover_url: cover,
          first_name: firstName,
          last_name: lastName,
          profile: {
            ...user.profile,
            info_bio: infoBio,
            job_title: jobTitle,
            contact_phone: phone,
            contact_email: email,
            office,
            experience,
            education,
            accolades,
          },
        },
      },
      after,
      callback: onCancel,
    }
    dispatch(CommunityActions.postcommunityuserRequest(payload))
  }

  const handleAddExperience = () => {
    let newExperience = clone(experience)
    newExperience.push({
      company: '',
      date_span: null,
      description: '',
      position: '',
    })
    setExperience(newExperience)
  }

  const handleAddEducation = () => {
    let newEducation = clone(education)
    newEducation.push({
      degree: '',
      graduation: null,
      school_name: '',
      website: '',
    })
    setEducation(newEducation)
  }

  const handleAddAwards = () => {
    let newAccolades = clone(accolades)
    newAccolades.push({
      company: '',
      date: null,
      description: '',
      title: '',
    })
    setAccolades(newAccolades)
  }

  const handleChangeExperience = (type, index) => e => {
    let newExperience = clone(experience)
    if (type === 'date_span') {
      const dateSpan = `${e.start.format('MMM DD, YYYY')} - ${e.end.format('MMM DD, YYYY')}`
      newExperience[index][type] = dateSpan
    } else {
      newExperience[index][type] = e
    }
    setExperience(newExperience)
  }

  const handleChangeEducation = (type, index) => e => {
    let newEducation = clone(education)
    if (type === 'graduation') {
      const graduation = e.format('MMM DD, YYYY')
      newEducation[index][type] = graduation
    } else {
      newEducation[index][type] = e
    }
    setEducation(newEducation)
  }

  const handleChangeAccolades = (type, index) => e => {
    let newAccolades = clone(accolades)
    if (type === 'date') {
      const date = e.format('MMM DD, YYYY')
      newAccolades[index][type] = date
    } else {
      newAccolades[index][type] = e
    }
    setAccolades(newAccolades)
  }

  return (
    <div className="individual-profile-about">
      <div className="card">
        <p className="dsl-b24 bold">Edit About Information</p>
        <Row className="mx-0">
          <Col xs={12} sm={6} className="pl-0">
            <Input className="mb-3" title="First Name" value={firstName} onChange={e => setFirstName(e)} />
            <Input className="mb-3" title="Last Name" value={lastName} onChange={e => setLastName(e)} />
            <Input
              className="align-items-start mb-3"
              title="About"
              as="textarea"
              rows={5}
              value={infoBio}
              placeholder="Type your bio info..."
              onChange={e => setInfoBio(e)}
            />
            <Input title="Job Title" value={jobTitle} onChange={e => setJobTitle(e)} />
          </Col>
          <Col xs={12} sm={6}>
            <Input className="mb-3" title="Cell" value={phone} placeholder="000 333 4455" onChange={e => setPhone(e)} />
            <Input
              className="mb-3"
              title="Office"
              value={office}
              placeholder="1 323 653 8899"
              onChange={e => setOffice(e)}
            />
            <Input
              className="mb-3"
              title="Email"
              value={email}
              placeholder="email@email.com"
              onChange={e => setEmail(e)}
            />
          </Col>
        </Row>
      </div>
      <div className="card overflow-visible">
        <div className="d-h-start py-3">
          <p className="dsl-b20 bold mr-3 mb-0">Experience</p>
          <Icon name="fas fa-plus-circle" color="white" size={18} />
        </div>
        {experience.map((item, index) => (
          <Row key={`experience-${index}`} className="mx-0">
            <Col xs={1} className="pl-0">
              <Avatar
                url={convertUrl(item.logo, '/images/default_company.svg')}
                type="logo"
                size="small"
                backgroundColor="#fff"
                borderColor="#dee2e6"
                borderWidth={1}
              />
            </Col>
            <Col xs={11} className="px-0">
              <Input
                className="py-2"
                title="Company"
                value={item.company}
                onChange={handleChangeExperience('company', index)}
              />
              <Input
                className="py-2"
                title="Position"
                value={item.position}
                onChange={handleChangeExperience('position', index)}
              />
              <DatePicker
                className="profile-datepicker py-2"
                title="Dates of work"
                value={
                  item.date_span
                    ? moment.range(moment(item.date_span.split('-')[0]), moment(item.date_span.split('-')[1]))
                    : moment.range(moment(), moment())
                }
                calendar="range"
                append="caret"
                format="MMM D, YYYY"
                as="span"
                onSelect={handleChangeExperience('date_span', index)}
              />
              <Input
                className="py-2"
                title="Description"
                value={item.description}
                onChange={handleChangeExperience('description', index)}
              />
            </Col>
          </Row>
        ))}
        <div className="d-h-end py-3">
          <Button type="link" name="+ ADD EXPERIENCE" onClick={handleAddExperience} />
        </div>
      </div>
      <div className="card">
        <div className="d-h-start py-3">
          <p className="dsl-b20 bold mr-3 mb-0">Education</p>
          <Icon name="fas fa-plus-circle" color="white" size={18} />
        </div>
        {education.map((item, index) => (
          <div key={`education-${index}`}>
            <Input
              className="py-2"
              title="University"
              value={item.school_name}
              onChange={handleChangeEducation('school_name', index)}
            />
            <Input
              className="py-2"
              title="Degree"
              value={item.degree}
              onChange={handleChangeEducation('degree', index)}
            />
            <DatePicker
              className="profile-datepicker py-2"
              title="Graduation"
              value={item.graduation ? moment(item.graduation) : moment()}
              calendar="day"
              append="caret"
              format="MMM D, YYYY"
              as="span"
              onSelect={handleChangeEducation('graduation', index)}
            />
            <Input
              className="py-2"
              title="Website"
              value={item.website}
              onChange={handleChangeEducation('website', index)}
            />
          </div>
        ))}
        <div className="d-h-end py-3">
          <Button type="link" name="+ ADD EDUCATION" onClick={handleAddEducation} />
        </div>
      </div>
      <div className="card">
        <div className="d-h-start py-3">
          <p className="dsl-b20 bold mr-3 mb-0">Accolades/Awards</p>
          <Icon name="fas fa-plus-circle" color="white" size={18} />
        </div>
        {accolades.map((item, index) => (
          <div key={`accolades-${index}`}>
            <Input className="py-2" title="Title" value={item.title} onChange={handleChangeAccolades('title', index)} />
            <Input
              className="py-2"
              title="Company/place"
              value={item.company}
              onChange={handleChangeAccolades('company', index)}
            />
            <DatePicker
              className="profile-datepicker py-2"
              title="Date"
              value={item.date ? moment(item.date) : moment()}
              calendar="day"
              append="caret"
              format="MMM D, YYYY"
              as="span"
              onSelect={handleChangeAccolades('date', index)}
            />
            <Input
              className="py-2"
              title="Description"
              value={item.description}
              onChange={handleChangeAccolades('description', index)}
            />
          </div>
        ))}
        <div className="d-h-end py-3">
          <Button type="link" name="+ ADD AWARD" onClick={handleAddAwards} />
        </div>
      </div>
      <div className="d-h-end my-3">
        <Button type="medium" name="DISCARD" className="mr-3" onClick={onCancel} />
        <Button name="SAVE" onClick={handleSave} />
      </div>
    </div>
  )
}

Edit.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number,
  }),
  avatar: PropTypes.string,
  cover: PropTypes.string,
  editable: PropTypes.bool,
  onCancel: PropTypes.func,
}

Edit.defaultProps = {
  user: {
    id: 0,
  },
  editable: false,
  avatar: '',
  cover: '',
  onCancel: () => {},
}

export default Edit

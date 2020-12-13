import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Select from 'react-select'
import moment from 'moment'
import { clone } from 'ramda'
import { Avatar, Button, CheckBox, DatePicker, Dropdown, Icon, Input } from '@components'
import CommunityActions from '~/actions/community'
import VendorActions from '~/actions/vendor'
import './Authentication.scss'

const IAM = [
  { id: 'dealer', value: 'Dealer' },
  { id: 'oem', value: 'OEM' },
  { id: 'allied', value: 'Allied' },
  { id: 'other', value: 'Other' },
]
const ROLE = [
  { id: '1', value: 'Sales Manager' },
  { id: '2', value: 'Senior Consultant' },
]

const Register = ({ data, onChange, onSubmit, onClose }) => {
  const dispatch = useDispatch()

  const companies = useSelector(state => state.vendor.vendorCompanies)
  const user = useSelector(state => state.app.user)

  const [step, setStage] = useState('step1')
  const [agree, setAgree] = useState(false)
  const [experience, setExperience] = useState([{}])
  const [education, setEducation] = useState([{}])
  const [accolades, setAwards] = useState([])
  const [company, setCompany] = useState('')

  const getCompanies = (search = '') => {
    dispatch(VendorActions.getvendorcompaniesRequest({ payload: { search } }))
  }

  const handleRegister = () => {
    if (data.first_name || data.email || data.password || data.repeat_password) null
    if (data.password === data.repeat_password && agree) {
      const payload = {
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        password: data.password,
      }
      onSubmit(payload)
      setStage('step2')
    }
  }
  const handleSaveDetails = () => {
    const communityUser = user?.community_user
    const _experience = experience?.map(item => ({
      company: item?.company,
      date_span: `${moment(item?.date_started).format('MMM DD, YYYY')} - ${moment(item?.date_ended).format(
        'MMM DD, YYYY'
      )}`,
      position: item?.position,
      description: item?.description,
    }))
    const payload = {
      data: {
        user: {
          ...communityUser,
          profile: {
            ...communityUser?.profile,
            career: data.career,
            info_bio: data.info_bio,
            job_title: data.job_title,
            contact_phone: data.contact_phone,
            contact_email: data.email,
            experience: _experience,
            education,
            accolades,
          },
        },
      },
    }
    dispatch(CommunityActions.postcommunityuserRequest(payload))
    onClose()
  }

  const handleAddExperience = () => {
    const _experience = clone(experience)
    _experience.push('')
    setExperience(_experience)
  }

  const handleExperienceChange = (index, type) => e => {
    const _experience = clone(experience)
    _experience[index][type] = e
    setExperience(_experience)
  }

  const handleSearch = e => {
    if (e !== '') getCompanies(e)
  }

  const handleAddEducation = () => {
    const _education = clone(education)
    _education.push('')
    setEducation(_education)
  }
  const handleEducationChange = (index, type) => e => {
    const _education = clone(education)
    _education[index][type] = e
    setEducation(_education)
  }
  const handleAddAwards = () => {
    const _accolades = clone(accolades)
    _accolades.push('')
    setAwards(_accolades)
  }

  const handleAwardsChange = (index, type) => e => {
    const _accolades = clone(accolades)
    _accolades[index][type] = e
    setExperience(_accolades)
  }

  let options = []
  companies?.data?.map(item => {
    const value = item.name
    const label = item.name
    options.push({ value, label, ...item })
  })

  return (
    <div>
      {step === 'step1' && (
        <>
          <div className="d-flex">
            <div className="d-flex-1">
              <Avatar
                url={data.avatar}
                type="logo"
                borderColor="white"
                borderWidth={4}
                upload
                size="regular"
                onDrop={onChange('avatar')}
              />
            </div>

            <div className="d-flex-4 border-bottom pb-4">
              <p className="dsl-b18 bold">About</p>
              <Input
                title="First Name"
                type="text"
                value={data['first_name']}
                placeholder="Type here..."
                onChange={onChange('first_name')}
              />
              <Input
                title="Last Name"
                type="text"
                value={data['last_name']}
                placeholder="Type here..."
                onChange={onChange('last_name')}
              />
              <Input
                title="Email"
                type="text"
                value={data['email']}
                placeholder="Type here..."
                onChange={onChange('email')}
              />
              <Dropdown title="I am a" align="right" width="fit-content" data={IAM} />
              <Dropdown title="Role" align="right" width="fit-content" data={ROLE} />
            </div>
          </div>

          <div className="d-flex mt-4">
            <div className="d-flex-1">
              <Avatar url={company?.avatar} type="logo" borderColor="white" borderWidth={4} size="regular" />
            </div>
            <div className="d-flex-4 border-bottom pb-4">
              <p className="dsl-b18 bold">Company</p>
              <div className="d-flex comapny-select pb-2">
                <span className="dsl-m12 align-self-center comapny-select-title">Company Name</span>
                <Select
                  className="comapny-select-list"
                  isClearable
                  isSearchable
                  options={options}
                  value={company}
                  onChange={e => setCompany(e)}
                  onInputChange={handleSearch}
                />
              </div>
              <Input
                title="Job title"
                type="text"
                value={data['job_title']}
                placeholder="Type here..."
                onChange={onChange('job_title')}
              />
              <Input
                title="Phone"
                type="text"
                value={company?.data?.profile?.primary_phone}
                placeholder="Type here..."
                onChange={onChange('phone')}
              />
            </div>
          </div>

          <div className="d-flex mt-4">
            <div className="d-flex-1"></div>
            <div className="d-flex-4 border-bottom pb-4">
              <p className="dsl-b18 bold">Login</p>
              <Input
                title="Password"
                type="password"
                value={data['password']}
                placeholder="Type here..."
                onChange={onChange('password')}
              />
              <Input
                title="Repeat password"
                type="password"
                value={data['repeat_password']}
                placeholder="Type here..."
                onChange={onChange('repeat_password')}
              />
            </div>
          </div>

          <div className="d-flex mt-4">
            <div className="d-flex-1" />
            <div className="d-flex-4">
              <div className="d-flex align-items-center">
                <CheckBox
                  id="agree"
                  className="mr-3"
                  checked={agree}
                  size="regular"
                  title="I agree to"
                  onChange={() => setAgree(!agree)}
                />
                <span className="dsl-p16">Terms of Service & Privacy</span>
              </div>
              <Button className="ml-auto mt-3" name="REGISTER" onClick={handleRegister} />
            </div>
          </div>
        </>
      )}
      {step === 'step2' && (
        <>
          <div className="d-flex">
            <div className="d-flex-1">
              <Avatar
                url={data.avatar}
                type="logo"
                borderColor="white"
                borderWidth={4}
                upload
                size="regular"
                onDrop={onChange('avatar')}
              />
            </div>

            <div className="d-flex-4 border-bottom pb-4">
              <p className="dsl-b18 bold">About</p>
              <Input
                title="Cell phone"
                type="text"
                value={data['contact_phone']}
                placeholder="Type here..."
                onChange={onChange('contact_phone')}
              />
              <Input
                className="task-text"
                title="About me"
                type="textarea"
                value={data['info_bio']}
                placeholder="Type here..."
                onChange={onChange('info_bio')}
              />
              <Input
                title="3/y career goal"
                type="text"
                value={data['career']}
                placeholder="Type here..."
                onChange={onChange('career')}
              />
            </div>
          </div>
          <div className="d-flex mt-4">
            <div className="d-flex-1"></div>
            <div className="d-flex-4 border-bottom pb-4">
              <p className="dsl-b18 bold">Experience</p>
              {experience?.map((item, index) => (
                <div className="border-bottom py-2" key={`ob${index}`}>
                  <Input
                    title="Company"
                    type="text"
                    value={item.company}
                    placeholder="Type here..."
                    onChange={handleExperienceChange(index, 'company')}
                  />
                  <Input
                    title="Position"
                    type="text"
                    placeholder="Started"
                    value={item.position}
                    placeholder="Type here..."
                    onChange={handleExperienceChange(index, 'position')}
                  />
                  <div className="d-flex">
                    <DatePicker
                      title="Dates"
                      value={item?.date_started}
                      placeholder="Started"
                      calendar="day"
                      append="caret"
                      format="MMM D, YYYY"
                      as="input"
                      onSelect={handleExperienceChange(index, 'date_started')}
                    />
                    <DatePicker
                      className="register-date-end"
                      value={item?.date_ended}
                      placeholder="Ended"
                      calendar="day"
                      append="caret"
                      format="MMM D, YYYY"
                      as="input"
                      onSelect={handleExperienceChange(index, 'date_ended')}
                    />
                  </div>
                  <Input
                    className="task-text"
                    title="Summary"
                    type="text"
                    value={item.description}
                    placeholder="Type here..."
                    onChange={handleExperienceChange(index, 'description')}
                  />
                </div>
              ))}
              <Button className="ml-auto" type="link" onClick={handleAddExperience}>
                <Icon name="far fa-plus" size={14} color="#376caf" />
                <span className="dsl-p14 text-400 ml-1">ADD EXPERIENCE</span>
              </Button>
            </div>
          </div>
          <div className="d-flex mt-4">
            <div className="d-flex-1"></div>
            <div className="d-flex-4 border-bottom pb-4">
              <p className="dsl-b18 bold">Education</p>
              {education?.map((item, index) => (
                <div className="border-bottom py-2" key={`ob${index}`}>
                  <Input
                    title="Title"
                    type="text"
                    value={item.school_name}
                    placeholder="Type here..."
                    onChange={handleEducationChange(index, 'school_name')}
                  />
                  <div className="d-flex">
                    <DatePicker
                      title="Dates"
                      value={item?.date_started}
                      placeholder="Started"
                      calendar="day"
                      append="caret"
                      format="MMM D, YYYY"
                      as="input"
                      onSelect={handleEducationChange(index, 'date_started')}
                    />
                    <DatePicker
                      className="register-date-end"
                      value={item?.graduation}
                      placeholder="Ended"
                      calendar="day"
                      append="caret"
                      format="MMM D, YYYY"
                      as="input"
                      onSelect={handleEducationChange(index, 'graduation')}
                    />
                  </div>
                  <Input
                    className="task-text"
                    title="Summary"
                    type="text"
                    value={item.degree}
                    placeholder="Type here..."
                    onChange={handleEducationChange(index, 'degree')}
                  />
                </div>
              ))}
              <Button className="ml-auto" type="link" onClick={handleAddEducation}>
                <Icon name="far fa-plus" size={14} color="#376caf" />
                <span className="dsl-p14 text-400 ml-1">ADD EDUCATION</span>
              </Button>
            </div>
          </div>
          <div className="d-flex mt-4">
            <div className="d-flex-1"></div>
            <div className="d-flex-4 border-bottom pb-4">
              <p className="dsl-b18 bold">Awards</p>
              {accolades?.map((item, index) => (
                <div className="border-bottom py-2" key={`ob${index}`}>
                  <Input
                    title="Title"
                    type="text"
                    value={item.title}
                    placeholder="Type here..."
                    onChange={handleAwardsChange(index, 'title')}
                  />
                  <Input
                    title="Company"
                    type="text"
                    value={item.company}
                    placeholder="Type here..."
                    onChange={handleAwardsChange(index, 'title')}
                  />
                  <DatePicker
                    title="Date"
                    value={item?.date}
                    placeholder="Date"
                    calendar="day"
                    append="caret"
                    format="MMM D, YYYY"
                    as="input"
                    onSelect={handleAwardsChange(index, 'date')}
                  />
                  <Input
                    className="task-text"
                    title="Summary"
                    type="text"
                    value={item.description}
                    placeholder="Type here..."
                    onChange={handleAwardsChange(index, 'degree')}
                  />
                </div>
              ))}
              <Button className="ml-auto" type="link" onClick={handleAddAwards}>
                <Icon name="far fa-plus" size={14} color="#376caf" />
                <span className="dsl-p14 text-400 ml-1">ADD AWARDS</span>
              </Button>
            </div>
          </div>
          <div className="d-flex mt-4">
            <div className="d-flex-1" />
            <div className="d-flex">
              <Button className="ml-auto mt-3" name="SKIP" type="link" onClick={() => onClose()} />
              <Button className="ml-auto mt-3" name="REGISTER" onClick={handleSaveDetails} />
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default Register

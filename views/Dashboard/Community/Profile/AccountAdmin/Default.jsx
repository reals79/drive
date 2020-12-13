import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import moment from 'moment'
import classNames from 'classnames'
import { clone, find, findIndex } from 'ramda'
import { Avatar, Button, CheckBox, Dropdown, Input } from '@components'
import AppActions from '~/actions/app'
import { USA_TIMEZONES } from '~/services/constants'
import './AccountAdmin.scss'

const Default = props => {
  const dispatch = useDispatch()

  const user = useSelector(state => state.app.user)
  const companies = useSelector(state => state.app.companies)

  const [company, setComapny] = useState(Number(user?.profile?.default_company_id))
  const [email, setEmail1] = useState(user.email)
  const [email2, setEmail2] = useState(user.email2)
  const [emails, setEmail] = useState([
    { email: user.email, type: 'email' },
    { email: user.email2, type: 'email2' },
  ])
  const [emailPreference, setEmailPreference] = useState(user?.profile?.email_preference)
  const [timezone, setTimezone] = useState(user?.profile?.timezone)

  const handleChecked = id => {
    if (props.editable) setComapny(id)
  }

  const handleEmail = (index, preference) => e => {
    const _email = clone(emails)
    _email[index]['email'] = e
    setEmail(_email)
    if (preference === 'email') {
      setEmail1(e)
    } else setEmail2(e)
  }

  const handleEmailPreference = preference => {
    setEmailPreference(preference)
  }

  const handleTimezone = e => {
    const _timezone = e[0].value
    setTimezone(_timezone)
  }

  const handleSave = () => {
    const payload = {
      user: {
        id: user.id,
        default_company_id: company,
        email,
        email2,
        timezone,
        email_preference: emailPreference,
      },
    }
    dispatch(AppActions.posteditprofileRequest(user.id, payload))
    props.onCancel()
  }

  return (
    <>
      <div className="card-bottom">
        <p className="dsl-b18 bold">Default Company</p>
        <p className="dsl-d12">
          The companies your profile is connected to are listed below. You can select a a default to decide which
          company will load at login.
        </p>
        <div className="default border-bottom">
          <div className="default-header">
            <span className="dsl-m12">Default</span>
          </div>
          <div className="default-content">
            <span className="dsl-m12">Company</span>
            <span className="dsl-m12">Date</span>
          </div>
        </div>
        {companies.map((item, index) => {
          const users = item?.users ? find(item => item.id === user.id, item?.users) : null
          return (
            users && (
              <div className={classNames('default py-3', index !== 3 && 'border-bottom')} key={index}>
                <div className="default-header">
                  <CheckBox
                    className="ml-2"
                    size="tiny"
                    id={`c${index}`}
                    checked={company === item.id}
                    onChange={() => handleChecked(item.id)}
                  />
                </div>
                <div className="default-content">
                  <div className="d-flex align-items-center">
                    <Avatar
                      url={item.data.profile?.avatar}
                      type="logo"
                      backgroundColor="white"
                      borderColor="white"
                      size="tiny"
                    />
                    <span className="dsl-m12 ml-3">{item.name}</span>
                  </div>
                  <span className="dsl-m12">{moment(item.created_at).format('MMM DD, YY')}</span>
                </div>
              </div>
            )
          )
        })}
      </div>
      <div className="card mt-3 py-4">
        <p className="dsl-b18 bold">Default Email</p>
        <p className="dsl-d12 default-email">
          We suggest a backup email to access your account in the event you leave your company, you can still access
          your profile and all the free features that come with it.
        </p>
        {props.editable ? (
          <>
            <div className="default">
              <div className="default-header">
                <span className="dsl-m12">Default</span>
              </div>
              <div className="default-content">
                <span className="dsl-m12">Email</span>
              </div>
            </div>
            {emails.map((item, index) => (
              <div className="default">
                <div className="default-header">
                  <CheckBox
                    className="ml-2"
                    size="tiny"
                    id={`c${item.type}`}
                    checked={emailPreference === item.type}
                    onChange={() => handleEmailPreference(item.type)}
                  />
                </div>
                <div className="default-content">
                  <Input className="email" value={item.email} onChange={handleEmail(index, item.type)} />
                </div>
              </div>
            ))}
          </>
        ) : (
          <div className="d-flex align-items-center">
            <span className="dsl-m12 fixed-label">Email</span>
            <span className="dsl-b16">{user?.profile?.email_preference === 'email' ? user?.email : user?.email2}</span>
          </div>
        )}
      </div>
      <div className="card mt-3 py-4">
        <p className="dsl-b18 bold">Time Zone</p>
        {props.editable ? (
          <>
            <Dropdown
              title="Default time zone"
              align="right"
              width="fit-content"
              defaultIds={[findIndex(item => item.value === timezone, USA_TIMEZONES)]}
              returnBy="data"
              getValue={e => e.value}
              data={USA_TIMEZONES}
              onChange={handleTimezone}
            />
            <div className="d-flex justify-content-end mt-4">
              <Button name="SAVE" onClick={handleSave} />
            </div>
          </>
        ) : (
          <div className="d-flex align-items-center">
            <span className="dsl-m12 fixed-label">Default time zone</span>
            <span className="dsl-b16">{user?.profile?.timezone}</span>
          </div>
        )}
      </div>
    </>
  )
}

export default Default

import React from 'react'
import { useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import { Row, Col } from 'react-bootstrap'
import { findIndex } from 'ramda'
import { Avatar, Button } from '@components'
import { convertUrl } from '~/services/util'
import './About.scss'

const Detail = ({ user, authenticated, onLogin }) => {
  const loginUser = useSelector(state => state.app.user?.community_user)
  const activeConnections = loginUser?.connections?.active_user_connections || []
  const connected =
    findIndex(x => x.connector?.user_id === user?.id, activeConnections) > -1 || loginUser?.id === user?.id

  const handleConnect = () => {}

  return (
    <div className="individual-profile-about">
      <div className="d-flex">
        <div className="d-flex-3 card mr-2">
          <p className="dsl-b24 bold">About</p>
          <p className="dsl-b14 mb-0 profile-about">{user.profile?.info_bio}</p>
        </div>
        <div className="d-flex-2 card">
          <p className="dsl-b24 bold">Contact</p>
          <div className="d-h-start py-3">
            <p className="contact-label dsl-m12 mb-0">Cell</p>
            {authenticated ? (
              <>
                {connected ? (
                  <p className="dsl-b14 mb-0">{user.profile?.contact_phone}</p>
                ) : (
                  <Button name="Connect to view" type="link" onClick={handleConnect} />
                )}
              </>
            ) : (
              <p className="dsl-b14 mb-0">Private</p>
            )}
          </div>
          <div className="d-h-start py-3">
            <p className="contact-label dsl-m12 mb-0">Office</p>
            {authenticated ? (
              <>
                {connected ? (
                  <p className="dsl-b14 mb-0">{user.profile?.office}</p>
                ) : (
                  <Button name="Connect to view" type="link" onClick={handleConnect} />
                )}
              </>
            ) : (
              <p className="dsl-b14 mb-0">Private</p>
            )}
          </div>
          <div className="d-h-start py-3">
            <p className="contact-label dsl-m12 mb-0">Email</p>
            {authenticated ? (
              <>
                {connected ? (
                  <p className="dsl-b14 mb-0">{user.profile?.contact_email}</p>
                ) : (
                  <Button name="Connect to view" type="link" onClick={handleConnect} />
                )}
              </>
            ) : (
              <p className="dsl-b14 mb-0">Private</p>
            )}
          </div>
        </div>
      </div>
      {!authenticated && (
        <div className="card">
          <p className="dsl-b22 bold">Experience</p>
          <div className="d-flex profile-login text-center">
            <p className="dsl-b14 mb-0">
              {`By logging in you will be able to view ${user?.first_name}'s Job experience and Education, Blog posts and gain the ability to connect and get in touch with them`}
            </p>
            <Button name="Login" className="mt-2" type="medium" onClick={() => onLogin()} />
          </div>
        </div>
      )}
      {user.profile?.experience && authenticated && (
        <div className="card">
          <p className="dsl-b22 bold">Experience</p>
          {user.profile?.experience.map((item, index) => (
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
                <div className="d-h-start py-3">
                  <p className="dsl-m12 mb-0 about-label">Company</p>
                  <p className="dsl-b14 mb-0">{item.company}</p>
                </div>
                <div className="d-h-start py-3">
                  <p className="dsl-m12 mb-0 about-label">Position</p>
                  <p className="dsl-b14 mb-0">{item.position}</p>
                </div>
                <div className="d-h-start py-3">
                  <p className="dsl-m12 mb-0 about-label">Dates of work</p>
                  <p className="dsl-b14 mb-0">{item.date_span}</p>
                </div>
                <div className="d-h-start py-3">
                  <p className="dsl-m12 mb-0 about-label">Description</p>
                  <p className="dsl-b14 mb-0">{item.description}</p>
                </div>
              </Col>
            </Row>
          ))}
        </div>
      )}
      {user.profile?.education && authenticated && (
        <div className="card">
          <p className="dsl-b22 bold">Education</p>
          {user.profile?.education.map((item, index) => (
            <div key={`education-${index}`}>
              <div className="d-h-start py-3">
                <p className="dsl-m12 mb-0 about-label">University</p>
                <p className="dsl-b14 mb-0">{item.school_name}</p>
              </div>
              <div className="d-h-start py-3">
                <p className="dsl-m12 mb-0 about-label">Degree</p>
                <p className="dsl-b14 mb-0">{item.degree}</p>
              </div>
              <div className="d-h-start py-3">
                <p className="dsl-m12 mb-0 about-label">Graduation</p>
                <p className="dsl-b14 mb-0">{item.graduation}</p>
              </div>
              <div className="d-h-start py-3">
                <p className="dsl-m12 mb-0 about-label">Website</p>
                <p className="dsl-b14 mb-0">{item.website}</p>
              </div>
            </div>
          ))}
        </div>
      )}
      {user.profile?.accolades && authenticated && (
        <div className="card">
          <p className="dsl-b22 bold">Accolades/Awards</p>
          {user.profile?.accolades.map((item, index) => (
            <div key={`accolades-${index}`}>
              <div className="d-h-start py-3">
                <p className="dsl-m12 mb-0 about-label">Title</p>
                <p className="dsl-b14 mb-0">{item.title}</p>
              </div>
              <div className="d-h-start py-3">
                <p className="dsl-m12 mb-0 about-label">Company/place</p>
                <p className="dsl-b14 mb-0">{item.company}</p>
              </div>
              <div className="d-h-start py-3">
                <p className="dsl-m12 mb-0 about-label">Date</p>
                <p className="dsl-b14 mb-0">{item.date}</p>
              </div>
              <div className="d-h-start py-3">
                <p className="dsl-m12 mb-0 about-label">Description</p>
                <p className="dsl-b14 mb-0">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

Detail.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number,
  }),
}

Detail.defaultProps = {
  user: {
    id: 0,
  },
}

export default Detail

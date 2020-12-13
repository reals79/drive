import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Row, Col } from 'react-bootstrap'
import { useDispatch } from 'react-redux'
import { clone, findIndex, propEq } from 'ramda'
import { Button, Dropdown, Input } from '@components'
import VendorActions from '~/actions/vendor'
import { USA_TIMEZONES } from '~/services/constants'
import './About.scss'

const Edit = ({ business, avatar, cover, onCancel }) => {
  const profile = { ...business?.data?.profile, ...business?.hcms?.data?.profile }
  const [name, setName] = useState(business?.name)
  const [description, setDescription] = useState(profile?.about)
  const [phone, setPhone] = useState(profile?.primary_phone || business?.cell_phone)
  const [website, setWebsite] = useState(profile?.url)
  const [city, setCity] = useState(profile?.address?.city)
  const [state, setState] = useState(profile?.address?.state)
  const [street, setStreet] = useState(profile?.address?.street)
  const [zip, setZip] = useState(profile?.address?.zip)
  const [timezone, setTimezone] = useState(business?.data?.timezone)
  const timeIdx = timezone ? findIndex(propEq('value', timezone), USA_TIMEZONES) : 0

  const dispatch = useDispatch()
  const handleSave = () => {
    let compInfo = clone(business)
    delete compInfo.admins
    delete compInfo.blogs
    delete compInfo.business
    const payload = {
      data: {
        company: {
          id: compInfo.id,
          name,
          data: {
            ...compInfo.data,
            profile: {
              ...compInfo.data?.profile,
              address: {
                city,
                state,
                street,
                zip,
              },
              about: description,
              avatar,
              cover,
              url: website,
              primary_phone: phone,
            },
            timezone,
          },
        },
      },
      type: compInfo.slug ? 'vr' : 'hcm',
    }
    dispatch(VendorActions.savevrcompanyRequest(payload, onCancel))
  }

  return (
    <div className="company-profile-about">
      <div className="card pb-5">
        <p className="dsl-b24 bold">Edit Company Information</p>
        <Row className="mx-0">
          <Col xs={12} sm={6} className="pl-0">
            <Input className="mb-3" title="Name" value={name} onChange={e => setName(e)} />
            <Input
              className="align-items-start"
              title="Info"
              as="textarea"
              rows={7}
              value={description}
              onChange={e => setDescription(e)}
            />
          </Col>
          <Col xs={12} sm={6} className="pl-0">
            <Input className="mb-3" title="Cell" value={phone} onChange={e => setPhone(e)} />
            <Input className="mb-3" title="Web" value={website} onChange={e => setWebsite(e)} />
            <Input className="align-items-start mb-2" title="Street" value={street} onChange={e => setStreet(e)} />
            <Input className="align-items-start mb-2" title="City" value={city} onChange={e => setCity(e)} />
            <Input className="align-items-start mb-2" title="State" value={state} onChange={e => setState(e)} />
            <Input className="align-items-start mb-3" title="Zip code" value={zip} onChange={e => setZip(e)} />
            <Dropdown
              className="mb-5"
              title="TimeZone"
              width="fit-content"
              data={USA_TIMEZONES}
              getValue={e => e.label}
              returnBy="data"
              defaultIndexes={[timeIdx]}
              onChange={e => setTimezone(e[0].value)}
            />
          </Col>
        </Row>
      </div>
      <div className="d-h-end my-3">
        <Button type="medium" name="DISCARD" className="mr-3" onClick={onCancel} />
        <Button name="SAVE" onClick={handleSave} />
      </div>
    </div>
  )
}

Edit.propTypes = {
  company: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    admins: PropTypes.array,
    business: PropTypes.shape({
      data: PropTypes.array,
    }),
    data: PropTypes.shape({
      contact: PropTypes.shape({
        email: PropTypes.string,
        phone: PropTypes.string,
      }),
      description: PropTypes.string,
    }),
    entity: PropTypes.shape({
      id: PropTypes.number,
      content_id: PropTypes.number,
      group_id: PropTypes.number,
    }),
    products: PropTypes.array,
    stats: PropTypes.shape({
      comments: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      dislikes: PropTypes.number,
      like_avg: PropTypes.string,
      likes: PropTypes.string,
      rating_avg: PropTypes.number,
      rating_count: PropTypes.number,
      rating_score: PropTypes.string,
      views: PropTypes.number,
    }),
    university: PropTypes.array,
  }),
  avatar: PropTypes.string,
  cover: PropTypes.string,
  onCancel: PropTypes.func,
}

Edit.defaultProps = {
  company: {
    id: 0,
    name: '',
    admins: [],
    business: {
      data: [],
    },
    data: {
      contact: {
        email: '',
        phone: '',
      },
      description: '',
    },
    entity: {
      id: 0,
      content_id: 0,
      group_id: 0,
    },
    products: [],
    stats: {
      comments: '',
      dislikes: 0,
      like_avg: '',
      likes: '',
      rating_avg: 0,
      rating_count: 0,
      rating_score: '',
      views: 0,
    },
    university: [],
  },
  avatar: '',
  cover: '',
  onCancel: () => {},
}

export default Edit

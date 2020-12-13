import React from 'react'
import PropTypes from 'prop-types'
import { Row, Col } from 'react-bootstrap'
import { is } from 'ramda'
import moment from 'moment'
import { Avatar, Button, Rating, Thumbnail } from '@components'
import { convertUrl } from '~/services/util'
import './About.scss'

const Detail = ({ business }) => {
  const profile = { ...business?.data?.profile, ...business?.hcms?.data?.profile }

  return (
    <div className="company-profile-about">
      <div className="d-flex company-about">
        <div className="d-flex-3 mr-2 card">
          <p className="dsl-b24 bold">About {business?.name}</p>
          <p className="dsl-b14 mb-0">{profile?.about || 'Not Provided'}</p>
        </div>
        <div className="d-flex-2 card">
          <p className="dsl-b24 bold">Contact</p>
          <div className="d-h-start py-3">
            <p className="contact-label dsl-m12 mb-0">Cell</p>
            <p className="dsl-b14 mb-0">{profile?.primary_phone || profile?.cell_phone || 'Not Provided'}</p>
          </div>
          <div className="d-h-start py-3">
            <p className="contact-label dsl-m12 mb-0">Office</p>
            <p className="dsl-b14 mb-0">{profile?.url || 'Not Provided'}</p>
          </div>
          <div className="d-h-start py-3">
            <p className="contact-label dsl-m12 mb-0">Address</p>
            <p className="dsl-b14 mb-0">
              {is(Object, profile.address)
                ? `${profile?.address?.street}, ${profile?.address?.city}, ${profile?.address?.state}, ${profile?.address?.zip}`
                : profile.address}
            </p>
          </div>
        </div>
      </div>
      {business?.vrs?.products && (
        <div className="card mt-2">
          <p className="dsl-b22 bold">{`${business?.name} Products`}</p>
          <Row className="mx-0">
            {business?.vrs?.products?.map((item, index) => {
              if (index > 3) return null
              const { id, name, thumbnail, stats } = item
              return (
                <Col key={`products-${id}`} xs={3} className="d-h-start flex-column">
                  <p className="dsl-b14 bold">{name}</p>
                  <Avatar
                    className="mb-4"
                    url={convertUrl(thumbnail, '/images/default_company.svg')}
                    type="logo"
                    size="medium"
                    backgroundColor="#f6f7f8"
                    borderColor="#f6f7f8"
                    borderWidth={1}
                  />
                  <Rating score={Math.round(Number(stats?.rating_avg) * 100) / 100 || 0} />
                  <p className="dsl-b13">{Math.round(stats?.rating_recommended_avg * 100) / 100}% Recommended</p>
                </Col>
              )
            })}
          </Row>
          <div className="d-h-end">
            <Button type="medium" name="SEE MORE" className="my-3" />
          </div>
        </div>
      )}
      {business?.vrs?.university && (
        <div className="card mt-2">
          <p className="dsl-b22 bold">{business?.name} University</p>
          <Row>
            {business?.vrs?.university?.map((item, index) => {
              if (index > 3) return null
              return (
                <Col key={`university-${index}`} xs={3}>
                  <video className="video-container video-container-overlay">
                    <source type="video/mp4" src={item.vidoe} />
                  </video>
                  <p className="dsl-b12">{item.title}</p>
                </Col>
              )
            })}
          </Row>
          <div className="d-h-end">
            <Button type="medium" name="SEE MORE" className="my-3" />
          </div>
        </div>
      )}
      {business?.vrs?.blogs && (
        <div className="card mt-2">
          <p className="dsl-b22 bold">{`${business?.name} Blog`}</p>
          {business?.vrs?.blogs?.map((item, index) => {
            if (index > 2) return null
            return (
              <Row key={`blog-${index}`} className="mx-0 py-3">
                <Col className="px-0" xs={3}>
                  <Thumbnail src={item.logo} size="responsive" />
                </Col>
                <Col xs={9} className="pl-2">
                  <p className="dsl-b16 bold mb-2">{item.name}</p>
                  <p className="dsl-b14 mb-1 truncate-two">{item.data?.body}</p>
                  <div className="d-h-between">
                    <div className="d-h-start">
                      <Avatar
                        className="mr-2"
                        url={item.author_avatar}
                        type="logo"
                        size="extraTiny"
                        backgroundColor="#f6f7f8"
                        borderColor="#f6f7f8"
                        borderWidth={1}
                      />
                      <div>
                        <p className="dsl-m12 mb-0">{`${item.author?.first_name} ${item.author?.last_name}`}</p>
                        <p className="dsl-m12 mb-0">{item.author?.profile?.company}</p>
                      </div>
                    </div>
                    <p className="dsl-b13">{moment(item.created_at).format('MMM DD, YY')}</p>
                  </div>
                </Col>
              </Row>
            )
          })}
          <div className="d-h-end">
            <Button type="medium" name="SEE MORE" className="my-3" />
          </div>
        </div>
      )}
    </div>
  )
}

Detail.propTypes = {
  company: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    admins: PropTypes.array,
    business: PropTypes.shape({
      data: PropTypes.array,
    }),
    data: PropTypes.shape({
      profile: PropTypes.shape({
        about: PropTypes.string,
        avatar: PropTypes.string,
        cover: PropTypes.string,
        primary_phone: PropTypes.string,
        url: PropTypes.string,
      }),
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
}

Detail.defaultProps = {
  company: {
    id: 0,
    name: '',
    admins: [],
    business: {
      data: [],
    },
    data: {
      profile: {
        about: '',
        avatar: '',
        cover: '',
        primary_phone: '',
        url: '',
      },
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
}

export default Detail

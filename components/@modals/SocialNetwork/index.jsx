import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import PropTypes from 'prop-types'
import { clone } from 'ramda'
import { Button, Icon, Input } from '@components'
import CommunityActions from '~/actions/community'
import VendorActions from '~/actions/vendor'
import './SocialNetwork.scss'

const SocialNetwork = ({ company, user, callback, onClose }) => {
  const dispatch = useDispatch()

  const [facebook, setFacebook] = useState(company?.data?.profile?.facebook || user?.profile?.facebook || '')
  const [twitter, setTwitter] = useState(company?.data?.profile?.twitter || user?.profile?.twitter || '')
  const [linkedin, setLinkedin] = useState(company?.data?.profile?.linked_in || user?.profile?.linked_in || '')
  const [youtube, setYoutube] = useState(company?.data?.profile?.youtube || user?.profile?.youtube || '')

  const handleSaveSocialLinks = () => {
    if (company?.id) {
      let compInfo = clone(company)
      delete compInfo.admins
      delete compInfo.blogs
      delete compInfo.business

      const payload = {
        data: {
          company: {
            ...compInfo,
            data: {
              ...compInfo.data,
              profile: {
                ...compInfo.data?.profile,
                facebook: facebook !== '' ? facebook : null,
                twitter: twitter !== '' ? twitter : null,
                linked_in: linkedin !== '' ? linkedin : null,
                youtube: youtube !== '' ? youtube : null,
              },
            },
          },
        },
        type: compInfo.slug ? 'vr' : 'hcm',
      }
      dispatch(VendorActions.savevrcompanyRequest(payload, callback))
    }
    if (user?.id) {
      const payload = {
        data: {
          user: {
            ...user,
            profile: {
              ...user.profile,
              facebook: facebook !== '' ? facebook : null,
              twitter: twitter !== '' ? twitter : null,
              linked_in: linkedin !== '' ? linkedin : null,
              youtube: youtube !== '' ? youtube : null,
            },
          },
        },
        callback,
      }
      dispatch(CommunityActions.postcommunityuserRequest(payload))
    }
    onClose()
  }

  return (
    <div className="social-network-modal">
      <div className="modal-header">
        <p className="dsl-w14 m-0">Link Social Networks</p>
      </div>
      <div className="modal-body p-4">
        <p className="dsl-m12">Please insert links to your social network profiles here.</p>
        <div className="d-h-start mb-3">
          <Icon name="fab fa-facebook-f" size={14} color="#343f4b" />
          <Input title="Facebook" placeholder="Type here..." value={facebook} onChange={e => setFacebook(e)} />
        </div>
        <div className="d-h-start mb-3">
          <Icon name="fab fa-twitter" size={14} color="#343f4b" />
          <Input title="Twitter" placeholder="Type here..." value={twitter} onChange={e => setTwitter(e)} />
        </div>
        <div className="d-h-start mb-3">
          <Icon name="fab fa-linkedin-in" size={14} color="#343f4b" />
          <Input title="Linkedin" placeholder="Type here..." value={linkedin} onChange={e => setLinkedin(e)} />
        </div>
        <div className="d-h-start mb-3">
          <Icon name="fab fa-youtube" size={14} color="#343f4b" />
          <Input title="Youtube" placeholder="Type here..." value={youtube} onChange={e => setYoutube(e)} />
        </div>
        <div className="d-h-end pt-4">
          <Button type="link" className="ml-2" name="DISCARD" onClick={onClose} />
          <Button name="SAVE" onClick={handleSaveSocialLinks} />
        </div>
      </div>
    </div>
  )
}

SocialNetwork.propTypes = {
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
  user: PropTypes.shape({
    id: PropTypes.number,
  }),
  callback: PropTypes.func,
  onClose: PropTypes.func,
}

SocialNetwork.defaultProps = {
  company: null,
  user: null,
  callback: () => {},
  onClose: () => {},
}

export default SocialNetwork

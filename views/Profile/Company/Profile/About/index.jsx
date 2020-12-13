import React from 'react'
import PropTypes from 'prop-types'
import Detail from './Detail'
import Edit from './Edit'

const About = ({ business, editable, avatar, cover, onCancel }) => {
  return editable ? (
    <Edit business={business} avatar={avatar} cover={cover} onCancel={onCancel} />
  ) : (
    <Detail business={business} />
  )
}

About.propTypes = {
  business: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    data: PropTypes.shape({
      franchises: PropTypes.array,
      licences: PropTypes.shape({
        blog: PropTypes.string,
        community: PropTypes.string,
        global_author: PropTypes.string,
        hcm: PropTypes.string,
        products: PropTypes.string,
      }),
      profile: PropTypes.shape({
        address: PropTypes.string,
        avatar: PropTypes.string,
        cell_phone: PropTypes.string,
        cover: PropTypes.string,
        url: PropTypes.string,
      }),
      vendors: PropTypes.array,
    }),
    status: PropTypes.number,
    users: PropTypes.array,
    hcms: PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
    }),
    vrs: PropTypes.shape({
      id: PropTypes.number,
    }),
  }),
  avatar: PropTypes.string,
  cover: PropTypes.string,
  editable: PropTypes.bool,
  onCancel: PropTypes.func,
}

About.defaultProps = {
  company: {
    id: 0,
    name: '',
    data: {
      franchises: [],
      licences: {
        blog: '',
        community: '',
        global_author: '',
        hcm: '',
        products: '',
      },
      profile: {
        address: '',
        avatar: '',
        cell_phone: '',
        cover: '',
        url: '',
      },
      vendors: [],
    },
    status: 0,
    users: [],
    hcms: {
      id: 0,
      name: '',
    },
    vrs: null,
  },
  editable: false,
  avatar: '',
  cover: '',
  onCancel: () => {},
}

export default About

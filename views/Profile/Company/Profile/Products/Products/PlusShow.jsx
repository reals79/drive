import React from 'react'
import PropTypes from 'prop-types'
import { Image } from 'react-bootstrap'
import { Icon, Rating } from '@components'

const PlusShow = ({ data }) => (
  <>
    <div className="d-flex align-items-end">
      <span className="dsl-b24 bold">{data.name}</span>
      <div className="d-flex mb-1">
        <Icon name="fa fa-check-circle ml-2" color="green" size={14} />
        <span className="dsl-m12 ml-1">Claimed</span>
      </div>
    </div>
    <div className="d-flex">
      <div className="d-flex-1 mt-3">
        <p className="dsl-b18 bold">Ratings</p>
        <div className="d-flex">
          <Rating score={Math.round(Number(data?.stats?.rating_avg) * 100) / 100 || 0} size="medium" />
        </div>
        <p className="dsl-b18 bold mt-2">
          {Math.round(data.stats?.rating_recommended_avg * 100) / 100 || 0}% Recommended
        </p>
        <p className="dsl-b14 mt-5">{data.stats?.rating_count} Verified Ratings</p>
        <p className="dsl-b14 mt-1">By {data.stats?.rating_dealership_count} Verified Dealership</p>

        <p className="dsl-b20 bold mt-5">Contact</p>
        <div className="contact mt-4">
          <Icon name="fal fa-phone-alt head" color="dark" size={14} />
          <span className="dsl-b16">{data.data?.contact?.phone || 'Not provided'}</span>
        </div>
        <div className="contact mt-4">
          <Icon name="fal fa-window-maximize head" color="dark" size={14} />
          <span className="dsl-b16">{data.data?.website || 'Not provided'}</span>
        </div>
        <div className="contact mt-4">
          <Icon name="fal fa-comment head" color="dark" size={14} />
          <span className="dsl-b16">Chat with us</span>
        </div>
        <div className="contact mt-4">
          <Icon name="fal fa-envelope head" color="dark" size={14} />
          <span className="dsl-b16">{data.data?.contact?.email || 'Not provided'}</span>
        </div>
      </div>
      <div className="d-flex-2">
        <Image className="w-100 mb-4 mt-3" src={data.media ? data.media[0]?.data?.file_path : null} />
        <p className="dsl-b18 bold">About</p>
        <p className="dsl-m16">{data.data?.description}</p>
      </div>
    </div>
  </>
)

PlusShow.propTypes = {
  data: PropTypes.any,
  title: PropTypes.string,
}

PlusShow.defaultProps = {
  data: {},
  title: 'HCM',
}

export default PlusShow

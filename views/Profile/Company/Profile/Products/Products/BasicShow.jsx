import React from 'react'
import PropTypes from 'prop-types'
import { Avatar, Icon, Rating } from '@components'
import { convertUrl } from '~/services/util'

const BasicShow = ({ data, products, title }) => (
  <>
    <div className="d-flex align-items-end">
      <span className="dsl-b24 bold">{title}</span>
      <span className="dsl-m12 ml-2">Claim page</span>
    </div>
    <div className="d-flex mt-3">
      <div className="d-flex-1">
        <p className="dsl-b18 bold">Ratings</p>
        <div className="d-flex">
          <Rating score={Math.round(Number(data?.stats?.rating_avg) * 100) / 100 || 0} size="medium" />
        </div>
        <p className="dsl-b18 bold mt-2">
          {Math.round(data.stats?.rating_recommended_avg * 100) / 100 || 0}% Recommended
        </p>
        <p className="dsl-b14 mt-5">{data.stats?.rating_count} Verified Ratings</p>
        <p className="dsl-b14 mt-1">By {data.stats?.rating_dealership_count} Verified Dealership</p>

        <p className="dsl-b18 bold mt-5">Contact</p>
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
          <span className="dsl-b16">CONTACT</span>
        </div>
      </div>
      <div className="d-flex-2">
        <p className="dsl-b18 bold">About</p>
        <p className="dsl-m16">{data.data?.description}</p>

        <div className="top-rated">
          <p className="dsl-b18 bold mt-2 mb-3">Consider Top Rated Products</p>
          {products?.data?.map((item, index) => {
            if (index > 2) return
            const url = convertUrl(item.logo, '/images/default_company.svg')
            return (
              <div className="product align-items-center mb-3" key={index}>
                <Avatar
                  url={url}
                  size="small"
                  type="logo"
                  backgroundColor="#FFFFFF"
                  borderColor="#e0e0e0"
                  borderWidth={1}
                />
                <div className="ml-2">
                  <p className="dsl-b14 mb-1">{item.name}</p>
                  <p className="dsl-m12 mb-1">
                    {Math.round(item.stats?.rating_recommended_avg * 100) / 100}% Recommended {item.stats?.rating_count}{' '}
                    Ratings
                  </p>
                  <Rating score={Math.round(Number(item?.stats?.rating_avg) * 100) / 100} />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  </>
)

BasicShow.propTypes = {
  data: PropTypes.any,
  title: PropTypes.string,
}

BasicShow.defaultProps = {
  data: {},
  title: 'HCM',
}

export default BasicShow

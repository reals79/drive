import React from 'react'
import PropTypes from 'prop-types'
import ReactPlayer from 'react-player'
import { split, takeLast } from 'ramda'
import { Button, Icon, Rating } from '@components'

const PremiumShow = ({ data, title }) => {
  const name = data.documents[0]?.data?.document_url
    ? takeLast(1, split('/', data.documents[0]?.data?.document_url))
    : 'our CRM whitepaper'
  return (
    <>
      <div className="d-flex align-items-end">
        <span className="dsl-b24 bold">{title}</span>
        <div className="d-flex mb-1">
          <Icon name="fa fa-check-circle ml-2" color="green" size={14} />
          <span className="dsl-m12 ml-1">Claimed</span>
        </div>
      </div>
      <div className="d-flex video-section mb-4">
        <div className="d-flex-1 mr-1 video-card">
          <ReactPlayer
            url={data.videos ? data.videos[0]?.data?.video_url : null}
            playing={false}
            controls
            width="100%"
            height="100%"
          />
        </div>
        <div className="d-flex-1 mx-1 video-card">
          <ReactPlayer
            url={data.videos ? data.videos[1]?.data?.video_url : null}
            playing={false}
            controls
            width="100%"
            height="100%"
          />
        </div>
        <div className="d-flex d-flex-1 ml-1 ">
          <div className="d-flex d-flex-1 flex-column justify-content-between mr-1">
            <div className="video-card">
              <ReactPlayer
                className="mb-1"
                playing={false}
                url={data.videos ? data.videos[2]?.data?.video_url : null}
                controls
                width="100%"
                height="100%"
              />
            </div>

            <div className="video-card">
              <ReactPlayer
                className="mt-1"
                playing={false}
                url={data.videos ? data.videos[3]?.data?.video_url : null}
                controls
                width="100%"
                height="100%"
              />
            </div>
          </div>
          <div className="d-flex d-flex-1 flex-column justify-content-between ml-1">
            <div className="video-card">
              <ReactPlayer
                className="mb-1"
                playing={false}
                url={data.videos ? data.videos[4]?.data?.video_url : null}
                controls
                width="100%"
                height="100%"
              />
            </div>

            <div className="video-card">
              <ReactPlayer
                className="mt-1"
                playing={false}
                url={data.videos ? data.videos[5]?.data?.video_url : null}
                controls
                width="100%"
                height="100%"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="d-flex">
        <div className="d-flex-1 mr-5">
          <p className="dsl-b18 bold">Rating</p>
          <div className="d-flex">
            <Rating score={Math.round(Number(data?.stats?.rating_avg) * 100) / 100 || 0} size="medium" />
          </div>
          <p className="dsl-b18 bold mt-2">
            {Math.round(data.stats?.rating_recommended_avg * 100) / 100 || 0}% Recommended
          </p>
          <p className="dsl-b14 mt-4">{data.stats?.rating_count} Verified Ratings</p>
          <p className="dsl-b14 mt-1 mb-0 pb-4 border-bottom">
            By {data.stats?.rating_dealership_count} Verified Dealership
          </p>

          <p className="dsl-b20 bold mt-4">Contact</p>
          <div className="contact mt-4">
            <Icon name="fal fa-phone-alt head" color="dark" size={14} />
            <span className="dsl-b16 info">{data.data?.contact?.phone || 'Not provided'}</span>
          </div>
          <div className="contact mt-4">
            <Icon name="fal fa-window-maximize head" color="dark" size={14} />
            <span className="dsl-b16 info">{data.data?.website || 'Not provided'}</span>
          </div>
          <div className="contact mt-4">
            <Icon name="fal fa-comment head" color="dark" size={14} />
            <span className="dsl-b16 info">Chat with us</span>
          </div>
          <div className="contact mt-4">
            <Icon name="fal fa-envelope head" color="dark" size={14} />
            <span className="dsl-b16 info">CONTACT</span>
          </div>
        </div>
        <div className="d-flex-2">
          <p className="dsl-b18 bold">About</p>
          <p className="dsl-m16 mb-0 pb-4 border-bottom">{data.data?.description}</p>

          <p className="dsl-b18 bold mt-4">Offers</p>
          <div className="d-flex">
            <div className="d-flex-2">
              <div className="d-flex mb-3">
                <Icon name="fal fa-newspaper mx-auto" color="#376caf" size={24} />
              </div>
              <p className="dsl-b14 text-center">Download {name}</p>
              <Button className="mx-auto" type="medium">
                <a
                  className="dsl-b14"
                  href={data.documents ? data.documents[0]?.data?.document_url : null}
                  target="_blank"
                >
                  Download
                </a>
              </Button>
            </div>
            <div className="d-flex-1 d-flex d-center">
              <Button name="SPECIAL OFFER" />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

PremiumShow.propTypes = {
  data: PropTypes.any,
  title: PropTypes.string,
}

PremiumShow.defaultProps = {
  data: {},
  title: 'HCM',
}

export default PremiumShow

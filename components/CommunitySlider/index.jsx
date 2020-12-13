import React, { useState } from 'react'
import Slider from 'react-slick'
import { Icon, Thumbnail } from '@components'
import './CommunitySlider.scss'

const CommunitySlider = ({ data }) => {
  const [current, setCurrent] = useState(0)

  const settings = {
    infinite: true,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    vertical: true,
    pauseOnHover: false,
    beforeChange: (before, next) => setCurrent(next),
  }

  let slider
  const handleClick = e => {
    setCurrent(e)
    slider.slickGoTo(e)
  }

  return (
    <div className="community-slider d-flex">
      <div className="card d-flex-3 mr-2">
        <div className="d-flex justify-content-between mb-3">
          <span className="dsl-b22 bold">Featured Posts</span>
          <div className="d-flex">
            {[0, 1, 2, 3, 4].map(item => (
              <Icon
                key={item}
                name="fas fa-circle ml-1"
                color={current === item ? '#6899d7' : '#e5eef8'}
                size={14}
                onClick={() => handleClick(item)}
              />
            ))}
          </div>
        </div>
        <div onClick={() => window.open(data[current]?.data?.url)}>
          <Thumbnail src={data[current]?.data?.image} size="responsive" />
          <p className="dsl-b16 bold mt-3">{data[current]?.data?.title}</p>
          <p className="dsl-b16 truncate-one mb-0">{data[current]?.data?.synopsis}</p>
        </div>
      </div>
      <div className="d-flex-1 ml-2 right-end">
        <Slider ref={e => (slider = e)} {...settings}>
          {[1, 2, 3, 4, 0].map(item => (
            <div className="img" key={`i${item}`}>
              {data && (
                <Thumbnail
                  src={data[item]?.data?.image}
                  size="responsive"
                  onClick={() => window.open(data[item]?.data?.url)}
                />
              )}
            </div>
          ))}
        </Slider>
      </div>
    </div>
  )
}

export default CommunitySlider

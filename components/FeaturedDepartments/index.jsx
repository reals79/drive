import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import Slider from 'react-slick'
import { slice } from 'ramda'
import { useDispatch } from 'react-redux'
import { Avatar, Icon, Rating } from '@components'
import CommunityActions from '~/actions/community'
import './FeaturedDepartments.scss'

const FeaturedDepartments = ({ departments }) => {
  const categories = useSelector(state => state.vendor.categories)
  const products = useSelector(state => state.community.featuredProducts)
  const [current, setCurrent] = useState(0)

  const featureCategories = slice(0, 5, categories.all)
  let slider
  const handleClick = e => {
    setCurrent(e)
    slider.slickGoTo(e)
  }

  const dispatch = useDispatch()
  useEffect(() => {
    featureCategories.forEach(item => {
      dispatch(CommunityActions.getcategorysponsoredproductsRequest(item.id))
    })
  }, [])

  const settings = {
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2600,
    pauseOnHover: false,
    beforeChange: (before, next) => setCurrent(next),
  }

  return (
    <div className="featured-departments card">
      <div className="d-flex align-items-center">
        <p className="dsl-b18 bold mr-auto">Featured {featureCategories[current]?.name}</p>
        {[0, 1, 2, 3, 4].map(item => (
          <Icon
            key={`ic${item}`}
            name="fas fa-circle ml2"
            color={current === item ? '#6899d7' : '#e5eef8'}
            size={14}
            onClick={() => handleClick(item)}
          />
        ))}
      </div>
      <Slider ref={e => (slider = e)} {...settings}>
        {featureCategories?.map((department, idx) => (
          <div key={idx}>
            {products[department?.id]?.length > 0 ? (
              products[department?.id]?.map((item, index) => (
                <div className="d-flex align-items-center mb-2" key={index}>
                  <div className="d-flex-2">
                    <Avatar url={item?.logo} size="regular" />
                  </div>
                  <div className="d-flex-4 px-2">
                    <p className="dsl-b14 text-400 truncate-two mb-1">{item?.name}</p>
                    <p className="dsl-b14 mb-0">Rating: {item?.stats?.rating_count}</p>
                  </div>
                  <div className="d-flex-3">
                    <Rating score={item?.stats?.rating_avg} />
                    <span className="dsl-b14">{Math.round(item?.stats?.rating_recommended_avg)}% recommended</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="dsl-m14 text-center">No Top Rated CRMs available</p>
            )}
          </div>
        ))}
      </Slider>
    </div>
  )
}

export default FeaturedDepartments

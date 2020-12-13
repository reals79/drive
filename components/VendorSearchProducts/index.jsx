import React, { memo } from 'react'
import PropTypes from 'prop-types'
import { equals, isEmpty, slice } from 'ramda'
import { Button } from '@components'
import EmptyProduct from './EmptyProduct'
import ProductItem from './ProductItem'
import './VendorSearchProducts.scss'

const VendorSearchProducts = ({ data, type, onSeeAll }) => {
  const subs = data.length > 3 ? slice(0, 3, data) : data
  return (
    <div className="vendor-search-products">
      <div className="d-h-start">
        <p className="dsl-b18 bold mr-2">Products</p>
        <p className="dsl-p12">{`(${data.length})`}</p>
      </div>
      {isEmpty(data) ? (
        <EmptyProduct />
      ) : (
        <>
          {equals(type, 'sub') ? (
            <div className="border-bottom pb-3 mb-5">
              {subs.map(product => {
                const { id, name, data, stats } = product
                const { contact, description } = data
                const { rating_recommended_avg, rating_avg, rating_count } = stats
                const { phone } = contact
                return (
                  <ProductItem
                    key={`product-${id}`}
                    name={name}
                    description={description}
                    recommend={rating_recommended_avg}
                    rating={Number(rating_avg)}
                    ratingCount={rating_count}
                    phone={phone}
                  />
                )
              })}
              <div className="d-h-end">
                <Button type="link" name="SEE ALL" onClick={onSeeAll} />
              </div>
            </div>
          ) : (
            <>
              {data.map(product => {
                const { id, name, data, stats } = product
                const { contact, description } = data
                const { rating_recommended_avg, rating_avg, rating_count } = stats
                const { phone } = contact
                return (
                  <ProductItem
                    key={`product-${id}`}
                    name={name}
                    description={description}
                    recommend={rating_recommended_avg}
                    rating={Number(rating_avg)}
                    ratingCount={rating_count}
                    phone={phone}
                    type="detail"
                  />
                )
              })}
            </>
          )}
        </>
      )}
    </div>
  )
}

VendorSearchProducts.propTypes = {
  data: PropTypes.array,
  type: PropTypes.oneOf(['sub', 'full']),
  onSeeAll: PropTypes.func,
}

VendorSearchProducts.defaultProps = {
  data: [],
  type: 'sub',
  onSeeAll: () => {},
}

export default memo(VendorSearchProducts)

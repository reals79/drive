import React, { memo } from 'react'
import PropTypes from 'prop-types'
import { equals, isEmpty, slice } from 'ramda'
import { Button } from '@components'
import EmptyCompany from './EmptyCompany'
import CompanyItem from './CompanyItem'
import './VendorSearchCompanies.scss'

const VendorSearchCompanies = ({ data, type, onSeeAll }) => {
  const subs = data.length > 3 ? slice(0, 3, data) : data
  return (
    <div className="vendor-search-companies">
      <div className="d-h-start">
        <p className="dsl-b18 bold mr-2">Companies</p>
        <p className="dsl-p12">{`(${data.length})`}</p>
      </div>
      {isEmpty(data) ? (
        <EmptyCompany />
      ) : (
        <>
          {equals(type, 'sub') ? (
            <>
              <CompanyItem />
              <div className="d-h-end">
                <Button type="link" name="SEE ALL" onClick={onSeeAll} />
              </div>
            </>
          ) : (
            <>
              {data.map((people, index) => (
                <CompanyItem key={`product-${index}`} type="detail" />
              ))}
            </>
          )}
        </>
      )}
    </div>
  )
}

VendorSearchCompanies.propTypes = {
  data: PropTypes.array,
  type: PropTypes.oneOf(['sub', 'full']),
  onSeeAll: PropTypes.func,
}

VendorSearchCompanies.defaultProps = {
  data: [],
  type: 'sub',
  onSeeAll: () => {},
}

export default memo(VendorSearchCompanies)

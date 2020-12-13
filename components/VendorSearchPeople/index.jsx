import React, { memo } from 'react'
import PropTypes from 'prop-types'
import { Row, Col } from 'react-bootstrap'
import { isNil, equals, isEmpty, slice } from 'ramda'
import { Button } from '@components'
import EmptyPeople from './EmptyPeople'
import PeopleItem from './PeopleItem'
import './VendorSearchPeople.scss'

const VendorSearchPeople = ({ data, type, onSeeAll }) => {
  const subs = data.length > 3 ? slice(0, 3, data) : data
  return (
    <div className="vendor-search-people">
      <div className="d-h-start">
        <p className="dsl-b18 bold mr-2">People</p>
        <p className="dsl-p12">{`(${data.length})`}</p>
      </div>
      {isEmpty(data) ? (
        <EmptyPeople />
      ) : (
        <>
          {equals(type, 'sub') ? (
            <div className="border-bottom pb-3 mb-5">
              <Row className="mx-0">
                {subs.map(people => {
                  const { id, first_name, last_name, profile, stats } = people
                  const connects = stats && stats.connections ? stats.connections : 0
                  return (
                    <Col className="px-0" xs={12} sm={6} md={4} key={`people-${id}`}>
                      <PeopleItem
                        name={`${first_name} ${last_name}`}
                        job={profile.job_title}
                        connects={connects}
                      />
                    </Col>
                  )
                })}
              </Row>
              <div className="d-h-end">
                <Button type="link" name="SEE ALL" onClick={onSeeAll} />
              </div>
            </div>
          ) : (
            <Row className="mx-0">
              {data.map(people => {
                const { id, first_name, last_name, profile, stats } = people
                const connects = stats && stats.connections ? stats.connections : 0
                return (
                  <Col className="px-0" xs={12} sm={6} md={3} key={`people-${id}`}>
                    <PeopleItem
                      name={`${first_name} ${last_name}`}
                      job={profile.job_title}
                      connects={connects}
                    />
                  </Col>
                )
              })}
            </Row>
          )}
        </>
      )}
    </div>
  )
}

VendorSearchPeople.propTypes = {
  data: PropTypes.array,
  type: PropTypes.oneOf(['sub', 'full']),
  onSeeAll: PropTypes.func,
}

VendorSearchPeople.defaultProps = {
  data: [],
  type: 'sub',
  onSeeAll: () => {},
}

export default memo(VendorSearchPeople)

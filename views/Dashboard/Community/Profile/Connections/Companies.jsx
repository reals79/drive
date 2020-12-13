import React from 'react'
import { useDispatch } from 'react-redux'

import CommunityActions from '~/actions/community'
import PropTypes from 'prop-types'
import { Row, Col } from 'react-bootstrap'
import { ConnectionCard as CompanyCard } from '@components'
import './Connections.scss'

const Companies = ({ companies, user }) => {
  const dispatch = useDispatch()

  const handleUnfollow = company => () => {
    const payload = {
      data: {
        company_id: company.id,
      },
      after: {
        type: 'GETCOMMUNITYCONNECTIONS_REQUEST',
        payload: {
          userId: user.id,
        },
      },
    }
    dispatch(CommunityActions.postunfollowRequest(payload))
  }

  return (
    <>
      {companies.length > 0 ? (
        <Row className="connections-companies mx-1">
          {companies.map(company => (
            <Col key={company.id} className="p-2" xs={12} sm={6} md={3}>
              <CompanyCard data={company} tab="companies" type="company" onClick={handleUnfollow(company)} />
            </Col>
          ))}
        </Row>
      ) : (
        <p className="dsl-b16 p-3">No companies</p>
      )}
    </>
  )
}

Companies.propTypes = {
  companies: PropTypes.array,
  user: PropTypes.shape({
    id: PropTypes.number,
  }),
}

Companies.defaultProps = {
  companies: [],
  user: {
    id: 0,
  },
}

export default Companies

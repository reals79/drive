import React from 'react'
import PropTypes from 'prop-types'
import { Row, Col } from 'react-bootstrap'
import { Icon } from '@components'

const CommunityHeader = ({ activeRoute, backTitle, childRoute, searchTitle, onBack, onModal }) => (
  <Row className="mx-0 mb-3">
    <Col xs={7} className="d-h-start px-0 py-2">
      <span className="dsl-b14 text-400">Community</span>
      {activeRoute && (
        <>
          <Icon name="far fa-chevron-right ml-2" size={12} color="#969faa" />
          <span className={`${childRoute ? 'dsl-b14 text-400' : 'dsl-m14'} ml-2`}>{activeRoute}</span>
        </>
      )}
      {childRoute && (
        <>
          <Icon name="far fa-chevron-right ml-2" size={12} color="#969faa" />
          <span className="dsl-m14 ml-2">{childRoute}</span>
        </>
      )}
    </Col>
    <Col xs={5} className="d-flex align-items-center justify-content-end">
      {searchTitle && (
        <div className="d-h-start mr-5">
          <Icon name="fal fa-search mr-2" size={14} color="#376caf" />
          <span className="dsl-p14">{`Search ${searchTitle}`}</span>
        </div>
      )}
      {backTitle ? (
        <div className="d-h-start" onClick={onBack}>
          <Icon name="fal fa-arrow-left mr-2" size={12} color="#376caf" />
          <span className="dsl-p14">{`Back to ${backTitle}`}</span>
        </div>
      ) : (
        <div className="d-h-start mr-0 mr-md-4">
          {searchTitle && (
            <div onClick={onModal}>
              <Icon name="fal fa-plus mr-2" size={14} color="#376caf" />
              <span className="dsl-p14">{`Add ${searchTitle}`}</span>
            </div>
          )}
        </div>
      )}
    </Col>
  </Row>
)

CommunityHeader.propTypes = {
  activeRoute: PropTypes.string,
  backTitle: PropTypes.string,
  childRoute: PropTypes.string,
  searchTitle: PropTypes.string,
  onBack: PropTypes.func,
  onModal: PropTypes.func,
}

CommunityHeader.defaultProps = {
  activeRoute: null,
  backTitle: null,
  childRoute: null,
  searchTitle: null,
  onBack: () => {},
  onModal: () => {},
}

export default CommunityHeader

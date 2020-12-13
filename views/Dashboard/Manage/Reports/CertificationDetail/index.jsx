import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Row, Col } from 'react-bootstrap'
import originalMoment from 'moment'
import { extendMoment } from 'moment-range'
import { isNil, find, propEq } from 'ramda'
import { Filter, ErrorBoundary, CertificationCard } from '@components'
import DevActions from '~/actions/develop'
import './CertificationDetail.scss'

const moment = extendMoment(originalMoment)

class CertificationDetail extends Component {
  constructor(props) {
    super(props)

    const userId = Number(props.match.params.userId)
    const certId = Number(props.match.params.id)

    const { users, templates } = props
    const program = find(propEq('id', certId), templates.certifications.data)

    const userDetails = userId ? find(propEq('id', userId), users) : {}
    const profile = userId ? { ...userDetails.profile, id: userId } : null

    this.state = { profile, program }

    this.handleComplete = this.handleComplete.bind(this)
  }

  handleComplete() {
    const { program } = this.state
    this.props.programPromote({ programId: program.id, route: '/hcm/report-certifications' })
  }

  render() {
    const { program, profile } = this.state
    const { history } = this.props
    const levels = program.data.levels || {}
    const startDate = isNil(history.location.state)
      ? moment()
          .startOf('month')
          .format('YYYY-MM-DD')
      : history.location.state.startDate
    const endDate = isNil(history.location.state)
      ? moment()
          .endOf('month')
          .format('YYYY-MM-DD')
      : history.location.state.endDate

    return (
      <ErrorBoundary className="manage-report-certification-detail">
        <Filter backTitle="Back" onBack={() => history.goBack()} />
        <Row>
          <Col xs={12} sm={6}>
            <CertificationCard.Info title={program.title} icon={levels[program.level].icon_url} />
          </Col>
          <Col xs={12} sm={6}>
            <CertificationCard.Levels data={levels} />
          </Col>
        </Row>
        {!isNil(profile) && (
          <CertificationCard.User
            className="mt-3"
            userId={this.props.userId}
            profile={profile}
            certification={program}
            onComplete={this.handleComplete}
          />
        )}
        <CertificationCard.Requirements className="mt-3" data={levels} />
      </ErrorBoundary>
    )
  }
}

CertificationDetail.propTypes = {
  users: PropTypes.any,
  userId: PropTypes.number,
  templates: PropTypes.any,
}

CertificationDetail.defaultProps = {
  users: [],
  userId: 0,
  templates: {},
}

const mapStateToProps = state => ({
  users: state.app.employees,
  userId: state.app.id,
  templates: state.develop.templates,
})

const mapDispatchToProps = dispatch => ({
  programPromote: e => dispatch(DevActions.programpromotionRequest(e)),
})

export default connect(mapStateToProps, mapDispatchToProps)(CertificationDetail)

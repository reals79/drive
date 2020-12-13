import React from 'react'
import { connect } from 'react-redux'
import { Image, Row, Col } from 'react-bootstrap'
import { Icon } from '@components'
import DevActions from '~/actions/develop'
import './CareerCommitments.scss'

class CareerCommitments extends React.PureComponent {
  componentDidMount() {
    const userId = this.props.userId
    this.props.goalsRequest(userId)
    this.props.tasksRequest(userId, 3, 1)
    this.props.trainingsRequest(userId, 3, 1)
  }

  render() {
    return (
      <div className="career-commitments">
        <div className="header">
          <span className="dsl-b12">Open Commitments</span>
        </div>
        <div className="content">
          <Row className="line">
            <Col className="no-left" xs={2} sm={2}>
              <Icon name="fa fa-bullseye" color="#343f4b" size={18} />
            </Col>
            <Col className="no-right" xs={10} sm={10}>
              <span className="dsl-b12 pt-2">Goals</span>
            </Col>
          </Row>
          {this.props.goals.map((goal, key) => (
            <Row className="line" key={key}>
              <Col className="no-left" xs={2} sm={2}>
                <Icon name="fal fa-circle mr-2" color="#969faa" size={21} />
              </Col>
              <Col className="no-right" xs={10} sm={10}>
                <span className="dsl-d12 pt-2">Goal</span>
                <br />
                <span className="dsl-d14">{goal}</span>
              </Col>
            </Row>
          ))}
          <Row className="see-all">
            <span className="dsl-p14">
              See all&nbsp;
              <Icon name="fa fa-chevron-right" color="#376CAF" size={12} />
            </span>
          </Row>
          <Row className="line">
            <Col className="no-left" xs={2} sm={2}>
              <Icon name="fa fa-check-circle" color="#343f4b" size={18} />
            </Col>
            <Col className="no-right" xs={10} sm={10}>
              <span className="dsl-b12 pt-2">Tasks</span>
            </Col>
          </Row>
          {this.props.tasks.map((task, key) => (
            <Row className="line" key={key}>
              <Col className="no-left" xs={2} sm={2}>
                <Icon name="fal fa-circle mr-2" color="#969faa" size={21} />
              </Col>
              <Col className="no-right" xs={10} sm={10}>
                <span className="dsl-d12 pt-2">{task.data.name}</span>
                <br />
                <span className="dsl-d14">{task.data.description}</span>
              </Col>
            </Row>
          ))}
          <Row className="see-all">
            <span className="dsl-p14">
              See all&nbsp;
              <Icon name="fa fa-chevron-right" color="#376CAF" size={12} />
            </span>
          </Row>
          <Row className="line">
            <Col className="no-left" xs={2} sm={2}>
              <Icon name="fa fa-graduation-cap" color="#343f4b" size={18} />
            </Col>
            <Col className="no-right" xs={10} sm={10}>
              <span className="dsl-b12 pt-2">Trainging</span>
            </Col>
          </Row>
          {this.props.trainings.map((training, key) => (
            <Row className="line" key={key}>
              <Col className="no-left" xs={2} sm={2}>
                <Icon name="fal fa-circle mr-2" color="#969faa" size={21} />
              </Col>
              <Col className="no-left no-right" xs={3} sm={3}>
                <Image width="100%" src={training.data.thumb_url} />
              </Col>
              <Col className="no-right" xs={7} sm={7}>
                <span className="dsl-d14">{training.data.name}</span>
              </Col>
            </Row>
          ))}
          <Row className="see-all last">
            <span className="dsl-p14">
              See all&nbsp;
              <Icon name="fa fa-chevron-right" color="#376CAF" size={12} />
            </span>
          </Row>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  userId: state.app.id,
  goals: state.develop.careerGoals,
  tasks: state.develop.careerTasks,
  trainings: state.develop.careerTrainings,
})

const mapDispatchToProps = dispatch => ({
  goalsRequest: id => dispatch(DevActions.careergoalsRequest(id)),
  tasksRequest: (user_id, per_page, page) =>
    dispatch(DevActions.careertasksRequest(user_id, per_page, page)),
  trainingsRequest: (user_id, per_page, page) =>
    dispatch(DevActions.careertrainingsRequest(user_id, per_page, page)),
})

export default connect(mapStateToProps, mapDispatchToProps)(CareerCommitments)

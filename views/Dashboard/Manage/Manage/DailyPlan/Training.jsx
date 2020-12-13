import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { toast } from 'react-toastify'
import { equals, isNil } from 'ramda'
import { Icon, CoreTaskHeader as Header, TrainingItem, ErrorBoundary, TaskEmptyList } from '@components'
import AppActions from '~/actions/app'
import DevActions from '~/actions/develop'

class Training extends Component {
  state = { userId: this.props.userId, showTraining: false }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { userId, getDailyTrainings } = nextProps
    if (!equals(userId, prevState.userId)) {
      getDailyTrainings({ userId })
      return { userId }
    }
    return null
  }

  componentDidMount() {
    const { userId } = this.props
    this.props.getDailyTrainings({ userId })
  }

  handleShowModal = course => () => {
    if (isNil(course.data.child_count) || equals(course.data.child_count, 0)) {
      toast.warn(`Sorry, the course has no any module.`, {
        position: toast.POSITION.BOTTOM_CENTER,
        pauseOnFocusLoss: false,
        hideProgressBar: true,
      })
      return
    }
    const { userId } = this.state
    if (isNil(course.data.completed)) {
      course = {
        ...course,
        data: { ...course.data, completed: course.data.child_count },
      }
    }
    const remainingCount = course.data.child_count - course.data.completed
    const index = equals(remainingCount, 0) ? 0 : equals(course.data.completed, 0) ? 0 : course.data.completed
    const after = { type: 'DAILYTRAINING_REQUEST', payload: { userId } }
    this.props.toggleModal({
      type: 'Preview',
      data: { before: { course, module: course.children[index], index, after }, after: null },
      callBack: null,
    })
    this.props.resetURL()
  }

  render() {
    const { className, title, completed, daily, dataCy, userId } = this.props
    const { showTraining } = this.state
    const trainings = completed ? daily.completed : daily.open

    return (
      <ErrorBoundary className={`training-list ${className}`} dataCy={dataCy}>
        <Header title={title} data={trainings} />
        {trainings.map(
          (training, index) =>
            ((index <= 1 && !showTraining) || showTraining) && (
              <TrainingItem
                key={`tl${index}`}
                dataCy={`${dataCy}-treiningItem${index}`}
                completed={completed}
                task={training}
                userId={userId}
                onClick={this.handleShowModal(training)}
              />
            )
        )}
        {!equals(trainings.length, 0) && (
          <div className="d-flex justify-content-center" onClick={() => this.setState({ showTraining: !showTraining })}>
            <div className="dsl-b14 text-400 mr-2">{showTraining ? 'Compress to see less' : 'Expand to see more'}</div>
            <Icon name={`far ${showTraining ? 'fa-angle-up' : 'fa-angle-down'}`} size={14} color="#000" />
          </div>
        )}

        {equals(trainings.length, 0) && (
          <TaskEmptyList
            type="blank"
            message={completed ? 'There are no completed Trainings to show' : 'There are no assigned Trainings to show'}
          />
        )}
      </ErrorBoundary>
    )
  }
}

Training.propTypes = {
  userId: PropTypes.number,
  daily: PropTypes.shape({ open: PropTypes.array, completed: PropTypes.array }),
  className: PropTypes.string,
  title: PropTypes.string.isRequired,
  completed: PropTypes.bool.isRequired,
  getDailyTrainings: PropTypes.func,
  resetURL: PropTypes.func.isRequired,
}

Training.defaultProps = {
  userId: 0,
  daily: { open: [], completed: [] },
  className: '',
  title: '',
  completed: false,
  getDailyTrainings: () => {},
  resetURL: () => {},
}

const mapStateToProps = state => ({
  daily: state.develop.instances.dailyTraining,
})

const mapDispatchToProps = dispatch => ({
  getDailyTrainings: e => dispatch(DevActions.dailytrainingRequest(e)),
  resetURL: () => dispatch(AppActions.uploadSuccess('')),
  toggleModal: e => dispatch(AppActions.modalRequest(e)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Training)

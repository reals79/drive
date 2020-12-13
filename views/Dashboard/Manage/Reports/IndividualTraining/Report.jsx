import React from 'react'
import PropTypes from 'prop-types'
import { equals, isNil } from 'ramda'
import moment from 'moment'
import { CheckBox, Thumbnail, Icon, Pagination } from '@components'
import { inPage } from '~/services/util'
import './IndividualTraining.scss'

class Course extends React.PureComponent {
  state = { current: 1, per: 5 }

  handlePagination = current => {
    this.setState({ current })
  }

  handlePer = per => {
    if (per >= 10) {
      this.setState({ current: 1, per })
    }
    this.setState({ per })
  }

  renderStatus(status, completed_at) {
    if (equals(status, 0)) {
      return <span className="dsl-b14 text-400 no-wrap">Not Started</span>
    } else if (equals(status, 3)) {
      return (
        <div>
          <span className="dsl-b14 text-400 no-wrap">Completed</span>
          <br />
          <span className="dsl-m12 no-wrap">{moment(completed_at).format('M/D/YYYY')}</span>
        </div>
      )
    } else if (equals(status, 2)) {
      return <span className="dsl-b14 text-400 no-wrap">Past Due</span>
    } else {
      return <span className="dsl-b14 text-400 no-wrap">In Progress</span>
    }
  }

  render() {
    const { current, per } = this.state
    const { data, type } = this.props

    return (
      <>
        <div className="report-item">
          <div className="d-flex-10 text-left">
            <span className="dsl-m12">Courses</span>
          </div>
          <div className="d-flex-2 text-right">
            <span className="dsl-m12">Modules</span>
          </div>
          <div className="d-flex-2 text-right">
            <span className="dsl-m12">Completed</span>
          </div>
          <div className="d-flex-2 text-right">
            <span className="dsl-m12">Open</span>
          </div>
          <div className="d-flex-3 text-right">
            <span className="dsl-m12">Due date</span>
          </div>
          <div className="d-flex-3 text-left ml-3">
            <span className="dsl-m12">Status</span>
          </div>
          <div className="d-flex-1" />
        </div>
        {equals(data.length, 0) ? (
          <p className="dsl-m14 mt-3">{`There are no ${type} assigned courses.`}</p>
        ) : (
          data.map((item, index) => {
            const completed = item.children_complete
            const total = item.children.length
            const opened = total - completed
            const isCompleted = total > 0 ? equals(completed, total) : false
            const percent_completed = item.percent_complete
            const percent_opened = 100 - percent_completed
            const due_date = isNil(item.due_at) ? 'N/A' : moment(item.due_at).format('MMM D')
            return (
              inPage(index, current, per) && (
                <div className="report-item" key={`card${index}`}>
                  <div className="d-flex d-flex-10 text-left">
                    <div className="d-flex align-items-center">
                      <CheckBox checked={isCompleted} />
                    </div>
                    <Thumbnail className="mx-2" src={item.data.thumb_url} size="tiny" />
                    <p className={`dsl-b14 text-400 truncate-two mb-0 ${isCompleted ? 'text-line-through' : ''}`}>
                      {item.data.name}
                    </p>
                  </div>
                  <div className="d-flex-2 text-right">
                    <span className="dsl-b14 text-400">{total}</span>
                    <br />
                    <span className="dsl-m12">100%</span>
                  </div>
                  <div className="d-flex-2 text-right">
                    <span className="dsl-b14 text-400">{completed}</span>
                    <br />
                    <span className="dsl-m12">{percent_completed}%</span>
                  </div>
                  <div className="d-flex-2 text-right">
                    <span className="dsl-b14 text-400">{opened}</span>
                    <br />
                    <span className="dsl-m12">{percent_opened}%</span>
                  </div>
                  <div className="d-flex-3 text-right">
                    <span className="dsl-b14 text-400">{due_date}</span>
                  </div>
                  <div className="d-flex-3 text-left ml-3">{this.renderStatus(item.status, item.completed_at)}</div>
                  <div className="d-flex-1 edit">
                    <Icon name="far fa-ellipsis-h" size={14} color="#c3c7cc" />
                  </div>
                </div>
              )
            )
          })
        )}
        <Pagination
          size="small"
          current={current}
          per={per}
          pers={[5, 10, 'all']}
          total={Math.ceil(data.length / per)}
          onChange={this.handlePagination}
          onPer={this.handlePer}
        />
      </>
    )
  }
}

Course.propTypes = {
  count: PropTypes.number.isRequired,
  data: PropTypes.array.isRequired,
}

Course.defaultProps = {
  count: 0,
  data: [],
}

export default Course

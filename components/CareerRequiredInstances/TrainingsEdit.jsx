import React from 'react'
import PropTypes from 'prop-types'
import { clone, equals, filter, findIndex, isNil, length, move, propEq, remove } from 'ramda'
import moment from 'moment'
import { CheckIcon, EditDropdown, Pagination, Thumbnail } from '@components'
import { inPage } from '~/services/util'
import './CareerRequiredInstances.scss'

class TrainingsEdit extends React.PureComponent {
  state = { current: 1, per: 5 }

  handlePagination = e => {
    this.setState({ current: e })
  }

  handlePer = e => {
    this.setState({ per: e })
  }

  handleSelectMenu = item => e => {
    const index = findIndex(propEq('id', item.id), this.props.data)
    let data = clone(this.props.data)
    switch (e) {
      case 'move up':
        data = move(index, index - 1, data)
        break
      case 'move down':
        data = move(index, index + 1, data)
        break
      case 'remove':
        data = remove(index, 1, data)
        break
      default:
        break
    }
    this.props.onChange(data)
  }

  render() {
    const { current, per } = this.state
    const { data, type } = this.props

    return (
      <div className="career-required-instances">
        <div className="trainings">
          <div className="list">
            <div className="d-flex-1" />
            {equals('instance', type) && (
              <>
                <div className="modules">
                  <span className="dsl-m12">Modules</span>
                </div>
                <div className="compl">
                  <span className="dsl-m12">Compl.</span>
                </div>
                <div className="due">
                  <span className="dsl-m12">Due</span>
                </div>
                <div className="status">
                  <span className="dsl-m12">Status</span>
                </div>
              </>
            )}
            <div className="edit" />
          </div>
          {data.map((item, index) => {
            let dotsMenu = ['Move Down', 'Move Up', 'Remove']
            if (equals(index, 0)) {
              dotsMenu = filter(x => !equals(x, 'Move Up'), dotsMenu)
            }
            if (equals(index + 1, length(data))) {
              dotsMenu = filter(x => !equals(x, 'Move Down'), dotsMenu)
            }

            return (
              inPage(index, current, per) && (
                <div className="list" key={`tr-${index}`}>
                  <div className="d-flex d-flex-1">
                    <CheckIcon className="my-auto" size={26} checked={!isNil(item.completed_at)} />
                    <Thumbnail src={item.data.thumb_url || item.thumbnail} size="tiny" />
                    <div className="ml-4">
                      <p className="dsl-b14 text-400 mb-1">{item.data.name || item.title}</p>
                      <p className="dsl-m12 mb-0">Assigned: Career</p>
                    </div>
                  </div>
                  {equals('instance', type) && (
                    <>
                      <div className="modules">
                        <span className="dsl-m12">{item.data.module_count}</span>
                      </div>
                      <div className="compl">
                        <span className="dsl-m12">2</span>
                      </div>
                      <div className="due">
                        <span className="dsl-m12">{moment(item.due_at).format('MMM DD')}</span>
                      </div>
                      <div className="status">
                        <span className="dsl-m12">
                          {isNil(item.completed_at) ? 'In Progress' : 'Completed'}
                        </span>
                      </div>
                    </>
                  )}
                  <div className="edit">
                    <EditDropdown options={dotsMenu} onChange={this.handleSelectMenu(item)} />
                  </div>
                </div>
              )
            )
          })}
        </div>
        <Pagination
          current={current}
          per={per}
          pers={[5, 10, 'all']}
          total={Math.ceil(data.length / per)}
          onChange={this.handlePagination}
          onPer={this.handlePer}
        />
      </div>
    )
  }
}

TrainingsEdit.propTypes = {
  data: PropTypes.array,
  type: PropTypes.oneOf(['instance', 'template']),
}

TrainingsEdit.defaultProps = {
  data: [],
  type: 'instance',
}

export default TrainingsEdit

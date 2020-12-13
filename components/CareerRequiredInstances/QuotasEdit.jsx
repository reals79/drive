import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { clone, filter, findIndex, isNil, length, move, propEq, remove } from 'ramda'
import { CheckIcon, Dropdown, EditDropdown, Input, Pagination } from '@components'
import { QuotaRequirement } from '~/services/config'
import { inPage } from '~/services/util'
import './CareerRequiredInstances.scss'

class QuotasEdit extends Component {
  state = { current: 1, per: 5 }

  handleCalculation = (type, item) => e => {
    let _item = clone(item)
    let data = {}
    const calc = e[0]
    if (type === 'calculation') {
      data = this.props.data.map(m => {
        if (m.id == _item.id) {
          _item.quota_calculation = calc.value
          return _item
        }
        return m
      })
    } else if (type === 'month') {
      data = this.props.data.map(m => {
        if (m.id == _item.id) {
          _item.span_months = calc.value
          _item.minimum_months = calc.value
          return _item
        }
        return m
      })
    } else if (type === 'requirement') {
      data = this.props.data.map(m => {
        if (m.id == _item.id) {
          return _item
        }
        return m
      })
    }

    this.props.onChange(data)
  }

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

  handleTarget = item => e => {
    const quota_target = Number(e)
    const data = this.props.data.map(m => {
      if (m.id === item.id) {
        item.quota_target = quota_target
        return item
      }
      return m
    })
    this.props.onChange(data)
  }

  render() {
    const { current, per } = this.state
    const { data, options, type } = this.props
    const months = [...Array(12).keys()].map(key => ({ id: key + 1, value: key + 1, label: `${key + 1}` }))

    return (
      <div className="career-required-instances">
        <div className="quotas">
          <div className="list">
            <div className="d-flex-7">
              <span className="dsl-m12">Achievement</span>
            </div>
            {'instance' === type && (
              <div className="d-flex d-flex-11">
                <div className="d-flex-5 px-0">
                  <p className="dsl-d12">Calculation</p>
                </div>
                <div className="d-flex-2  px-0">
                  <p className="dsl-d12">Months</p>
                </div>
                <div className="d-flex-3 px-0">
                  <p className="dsl-d12">Requirement</p>
                </div>
                <div className="d-flex-2 px-0">
                  <p className="dsl-d12">Required</p>
                </div>
              </div>
            )}
            <div className="edit" />
          </div>
          {data.map((item, index) => {
            let dotsMenu = ['Move Down', 'Move Up', 'Remove']
            if (index === 0) {
              dotsMenu = filter(x => !(x === 'Move Up'), dotsMenu)
            }
            if (index + 1 === length(data)) {
              dotsMenu = filter(x => !(x === 'Move Down'), dotsMenu)
            }
            return (
              inPage(index, current, per) && (
                <div className="list" key={`qt-${index}`}>
                  <div className="d-flex d-flex-7">
                    <CheckIcon className="my-auto" size={26} checked={!isNil(item.completed_at)} />
                    <div className="ml-4">
                      <p className="dsl-b14 text-400 mb-1">{item.name || item.data.name}</p>
                      <p className="dsl-m12 mb-0">{item.description || item.data.description}</p>
                    </div>
                  </div>
                  {'instance' === type && (
                    <div className="d-flex d-flex-11">
                      <div className="d-flex-5">
                        <Dropdown
                          placeholder="Select"
                          width="fit-content"
                          returnBy="data"
                          defaultIds={[item.quota_calculation]}
                          data={options}
                          getValue={e => e['label']}
                          onChange={this.handleCalculation('calculation', item)}
                        />
                      </div>
                      <div className="d-flex-2  px-0">
                        {item.quota_calculation === 3 && (
                          <Dropdown
                            placeholder="Select"
                            width="fit-content"
                            returnBy="data"
                            defaultIds={[item.span_months]}
                            data={months}
                            getValue={e => e['label']}
                            onChange={this.handleCalculation('month', item)}
                          />
                        )}
                      </div>
                      <div className="d-flex-3 px-0">
                        <Dropdown
                          placeholder="Select"
                          width="fit-content"
                          returnBy="data"
                          defaultIds={[item.quota_direction]}
                          data={QuotaRequirement}
                          getValue={e => e['name']}
                          onChange={this.handleCalculation('requirement', item)}
                        />
                      </div>
                      <div className="d-flex-2">
                        <Input
                          type="number"
                          placeholder="Type required number here..."
                          value={item.quota_target || 0}
                          onChange={this.handleTarget(item)}
                        />
                      </div>
                    </div>
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

QuotasEdit.propTypes = {
  data: PropTypes.array,
  type: PropTypes.oneOf(['instance', 'template']),
}

QuotasEdit.defaultProps = {
  data: [],
  type: 'instance',
}

export default QuotasEdit

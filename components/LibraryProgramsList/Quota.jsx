import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { length, slice, isNil, filter, values, findIndex, propEq, move, remove, clone, type as RamdaType } from 'ramda'
import { CheckIcon, Input, Pagination, Dropdown, EditDropdown } from '@components'
import { QuotaRequirement } from '~/services/config'
import './LibraryProgramsList.scss'

class QuotaList extends Component {
  constructor(props) {
    super(props)

    const months = [...Array(12).keys()].map(key => ({ id: key + 1, value: key + 1, label: `${key + 1}` }))

    this.state = {
      curPage: 1,
      totalPage: 1,
      perPage: 7,
      selected: [],
      required: '',
      quotas: [],
      options: props.quotaOptions,
      months,
    }

    this.handleChangePage = this.handleChangePage.bind(this)
    this.handleSelectCalculation = this.handleSelectCalculation.bind(this)
    this.handleChangeRequired = this.handleChangeRequired.bind(this)
    this.handleSelectMenu = this.handleSelectMenu.bind(this)
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (!(nextProps.modules === prevState.quotas)) {
      const { perPage, curPage } = prevState
      const from = (curPage - 1) * perPage
      const to = curPage * perPage
      const totalPage = Math.ceil(length(nextProps.modules) / perPage)
      const selected = slice(from, to, nextProps.modules)
      return {
        quotas: nextProps.modules,
        selected,
        totalPage,
      }
    }
    return null
  }

  handleChangePage(page) {
    const { totalPage, perPage } = this.state
    const { modules } = this.props
    if (page > totalPage) return
    const from = (page - 1) * perPage
    const to = page * perPage
    const selected = slice(from, to, modules)
    this.setState({ curPage: page, selected })
  }

  handleSelectCalculation(type, item, e) {
    const calc = e[0]
    let modules = {}
    if (type === 'calculation') {
      modules = this.props.modules.map(m => {
        if (m.id === item.id) {
          return { ...item, quota_calculation: calc.value }
        }
        return m
      })
    } else if (type === 'month') {
      modules = this.props.modules.map(m => {
        if (m.id === item.id) {
          return { ...item, span_months: calc.value, minimum_months: calc.value }
        }
        return m
      })
    } else if (type === 'requirement') {
      modules = this.props.modules.map(m => {
        if (m.id === item.id) {
          return { ...item }
        }
        return m
      })
    }
    this.props.onChange(modules)
  }

  handleChangeRequired(item, e) {
    const quota_target = Number(e)
    const modules = this.props.modules.map(m => {
      if (m.id === item.id) {
        return {
          ...item,
          quota_target,
        }
      }
      return m
    })
    this.props.onChange(modules)
  }

  handleSelectMenu(item, e) {
    const { quotas } = this.state
    const index = findIndex(propEq('id', item.id), quotas)
    let modules = clone(quotas)
    switch (e) {
      case 'move up':
        modules = move(index, index - 1, modules)
        break
      case 'move down':
        modules = move(index, index + 1, modules)
        break
      case 'remove':
        modules = remove(index, 1, modules)
        break
      default:
        break
    }
    this.props.onChange(modules)
  }

  render() {
    const { totalPage, perPage, curPage, selected, options, months } = this.state
    const quotaOptions = RamdaType(options) === 'Array' ? options : values(options)

    return (
      <div className="library-programs-list px-0">
        <div className="programs-module-list">
          <div className="d-flex">
            <div className="d-flex-7 px-0">
              <p className="dsl-d12">Achievement</p>
            </div>
            <div className="d-flex-4  px-0">
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
            <div className="edit" />
          </div>
          {selected.map((item, index) => {
            if (isNil(item.id)) return null
            let dotsMenu = ['Move Down', 'Move Up', 'Remove']
            if (index === 0) {
              dotsMenu = filter(x => !(x === 'Move Up'), dotsMenu)
            }
            if (index + 1 === length(selected)) {
              dotsMenu = filter(x => !(x === 'Move Down'), dotsMenu)
            }
            return (
              <div className="mx-0 border-top d-flex align-items-center py-2" key={item.id}>
                <div className="d-flex-7 d-flex align-items-center px-0">
                  <CheckIcon size={26} checked={!isNil(item.completed_at)} />
                  <p className="dsl-b14 mb-0 ml-2">{item.name || item.data.name}</p>
                </div>
                <div className="d-flex-4 px-0">
                  <Dropdown
                    placeholder="Select"
                    width="fit-content"
                    returnBy="data"
                    defaultIds={[Number(item.quota_calculation)]}
                    data={quotaOptions}
                    getValue={e => e['label']}
                    onChange={this.handleSelectCalculation.bind(this, 'calculation', item)}
                  />
                </div>
                <div className="d-flex-2 px-0">
                  {Number(item.quota_calculation) === 3 && (
                    <Dropdown
                      placeholder="Select"
                      width="fit-content"
                      returnBy="data"
                      defaultIds={[Number(item.span_months)]}
                      data={months}
                      getValue={e => e['label']}
                      onChange={this.handleSelectCalculation.bind(this, 'month', item)}
                    />
                  )}
                </div>
                <div className="d-flex-3 px-0">
                  <Dropdown
                    placeholder="Select"
                    width="fit-content"
                    returnBy="data"
                    defaultIds={[Number(item.quota_direction)]}
                    data={QuotaRequirement}
                    getValue={e => e['name']}
                    onChange={this.handleSelectCalculation.bind(this, 'requirement', item)}
                  />
                </div>
                <div className="d-flex-2 px-0">
                  <Input
                    className="input-field"
                    type="number"
                    placeholder="Type required number here..."
                    value={item.quota_target || 0}
                    onChange={this.handleChangeRequired.bind(this, item)}
                  />
                </div>
                <div className="edit">
                  <EditDropdown options={dotsMenu} onChange={this.handleSelectMenu.bind(this, item)} />
                </div>
              </div>
            )
          })}
          <Pagination current={curPage} perPage={perPage} total={totalPage} onChange={this.handleChangePage} />
        </div>
      </div>
    )
  }
}

QuotaList.propTypes = {
  modules: PropTypes.array,
  quotaOptions: PropTypes.oneOfType([PropTypes.array, PropTypes.any]),
  onChange: PropTypes.func,
}

QuotaList.defaultProps = {
  modules: [],
  quotaOptions: [],
  onChange: e => {},
}

export default QuotaList

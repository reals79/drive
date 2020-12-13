import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { equals, length, slice, isNil, filter, findIndex, propEq, move, remove, clone } from 'ramda'
import { CheckIcon, Pagination, Thumbnail, EditDropdown } from '@components'
import './LibraryProgramsList.scss'

class TrainingList extends Component {
  constructor(props) {
    super(props)

    this.state = {
      curPage: 1,
      totalPage: 1,
      perPage: 10,
      selected: [],
      trainings: [],
    }

    this.handleChangePage = this.handleChangePage.bind(this)
    this.handleSelectMenu = this.handleSelectMenu.bind(this)
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (!equals(nextProps.modules, prevState.trainings)) {
      const { perPage, curPage } = prevState
      const from = (curPage - 1) * perPage
      const to = curPage * perPage
      const totalPage = Math.ceil(length(nextProps.modules) / perPage)
      const selected = slice(from, to, nextProps.modules)
      return {
        trainings: nextProps.modules,
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

  handleSelectMenu(item, e) {
    const { trainings } = this.state
    const index = findIndex(propEq('id', item.id), trainings)
    let modules = clone(trainings)
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
    const { totalPage, perPage, curPage, selected } = this.state

    return (
      <div className="library-programs-list px-0">
        <div className="programs-module-list">
          {selected.map((item, index) => {
            if (isNil(item.id)) return null
            const thumb_url = equals(item.card_type_id, 1)
              ? item.data.thumb_url
              : item.thumbnail || item.data.thumb_url
            const key = equals(item.card_type_id, 1) ? `course-${item.id}` : `track-${item.id}`
            let dotsMenu = ['Move Down', 'Move Up', 'Remove']
            if (equals(index, 0)) {
              dotsMenu = filter(x => !equals(x, 'Move Up'), dotsMenu)
            }
            if (equals(index + 1, length(selected))) {
              dotsMenu = filter(x => !equals(x, 'Move Down'), dotsMenu)
            }
            return (
              <div className="d-flex justify-content-between py-2" key={key}>
                <div className="d-flex align-items-center">
                  <CheckIcon size={26} checked={!isNil(item.completed_at)} />
                  <Thumbnail src={thumb_url} size="tiny" />
                  <div className="ml-3">
                    <p className="dsl-b14 text-400 mb-1">
                      {item.name || item.data.name || item.title}
                    </p>
                    <p className="dsl-m12 mb-0">Completeness: none</p>
                  </div>
                </div>
                <div className="edit">
                  <EditDropdown
                    options={dotsMenu}
                    onChange={this.handleSelectMenu.bind(this, item)}
                  />
                </div>
              </div>
            )
          })}
          <Pagination
            current={curPage}
            perPage={perPage}
            total={totalPage}
            onChange={this.handleChangePage}
          />
        </div>
      </div>
    )
  }
}

TrainingList.propTypes = {
  modules: PropTypes.array,
  onChange: PropTypes.func,
}

TrainingList.defaultProps = {
  modules: [],
  onChange: () => {},
}

export default TrainingList

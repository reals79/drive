import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  equals,
  length,
  slice,
  toLower,
  replace,
  findIndex,
  propEq,
  move,
  clone,
  remove,
  filter,
} from 'ramda'
import { Icon, Pagination, Thumbnail, EditDropdown } from '@components'
import { LibraryTypes } from '~/services/config'
import './LibraryProgramsList.scss'

class DocumentList extends Component {
  constructor(props) {
    super(props)

    this.state = {
      curPage: 1,
      totalPage: 1,
      perPage: 10,
      selected: [],
      documents: [],
    }

    this.handleChangePage = this.handleChangePage.bind(this)
    this.handleSelectMenu = this.handleSelectMenu.bind(this)
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (!equals(nextProps.modules, prevState.documents)) {
      const { perPage, curPage } = prevState
      const from = (curPage - 1) * perPage
      const to = curPage * perPage
      const totalPage = Math.ceil(length(nextProps.modules) / perPage)
      const selected = slice(from, to, nextProps.modules)
      return {
        documents: nextProps.modules,
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
    const { documents } = this.state
    const index = findIndex(propEq('id', item.id), documents)
    let modules = clone(documents)
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
            const type = toLower(replace(/\s/g, '', item.data.type))
            const thumbnail = LibraryTypes[type].icon
            let dotsMenu = ['Move Down', 'Move Up', 'Remove']
            if (equals(index, 0)) {
              dotsMenu = filter(x => !equals(x, 'Move Up'), dotsMenu)
            }
            if (equals(index + 1, length(selected))) {
              dotsMenu = filter(x => !equals(x, 'Move Down'), dotsMenu)
            }
            return (
              <div
                className="d-flex justify-content-between py-2"
                key={`${item.data.type}-${item.id}`}
              >
                <div className="d-flex align-items-center">
                  <Icon name="fal fa-circle mr-3" size={25} color="#969faa" />
                  <Thumbnail src={thumbnail} label={item.data.type} size="tiny" />
                  <div className="ml-3">
                    <p className="dsl-b14 text-400 mb-1">{item.title}</p>
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

DocumentList.propTypes = {
  modules: PropTypes.array,
}

DocumentList.defaultProps = {
  modules: [],
}

export default DocumentList

import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import OutsideClickHandler from 'react-outside-click-handler'
import { Row, Col } from 'react-bootstrap'
import { Animations, Button, Dropdown, Input } from '@components'
import './BlogAdvancedSearch.scss'

class BlogAdvancedSearch extends PureComponent {
  state = {
    opened: false,
    search: '',
    author: null,
    department: null,
    category: null,
  }

  handleSelectTags = key => tags => {
    this.setState({ [key]: tags })
  }

  handleClose = () => {
    this.setState({ opened: false })
  }

  handleToggle = e => {
    e.stopPropagation()
    this.setState({ opened: !this.state.opened })
  }

  handleApply = () => {
    const { search, department, author, category } = this.state
    this.props.onSearch({
      search,
      categoryId: department,
      blogCategory: category,
    })
    this.setState({ opened: false, search: '', author: null, department: null, category: null })
  }

  render() {
    const { search, opened } = this.state
    const { authors, departments, competencies, categories, types } = this.props

    return (
      <OutsideClickHandler display="flex" onOutsideClick={this.handleClose}>
        <div className="blog-advanced-search">
          <div className="search-toggle dsl-p16 mb-0 mr-3 cursor-pointer" onClick={this.handleToggle}>
            Advanced Search
          </div>
          <Animations.Popup enter={10} exit={0} opened={opened} className="search-popup">
            <div className="search-body pb-0">
              <Input
                className="mb-2"
                title="Search"
                direction="vertical"
                value={search}
                placeholder="Search here..."
                onChange={e => this.setState({ search: e })}
              />
              <p className="dsl-b16 bold mt-2 mb-0">Filters</p>
              <Row>
                <Col xs={12} sm={6} className="my-3">
                  <Dropdown
                    title="Author"
                    direction="vertical"
                    width="fit-content"
                    data={authors}
                    getValue={e => `${e.first_name} ${e.last_name}`}
                    onChange={this.handleSelectTags('author')}
                  />
                </Col>
                <Col xs={12} sm={6} className="my-3">
                  <Dropdown
                    title="Departments"
                    direction="vertical"
                    width="fit-content"
                    data={departments}
                    getValue={e => e.name}
                    onChange={this.handleSelectTags('department')}
                  />
                </Col>
                <Col xs={12} sm={6} className="my-3">
                  <Dropdown
                    title="Competencies"
                    direction="vertical"
                    width="fit-content"
                    data={competencies}
                    getValue={e => e.name}
                    onChange={this.handleSelectTags('competency')}
                  />
                </Col>
                <Col xs={12} sm={6} className="my-3">
                  <Dropdown
                    title="Categories"
                    direction="vertical"
                    width="fit-content"
                    data={categories}
                    getId={e => e.name}
                    getValue={e => e.name}
                    onChange={this.handleSelectTags('category')}
                  />
                </Col>
                <Col xs={12} sm={6} className="my-3">
                  <Dropdown
                    title="Types"
                    direction="vertical"
                    width="fit-content"
                    data={types}
                    getValue={e => e.name}
                    onChange={this.handleSelectTags('type')}
                  />
                </Col>
              </Row>
            </div>

            <div className="d-h-end p-2">
              <Button type="medium" name="APPLY" onClick={() => this.handleApply()} />
            </div>
          </Animations.Popup>
        </div>
      </OutsideClickHandler>
    )
  }
}

BlogAdvancedSearch.propTypes = {
  authors: PropTypes.array,
  departments: PropTypes.array,
  competencies: PropTypes.array,
  categories: PropTypes.array,
  types: PropTypes.array,
  onSearch: PropTypes.func,
}

BlogAdvancedSearch.defaultProps = {
  authors: [],
  departments: [],
  competencies: [],
  categories: [],
  types: [],
  onSearch: () => {},
}

export default BlogAdvancedSearch

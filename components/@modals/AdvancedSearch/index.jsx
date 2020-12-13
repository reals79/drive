import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { keys, isNil, includes, length, equals, clone, without } from 'ramda'
import { Row, Col } from 'react-bootstrap'
import { Button, Icon } from '@components'
import './AdvancedSearch.scss'

class AdvancedSearch extends PureComponent {
  state = {
    selectedOptions: {
      all: [],
      authors: [],
      departments: [],
      competencies: [],
      categories: [],
    },
    isSelectAll: false,
  }

  componentDidMount() {
    const { options, selected } = this.props
    const authorLen =
      isNil(options[1].meta) || Array.isArray(options[1].meta) ? 0 : length(keys(options[1].meta))
    const departmentLen =
      isNil(options[2].meta) || Array.isArray(options[2].meta) ? 0 : length(keys(options[2].meta))
    const competencyLen =
      isNil(options[3].meta) || Array.isArray(options[3].meta) ? 0 : length(keys(options[3].meta))
    const categoryLen =
      isNil(options[4].meta) || Array.isArray(options[4].meta) ? 0 : length(keys(options[4].meta))
    if (
      equals(authorLen, length(selected.authors)) &&
      equals(departmentLen, length(selected.departments)) &&
      equals(competencyLen, length(selected.competencies)) &&
      equals(categoryLen, length(selected.categories))
    ) {
      this.setState({
        isSelectAll: true,
        selectedOptions: {
          all: selected.all,
          authors: [],
          departments: [],
          competencies: [],
          categories: [],
        },
      })
    } else {
      this.setState({
        isSelectAll: false,
        selectedOptions: selected,
      })
    }
  }

  handleSelectItem(key, item) {
    const { selectedOptions } = this.state
    if (!includes(item.id, selectedOptions[key])) {
      const temp = clone(selectedOptions)
      temp[key].push(item.id)
      this.setState({ selectedOptions: temp, isSelectAll: false })
    } else {
      const { selected } = this.props
      let temp = clone(selectedOptions)
      temp[key] = without([item.id], temp[key])
      if (
        length(temp.authors) === 0 &&
        length(temp.departments) === 0 &&
        length(temp.competencies) === 0 &&
        length(temp.categories) === 0
      ) {
        this.setState({
          isSelectAll: true,
          selectedOptions: {
            all: selected.all,
            authors: [],
            departments: [],
            competencies: [],
            categories: [],
          },
        })
      } else {
        this.setState({ selectedOptions: temp, isSelectAll: false })
      }
    }
  }

  handleSelectAll() {
    const { selected } = this.props
    this.setState({
      isSelectAll: true,
      selectedOptions: {
        all: selected.all,
        authors: [],
        departments: [],
        competencies: [],
        categories: [],
      },
    })
  }

  handleApply() {
    const { selectedOptions, isSelectAll } = this.state
    const { selected, onSearch } = this.props
    if (isSelectAll) {
      onSearch(selected)
    } else {
      onSearch(selectedOptions)
    }
  }

  render() {
    const { selectedOptions, isSelectAll } = this.state
    const { options } = this.props
    const authors =
      isNil(options[1].meta) || Array.isArray(options[1].meta)
        ? []
        : keys(options[1].meta).map(key => {
            return {
              name: key,
              id: options[1].meta[key].author_id,
              isSelected: includes(options[1].meta[key].author_id, selectedOptions.authors),
              ...options[1].meta[key],
            }
          })
    const departments =
      isNil(options[2].meta) || Array.isArray(options[2].meta)
        ? []
        : keys(options[2].meta).map(key => {
            return {
              name: key,
              id: options[2].meta[key].department_id,
              isSelected: includes(options[2].meta[key].department_id, selectedOptions.departments),
              ...options[2].meta[key],
            }
          })
    const competencies =
      isNil(options[3].meta) || Array.isArray(options[3].meta)
        ? []
        : keys(options[3].meta).map(key => {
            return {
              name: key,
              isSelected: includes(options[3].meta[key].id, selectedOptions.competencies),
              ...options[3].meta[key],
            }
          })
    const categories =
      isNil(options[4].meta) || Array.isArray(options[4].meta)
        ? []
        : keys(options[4].meta).map(key => {
            return {
              name: key,
              id: options[4].meta[key].category_id,
              isSelected: includes(options[4].meta[key].category_id, selectedOptions.categories),
              ...options[4].meta[key],
            }
          })

    return (
      <div className="advanced-search">
        <div className="modal-header bg-primary text-white">
          <Icon name="fal fa-search mr-2" color="white" size={14} />
          <span>Advanced Search</span>
        </div>
        <Row className="modal-body mx-0 pb-0">
          <Col xs={6} md={3}>
            <div
              className={`option-item ${isSelectAll ? 'active' : ''}`}
              onClick={() => this.handleSelectAll()}
            >
              Show All
            </div>
          </Col>
        </Row>
        <Row className="modal-body mx-0 pt-5">
          <Col xs={6} md={3} className="border-r">
            <div className="option-label">Author</div>
            {authors.map(author => (
              <div
                className={`option-item ${!isSelectAll && author.isSelected ? 'active' : ''}`}
                key={author.id}
                onClick={() => this.handleSelectItem('authors', author)}
              >
                {author.name}
              </div>
            ))}
          </Col>
          <Col xs={6} md={3} className="border-r">
            <div className="option-label">Department</div>
            {departments.map(department => (
              <div
                className={`option-item ${!isSelectAll && department.isSelected ? 'active' : ''}`}
                key={department.id}
                onClick={() => this.handleSelectItem('departments', department)}
              >
                {department.name}
              </div>
            ))}
          </Col>
          <Col xs={6} md={3} className="border-r">
            <div className="option-label">Competency</div>
            {competencies.map(competency => (
              <div
                className={`option-item ${!isSelectAll && competency.isSelected ? 'active' : ''}`}
                key={competency.id}
                onClick={() => this.handleSelectItem('competencies', competency)}
              >
                {competency.name}
              </div>
            ))}
          </Col>
          <Col xs={6} md={3}>
            <div className="option-label">Category</div>
            {categories.map(category => (
              <div
                className={`option-item ${!isSelectAll && category.isSelected ? 'active' : ''}`}
                key={category.id}
                onClick={() => this.handleSelectItem('categories', category)}
              >
                {category.name}
              </div>
            ))}
          </Col>
        </Row>
        <div className="text-right pb-4 px-4">
          <Button name="APPLY" onClick={() => this.handleApply()} />
        </div>
      </div>
    )
  }
}

AdvancedSearch.propTypes = {
  options: PropTypes.array,
  selected: PropTypes.any,
  onSearch: PropTypes.func,
}

AdvancedSearch.defaultProps = {
  options: [],
  selected: {},
  onSearch: () => {},
}

export default AdvancedSearch

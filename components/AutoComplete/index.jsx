import React from 'react'
import PropTypes from 'prop-types'
import Highlighter from 'react-highlight-words'
import classNames from 'classnames'
import { slice } from 'ramda'
import { Input } from '@components'
import './AutoComplete.scss'

class AutoComplete extends React.Component {
  state = {
    filteredOptions: [],
    showOptions: false,
    userInput: '',
  }

  handleChange = userInput => {
    const { options } = this.props
    const filteredOptions = options.filter(option => option.name.toLowerCase().indexOf(userInput.toLowerCase()) > -1)
    this.setState({ userInput, filteredOptions, showOptions: true })
  }

  handleClick = option => () => {
    this.props.onSearch(option)
    this.setState({
      filteredOptions: [],
      showOptions: false,
      userInput: '',
    })
  }

  render() {
    const { className, type, placeholder } = this.props
    const { filteredOptions, showOptions, userInput } = this.state
    const options = filteredOptions.length > 10 ? slice(0, 9, filteredOptions) : filteredOptions

    return (
      <div className={classNames('auto-search-complete', className)}>
        <Input className="auto-search-input" value={userInput} onChange={this.handleChange} placeholder={placeholder} />
        {showOptions && userInput && (
          <div className="search-options">
            {options.map(option => (
              <div key={option.id} className="search-options-item" onClick={this.handleClick(option)}>
                <Highlighter
                  highlightClassName="dsl-m14 text-400 p-0 bg-none"
                  unhighlightClassName="dsl-b14 text-600"
                  searchWords={[userInput]}
                  autoEscape={true}
                  textToHighlight={option.name}
                />
              </div>
            ))}
            {options.length === 0 && (
              <div className="search-options-item">
                <p className="dsl-b14 mb-0">No {type}</p>
              </div>
            )}
          </div>
        )}
      </div>
    )
  }
}

AutoComplete.propTypes = {
  className: PropTypes.string,
  options: PropTypes.array,
  type: PropTypes.string,
}

AutoComplete.defaultProps = {
  className: '',
  options: [],
  type: '',
}

export default AutoComplete

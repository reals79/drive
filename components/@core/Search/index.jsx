import React from 'react'
import { Form } from 'react-bootstrap'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { Icon } from '@components'
import './Search.scss'

const Search = ({ className, placeholder = 'Search here...', hideIcon, onChange, dataCy }) => (
  <div className={classNames('ds-search', className)} data-cy={dataCy}>
    <Form.Control type="text" placeholder={placeholder} onChange={onChange} />
    {!hideIcon && <Icon name="far fa-search" size={18} color="#343f4b" />}
  </div>
)

Search.propTypes = {
  className: PropTypes.string,
  placeholder: PropTypes.string,
  hideIcon: PropTypes.bool,
  dataCy: PropTypes.any,
  onChange: PropTypes.func,
}

Search.defaultProps = {
  className: '',
  placeholder: 'Search here...',
  hideIcon: false,
  dataCy: null,
  onChange: () => {},
}

export default Search

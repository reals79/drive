import React from 'react'
import PropTypes from 'prop-types'
import { NotFound } from '~/components'
import './ErrorBoundary.scss'

class ErrorBoundary extends React.PureComponent {
  constructor(props) {
    super(props)

    this.state = { error: null, errorInfo: null }
  }

  componentDidCatch(error, errorInfo) {
    console.log(error)
    console.log(errorInfo)
    this.setState({ error, errorInfo })
  }

  render() {
    if (process.env.NODE_ENV == 'local') {
      if (this.props.className) {
        return (
          <div className={this.props.className} data-cy={this.props.dataCy}>
            {this.props.children}
          </div>
        )
      }
      return this.props.children
    } else {
      if (this.state.errorInfo) {
        return <NotFound error="Components" />
      }

      if (this.props.className) {
        return (
          <div className={this.props.className} data-cy={this.props.dataCy}>
            {this.props.children}
          </div>
        )
      }
    }

    return this.props.children
  }
}

ErrorBoundary.propTypes = {
  className: PropTypes.string,
}

export default ErrorBoundary

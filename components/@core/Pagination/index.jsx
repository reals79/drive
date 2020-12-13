import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { pagination } from '~/services/util'
import './Pagination.scss'

class Pagination extends Component {
  componentDidMount() {
    if (this.props.mountEvent) {
      this.props.onChange(this.props.current)
    }
  }

  handleControl = step => () => {
    if (this.props.current == this.props.total && step == 1) return
    if (this.props.current == 1 && step == -1) return

    const current = this.props.current + step

    if (current >= 1 && current <= this.props.total) {
      this.props.onChange(current)
    } else if (current < 1) {
      this.props.onChange(this.props.total)
    } else {
      this.props.onChange(1)
    }
  }

  handlePage = e => () => {
    if (e == '...') return
    const { dataCy } = this.props
    const innerScroll = document.getElementById(dataCy)
    this.props.onChange(e)
    if (innerScroll) {
      innerScroll.scroll(0, 0)
    } else {
      window.scrollTo(0, 0)
    }
  }

  handlePer = e => () => {
    this.props.onPer(e)
  }

  render() {
    const { current, per, total, size, pers, suffix, dataCy } = this.props
    const container = classNames('core-pagination', size)

    if (total == 0) return false

    return (
      <div className={container} data-cy={dataCy}>
        <div className="core-pagination-button ctl left" onClick={this.handleControl(-1)}>
          <span className={current == 1 ? 'disabled' : ''}>{`PREV ${suffix}`}</span>
        </div>
        {pagination(current, total).map((item, index) => {
          const page = classNames('core-pagination-button', { active: item == current })
          return (
            <div className={page} key={`pg-${index}`} onClick={this.handlePage(item)}>
              <span>{item}</span>
            </div>
          )
        })}
        <div className="core-pagination-button ctl right" onClick={this.handleControl(1)}>
          <span className={total == current ? 'disabled' : ''}>{`NEXT ${suffix}`}</span>
        </div>

        {pers.length > 0 && (
          <div className="d-none d-md-flex ml-auto align-items-center">
            {pers.map(item => {
              const page = classNames('core-pagination-pers', {
                active: item == per || (item == 'all' && per == 5000),
              })
              const counts = item == 'all' ? 5000 : item
              return (
                <div key={item} className="core-pagination-right-bottom">
                  <span className={page} onClick={this.handlePer(counts)}>
                    {item}
                  </span>
                  {item !== 'all' && <span className="px-2">|</span>}
                </div>
              )
            })}
          </div>
        )}
      </div>
    )
  }
}

Pagination.propTypes = {
  current: PropTypes.number.isRequired,
  per: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  total: PropTypes.number.isRequired,
  pers: PropTypes.arrayOf(PropTypes.any),
  size: PropTypes.oneOf(['small', 'large']),
  suffix: PropTypes.string,
  mountEvent: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  onPer: PropTypes.func.isRequired,
}

Pagination.defaultProps = {
  // Current Page
  current: 1,
  // Item counts per page
  per: 25,
  // Total page counts
  total: 2,
  // Steps
  pers: [25, 50, 'all'],
  size: 'small',
  suffix: '',
  mountEvent: false,
  onChange: e => {},
  onPer: e => {},
}

export default Pagination

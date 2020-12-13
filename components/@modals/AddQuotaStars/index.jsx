import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { toast } from 'react-toastify'
import { clone, equals } from 'ramda'
import { Button, Input, Rating } from '@components'
import { RatingType } from '~/services/config'
import './AddQuotaStars.scss'

class AddQuotaStars extends Component {
  state = { stars: this.props.stars }

  handleChange = (index, e) => {
    const stars = clone(this.state.stars)
    stars[5 - index] = e
    this.setState({ stars })
  }

  handleSubmit = () => {
    let { stars } = this.state
    stars = stars.map(Number)
    stars[5] = Number(stars[5])
    this.props.onAdd(stars)
    this.props.onClose()
  }

  handleValidate = (index, e) => {
    const { direction } = this.props
    const stars = clone(this.state.stars)
    const rate = Number(e)
    if (equals(0, rate)) return
    if (isNaN(e)) {
      toast.error(`Invalid number. Please input a valid number`, {
        position: toast.POSITION.TOP_CENTER,
        pauseOnFocusLoss: false,
        hideProgressBar: true,
      })
      return
    }

    if (index > 0) {
      if (equals(direction, 1) && stars[index - 1] > rate) {
        toast.error(`Invalid number. Please input larger than ${RatingType[index - 1].name}`, {
          position: toast.POSITION.TOP_CENTER,
          pauseOnFocusLoss: false,
          hideProgressBar: true,
        })
        return
      } else if (equals(direction, 2) && stars[index - 1] < rate) {
        toast.error(`Invalid number. Please input lower than ${RatingType[index - 1].name}`, {
          position: toast.POSITION.TOP_CENTER,
          pauseOnFocusLoss: false,
          hideProgressBar: true,
        })
        return
      }
    }
    stars[index] = rate
    this.setState({ stars })
  }

  render() {
    const { title, unit } = this.props
    const { stars } = this.state
    const disabled = Number(stars[4]) == 0

    return (
      <div className="add-quota-stars modal-content">
        <div className="modal-header bg-primary">
          <p className="dsl-w14 mb-0 text-center">{title}</p>
        </div>
        <div className="modal-body pt-5">
          <div className="contents">
            {RatingType.map((item, index) => (
              <div className="star-row" key={item.id}>
                <div className="star-label">
                  <p className="dsl-m12 mb-0">{item.name}:</p>
                </div>
                <div className="stars">
                  <Rating score={5 - index} />
                </div>
                <div className="star-value">
                  <Input
                    className="input-field"
                    type="text"
                    value={stars[5 - index]}
                    placeholder="Type here..."
                    onChange={this.handleChange.bind(this, index)}
                  />
                  <span className="dsl-b12 mb-0">{equals('Percentage', unit) ? ' %' : ''}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="modal-footer pb-4">
          <Button name="SAVE" disabled={disabled} onClick={this.handleSubmit} />
        </div>
      </div>
    )
  }
}

AddQuotaStars.propTypes = {
  stars: PropTypes.array,
  direction: PropTypes.number,
  onClose: PropTypes.func.isRequired,
  onAdd: PropTypes.func.isRequired,
}

AddQuotaStars.defaultProps = {
  stars: [],
  direction: 1,
  onAdd: () => {},
  onClose: () => {},
}

export default AddQuotaStars

import React from 'react'
import PropTypes from 'prop-types'
import { Row, FormGroup, FormControl } from 'react-bootstrap'
import { Button, Rating } from '@components'
import './AddRating.scss'

class AddRating extends React.PureComponent {
  state = {
    stars: [],
  }

  handleChange = index => e => {
    let stars = this.state.stars
    const value = e.target.value
    stars[index] = value

    this.setState({ stars })
  }

  handleSubmit = () => {
    const { stars } = this.state
    const { quota } = this.props
    const data = {
      ...quota.data,
      stars: stars,
    }
    const payload = {
      quota_template: {
        ...quota,
        data,
      },
    }

    this.props.onAdd(payload)
  }

  render() {
    const { stars } = this.state
    return (
      <div className="add-rating modal-content">
        <div className="modal-header text-center bg-primary text-white">
          <span>Add Rating</span>
        </div>
        <div className="modal-body">
          <Row className="d-center">
            <Rating className="m-2" titleWidth={100} title="Outstanding:" score={5} />

            <FormGroup className="mt-3">
              <FormControl
                className="scale-input"
                min={0}
                max={100}
                type="number"
                value={stars[0]}
                onChange={this.handleChange(0)}
              />
            </FormGroup>
          </Row>
          <Row className="d-center">
            <Rating className="m-2" titleWidth={100} title="Good:" score={4} />
            <FormGroup className="mt-3">
              <FormControl
                className="scale-input"
                min={0}
                max={100}
                type="number"
                value={stars[1]}
                onChange={this.handleChange(1)}
                type="number"
              />
            </FormGroup>
          </Row>
          <Row className="d-center">
            <Rating className="m-2" titleWidth={100} title="Standard:" score={3} />
            <FormGroup className="mt-3">
              <FormControl
                className="scale-input"
                min={0}
                max={100}
                type="number"
                value={stars[2]}
                onChange={this.handleChange(2)}
              />
            </FormGroup>
          </Row>
          <Row className="d-center">
            <Rating className="m-2" titleWidth={100} title="Minimum:" score={2} />
            <FormGroup className="mt-3">
              <FormControl
                className="scale-input"
                min={0}
                max={100}
                type="number"
                value={stars[3]}
                onChange={this.handleChange(3)}
              />
            </FormGroup>
          </Row>
          <Row className="d-center">
            <Rating className="m-2" titleWidth={100} title="Poor:" score={1} />
            <FormGroup className="mt-3">
              <FormControl
                className="scale-input"
                min={0}
                max={100}
                type="number"
                value={stars[4]}
                onChange={this.handleChange(4)}
              />
            </FormGroup>
          </Row>
          <Row className="d-center">
            <Rating className="m-2" titleWidth={100} title="Under Scale:" score={0} />
            <FormGroup className="mt-3">
              <FormControl
                className="scale-input"
                min={0}
                max={100}
                type="number"
                value={stars[5]}
                onChange={this.handleChange(5)}
              />
            </FormGroup>
          </Row>
        </div>
        <div className="modal-footer mx-0 pb-4 d-center">
          <Button className="ml-3" name="Save" onClick={this.handleSubmit} />
        </div>
      </div>
    )
  }
}

AddRating.propTypes = {
  onClose: PropTypes.func.isRequired,
  onAdd: PropTypes.func.isRequired,
}

AddRating.defaultProps = {
  onAdd: () => {},
}

export default AddRating

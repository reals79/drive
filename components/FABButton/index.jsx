import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { history } from '~/reducers'
import { Icon, Submenu } from '@components'
import './FABButton.scss'

class FABButton extends Component {
  state = { opened: false }

  handleClick = () => {
    this.setState(prevState => ({ opened: !prevState.opened }))
  }

  handleMenuClick = selectedMenu => {
    const { token } = this.props
    const route = history.location.pathname
    this.setState(prevState => ({ opened: !prevState.opened }))
    const payload = {
      type: 'Add New Task',
      data: { before: {}, after: null },
      callBack: {},
    }

    switch (selectedMenu) {
      case 'Task':
        payload.type = 'Add New Task'
        break
      case 'Program':
      case 'ToDo':
      case 'Training':
        payload.type = `Assign ${selectedMenu}`
        break
      case 'Packet':
        payload.type = 'Add Packet'
        break
      case 'Training Schedule':
        return this.props.history.push('/hcm/report-training-schedule/null')
      case 'Employee':
        return this.props.history.push('/hcm/record-add-employee')
      case 'Company': {
        payload.type = 'Add Company'
        // return this.props.history.push('/hcm/record-add-company')
      }
    }

    if (token) {
      this.props.onModal(payload)
    } else {
      this.props.onModal({
        type: 'Authentication',
        data: {
          before: {
            route,
            after: {
              type: 'MODAL_REQUEST',
              payload,
            },
          },
        },
        callBack: null,
      })
    }
  }

  render() {
    const { opened } = this.state
    const { fixed, primaryRole } = this.props

    return (
      <div className="fab-button-contents" style={fixed ? { position: 'fixed' } : { position: 'absolute' }}>
        {opened && (
          <Submenu role={primaryRole} onClick={this.handleMenuClick} onClose={() => this.setState({ opened: false })} />
        )}
        <div className="contents">
          <div className="fab-button" onClick={this.handleClick} data-cy="content-add-fab-button">
            <Icon size={25} name={`fal fa-${opened ? 'minus' : 'plus'}`} color="white" />
          </div>
        </div>
      </div>
    )
  }
}

FABButton.propTypes = {
  primaryRole: PropTypes.number,
  fixed: PropTypes.bool.isRequired,
  onModal: PropTypes.func.isRequired,
}

FABButton.defaultProps = {
  fixed: true,
}

const mapStateToProps = state => ({
  primaryRole: state.app.primary_role_id,
  token: state.app.token,
})

export default connect(mapStateToProps, null)(FABButton)

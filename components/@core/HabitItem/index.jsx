import React from 'react'
import { isNil } from 'ramda'
import { CheckBox, Icon } from '@components'
import './HabitItem.scss'

class HabitItem extends React.Component {
  state = { checked: !isNil(this.props.habit.completed_at) }

  handleCheck = (id, e) => {
    if (e.target.checked && !this.state.checked) {
      this.props.onUpdate('completed', id)
    } else {
      this.props.onUpdate('incompleted', id)
    }
    this.setState({ checked: e.target.checked })
  }

  handleModal = () => {
    const { habit, onModal } = this.props
    const payload = {
      type: 'Task Detail',
      data: { before: { card: habit, after: this.props.after } },
      callBack: null,
    }
    onModal(payload)
  }

  render() {
    const { type, habit, status } = this.props
    const { checked } = this.state
    const completed = status ? (status.complete / status.total).toFixed(2) * 100 : 0
    return (
      <div className="core-habit-item" onClick={this.handleModal}>
        <CheckBox id={habit.id} size="regular" checked={checked} onChange={this.handleCheck.bind(this, habit.id)} />
        <div className="d-flex-1 ml-3">
          <p className="dsl-b14 mb-1 text-400">{habit.data.name}</p>
          <p className="dsl-m12 mb-0 text-400">{type}</p>
        </div>
        <div>
          <p className="dsl-m12 mb-1 text-400">Assigned</p>
          <p className="dsl-b14 mb-0 text-400 text-capitalize">{status?.category || 'Manager'}</p>
        </div>
        <div className="ml-3 text-right">
          <p className="dsl-m12 mb-1 text-400">Completed</p>
          <p className="dsl-b14 mb-0 text-400">{completed}%</p>
        </div>
        <div className="d-center ml-3">
          <Icon name="fas fa-ellipsis-h text-400" color="#969faa" size={16} />
        </div>
      </div>
    )
  }
}

export default HabitItem

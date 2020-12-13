import React from 'react'
import { OverlayTrigger } from 'react-bootstrap'
import classNames from 'classnames'
import moment from 'moment'
import { join } from 'ramda'
import { Animations, Avatar, Button, CheckBox, Icon, Input, QuotaTooltip } from '@components'
import { avatarBackgroundColor } from '~/services/util'

class Career extends React.Component {
  state = { hovered: false, opened: false, message: '' }

  handleClose = () => {
    this.setState({ hovered: false, opened: false })
  }

  handleMouseOver = () => {
    const { opened } = this.state
    if (!opened) this.setState({ hovered: true, opened: false })
  }

  handleMouseLeave = () => {
    const { opened } = this.state
    if (!opened) this.handleClose()
  }

  handleMouseClick = () => {
    this.setState({ hovered: false, opened: true })
  }

  handleSubmit = () => {
    const { message } = this.state
    if (message) {
      this.props.onComment(message)
      this.setState({ message: '', hovered: false, opened: false })
    }
  }

  render() {
    const { avatar, data, name, value, onCheck } = this.props
    const { message, opened, hovered } = this.state
    const visible = opened || (value?.data?.comments?.length && hovered)
    if (!data) return null

    const target = data.data.star_values ? data.data.star_values[5] : data.data.quota_target
    let actuals = []
    data.actuals.forEach(item => item.actual && actuals.push(Number(item.actual.toString())))

    return (
      <div className="d-flex align-items-center border-bottom lh-60 py-2">
        <div className="d-flex-1">
          <CheckBox className="quota-checkbox" id={`cr${data.id}`} checked={value?.checked} onChange={onCheck} />
        </div>
        <div className="d-flex-4">
          <OverlayTrigger placement="top" overlay={QuotaTooltip(data.data.description, data.name)}>
            <span className={classNames(value?.checked ? 'dsl-b16' : 'dsl-m16', 'text-400')}>{data.name}</span>
          </OverlayTrigger>
        </div>
        <div className="d-flex-1 pr-4">
          <span className={classNames(value?.checked ? 'dsl-b14' : 'dsl-m14', 'text-400 truncate-one')}>
            {value?.checked ? join(', ', actuals) : 'NA'}
          </span>
        </div>
        <div className="d-flex-1 text-right px-2">
          <span className={classNames(value?.checked ? 'dsl-b14' : 'dsl-m14', 'text-400')}>
            {value?.checked ? target : 'NA'}
          </span>
        </div>
        <div className="d-flex-1 text-right px-2">
          <span className={classNames(value?.checked ? 'dsl-b14' : 'dsl-m14', 'text-400')}>
            {value?.checked ? (value?.actual == '0' ? '0' : Number(value?.actual)) : 'NA'}
          </span>
        </div>
        <div className="d-flex-2 truncate-one ml-4">
          {data.archived == '2' ? (
            <span className={classNames(value?.checked ? 'dsl-b14' : 'dsl-m14', 'text-400')}>
              Archived
              <Icon name="fas fa-check ml5" color={value?.checked && '#000'} />
            </span>
          ) : (
            <span className={classNames(value?.checked ? 'dsl-b14' : 'dsl-m14', 'text-400')}>In Progress</span>
          )}
        </div>
        <div className="d-flex d-flex-1 quota-comment">
          <Icon
            name="fas fa-comment cursor-pointer"
            active={value?.data?.comments?.length}
            size={14}
            colors={['#376caf', '#dee2e6']}
            onClick={this.handleMouseClick}
            onMouseEnter={this.handleMouseOver}
            onMouseLeave={this.handleMouseLeave}
          />
          <Animations.Popup
            className={classNames('comment-popup', hovered && 'cmt')}
            enter={10}
            exit={0}
            opened={visible}
          >
            <div className="d-flex justify-content-between">
              {hovered &&
                value?.data?.comments?.map((item, index) => (
                  <div key={`h${index}`} onClick={() => this.setState({ opened: true, hovered: false })}>
                    <p className="dsl-m10 mb-1">By {item.name}</p>
                    <p className="dsl-b12 mb-2">{item.comment}</p>
                  </div>
                ))}
              <div className="d-h-end mb-2 pb-2">
                <Icon name="fal fa-times cursor-pointer" color="black" size={14} onClick={this.handleClose} />
              </div>
            </div>
            {opened && (
              <>
                {value?.data?.comments?.map((item, index) => (
                  <div
                    key={`c${index}`}
                    className="d-flex align-items-center cursor-pointer mb-3"
                    onClick={() => this.setState({ opened: true, hovered: false })}
                  >
                    <Avatar
                      url={`${item.avatar}?${Date.now()}`}
                      name={name}
                      backgroundColor={avatarBackgroundColor(item.user_id)}
                    />
                    <div className="d-flex-1 ml-2">
                      <p className="dsl-m10 text-400 mb-1">
                        {moment
                          .utc(item.created_at)
                          .local()
                          .format('MMM DD [AT] hh:mm A z')}
                      </p>
                      <p className="dsl-b12 text-400 mb-0">{item.comment}</p>
                    </div>
                  </div>
                ))}
                <div className="d-flex mb-2">
                  <Avatar
                    url={`${avatar}?${Date.now()}`}
                    name={name}
                    type="logo"
                    backgroundColor={avatarBackgroundColor()}
                  />
                  <div className="d-flex-1 ml-2">
                    <Input
                      className="text-left"
                      placeholder="Type here..."
                      value={message}
                      onChange={e => this.setState({ message: e })}
                    />
                  </div>
                </div>
                <div className="d-h-end">
                  <Button type="link" name="SAVE" onClick={this.handleSubmit} />
                </div>
              </>
            )}
          </Animations.Popup>
        </div>
      </div>
    )
  }
}

export default Career
